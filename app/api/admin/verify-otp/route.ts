import { NextRequest, NextResponse } from 'next/server'
import { sql, ensurePasswordResetOtpsTable } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    await ensurePasswordResetOtpsTable()

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
        { error: 'Invalid OTP. Please check the code and try again.' },
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

    return NextResponse.json({ success: true, message: 'OTP verified successfully.' })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
