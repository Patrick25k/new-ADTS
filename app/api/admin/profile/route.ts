import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureAdminTables } from '@/lib/db'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'

export const runtime = 'nodejs'

async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
  if (!token) throw new Error('Unauthorized')
  return verifyAdminToken(token)
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getCurrentUser(request)
    await ensureAdminTables()

    const rows = await sql`
      SELECT id, email, full_name, role, is_active, avatar_url, created_at
      FROM admin_users
      WHERE id = ${payload.sub as string}
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const u = rows[0]
    return NextResponse.json({
      user: {
        id: u.id,
        email: u.email,
        full_name: u.full_name ?? '',
        role: u.role,
        is_active: u.is_active,
        avatar_url: u.avatar_url ?? null,
        created_at: u.created_at,
      },
    })
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await getCurrentUser(request)
    await ensureAdminTables()

    const { full_name, email, avatar_url } = await request.json()
    const userId = payload.sub as string

    // Check email uniqueness if email is being changed
    if (email) {
      const taken = await sql`
        SELECT id FROM admin_users
        WHERE email = ${email} AND id != ${userId}
        LIMIT 1
      `
      if (taken.length > 0) {
        return NextResponse.json({ error: 'Email already in use by another account' }, { status: 409 })
      }
    }

    const { pool } = await import('@/lib/db')

    const setClauses: string[] = []
    const values: any[] = []
    let i = 1

    if (full_name !== undefined) { setClauses.push(`full_name = $${i++}`); values.push(full_name) }
    if (email !== undefined)     { setClauses.push(`email = $${i++}`);     values.push(email) }
    if (avatar_url !== undefined) { setClauses.push(`avatar_url = $${i++}`); values.push(avatar_url) }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Only include updated_at if the column exists (it is added via migration on next restart)
    // We skip it here to stay compatible with existing DB schemas that may not have it yet
    values.push(userId)

    const query = `
      UPDATE admin_users
      SET ${setClauses.join(', ')}
      WHERE id = $${i}
      RETURNING id, email, full_name, role, is_active, avatar_url, created_at
    `

    const result = await pool!.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const u = result.rows[0]
    return NextResponse.json({
      success: true,
      user: {
        id: u.id,
        email: u.email,
        full_name: u.full_name ?? '',
        role: u.role,
        is_active: u.is_active,
        avatar_url: u.avatar_url ?? null,
        created_at: u.created_at,
      },
    })
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
