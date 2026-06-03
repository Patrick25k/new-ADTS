import nodemailer from 'nodemailer'

export function createTransporter() {
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
    auth: { user: emailUser, pass: emailPass },
    tls: { rejectUnauthorized: false },
  })
}

export function otpEmailTemplate(adminName: string, otp: string, sentAt: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">

      <!-- Header -->
      <div style="background: #1f2937; padding: 36px 30px 28px; text-align: center;">
        <img
          src="https://adtsrwanda.org/images/ADTS%20LOGO.jpg"
          alt="ADTS Rwanda"
          width="110"
          height="110"
          style="display: block; margin: 0 auto 20px; border-radius: 12px; object-fit: contain;"
        />
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Password Reset</h1>
      </div>

      <!-- Gold accent bar -->
      <div style="height: 4px; background: linear-gradient(90deg, #FCB20B 0%, #d4822a 100%);"></div>

      <!-- Body -->
      <div style="background: #ffffff; padding: 40px 36px;">
        <p style="color: #1f2937; font-size: 16px; margin: 0 0 12px; font-weight: 600;">Hi ${adminName},</p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.7; margin: 0 0 28px;">
          We received a request to reset the password for your ADTS Rwanda admin account.
          Enter the verification code below to continue. It expires in <strong style="color: #1f2937;">15 minutes</strong>.
        </p>

        <!-- OTP Box -->
        <div style="background: #fffbeb; border: 2px solid #FCB20B; border-radius: 16px; padding: 32px 20px; text-align: center; margin: 0 0 28px;">
          <p style="color: #92400e; margin: 0 0 10px; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">Your verification code</p>
          <p style="color: #1f2937; margin: 0; font-size: 54px; font-weight: 800; letter-spacing: 14px; font-family: 'Courier New', monospace;">${otp}</p>
          <div style="display: inline-block; margin-top: 14px; background: #FCB20B; border-radius: 20px; padding: 4px 16px;">
            <p style="color: #1f2937; margin: 0; font-size: 12px; font-weight: 700;">Expires in 15 minutes</p>
          </div>
        </div>

        <!-- Warning -->
        <div style="background: #f9fafb; border-left: 4px solid #FCB20B; border-radius: 0 8px 8px 0; padding: 14px 18px; margin: 0 0 24px;">
          <p style="color: #374151; margin: 0; font-size: 14px; line-height: 1.6;">
            <strong style="color: #1f2937;">⚠ Security notice:</strong> Never share this code with anyone.
            ADTS Rwanda staff will never ask for this code. If you did not request a password reset, you can safely ignore this email — your password will not change.
          </p>
        </div>

        <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">
          This code was requested on ${sentAt} (Rwanda Time)
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #1f2937; padding: 24px 36px; text-align: center;">
        <p style="color: #FCB20B; margin: 0 0 4px; font-size: 13px; font-weight: 700; letter-spacing: 1px;">ADTS RWANDA</p>
        <p style="color: #9ca3af; margin: 0; font-size: 12px;">Transforming Lives, Empowering Communities</p>
        <p style="color: #4b5563; margin: 12px 0 0; font-size: 11px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>

    </div>
  `
}

export function adminReplyEmailTemplate(
  recipientName: string,
  originalSubject: string,
  replyMessage: string,
  sentAt: string
): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">

      <!-- Header -->
      <div style="background: #1f2937; padding: 36px 30px; text-align: center;">
        <img
          src="https://adtsrwanda.org/images/ADTS%20LOGO.jpg"
          alt="ADTS Rwanda"
          width="110"
          height="110"
          style="display: block; margin: 0 auto 20px; border-radius: 12px; object-fit: contain;"
        />
        <p style="color: #FCB20B; margin: 0 0 6px; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">Official Response</p>
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">ADTS Rwanda</h1>
      </div>

      <!-- Gold accent bar -->
      <div style="height: 4px; background: linear-gradient(90deg, #FCB20B 0%, #d4822a 100%);"></div>

      <!-- Subject Banner -->
      <div style="background: #FCB20B; padding: 12px 36px;">
        <p style="color: #1f2937; margin: 0; font-size: 13px; font-weight: 600;">
          Re: ${originalSubject}
        </p>
      </div>

      <!-- Body -->
      <div style="background: #ffffff; padding: 40px 36px;">
        <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px; font-weight: 600;">Dear ${recipientName},</p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
          Thank you for reaching out to <strong style="color: #1f2937;">ADTS Rwanda</strong>. We have reviewed your inquiry and are pleased to provide you with the following response:
        </p>

        <!-- Reply Message -->
        <div style="background: #f9fafb; border-left: 4px solid #FCB20B; border-radius: 0 12px 12px 0; padding: 24px; margin: 0 0 28px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.8; margin: 0; white-space: pre-line;">${replyMessage}</p>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.7; margin: 0 0 28px;">
          If you have any further questions or need additional assistance, please do not hesitate to contact us.
          We are always happy to help.
        </p>

        <!-- CTA -->
        <div style="text-align: center; margin: 0 0 8px;">
          <a href="https://adtsrwanda.org" style="display: inline-block; background: #FCB20B; color: #1f2937; text-decoration: none; padding: 13px 32px; border-radius: 8px; font-size: 14px; font-weight: 700;">Visit Our Website</a>
        </div>
      </div>

      <!-- Contact Info -->
      <div style="background: #f9fafb; padding: 28px 36px; border-top: 1px solid #e5e7eb;">
        <p style="color: #1f2937; margin: 0 0 16px; font-size: 14px; font-weight: 700; text-align: center;">Get in Touch</p>
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

      <!-- Footer -->
      <div style="background: #1f2937; padding: 20px 36px; text-align: center;">
        <p style="color: #FCB20B; margin: 0 0 4px; font-size: 13px; font-weight: 700; letter-spacing: 1px;">ADTS RWANDA</p>
        <p style="color: #9ca3af; margin: 0; font-size: 12px;">Transforming Lives, Empowering Communities</p>
        <p style="color: #4b5563; margin: 10px 0 0; font-size: 11px;">
          Sent on ${sentAt} (Rwanda Time) · This reply was sent by the ADTS Rwanda administration team.
        </p>
      </div>

    </div>
  `
}

export function formatRwandaTime(date: Date = new Date()): string {
  return date.toLocaleString('en-US', {
    timeZone: 'Africa/Kigali',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
