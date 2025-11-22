import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureBlogTables, ensureContactsTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Ensure tables exist
    await ensureBlogTables()
    await ensureContactsTables()

    // Create notification read tracking table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS notification_reads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_email TEXT NOT NULL,
        notification_id TEXT NOT NULL,
        notification_type TEXT NOT NULL,
        read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_email, notification_id, notification_type)
      )
    `

    // Get user email from auth context (for now, use admin email)
    const userEmail = 'admin@adtsrwanda.org' // This should come from auth context

    // Get current timestamp from 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Fetch new subscribers from last 24 hours
    const subscribers = await sql`
      SELECT 
        id,
        email,
        name,
        subscribed_at as created_at,
        'subscriber' as type
      FROM newsletter_subscribers
      WHERE subscribed_at >= ${twentyFourHoursAgo.toISOString()}
      ORDER BY subscribed_at DESC
      LIMIT 10
    `

    // Fetch new contact messages from last 24 hours
    const contacts = await sql`
      SELECT 
        id,
        name,
        email,
        subject,
        created_at,
        'contact' as type
      FROM contact_messages
      WHERE created_at >= ${twentyFourHoursAgo.toISOString()}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get already read notifications
    const readNotifications = await sql`
      SELECT notification_id, notification_type
      FROM notification_reads
      WHERE user_email = ${userEmail}
    `

    const readSet = new Set(
      (readNotifications as any[]).map(row => `${row.notification_id}-${row.notification_type}`)
    )

    // Combine and format notifications, filtering out read ones
    const allNotifications = [
      ...(subscribers as any[]).map((row) => ({
        id: row.id,
        type: 'subscriber',
        title: 'New Newsletter Subscriber',
        message: `${row.name || row.email} subscribed to newsletter`,
        timestamp: row.created_at,
        link: '/admin/newsletter',
        icon: '📧'
      })),
      ...(contacts as any[]).map((row) => ({
        id: row.id,
        type: 'contact',
        title: 'New Contact Message',
        message: `${row.name} sent a message: ${row.subject}`,
        timestamp: row.created_at,
        link: '/admin/contacts',
        icon: '💬'
      }))
    ]
    .filter(notification => !readSet.has(`${notification.id}-${notification.type}`))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const response = NextResponse.json({ 
      notifications: allNotifications,
      unreadCount: allNotifications.length
    })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to load notifications', notifications: [], unreadCount: 0 },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { notifications } = await request.json()
    
    if (!Array.isArray(notifications)) {
      return NextResponse.json(
        { error: 'Invalid notifications array' },
        { status: 400 }
      )
    }

    // Get user email from auth context (for now, use admin email)
    const userEmail = 'admin@adtsrwanda.org' // This should come from auth context

    // Mark notifications as read
    for (const notification of notifications) {
      await sql`
        INSERT INTO notification_reads (user_email, notification_id, notification_type)
        VALUES (${userEmail}, ${notification.id}, ${notification.type})
        ON CONFLICT (user_email, notification_id, notification_type) DO NOTHING
      `
    }

    return NextResponse.json({ success: true, markedAsRead: notifications.length })

  } catch (error) {
    console.error('Mark notifications as read error:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
}
