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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureVideosTables()
    await requireAdmin(request)

    const { id } = await params
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

    const rows = await sql`
      UPDATE videos
      SET
        title = ${title},
        description = ${description ?? ''},
        youtube_url = ${youtubeUrl ?? ''},
        category = ${category ?? ''},
        status = ${dbStatus},
        featured = ${isFeatured},
        duration = ${duration ?? ''},
        author_name = ${author ?? ''},
        updated_at = NOW(),
        published_at = CASE
          WHEN ${dbStatus} = 'Published' AND published_at IS NULL THEN NOW()
          WHEN ${dbStatus} = 'Draft' THEN NULL
          ELSE published_at
        END
      WHERE id = ${id}
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

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const row = (rows as any[])[0]

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

    const video = {
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

    return NextResponse.json({ video })
  } catch (error: any) {
    console.error('Video update error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureVideosTables()
    await requireAdmin(request)

    const { id } = await params

    const result = await sql`
      DELETE FROM videos
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Video delete error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
