import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureGalleryTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
  try {
    await ensureGalleryTables()

    const rows = await sql`
      SELECT
        id,
        title,
        description,
        image_url,
        category,
        photographer,
        featured,
        status,
        file_size,
        dimensions,
        views,
        downloads,
        alt_text,
        tags,
        created_at,
        updated_at
      FROM gallery_images
      WHERE status = 'Published'
      ORDER BY created_at DESC
    `

    const images = (rows as any[]).map((row) => ({
      id: row.id as string,
      title: (row.title as string) ?? '',
      description: (row.description as string) ?? '',
      imageUrl: (row.image_url as string) ?? '',
      category: (row.category as string) ?? '',
      photographer: (row.photographer as string) ?? '',
      featured: Boolean(row.featured),
      status: (row.status as string) ?? 'Published',
      fileSize: (row.file_size as string) ?? '',
      dimensions: (row.dimensions as string) ?? '',
      views: (row.views as number) ?? 0,
      downloads: (row.downloads as number) ?? 0,
      altText: (row.alt_text as string) ?? '',
      tags: (row.tags as string) ?? '',
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }))

    return NextResponse.json({ images }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Public gallery images list error:', error)
    return NextResponse.json(
      { error: 'Failed to load gallery images' },
      { status: 500 },
    )
  }
}
