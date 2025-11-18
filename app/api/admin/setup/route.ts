import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql, ensureAdminTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    // Ensure admin tables exist
    await ensureAdminTables()

    // Check if an admin with this email already exists
    const existing = await sql`
      SELECT id FROM admin_users WHERE email = ${email} LIMIT 1
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const inserted = await sql`
      INSERT INTO admin_users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName ?? null})
      RETURNING id
    `

    const admin = (inserted as { id: string }[])[0]

    return NextResponse.json(
      {
        success: true,
        admin: {
          id: admin.id,
          email,
          fullName: fullName ?? null,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 },
    )
  }
}
