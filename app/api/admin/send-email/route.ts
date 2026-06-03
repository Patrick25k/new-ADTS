import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'
import { createTransporter, adminReplyEmailTemplate, formatRwandaTime } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Require admin auth
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await verifyAdminToken(token)

    const { to, subject, message, recipientName } = await request.json()

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'to, subject, and message are required' },
        { status: 400 }
      )
    }

    const recipients: string[] = Array.isArray(to) ? to : [to]
    if (recipients.length === 0) {
      return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 })
    }

    const sentAt = formatRwandaTime()
    const transporter = createTransporter()

    const results = await Promise.allSettled(
      recipients.map((recipient) =>
        transporter.sendMail({
          from: `"ADTS Rwanda" <${process.env.EMAIL_USER}>`,
          to: recipient,
          subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
          html: adminReplyEmailTemplate(
            recipientName || recipient,
            subject,
            message,
            sentAt
          ),
        })
      )
    )

    const failed = results.filter((r) => r.status === 'rejected')
    const succeeded = results.filter((r) => r.status === 'fulfilled')

    if (succeeded.length === 0) {
      console.error('❌ All emails failed:', failed)
      return NextResponse.json(
        { error: 'Failed to send email. Please check your email configuration.' },
        { status: 500 }
      )
    }

    console.log(`✅ Admin reply sent to ${succeeded.length}/${recipients.length} recipients`)

    return NextResponse.json({
      success: true,
      sent: succeeded.length,
      failed: failed.length,
    })
  } catch (error: any) {
    console.error('Send email error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const message =
      error instanceof Error ? error.message : 'Failed to send email'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
