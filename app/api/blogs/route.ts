import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureBlogTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
  try {
    await ensureBlogTables()

    const rows = await sql`
      SELECT 
        p.id,
        p.title,
        p.excerpt,
        p.category,
        p.cover_image_url,
        p.published_at,
        p.created_at,
        a.full_name AS author_name
      FROM blog_posts p
      LEFT JOIN admin_users a ON p.author_id = a.id
      WHERE p.status = 'Published'
      ORDER BY COALESCE(p.published_at, p.created_at) DESC
    `

    const blogs = (rows as any[]).map((row) => {
      const publishedAt = (row.published_at as string) ?? null
      const createdAt = row.created_at as string
      const rawDate = publishedAt ?? createdAt

      return {
        id: row.id as string,
        title: row.title as string,
        excerpt: (row.excerpt as string) ?? '',
        category: (row.category as string) ?? '',
        coverImageUrl: (row.cover_image_url as string) ?? '',
        publishedAt,
        createdAt,
        date: rawDate
          ? new Date(rawDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '',
        authorName: (row.author_name as string) ?? null,
      }
    })

    return NextResponse.json({ blogs })
  } catch (error) {
    console.error('Public blogs list error:', error)
    return NextResponse.json(
      { error: 'Failed to load blog posts' },
      { status: 500 },
    )
  }
}
