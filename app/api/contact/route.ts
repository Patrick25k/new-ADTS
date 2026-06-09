import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureContactsTables } from '@/lib/db'
import { createTransporter, formatRwandaTime } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Save to database
    await ensureContactsTables()
    await sql`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
    `

    const sentAt = formatRwandaTime()
    let emailSent = false

    try {
      const transporter = createTransporter()

      // Admin notification email
      const adminNotification = {
        from: `"ADTS Rwanda Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER!,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
            <div style="background: #1f2937; padding: 30px; text-align: center;">
              <p style="color: #FCB20B; margin: 0 0 6px; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">Admin Notification</p>
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Contact Message</h1>
              <p style="color: #9ca3af; margin: 6px 0 0; font-size: 13px;">ADTS Rwanda Website</p>
            </div>
            <div style="height: 4px; background: linear-gradient(90deg, #FCB20B 0%, #d4822a 100%);"></div>

            <div style="background: white; padding: 36px;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 16px; font-weight: 700;">Contact Details</h2>

              <div style="background: #f9fafb; border-left: 4px solid #FCB20B; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 12px;">
                <p style="margin: 0; color: #FCB20B; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">From</p>
                <p style="margin: 6px 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">${name}</p>
                <p style="margin: 2px 0 0; color: #6b7280; font-size: 14px;">${email}</p>
              </div>

              <div style="background: #f9fafb; border-left: 4px solid #d4822a; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 12px;">
                <p style="margin: 0; color: #d4822a; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Subject</p>
                <p style="margin: 6px 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">${subject}</p>
              </div>

              <div style="background: #f9fafb; border-left: 4px solid #374151; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 20px;">
                <p style="margin: 0; color: #374151; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Message</p>
                <p style="margin: 10px 0 0; color: #1f2937; font-size: 15px; line-height: 1.7; white-space: pre-line;">${message}</p>
              </div>

              <div style="background: #fffbeb; border: 1px solid #FCB20B; border-radius: 8px; padding: 14px 18px;">
                <p style="margin: 0; color: #92400e; font-size: 13px;">
                  <strong>Received:</strong> ${sentAt} (Rwanda Time)
                </p>
              </div>
            </div>

            <div style="background: #1f2937; padding: 16px; text-align: center;">
              <p style="color: #FCB20B; margin: 0 0 4px; font-size: 12px; font-weight: 700; letter-spacing: 1px;">ADTS RWANDA</p>
              <p style="color: #6b7280; margin: 0; font-size: 11px;">This message was sent from the ADTS Rwanda website contact form.</p>
            </div>
          </div>
        `,
      }

      // Auto-reply to sender
      const autoReply = {
        from: `"ADTS Rwanda" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank you for contacting ADTS Rwanda – We received your message!',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
            <div style="background: #1f2937; padding: 36px 30px; text-align: center;">
              <p style="color: #FCB20B; margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">Message Received</p>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Thank You!</h1>
              <p style="color: #9ca3af; margin: 10px 0 0; font-size: 15px;">We've received your message</p>
            </div>
            <div style="height: 4px; background: linear-gradient(90deg, #FCB20B 0%, #d4822a 100%);"></div>

            <div style="background: white; padding: 40px 36px;">
              <p style="color: #1f2937; font-size: 16px; margin: 0 0 16px; font-weight: 600;">Dear ${name},</p>
              <p style="color: #6b7280; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
                Thank you for reaching out to <strong style="color: #1f2937;">ADTS Rwanda</strong>.
                We have successfully received your message regarding
                "<strong style="color: #1f2937;">${subject}</strong>" and truly appreciate you taking the time to contact us.
              </p>

              <div style="background: #f9fafb; border: 1px solid #FCB20B; border-radius: 12px; padding: 22px 24px; margin: 0 0 20px;">
                <h3 style="color: #1f2937; margin: 0 0 12px; font-size: 15px; font-weight: 700;">What happens next?</h3>
                <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.9; font-size: 14px;">
                  <li>Our team will review your message within 24 hours</li>
                  <li>We'll get back to you as soon as possible</li>
                  <li>For urgent matters, call us at <strong style="color: #1f2937;">+250 788 308 255</strong></li>
                </ul>
              </div>

              <div style="background: #fffbeb; border-left: 4px solid #FCB20B; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 0 0 28px;">
                <p style="color: #92400e; margin: 0 0 6px; font-size: 13px; font-weight: 700;">Your Message Summary</p>
                <p style="color: #374151; margin: 0 0 4px; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #374151; margin: 0; font-size: 14px;"><strong>Sent on:</strong> ${sentAt} (Rwanda Time)</p>
              </div>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.7; margin: 0 0 28px;">
                In the meantime, feel free to explore our website to learn more about our programs and initiatives.
              </p>

              <div style="text-align: center;">
                <a href="https://adtsrwanda.org" style="display: inline-block; background: #FCB20B; color: #1f2937; text-decoration: none; padding: 13px 32px; border-radius: 8px; font-size: 14px; font-weight: 700;">Visit Our Website</a>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 28px 36px; border-top: 1px solid #e5e7eb;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 0 12px;">
                    <p style="color: #FCB20B; margin: 0 0 4px; font-size: 12px; font-weight: 700;">📍 Location</p>
                    <p style="color: #374151; margin: 0; font-size: 13px; font-weight: 500;">Kigali, Rwanda</p>
                  </td>
                  <td style="text-align: center; padding: 0 12px; border-left: 1px solid #e5e7eb;">
                    <p style="color: #FCB20B; margin: 0 0 4px; font-size: 12px; font-weight: 700;">📞 Phone</p>
                    <p style="color: #374151; margin: 0; font-size: 13px; font-weight: 500;">+250 788 308 255</p>
                  </td>
                  <td style="text-align: center; padding: 0 12px; border-left: 1px solid #e5e7eb;">
                    <p style="color: #FCB20B; margin: 0 0 4px; font-size: 12px; font-weight: 700;">✉️ Email</p>
                    <p style="color: #374151; margin: 0; font-size: 13px; font-weight: 500;">rwandaadts@gmail.com</p>
                  </td>
                </tr>
              </table>
            </div>

            <div style="background: #1f2937; padding: 18px; text-align: center;">
              <p style="color: #FCB20B; margin: 0 0 4px; font-size: 12px; font-weight: 700; letter-spacing: 1px;">ADTS RWANDA</p>
              <p style="color: #6b7280; margin: 0; font-size: 11px;">This is an automated response. Please do not reply to this email.</p>
            </div>
          </div>
        `,
      }

      await Promise.all([
        transporter.sendMail(adminNotification),
        transporter.sendMail(autoReply),
      ])
      emailSent = true
      console.log('✅ Contact emails sent successfully')
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Message received successfully.',
      sentBy: emailSent ? 'smtp' : 'fallback-logged',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later or contact us directly.' },
      { status: 500 }
    )
  }
}
