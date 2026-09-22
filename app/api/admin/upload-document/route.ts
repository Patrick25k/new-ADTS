import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import { createWriteStream } from 'fs'
import { readFile, unlink } from 'fs/promises'
import busboy from 'busboy'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'
import {
  MAX_FILE_SIZE,
  validateFileNameAndType,
  resolveUploadDestination,
  getFileSizeText,
} from '@/lib/file-storage'
import { extractPDFMetadata } from '@/lib/pdf-metadata'

export const runtime = 'nodejs'

class UploadValidationError extends Error {}

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
  if (!token) {
    throw new Error('Unauthorized')
  }

  const payload = await verifyAdminToken(token)
  return payload
}

/**
 * Streams the uploaded file straight to disk instead of buffering the whole
 * request in memory (which is what `request.formData()` does internally).
 * On a memory-constrained server, fully buffering a large file before
 * writing it can exhaust RAM and stall the connection, which looks like a
 * hung upload with no error on the client.
 */
function streamUploadToDisk(request: NextRequest): Promise<{
  filePath: string
  url: string
  fileName: string
  sizeBytes: number
}> {
  return new Promise((resolvePromise, rejectPromise) => {
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('multipart/form-data')) {
      rejectPromise(new UploadValidationError('Expected multipart/form-data request'))
      return
    }
    if (!request.body) {
      rejectPromise(new UploadValidationError('No file uploaded'))
      return
    }

    const bb = busboy({
      headers: { 'content-type': contentType },
      limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    })

    let settled = false
    let sawFile = false
    let destFilePath: string | null = null
    let bytesWritten = 0

    const nodeStream = Readable.fromWeb(request.body as any)

    const fail = (error: Error) => {
      if (settled) return
      settled = true
      if (destFilePath) {
        unlink(destFilePath).catch(() => {})
      }
      nodeStream.unpipe(bb)
      nodeStream.destroy()
      bb.removeAllListeners()
      bb.destroy()
      rejectPromise(error)
    }

    bb.on('file', (_fieldName, fileStream, info) => {
      sawFile = true
      const { filename, mimeType } = info

      try {
        validateFileNameAndType(filename, mimeType)
      } catch (validationError: any) {
        fileStream.resume()
        fail(validationError)
        return
      }

      resolveUploadDestination(filename)
        .then(({ filePath, url }) => {
          if (settled) return
          destFilePath = filePath

          const writeStream = createWriteStream(filePath)

          fileStream.on('data', (chunk: Buffer) => {
            bytesWritten += chunk.length
          })

          fileStream.on('limit', () => {
            fail(
              new UploadValidationError(
                `File size exceeds limit. Maximum: ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
              ),
            )
          })

          fileStream.on('error', (err: any) =>
            fail(err instanceof Error ? err : new Error('Upload stream error')),
          )
          writeStream.on('error', (err: any) =>
            fail(err instanceof Error ? err : new Error('Failed to write file')),
          )

          writeStream.on('close', () => {
            if (settled) return
            settled = true
            resolvePromise({ filePath, url, fileName: filename, sizeBytes: bytesWritten })
          })

          fileStream.pipe(writeStream)
        })
        .catch((err) =>
          fail(err instanceof Error ? err : new Error('Failed to prepare upload destination')),
        )
    })

    bb.on('error', (err: any) => fail(err instanceof Error ? err : new Error('Upload parsing error')))

    bb.on('finish', () => {
      if (!sawFile) {
        fail(new UploadValidationError('No file uploaded'))
      }
    })

    nodeStream.pipe(bb)
  })
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const upload = await streamUploadToDisk(request)

    const fileBuffer = await readFile(upload.filePath)
    const metadata = await extractPDFMetadata(fileBuffer)
    const sizeText = getFileSizeText(upload.sizeBytes)

    return NextResponse.json({
      url: upload.url,
      fileName: upload.fileName,
      size: sizeText,
      sizeBytes: upload.sizeBytes,
      pages: metadata.pages,
      format: 'PDF',
      localStorage: true,
    })
  } catch (error: any) {
    console.error('Document upload error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
