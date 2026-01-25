import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql, ensureAdminTables } from '@/lib/db'
import { ADMIN_TOKEN_COOKIE_NAME, createAdminToken } from '@/lib/auth-tokens'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    // Ensure admin-related tables exist and seed admin if needed
    await ensureAdminTables()
    
    // Seed admin if none exists (idempotent)
    const existingCheck = await sql`SELECT id FROM admin_users LIMIT 1`
    if (existingCheck.length === 0) {
      const { seedAdmin } = await import('@/lib/db')
      await seedAdmin()
    }

    const result = (await sql`
      SELECT id, email, password_hash, full_name, role, is_active
      FROM admin_users
      WHERE email = ${email}
      LIMIT 1
    `) as {
      id: string
      email: string
      password_hash: string
      full_name: string | null
      role: string | null
      is_active: boolean
    }[]

    const user = result[0]

    if (!user || user.is_active === false) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      )
    }

    const token = await createAdminToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        fullName: user.full_name || "Admin User",
        role: user.role,
      },
    })

    response.cookies.set({
      name: ADMIN_TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
