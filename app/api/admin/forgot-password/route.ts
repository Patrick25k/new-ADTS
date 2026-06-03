import { NextRequest, NextResponse } from 'next/server'
import { sql, ensurePasswordResetOtpsTable, ensureAdminTables } from '@/lib/db'
import nodemailer from 'nodemailer'

function createTransporter() {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS

  if (!emailUser || !emailPass) {
    throw new Error(
      'EMAIL_USER and EMAIL_PASS must be set in .env. ' +
      'Generate a Gmail App Password at myaccount.google.com → Security → App passwords.'
    )
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: { rejectUnauthorized: false },
  })
}

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
    const sentAt = new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Kigali',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    let emailSent = false
    let emailError: unknown = null

    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: `"ADTS Rwanda" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'ADTS Rwanda – Your Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">ADTS Rwanda Admin Portal</p>
            </div>

            <div style="padding: 30px; background: white;">
              <p style="color: #1f2937; font-size: 16px; margin-top: 0;">Dear ${adminName},</p>
              <p style="color: #4b5563; line-height: 1.6;">
                You requested a password reset for your ADTS Rwanda admin account.
                Use the one-time code below to continue. This code is valid for <strong>15 minutes</strong>.
              </p>

              <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <p style="color: #1e40af; margin: 0 0 10px 0; font-size: 14px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Your OTP Code</p>
                <p style="color: #1e40af; margin: 0; font-size: 48px; font-weight: bold; letter-spacing: 12px;">${otp}</p>
              </div>

              <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  &#9888;&#65039; <strong>Security notice:</strong> If you did not request this reset, please ignore this email.
                  Your password will not be changed.
                </p>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">Sent at ${sentAt} (Rwanda Time)</p>
              <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                This is an automated message from ADTS Rwanda. Do not reply.
              </p>
            </div>
          </div>
        `,
      })
      emailSent = true
      console.log(`✅ OTP email sent to ${email}`)
    } catch (err) {
      emailError = err
      console.error('❌ Failed to send OTP email:', err)
    }

    // Always log OTP in development so you can test without email
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔑 OTP for ${email}: ${otp}`)
    }

    // In development expose the OTP in the response if email failed, so you can still test
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
