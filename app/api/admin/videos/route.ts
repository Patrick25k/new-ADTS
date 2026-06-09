import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureVideosTables } from '@/lib/db'
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
    await ensureVideosTables()
    await requireAdmin(request)

    const rows = await sql`
      SELECT
        id,
        title,
        description,
        youtube_url,
        category,
        status,
        featured,
        duration,
        author_name,
        views,
        likes,
        comments_count,
        created_at,
        updated_at,
        published_at
      FROM videos
      ORDER BY created_at DESC
    `

    const videos = (rows as any[]).map((row) => {
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
          .join('') || 'VD'

      return {
        id: row.id as string,
        title: row.title as string,
        description: (row.description as string) ?? '',
        youtubeUrl: (row.youtube_url as string) ?? '',
        category: (row.category as string) ?? '',
        status: (row.status as string) ?? 'Draft',
        featured: Boolean(row.featured),
        duration: (row.duration as string) ?? '',
        author: authorName || 'Unknown',
        authorAvatar: initials,
        views: Number(row.views ?? 0),
        likes: Number(row.likes ?? 0),
        comments: Number(row.comments_count ?? 0),
        date: rawDate,
        createdAt,
        updatedAt: row.updated_at as string,
        publishedAt,
      }
    })

    return NextResponse.json({ videos })
  } catch (error: any) {
    console.error('Videos list error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to load videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureVideosTables()
    const admin = await requireAdmin(request)

    const body = await request.json()
    const {
      title,
      description,
      youtubeUrl,
      category,
      status,
      featured,
      duration,
      author,
    } = body

    if (!title || !youtubeUrl) {
      return NextResponse.json(
        { error: 'Title and YouTube URL are required' },
        { status: 400 },
      )
    }

    const dbStatus = status === 'Published' || status === 'Draft' ? status : 'Draft'
    const isFeatured = Boolean(featured)
    const publishedAt = dbStatus === 'Published' ? new Date().toISOString() : null

    const authorName = (author as string | undefined) || (admin.name as string | undefined) || ''

    const rows = await sql`
      INSERT INTO videos (
        title,
        description,
        youtube_url,
        category,
        status,
        featured,
        duration,
        author_name,
        views,
        likes,
        comments_count,
        created_at,
        updated_at,
        published_at
      ) VALUES (
        ${title},
        ${description ?? ''},
        ${youtubeUrl ?? ''},
        ${category ?? ''},
        ${dbStatus},
        ${isFeatured},
        ${duration ?? ''},
        ${authorName},
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
        description,
        youtube_url,
        category,
        status,
        featured,
        duration,
        author_name,
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
        .join('') || 'VD'

    const video = {
      id: row.id as string,
      title: row.title as string,
      description: (row.description as string) ?? '',
      youtubeUrl: (row.youtube_url as string) ?? '',
      category: (row.category as string) ?? '',
      status: (row.status as string) ?? 'Draft',
      featured: Boolean(row.featured),
      duration: (row.duration as string) ?? '',
      author: createdAuthorName || 'Unknown',
      authorAvatar: initials,
      views: Number(row.views ?? 0),
      likes: Number(row.likes ?? 0),
      comments: Number(row.comments_count ?? 0),
      date: rawDate,
      createdAt,
      updatedAt: row.updated_at as string,
      publishedAt: createdPublishedAt,
    }

    return NextResponse.json({ video }, { status: 201 })
  } catch (error: any) {
    console.error('Video create error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}
