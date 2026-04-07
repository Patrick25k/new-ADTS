import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureBlogTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    await ensureBlogTables()

    const body = await request.json()
    const { email, name } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscriber = await sql`
      SELECT id FROM newsletter_subscribers 
      WHERE email = ${email} AND status = 'active'
    `

    if (existingSubscriber.length > 0) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      )
    }

    // Insert new subscriber
    await sql`
      INSERT INTO newsletter_subscribers (email, name)
      VALUES (${email}, ${name || null})
    `

    const response = NextResponse.json({
      message: 'Successfully subscribed to newsletter!',
      subscriber: {
        email,
        name: name || null
      }
    })
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
