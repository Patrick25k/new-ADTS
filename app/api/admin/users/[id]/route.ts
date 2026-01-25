import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql, ensureAdminTables } from '@/lib/db'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'

export const runtime = 'nodejs'

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
  if (!token) {
    throw new Error('Unauthorized')
  }

  const payload = await verifyAdminToken(token)
  return payload
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdminTables()
    const admin = await requireAdmin(request)
    const { id } = await params

    const body = await request.json()
    const { email, full_name, role, is_active, password } = body

    // Check if user exists
    const existing = await sql`
      SELECT id, email FROM admin_users WHERE id = ${id} LIMIT 1
    `

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existing[0].email) {
      const emailCheck = await sql`
        SELECT id FROM admin_users WHERE email = ${email} AND id != ${id} LIMIT 1
      `
      if (emailCheck.length > 0) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        )
      }
    }

    // Build update fields
    const updateFields: any = {}
    
    if (email !== undefined) updateFields.email = email
    if (full_name !== undefined) updateFields.full_name = full_name
    if (role !== undefined) updateFields.role = role
    if (is_active !== undefined) updateFields.is_active = is_active
    if (password) {
      updateFields.password_hash = await bcrypt.hash(password, 10)
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Build SQL update query
    const setClauses: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (updateFields.email !== undefined) {
      setClauses.push(`email = $${paramIndex}`)
      values.push(updateFields.email)
      paramIndex++
    }
    if (updateFields.full_name !== undefined) {
      setClauses.push(`full_name = $${paramIndex}`)
      values.push(updateFields.full_name)
      paramIndex++
    }
    if (updateFields.role !== undefined) {
      setClauses.push(`role = $${paramIndex}`)
      values.push(updateFields.role)
      paramIndex++
    }
    if (updateFields.is_active !== undefined) {
      setClauses.push(`is_active = $${paramIndex}`)
      values.push(updateFields.is_active)
      paramIndex++
    }
    if (updateFields.password_hash !== undefined) {
      setClauses.push(`password_hash = $${paramIndex}`)
      values.push(updateFields.password_hash)
      paramIndex++
    }

    setClauses.push(`updated_at = NOW()`)
    values.push(id)

    // Execute update using raw query with proper parameterization
    const query = `
      UPDATE admin_users
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, full_name, role, is_active, created_at
    `

    const { pool } = await import('@/lib/db')
    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update admin user' },
        { status: 500 }
      )
    }

    const updated = result.rows[0]

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        full_name: updated.full_name,
        role: updated.role,
        is_active: updated.is_active,
        created_at: updated.created_at,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Update admin user error:', error)
    return NextResponse.json(
      { error: 'Failed to update admin user' },
      { status: 500 }
    )
  }
}
