import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureVideosTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
  try {
    await ensureVideosTables()

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
        views,
        likes,
        comments_count,
        published_at,
        created_at
      FROM videos
      WHERE status = 'Published'
      ORDER BY COALESCE(published_at, created_at) DESC
    `

    const videos = (rows as any[]).map((row) => {
      const publishedAt = (row.published_at as string) ?? null
      const createdAt = row.created_at as string
      const rawDate = publishedAt ?? createdAt

      return {
        id: row.id as string,
        title: row.title as string,
        description: (row.description as string) ?? '',
        youtubeUrl: (row.youtube_url as string) ?? '',
        category: (row.category as string) ?? '',
        status: (row.status as string) ?? 'Draft',
        featured: Boolean(row.featured),
        duration: (row.duration as string) ?? '',
        views: (row.views as number) ?? 0,
        likes: (row.likes as number) ?? 0,
        comments: (row.comments_count as number) ?? 0,
        date: rawDate
          ? new Date(rawDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '',
      }
    })

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Public videos list error:', error)
    return NextResponse.json(
      { error: 'Failed to load videos' },
      { status: 500 },
    )
  }
}
