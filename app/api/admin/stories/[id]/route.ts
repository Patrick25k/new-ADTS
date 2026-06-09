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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureStoriesTables()
    await requireAdmin(request)

    const { id } = await params
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

    const rows = await sql`
      UPDATE stories
      SET
        title = ${title},
        excerpt = ${excerpt ?? ''},
        story = ${story ?? ''},
        impact = ${impact ?? ''},
        category = ${category ?? ''},
        status = ${dbStatus},
        featured = ${isFeatured},
        image_url = ${image ?? ''},
        video_url = ${videoUrl ?? ''},
        author_name = ${author ?? ''},
        read_time = ${readTime ?? ''},
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

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
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

    return NextResponse.json({ story: storyResult })
  } catch (error: any) {
    console.error('Story update error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureStoriesTables()
    await requireAdmin(request)

    const { id } = await params

    const result = await sql`
      DELETE FROM stories
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Story delete error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 })
  }
}
