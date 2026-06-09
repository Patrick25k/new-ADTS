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

export async function GET(request: NextRequest) {
  try {
    await ensureBlogTables()
    await requireAdmin(request)

    const rows = await sql`
      SELECT 
        p.id,
        p.title,
        p.excerpt,
        p.content,
        p.category,
        p.status,
        p.featured,
        p.cover_image_url,
        p.views,
        p.likes,
        p.created_at,
        p.updated_at,
        p.published_at,
        a.full_name AS author_name,
        a.email AS author_email
      FROM blog_posts p
      LEFT JOIN admin_users a ON p.author_id = a.id
      ORDER BY p.created_at DESC
    `

    const blogs = (rows as any[]).map((row) => ({
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
      authorName: (row.author_name as string) ?? null,
      authorEmail: (row.author_email as string) ?? null,
    }))

    return NextResponse.json({ blogs })
  } catch (error: any) {
    console.error('Blog list error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureBlogTables()
    const admin = await requireAdmin(request)

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
    const publishedAt = dbStatus === 'Published' ? new Date().toISOString() : null

    const rows = await sql`
      INSERT INTO blog_posts (
        title,
        excerpt,
        content,
        category,
        status,
        featured,
        cover_image_url,
        author_id,
        views,
        likes,
        created_at,
        updated_at,
        published_at
      ) VALUES (
        ${title},
        ${excerpt ?? ''},
        ${content ?? ''},
        ${category ?? ''},
        ${dbStatus},
        ${isFeatured},
        ${coverImageUrl ?? ''},
        ${admin.sub ?? null},
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
      authorName: admin.name ?? null,
      authorEmail: admin.email ?? null,
    }

    return NextResponse.json({ blog }, { status: 201 })
  } catch (error: any) {
    console.error('Blog create error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
