import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
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

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 },
      )
    }

    // Get file info
    const fileName = formData.get('fileName') as string || 'document'
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'documents')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = (formData.get('fileName') as string) || 'document'
    const extension = originalName.includes('.') ? 
      originalName.split('.').pop() : 
      'pdf' // default to pdf if no extension
    const safeFileName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}.${extension}`
    const filePath = join(uploadsDir, safeFileName)

    // Write file to local storage
    await writeFile(filePath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/documents/${safeFileName}`

    return NextResponse.json({
      url: publicUrl,
      fileName: safeFileName,
    })
  } catch (error: any) {
    console.error('Document upload error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 },
    )
  }
}
