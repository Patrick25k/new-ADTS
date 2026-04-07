import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
  if (!token) {
    throw new Error('Unauthorized')
  }

  const payload = await verifyAdminToken(token)
  return payload
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Check if Blob storage is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Vercel Blob Storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.' },
        { status: 500 }
      )
    }

    const fileName = formData.get('fileName') as string || 'document'
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const originalName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `documents/${timestamp}-${originalName}`

    try {
      // Upload to Vercel Blob Storage
      const blob = await put(uniqueFileName, buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: file.type || 'application/octet-stream',
      })

      return NextResponse.json({
        url: blob.url,
        fileName: originalName,
        blobId: blob.pathname,
        vercelBlob: true,
      })

    } catch (blobError) {
      console.error('Vercel Blob upload error:', blobError)
      return NextResponse.json(
        { error: 'Failed to upload to Vercel Blob Storage: ' + (blobError as Error).message },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Document upload error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
