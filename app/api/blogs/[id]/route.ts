import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureBlogTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureBlogTables()

    const postId = params.id

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const rows = await sql`
      SELECT 
        p.id,
        p.title,
        p.excerpt,
        p.content,
        p.category,
        p.cover_image_url,
        p.featured,
        p.published_at,
        p.created_at,
        a.full_name AS author_name
      FROM blog_posts p
      LEFT JOIN admin_users a ON p.author_id = a.id
      WHERE p.id = ${postId}
        AND p.status = 'Published'
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const row = rows[0] as any
    const publishedAt = (row.published_at as string) ?? null
    const createdAt = row.created_at as string
    const rawDate = publishedAt ?? createdAt

    const post = {
      id: row.id as string,
      title: row.title as string,
      excerpt: (row.excerpt as string) ?? '',
      content: (row.content as string) ?? '',
      category: (row.category as string) ?? '',
      coverImageUrl: (row.cover_image_url as string) ?? '',
      featured: Boolean(row.featured),
      publishedAt,
      createdAt,
      date: rawDate
        ? new Date(rawDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '',
      authorName: (row.author_name as string) ?? 'ADTS Rwanda Team',
    }

    const response = NextResponse.json({ post })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Blog post detail error:', error)
    return NextResponse.json(
      { error: 'Failed to load blog post' },
      { status: 500 }
    )
  }
}
