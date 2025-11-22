import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get recent activity from different tables
    const [
      contactsResult,
      storiesResult,
      blogsResult,
      videosResult,
      galleryResult,
      newsletterResult,
      volunteersResult,
      jobsResult,
      tendersResult
    ] = await Promise.all([
      // Recent contacts
      sql`
        SELECT id, name, subject, created_at, status 
        FROM contact_messages 
        WHERE status != 'archived'
        ORDER BY created_at DESC 
        LIMIT 5
      `,
      
      // Recent stories
      sql`
        SELECT id, title, created_at, status 
        FROM stories
        ORDER BY created_at DESC 
        LIMIT 3
      `,
      
      // Recent blogs
      sql`
        SELECT id, title, created_at, status 
        FROM blog_posts
        ORDER BY created_at DESC 
        LIMIT 3
      `,
      
      // Recent videos
      sql`
        SELECT id, title, created_at 
        FROM videos
        ORDER BY created_at DESC 
        LIMIT 3
      `,
      
      // Recent gallery uploads
      sql`
        SELECT id, title, created_at 
        FROM gallery_images
        ORDER BY created_at DESC 
        LIMIT 3
      `,
      
      // Recent newsletter subscribers
      sql`
        SELECT id, email, subscribed_at, status 
        FROM newsletter_subscribers
        ORDER BY subscribed_at DESC 
        LIMIT 3
      `,
      
      // Recent volunteer applications
      sql`
        SELECT id, name, email, created_at, status 
        FROM volunteers
        ORDER BY created_at DESC 
        LIMIT 3
      `,
      
      // Recent jobs
      sql`
        SELECT id, title, created_at, status 
        FROM jobs
        ORDER BY created_at DESC 
        LIMIT 3
      `,
      
      // Recent tenders
      sql`
        SELECT id, title, created_at, status 
        FROM tenders
        ORDER BY created_at DESC 
        LIMIT 3
      `
    ])

    // Format activity items
    const activities: any[] = []

    // Add contact activities
    contactsResult.forEach((contact: any) => {
      activities.push({
        id: `contact-${contact.id}`,
        action: contact.status === 'Unread' ? 'New contact message received' : 'Contact message updated',
        user: contact.name,
        email: contact.email,
        details: contact.subject,
        time: contact.created_at,
        type: 'contact',
        priority: contact.status === 'Unread' ? 'high' : 'medium'
      })
    })

    // Add story activities
    storiesResult.forEach((story: any) => {
      activities.push({
        id: `story-${story.id}`,
        action: story.status === 'Published' ? 'Success story published' : 'Story draft created',
        user: 'Admin',
        details: story.title,
        time: story.created_at,
        type: 'story',
        priority: story.status === 'Published' ? 'medium' : 'low'
      })
    })

    // Add blog activities
    blogsResult.forEach((blog: any) => {
      activities.push({
        id: `blog-${blog.id}`,
        action: blog.status === 'published' ? 'Blog post published' : 'Blog draft created',
        user: 'Admin',
        details: blog.title,
        time: blog.created_at,
        type: 'blog',
        priority: blog.status === 'published' ? 'medium' : 'low'
      })
    })

    // Add video activities
    videosResult.forEach((video: any) => {
      activities.push({
        id: `video-${video.id}`,
        action: 'New video uploaded',
        user: 'Admin',
        details: video.title,
        time: video.created_at,
        type: 'video',
        priority: 'medium'
      })
    })

    // Add gallery activities
    galleryResult.forEach((gallery: any) => {
      activities.push({
        id: `gallery-${gallery.id}`,
        action: 'Gallery images uploaded',
        user: 'Admin',
        details: gallery.title,
        time: gallery.created_at,
        type: 'gallery',
        priority: 'low'
      })
    })

    // Add newsletter activities
    newsletterResult.forEach((subscriber: any) => {
      activities.push({
        id: `newsletter-${subscriber.id}`,
        action: 'New newsletter subscription',
        user: subscriber.email,
        details: `Status: ${subscriber.status}`,
        time: subscriber.subscribed_at,
        type: 'newsletter',
        priority: 'low'
      })
    })

    // Add volunteer activities
    volunteersResult.forEach((volunteer: any) => {
      activities.push({
        id: `volunteer-${volunteer.id}`,
        action: 'Volunteer application received',
        user: volunteer.name,
        details: volunteer.email,
        time: volunteer.created_at,
        type: 'volunteer',
        priority: volunteer.status === 'Pending' ? 'high' : 'medium'
      })
    })

    // Add job activities
    jobsResult.forEach((job: any) => {
      activities.push({
        id: `job-${job.id}`,
        action: job.status === 'Open' ? 'Job posting published' : 'Job posting updated',
        user: 'Admin',
        details: job.title,
        time: job.created_at,
        type: 'job',
        priority: job.status === 'Open' ? 'medium' : 'low'
      })
    })

    // Add tender activities
    tendersResult.forEach((tender: any) => {
      activities.push({
        id: `tender-${tender.id}`,
        action: tender.status === 'Open' ? 'Tender published' : 'Tender draft created',
        user: 'Admin',
        details: tender.title,
        time: tender.created_at,
        type: 'tender',
        priority: tender.status === 'Open' ? 'medium' : 'low'
      })
    })

    // Sort by time and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit)

    return NextResponse.json({ activities: sortedActivities })

  } catch (error) {
    console.error('Recent activity error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Failed to fetch recent activity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
