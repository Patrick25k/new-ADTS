import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureStoriesTables } from '@/lib/db'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'

export const runtime = 'nodejs'

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
  if (!token) {
    throw new Error('Unauthorized')
  }

  const payload = await verifyAdminToken(token)
  return payload
}

export async function GET(request: NextRequest) {
  try {
    await ensureStoriesTables()
    await requireAdmin(request)

    const rows = await sql`
      SELECT
        id,
        title,
        excerpt,
        story,
        impact,
        category,
        status,
        featured,
        image_url,
        video_url,
        author_name,
        read_time,
        views,
        likes,
        comments_count,
        created_at,
        updated_at,
        published_at
      FROM stories
      ORDER BY created_at DESC
    `

    const stories = (rows as any[]).map((row) => {
      const publishedAt = (row.published_at as string) ?? null
      const createdAt = row.created_at as string
      const rawDate = publishedAt ?? createdAt

      const authorName = (row.author_name as string) ?? ''
      const initials =
        authorName
          .split(' ')
          .filter(Boolean)
          .map((part: string) => part[0]?.toUpperCase())
          .slice(0, 2)
          .join('') || 'ST'

      return {
        id: row.id as string,
        title: row.title as string,
        excerpt: (row.excerpt as string) ?? '',
        story: (row.story as string) ?? '',
        impact: (row.impact as string) ?? '',
        category: (row.category as string) ?? '',
        status: (row.status as string) ?? 'Draft',
        featured: Boolean(row.featured),
        image: (row.image_url as string) ?? '',
        videoUrl: (row.video_url as string) ?? '',
        author: authorName || 'Unknown',
        authorAvatar: initials,
        readTime: (row.read_time as string) ?? '',
        views: Number(row.views ?? 0),
        likes: Number(row.likes ?? 0),
        comments: Number(row.comments_count ?? 0),
        date: rawDate,
        createdAt,
        updatedAt: row.updated_at as string,
        publishedAt,
      }
    })

    return NextResponse.json({ stories })
  } catch (error: any) {
    console.error('Stories list error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to load stories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureStoriesTables()
    const admin = await requireAdmin(request)

    const body = await request.json()
    const {
      title,
      excerpt,
      story,
      impact,
      category,
      status,
      featured,
      image,
      videoUrl,
      author,
      readTime,
    } = body

    if (!title || !story) {
      return NextResponse.json(
        { error: 'Title and story are required' },
        { status: 400 },
      )
    }

    const dbStatus = status === 'Published' || status === 'Draft' ? status : 'Draft'
    const isFeatured = Boolean(featured)
    const publishedAt = dbStatus === 'Published' ? new Date().toISOString() : null

    const authorName = (author as string | undefined) || (admin.name as string | undefined) || ''

    const rows = await sql`
      INSERT INTO stories (
        title,
        excerpt,
        story,
        impact,
        category,
        status,
        featured,
        image_url,
        video_url,
        author_name,
        read_time,
        views,
        likes,
        comments_count,
        created_at,
        updated_at,
        published_at
      ) VALUES (
        ${title},
        ${excerpt ?? ''},
        ${story ?? ''},
        ${impact ?? ''},
        ${category ?? ''},
        ${dbStatus},
        ${isFeatured},
        ${image ?? ''},
        ${videoUrl ?? ''},
        ${authorName},
        ${readTime ?? ''},
        0,
        0,
        0,
        NOW(),
        NOW(),
        ${publishedAt}
      )
      RETURNING
        id,
        title,
        excerpt,
        story,
        impact,
        category,
        status,
        featured,
        image_url,
        video_url,
        author_name,
        read_time,
        views,
        likes,
        comments_count,
        created_at,
        updated_at,
        published_at
    `

    const row = (rows as any[])[0]

    const createdAt = row.created_at as string
    const createdPublishedAt = (row.published_at as string) ?? null
    const rawDate = createdPublishedAt ?? createdAt

    const createdAuthorName = (row.author_name as string) ?? ''
    const initials =
      createdAuthorName
        .split(' ')
        .filter(Boolean)
        .map((part: string) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join('') || 'ST'

    const storyResult = {
      id: row.id as string,
      title: row.title as string,
      excerpt: (row.excerpt as string) ?? '',
      story: (row.story as string) ?? '',
      impact: (row.impact as string) ?? '',
      category: (row.category as string) ?? '',
      status: (row.status as string) ?? 'Draft',
      featured: Boolean(row.featured),
      image: (row.image_url as string) ?? '',
      videoUrl: (row.video_url as string) ?? '',
      author: createdAuthorName || 'Unknown',
      authorAvatar: initials,
      readTime: (row.read_time as string) ?? '',
      views: Number(row.views ?? 0),
      likes: Number(row.likes ?? 0),
      comments: Number(row.comments_count ?? 0),
      date: rawDate,
      createdAt,
      updatedAt: row.updated_at as string,
      publishedAt: createdPublishedAt,
    }

    return NextResponse.json({ story: storyResult }, { status: 201 })
  } catch (error: any) {
    console.error('Story create error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 })
  }
}
