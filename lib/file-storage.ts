import { unlink, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { randomBytes } from 'crypto'

// Configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'storage/uploads/documents'
export const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200 MB
export const ALLOWED_MIME_TYPES = ['application/pdf']
export const ALLOWED_EXTENSIONS = ['.pdf']

/**
 * Validates a filename and declared MIME type before any bytes are read.
 * Size is enforced separately, during the streamed write, so a large file
 * is rejected as soon as it crosses the limit instead of after it's fully
 * received.
 */
export function validateFileNameAndType(fileName: string, mimeType?: string) {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex < 0) {
    throw new Error(
      `File type not allowed. Filename "${fileName}" has no extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
    )
  }
  const ext = fileName.substring(lastDotIndex).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(
      `File type not allowed. Extension "${ext}" is not permitted. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
    )
  }

  if (!mimeType) {
    throw new Error(
      `File type not allowed. MIME type is missing. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    )
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(
      `File type not allowed. MIME type ${mimeType} is not permitted. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    )
  }
}

/**
 * Ensures upload directory exists
 */
export async function ensureUploadDir() {
  try {
    const uploadPath = resolve(process.cwd(), UPLOAD_DIR)
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }
  } catch (error) {
    console.error('Failed to create upload directory:', error)
    throw new Error('Failed to initialize upload directory')
  }
}

/**
 * Resolves a safe, unique on-disk destination for an uploaded file without
 * writing anything yet. Used to open a write stream directly to disk so the
 * upload can be streamed instead of buffered entirely in memory.
 */
export async function resolveUploadDestination(fileName: string): Promise<{
  filePath: string
  url: string
}> {
  await ensureUploadDir()

  const sanitizedName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')

  const timestamp = Date.now()
  const uniqueSuffix = randomBytes(4).toString('hex')
  const uniqueFileName = `${timestamp}-${uniqueSuffix}-${sanitizedName}`
  const filePath = resolve(process.cwd(), UPLOAD_DIR, uniqueFileName)

  const uploadDirPath = resolve(process.cwd(), UPLOAD_DIR)
  if (!filePath.startsWith(uploadDirPath)) {
    throw new Error('Invalid file path: path traversal detected')
  }

  return { filePath, url: `/api/documents/${uniqueFileName}` }
}

/**
 * Deletes file from local storage
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl || !fileUrl.startsWith('/api/documents/')) {
      return false
    }

    // Extract filename from API URL
    const fileName = fileUrl.split('/').pop()
    if (!fileName) {
      return false
    }

    const filePath = resolve(process.cwd(), UPLOAD_DIR, fileName)

    // Verify file exists and is in the upload directory
    if (!existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`)
      return false
    }

    // Verify the path is within upload directory (security check)
    const resolvedPath = resolve(filePath)
    const resolvedUploadDir = resolve(process.cwd(), UPLOAD_DIR)
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      throw new Error('Invalid file path')
    }

    await unlink(filePath)
    return true
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
}

/**
 * Gets file size in readable format
 */
export function getFileSizeText(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  // Guard against negative, non-finite, or invalid inputs
  if (bytes < 0 || !isFinite(bytes) || isNaN(bytes)) {
    return 'Invalid size'
  }

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  // Clamp index to prevent out-of-bounds access
  const clampedI = Math.max(Math.min(i, sizes.length - 1), 0)

  return Math.round((bytes / Math.pow(k, clampedI)) * 100) / 100 + ' ' + sizes[clampedI]
}
