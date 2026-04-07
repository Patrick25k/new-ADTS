import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureBlogTables } from '@/lib/db'
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
    await ensureBlogTables()
    await requireAdmin(request)

    const { id } = await params
    const body = await request.json()
    const { title, excerpt, content, category, status, featured, coverImageUrl } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 },
      )
    }

    const dbStatus = status === 'Published' || status === 'Draft' ? status : 'Draft'
    const isFeatured = Boolean(featured)

    const rows = await sql`
      UPDATE blog_posts
      SET
        title = ${title},
        excerpt = ${excerpt ?? ''},
        content = ${content ?? ''},
        category = ${category ?? ''},
        status = ${dbStatus},
        featured = ${isFeatured},
        cover_image_url = ${coverImageUrl ?? ''},
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
        content,
        category,
        status,
        featured,
        cover_image_url,
        views,
        likes,
        created_at,
        updated_at,
        published_at
    `

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    const row = (rows as any[])[0]

    const blog = {
      id: row.id as string,
      title: row.title as string,
      excerpt: (row.excerpt as string) ?? '',
      content: (row.content as string) ?? '',
      category: (row.category as string) ?? '',
      status: (row.status as string) ?? 'Draft',
      featured: Boolean(row.featured),
      coverImageUrl: (row.cover_image_url as string) ?? '',
      views: Number(row.views ?? 0),
      likes: Number(row.likes ?? 0),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      publishedAt: (row.published_at as string) ?? null,
    }

    return NextResponse.json({ blog })
  } catch (error: any) {
    console.error('Blog update error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureBlogTables()
    await requireAdmin(request)

    const { id } = await params

    const result = await sql`
      DELETE FROM blog_posts
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Blog delete error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
