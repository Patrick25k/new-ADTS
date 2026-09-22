import { NextRequest, NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import { resolve, relative, isAbsolute, sep } from 'path'
import { existsSync, createReadStream } from 'fs'
import { Readable } from 'stream'

export const runtime = 'nodejs'

// Configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'storage/uploads/documents'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    // Validate filename (prevent path traversal). A bare ".." with no
    // separator can't escape the upload directory, and separators are
    // rejected outright below, so this only blocks real traversal attempts
    // (the resolved-path containment check further down is the real guard).
    if (!filename || filename.includes('/') || filename.includes('\\')) {
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

    let resolvedFilePath = filePath

    if (!existsSync(resolvedFilePath)) {
      const publicFallbackPath = resolve(process.cwd(), 'public/uploads/documents', filename)
      const publicRelativePath = relative(uploadDirPath, publicFallbackPath)
      if (
        publicRelativePath !== '..' &&
        !publicRelativePath.startsWith('..' + sep) &&
        !isAbsolute(publicRelativePath) &&
        existsSync(publicFallbackPath)
      ) {
        resolvedFilePath = publicFallbackPath
      } else {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
    }

    const stats = await stat(resolvedFilePath)
    const fileSize = stats.size

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', 'inline') // Display in browser
    headers.set('Cache-Control', 'private, max-age=3600') // Cache for 1 hour
    headers.set('Accept-Ranges', 'bytes')

    // Browser PDF viewers commonly use Range requests to load a large PDF
    // progressively; without honoring them, larger files can fail to render.
    const range = request.headers.get('range')
    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range)
      const start = match?.[1] ? parseInt(match[1], 10) : 0
      const end = match?.[2] ? parseInt(match[2], 10) : fileSize - 1

      if (
        !match ||
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start > end ||
        end >= fileSize
      ) {
        headers.set('Content-Range', `bytes */${fileSize}`)
        return new NextResponse(null, { status: 416, headers })
      }

      headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`)
      headers.set('Content-Length', String(end - start + 1))

      const nodeStream = createReadStream(resolvedFilePath, { start, end })
      const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream

      return new NextResponse(webStream, { status: 206, headers })
    }

    headers.set('Content-Length', String(fileSize))
    const nodeStream = createReadStream(resolvedFilePath)
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream

    return new NextResponse(webStream, { status: 200, headers })

  } catch (error: any) {
    console.error('Document serve error:', error)

    return NextResponse.json({ error: 'Failed to serve document' }, { status: 500 })
  }
}