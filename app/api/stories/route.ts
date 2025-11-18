import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureStoriesTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
  try {
    await ensureStoriesTables()

    const rows = await sql`
      SELECT
        id,
        title,
        excerpt,
        story,
        impact,
        category,
        author_name,
        image_url,
        video_url,
        published_at,
        created_at
      FROM stories
      WHERE status = 'Published'
      ORDER BY COALESCE(published_at, created_at) DESC
    `

    const stories = (rows as any[]).map((row) => {
      const publishedAt = (row.published_at as string) ?? null
      const createdAt = row.created_at as string
      const rawDate = publishedAt ?? createdAt

      return {
        id: row.id as string,
        title: row.title as string,
        excerpt: (row.excerpt as string) ?? '',
        story: (row.story as string) ?? '',
        impact: (row.impact as string) ?? '',
        category: (row.category as string) ?? '',
        authorName: (row.author_name as string) ?? null,
        imageUrl: (row.image_url as string) ?? '',
        videoUrl: (row.video_url as string) ?? '',
        date: rawDate
          ? new Date(rawDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '',
      }
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Public stories list error:', error)
    return NextResponse.json(
      { error: 'Failed to load stories' },
      { status: 500 },
    )
  }
}
