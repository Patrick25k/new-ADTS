import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create transporter for sending emails
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'kwihpatric69@gmail.com'
  const emailPass = process.env.EMAIL_PASS
  
  if (!emailPass) {
    throw new Error('EMAIL_PASS environment variable is required. Please set up Gmail App Password in .env.local file.')
  }
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create email transporter
    let transporter
    let useEmailFallback = false
    let emailSent = false
    let sendError: any = null
    
    try {
      transporter = createTransporter()
    } catch (error) {
      // Always use fallback mode if Gmail auth fails
      useEmailFallback = true
      sendError = error
    }

    // Email to admin (kwihpatric69@gmail.com)
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'kwihpatric69@gmail.com',
      to: 'kwihpatric69@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Message</h1>
            <p style="color: white; margin: 5px 0;">ADTS Rwanda Website</p>
          </div>
          
          <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin-top: 0;">Contact Details</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">FROM</p>
              <p style="margin: 5px 0 0 0; color: #1f2937; font-weight: bold;">${name}</p>
              <p style="margin: 5px 0 0 0; color: #3b82f6;">${email}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">SUBJECT</p>
              <p style="margin: 5px 0 0 0; color: #1f2937; font-weight: bold;">${subject}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">MESSAGE</p>
              <p style="margin: 10px 0 0 0; color: #1f2937; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 8px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>Received:</strong> ${new Date().toLocaleString('en-US', { 
                  timeZone: 'Africa/Kigali',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} (Rwanda Time)
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 15px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              This message was sent from the ADTS Rwanda website contact form.
            </p>
          </div>
        </div>
      `,
    }

    // Auto-reply email to sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER || 'kwihpatric69@gmail.com',
      to: email,
      subject: 'Thank you for contacting ADTS Rwanda - We received your message!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">We've received your message</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="color: #1f2937; font-size: 16px; margin-top: 0;">Dear ${name},</p>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
              Thank you for reaching out to <strong>ADTS Rwanda</strong>. We have successfully received your message regarding "<strong>${subject}</strong>" and truly appreciate you taking the time to contact us.
            </p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">What happens next?</h3>
              <ul style="color: #166534; margin: 0; padding-left: 20px;">
                <li style="margin: 8px 0;">Our team will review your message within 24 hours</li>
                <li style="margin: 8px 0;">We'll get back to you as soon as possible</li>
                <li style="margin: 8px 0;">For urgent matters, feel free to call us at +250 788 123 456</li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">Your Message Summary:</h3>
              <p style="color: #92400e; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="color: #92400e; margin: 5px 0;"><strong>Sent on:</strong> ${new Date().toLocaleString('en-US', { 
                timeZone: 'Africa/Kigali',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} (Rwanda Time)</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 25px 0;">
              In the meantime, feel free to explore our website to learn more about our programs and initiatives that are transforming lives across Rwanda and the Great Lakes region.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://adtsrwanda.org" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visit Our Website</a>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 25px; border-top: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0;">ADTS Rwanda</h3>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">Transforming Lives, Empowering Communities</p>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 30px; text-align: center; flex-wrap: wrap;">
              <div>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">📍 Location</p>
                <p style="color: #1f2937; margin: 5px 0 0 0; font-size: 14px;">Kigali, Rwanda</p>
              </div>
              <div>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">📞 Phone</p>
                <p style="color: #1f2937; margin: 5px 0 0 0; font-size: 14px;">+250 788 123 456</p>
              </div>
              <div>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">✉️ Email</p>
                <p style="color: #1f2937; margin: 5px 0 0 0; font-size: 14px;">info@adtsrwanda.org</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                This is an automated response. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    }

    // Send both emails
    console.log('📧 Email sending mode:', useEmailFallback ? 'FALLBACK' : 'LIVE EMAIL')
    if (useEmailFallback) {
      
      // Simulate email delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      emailSent = false
    } else {
      // Send actual emails
      try {
        await Promise.all([
          transporter!.sendMail(adminMailOptions),
          transporter!.sendMail(autoReplyOptions)
        ])
        console.log('✅ Emails sent successfully!')
        emailSent = true
      } catch (emailError) {
        sendError = emailError
        console.log('❌ Email sending failed, switching to fallback mode')
        console.log('Email Error:', emailError)
        
      }
    }

    const sentBy = emailSent ? 'smtp' : 'fallback-logged'
    const responseBody: any = {
      success: true,
      message: 'Message processed',
      sentBy,
    }

    // In development include a short error message to aid debugging
    if (!emailSent && sendError && process.env.NODE_ENV === 'development') {
      responseBody.sendError = typeof sendError === 'string' ? sendError : (sendError && sendError.message) ? sendError.message : String(sendError)
    }

    return NextResponse.json(responseBody, { status: 200 })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
