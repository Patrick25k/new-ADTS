import { writeFile, unlink, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { existsSync } from 'fs'

// Configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads/documents'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx']

/**
 * Validates file before upload
 */
export async function validateFile(file: Blob, fileName: string) {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds limit. Maximum: ${MAX_FILE_SIZE / (1024 * 1024)} MB`
    )
  }

  // Check file type by extension
  const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(
      `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
    )
  }

  // Check MIME type if available
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    console.warn(
      `Warning: MIME type ${file.type} not in approved list, but extension is valid`
    )
  }

  return true
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
 * Saves file to local storage and returns URL
 */
export async function saveFile(file: Blob, fileName: string): Promise<string> {
  try {
    await ensureUploadDir()

    // Sanitize filename
    const sanitizedName = fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const uniqueFileName = `${timestamp}-${sanitizedName}`
    const filePath = resolve(process.cwd(), UPLOAD_DIR, uniqueFileName)

    // Convert blob to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return relative URL
    const url = `/uploads/documents/${uniqueFileName}`
    return url
  } catch (error) {
    console.error('File save error:', error)
    throw new Error('Failed to save file')
  }
}

/**
 * Deletes file from local storage
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl || !fileUrl.startsWith('/uploads/documents/')) {
      return false
    }

    // Extract filename from URL
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
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
