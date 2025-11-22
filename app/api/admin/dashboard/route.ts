import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get counts for different content types
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
      // Contacts
      sql`
        SELECT id, status, created_at 
        FROM contact_messages 
        WHERE status != 'archived'
      `,
      
      // Stories
      sql`
        SELECT id, status, created_at 
        FROM stories
      `,
      
      // Blogs
      sql`
        SELECT id, status, created_at 
        FROM blog_posts
      `,
      
      // Videos
      sql`
        SELECT id, created_at 
        FROM videos
      `,
      
      // Gallery
      sql`
        SELECT id, created_at 
        FROM gallery_images
      `,
      
      // Newsletter subscribers
      sql`
        SELECT id, status, subscribed_at 
        FROM newsletter_subscribers
      `,
      
      // Volunteers
      sql`
        SELECT id, status, created_at 
        FROM volunteers
      `,
      
      // Jobs
      sql`
        SELECT id, status, created_at 
        FROM jobs
      `,
      
      // Tenders
      sql`
        SELECT id, status, created_at 
        FROM tenders
      `
    ])

    // Handle the jobs result (empty array)
    const jobsResultHandled = jobsResult

    // Calculate statistics
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)

    const stats = {
      contacts: {
        total: contactsResult.length || 0,
        unread: contactsResult.filter((c: any) => c.status === 'Unread').length || 0,
        thisMonth: contactsResult.filter((c: any) => new Date(c.created_at) >= thisMonth).length || 0,
        lastMonth: contactsResult.filter((c: any) => new Date(c.created_at) >= lastMonth && new Date(c.created_at) < thisMonth).length || 0
      },
      stories: {
        total: storiesResult.length || 0,
        published: storiesResult.filter((s: any) => s.status === 'Published').length || 0,
        thisMonth: storiesResult.filter((s: any) => new Date(s.created_at) >= thisMonth).length || 0,
        thisQuarter: storiesResult.filter((s: any) => new Date(s.created_at) >= thisQuarter).length || 0
      },
      blogs: {
        total: blogsResult.length || 0,
        published: blogsResult.filter((b: any) => b.status === 'Published').length || 0,
        thisMonth: blogsResult.filter((b: any) => new Date(b.created_at) >= thisMonth).length || 0
      },
      videos: {
        total: videosResult.length || 0,
        thisMonth: videosResult.filter((v: any) => new Date(v.created_at) >= thisMonth).length || 0
      },
      gallery: {
        total: galleryResult.length || 0,
        thisMonth: galleryResult.filter((g: any) => new Date(g.created_at) >= thisMonth).length || 0
      },
      newsletter: {
        total: newsletterResult.length || 0,
        active: newsletterResult.filter((n: any) => n.status === 'active').length || 0,
        thisMonth: newsletterResult.filter((n: any) => new Date(n.subscribed_at) >= thisMonth).length || 0
      },
      volunteers: {
        total: volunteersResult.length || 0,
        pending: volunteersResult.filter((v: any) => v.status === 'Pending').length || 0,
        thisMonth: volunteersResult.filter((v: any) => new Date(v.created_at) >= thisMonth).length || 0
      },
      jobs: {
        total: jobsResult.length || 0,
        active: jobsResult.filter((j: any) => j.status === 'Open').length || 0,
        thisMonth: jobsResult.filter((j: any) => new Date(j.created_at) >= thisMonth).length || 0
      },
      tenders: {
        total: tendersResult.length || 0,
        active: tendersResult.filter((t: any) => t.status === 'Open').length || 0,
        thisMonth: tendersResult.filter((t: any) => new Date(t.created_at) >= thisMonth).length || 0
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
