import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'
import { validateFile, saveFile, getFileSizeText } from '@/lib/file-storage'
import { extractPDFMetadata } from '@/lib/pdf-metadata'

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

    const fileName = formData.get('fileName') as string || 'document'

    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed for report uploads.' },
        { status: 400 }
      )
    }

    // Validate file
    try {
      await validateFile(file, fileName)
    } catch (validationError: any) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      )
    }

    // Extract PDF metadata
    let metadata
    try {
      metadata = await extractPDFMetadata(file)
    } catch (metadataError: any) {
      console.error('PDF metadata extraction error:', metadataError)
      return NextResponse.json(
        { error: 'Invalid PDF file or unable to read metadata' },
        { status: 400 }
      )
    }

    // Save file to local storage
    const url = await saveFile(file, fileName)
    const sizeText = getFileSizeText(file.size)

    return NextResponse.json({
      url,
      fileName,
      size: sizeText,
      sizeBytes: file.size,
      pages: metadata.pages,
      format: 'PDF',
      localStorage: true,
    })

  } catch (error: any) {
    console.error('Document upload error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
