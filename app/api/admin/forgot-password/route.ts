import { NextRequest, NextResponse } from 'next/server'
import { sql, ensurePasswordResetOtpsTable, ensureAdminTables } from '@/lib/db'
import { createTransporter, otpEmailTemplate, formatRwandaTime } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    await ensureAdminTables()

    const admins = await sql`
      SELECT id, email, full_name FROM admin_users
      WHERE email = ${email} AND is_active = TRUE
    `

    // Always return success to avoid revealing whether the email exists
    if (admins.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'If this email is registered, you will receive an OTP.',
      })
    }

    const admin = admins[0]

    await ensurePasswordResetOtpsTable()

    // Invalidate any previous unused OTPs for this email
    await sql`
      UPDATE password_reset_otps SET used = TRUE
      WHERE email = ${email} AND used = FALSE
    `

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await sql`
      INSERT INTO password_reset_otps (email, otp, expires_at)
      VALUES (${email}, ${otp}, ${expiresAt.toISOString()})
    `

    const adminName = admin.full_name || 'Admin'
    const sentAt = formatRwandaTime()

    let emailSent = false
    let emailError: unknown = null

    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: `"ADTS Rwanda" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'ADTS Rwanda – Your Password Reset Code',
        html: otpEmailTemplate(adminName, otp, sentAt),
      })
      emailSent = true
      console.log(`✅ OTP email sent to ${email}`)
    } catch (err) {
      emailError = err
      console.error('❌ Failed to send OTP email:', err)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔑 OTP for ${email}: ${otp}`)
    }

    return NextResponse.json({
      success: true,
      message: 'If this email is registered, you will receive an OTP.',
      ...(process.env.NODE_ENV === 'development' && !emailSent
        ? {
            devOtp: otp,
            devError: emailError instanceof Error ? emailError.message : String(emailError),
          }
        : {}),
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
