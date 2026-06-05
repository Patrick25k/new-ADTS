import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql, ensureUserInvitationsTable } from '@/lib/db'

export const runtime = 'nodejs'

// GET — verify a token is still valid (used by the page to show/hide the form)
export async function GET(request: NextRequest) {
  try {
    await ensureUserInvitationsTable()

    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 })
    }

    const rows = await sql`
      SELECT i.id, i.expires_at, i.used, u.email, u.full_name
      FROM user_invitations i
      JOIN admin_users u ON u.id = i.admin_user_id
      WHERE i.token = ${token}
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json({ valid: false, error: 'Invalid invitation link' }, { status: 400 })
    }

    const inv = rows[0]

    if (inv.used) {
      return NextResponse.json({ valid: false, error: 'This invitation link has already been used' }, { status: 400 })
    }

    if (new Date() > new Date(inv.expires_at)) {
      return NextResponse.json({ valid: false, error: 'This invitation link has expired. Please ask the administrator to resend it.' }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      email: inv.email,
      fullName: inv.full_name,
    })
  } catch (error) {
    console.error('Verify invitation token error:', error)
    return NextResponse.json({ valid: false, error: 'Something went wrong' }, { status: 500 })
  }
}

// POST — set the password and activate the account
export async function POST(request: NextRequest) {
  try {
    await ensureUserInvitationsTable()

    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const rows = await sql`
      SELECT i.id, i.expires_at, i.used, i.admin_user_id
      FROM user_invitations i
      WHERE i.token = ${token}
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid invitation link' }, { status: 400 })
    }

    const inv = rows[0]

    if (inv.used) {
      return NextResponse.json({ error: 'This invitation link has already been used' }, { status: 400 })
    }

    if (new Date() > new Date(inv.expires_at)) {
      return NextResponse.json({ error: 'This invitation link has expired' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Set password and activate the account
    await sql`
      UPDATE admin_users
      SET password_hash = ${passwordHash}, is_active = TRUE
      WHERE id = ${inv.admin_user_id}
    `

    // Mark token as used
    await sql`
      UPDATE user_invitations SET used = TRUE WHERE id = ${inv.id}
    `

    return NextResponse.json({ success: true, message: 'Password set successfully. You can now log in.' })
  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
