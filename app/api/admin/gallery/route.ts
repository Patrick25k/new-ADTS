import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureGalleryTables } from '@/lib/db'
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
    await ensureGalleryTables()
    await requireAdmin(request)

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
        updated_at,
        created_by
      FROM gallery_images
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
      createdBy: row.created_by as string,
    }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Admin gallery images list error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to load gallery images' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureGalleryTables()
    await requireAdmin(request)

    const {
      title,
      description,
      imageUrl,
      category,
      photographer,
      featured,
      status,
      fileSize,
      dimensions,
      altText,
      tags,
    } = await request.json()

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 },
      )
    }

    const admin = await requireAdmin(request)

    const result = await sql`
      INSERT INTO gallery_images (
        title,
        description,
        image_url,
        category,
        photographer,
        featured,
        status,
        file_size,
        dimensions,
        alt_text,
        tags,
        created_by
      )
      VALUES (
        ${title},
        ${description ?? null},
        ${imageUrl},
        ${category ?? null},
        ${photographer ?? null},
        ${featured ?? false},
        ${status ?? 'Published'},
        ${fileSize ?? null},
        ${dimensions ?? null},
        ${altText ?? null},
        ${tags ?? null},
        ${admin.sub}
      )
      RETURNING id, title, description, image_url, category, photographer, featured, status, file_size, dimensions, views, downloads, alt_text, tags, created_at, updated_at, created_by
    `

    const newImage = (result as any[])[0]

    return NextResponse.json({
      success: true,
      image: {
        id: newImage.id as string,
        title: (newImage.title as string) ?? '',
        description: (newImage.description as string) ?? '',
        imageUrl: (newImage.image_url as string) ?? '',
        category: (newImage.category as string) ?? '',
        photographer: (newImage.photographer as string) ?? '',
        featured: Boolean(newImage.featured),
        status: (newImage.status as string) ?? 'Published',
        fileSize: (newImage.file_size as string) ?? '',
        dimensions: (newImage.dimensions as string) ?? '',
        views: (newImage.views as number) ?? 0,
        downloads: (newImage.downloads as number) ?? 0,
        altText: (newImage.alt_text as string) ?? '',
        tags: (newImage.tags as string) ?? '',
        createdAt: newImage.created_at as string,
        updatedAt: newImage.updated_at as string,
        createdBy: newImage.created_by as string,
      },
    })
  } catch (error) {
    console.error('Admin gallery image create error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureGalleryTables()
    await requireAdmin(request)

    const {
      id,
      title,
      description,
      imageUrl,
      category,
      photographer,
      featured,
      status,
      fileSize,
      dimensions,
      altText,
      tags,
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 },
      )
    }

    const result = await sql`
      UPDATE gallery_images
      SET
        title = ${title ?? null},
        description = ${description ?? null},
        image_url = ${imageUrl ?? null},
        category = ${category ?? null},
        photographer = ${photographer ?? null},
        featured = ${featured ?? false},
        status = ${status ?? 'Published'},
        file_size = ${fileSize ?? null},
        dimensions = ${dimensions ?? null},
        alt_text = ${altText ?? null},
        tags = ${tags ?? null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, description, image_url, category, photographer, featured, status, file_size, dimensions, views, downloads, alt_text, tags, created_at, updated_at, created_by
    `

    const updatedImage = (result as any[])[0]

    if (!updatedImage) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      image: {
        id: updatedImage.id as string,
        title: (updatedImage.title as string) ?? '',
        description: (updatedImage.description as string) ?? '',
        imageUrl: (updatedImage.image_url as string) ?? '',
        category: (updatedImage.category as string) ?? '',
        photographer: (updatedImage.photographer as string) ?? '',
        featured: Boolean(updatedImage.featured),
        status: (updatedImage.status as string) ?? 'Published',
        fileSize: (updatedImage.file_size as string) ?? '',
        dimensions: (updatedImage.dimensions as string) ?? '',
        views: (updatedImage.views as number) ?? 0,
        downloads: (updatedImage.downloads as number) ?? 0,
        altText: (updatedImage.alt_text as string) ?? '',
        tags: (updatedImage.tags as string) ?? '',
        createdAt: updatedImage.created_at as string,
        updatedAt: updatedImage.updated_at as string,
        createdBy: updatedImage.created_by as string,
      },
    })
  } catch (error) {
    console.error('Admin gallery image update error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureGalleryTables()
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 },
      )
    }

    const result = await sql`
      DELETE FROM gallery_images
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin gallery image delete error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 },
    )
  }
}
