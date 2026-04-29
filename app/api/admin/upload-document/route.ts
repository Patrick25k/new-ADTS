import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'
import { validateFile, saveFile, getFileSizeText } from '@/lib/file-storage'

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

    // Validate file
    try {
      await validateFile(file, fileName)
    } catch (validationError: any) {
      return NextResponse.json(
        { error: validationError.message },
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
      localStorage: true,
    })

  } catch (error: any) {
    console.error('Document upload error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to upload document' },
      { status: 500 }
    )
  }
}
