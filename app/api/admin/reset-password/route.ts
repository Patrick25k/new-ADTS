import { NextRequest, NextResponse } from 'next/server'
import { sql, ensurePasswordResetOtpsTable, ensureAdminTables } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    await ensurePasswordResetOtpsTable()

    // Re-verify OTP is still valid before resetting
    const rows = await sql`
      SELECT id, expires_at, used
      FROM password_reset_otps
      WHERE email = ${email}
        AND otp = ${otp}
        AND used = FALSE
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please restart the password reset process.' },
        { status: 400 }
      )
    }

    const record = rows[0]

    if (new Date() > new Date(record.expires_at)) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await ensureAdminTables()

    await sql`
      UPDATE admin_users
      SET password_hash = ${passwordHash}
      WHERE email = ${email}
    `

    // Mark OTP as used so it can't be replayed
    await sql`
      UPDATE password_reset_otps
      SET used = TRUE
      WHERE id = ${record.id}
    `

    console.log(`✅ Password reset successfully for ${email}`)

    return NextResponse.json({ success: true, message: 'Password reset successfully.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
