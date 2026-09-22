import { NextRequest, NextResponse } from 'next/server'
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

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
    const folder = process.env.CLOUDINARY_FOLDER

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary environment variables are not configured' },
        { status: 500 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Math.floor(Date.now() / 1000)

    const params: Record<string, string | number> = {
      timestamp,
    }

    if (uploadPreset) {
      params.upload_preset = uploadPreset
    }

    if (folder) {
      params.folder = folder
    }

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, String(value))
    }

    const signatureBase = [...searchParams.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + apiSecret

    const crypto = await import('crypto')
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex')

    searchParams.append('api_key', apiKey)
    searchParams.append('signature', signature)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`

    const uploadForm = new FormData()
    uploadForm.append('file', new Blob([buffer]))
    for (const [key, value] of searchParams.entries()) {
      uploadForm.append(key, value)
    }

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadForm,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Cloudinary upload failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 502 },
      )
    }

    const result = await uploadResponse.json()

    return NextResponse.json({
      url: result.secure_url as string,
      publicId: result.public_id as string,
    })
  } catch (error: any) {
    console.error('Image upload error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 },
    )
  }
}
