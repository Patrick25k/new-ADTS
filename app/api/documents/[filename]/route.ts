import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { resolve, relative, isAbsolute, sep } from 'path'
import { existsSync } from 'fs'

// Configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'storage/uploads/documents'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    // Validate filename (prevent path traversal)
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const uploadDirPath = resolve(process.cwd(), UPLOAD_DIR)
    const filePath = resolve(uploadDirPath, filename)

    // Ensure requested file is contained within the upload directory
    const relativePath = relative(uploadDirPath, filePath)
    if (
      relativePath === '..' ||
      relativePath.startsWith('..' + sep) ||
      isAbsolute(relativePath)
    ) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read and serve the file
    const fileBuffer = await readFile(filePath)

    // Set appropriate headers for PDF
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', 'inline') // Display in browser
    headers.set('Cache-Control', 'private, max-age=3600') // Cache for 1 hour

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })

  } catch (error: any) {
    console.error('Document serve error:', error)

    return NextResponse.json({ error: 'Failed to serve document' }, { status: 500 })
  }
}