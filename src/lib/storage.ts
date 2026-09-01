import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export const STORAGE_ROOT = path.resolve(process.cwd(), 'storage')

export type StorageCategory =
  | 'vehicles'
  | 'documents'
  | 'invoices'
  | 'contracts'
  | 'inspections'
  | 'expenses'
  | 'insurance'
  | 'warranties'
  | 'temp'

export interface StoragePaths {
  relativePath: string
  absolutePath: string
  safeFilename: string
}

// ---------------------------------------------------------------------------
// Sanitization & path helpers
// ---------------------------------------------------------------------------

/**
 * Strips path traversal sequences, null bytes, and dangerous special characters
 * from a filename, keeping only safe characters.
 */
export function sanitizeFilename(filename: string): string {
  // Remove null bytes
  let safe = filename.replace(/\0/g, '')

  // Take only the base name – discard any directory components
  safe = path.basename(safe)

  // Replace path separators that survive basename on unusual inputs
  safe = safe.replace(/[/\\]/g, '')

  // Remove leading dots (hidden files) and dangerous shell chars
  safe = safe.replace(/^\.+/, '')
  safe = safe.replace(/[<>:"|?*]/g, '')

  // Collapse whitespace to underscores
  safe = safe.replace(/\s+/g, '_')

  // Fall back to a uuid-based name if nothing usable remains
  if (!safe || safe === '') {
    safe = uuidv4()
  }

  return safe
}

/**
 * Builds relative and absolute paths for a new file inside the storage root.
 * Uses a uuid prefix to avoid collisions.
 */
export function generateStoragePath(
  category: StorageCategory,
  originalFilename: string,
): StoragePaths {
  const safeFilename = sanitizeFilename(originalFilename)
  const uniqueFilename = `${uuidv4()}-${safeFilename}`
  const relativePath = path.join(category, uniqueFilename)
  const absolutePath = path.join(STORAGE_ROOT, relativePath)

  return { relativePath, absolutePath, safeFilename: uniqueFilename }
}

/**
 * Resolves a relative path to an absolute path and validates it stays inside
 * the storage root (directory traversal guard).
 */
export function getAbsolutePath(relativePath: string): string {
  // Normalize and resolve without allowing escaping the root
  const resolved = path.resolve(STORAGE_ROOT, relativePath)

  if (!resolved.startsWith(STORAGE_ROOT + path.sep) && resolved !== STORAGE_ROOT) {
    throw new Error(`Path traversal detected: "${relativePath}" escapes the storage root`)
  }

  return resolved
}

// ---------------------------------------------------------------------------
// File operations
// ---------------------------------------------------------------------------

/**
 * Saves a buffer to storage under the given category.
 * Creates the target directory if it does not exist.
 */
export async function saveFile(
  category: StorageCategory,
  fileBuffer: Buffer,
  originalFilename: string,
): Promise<StoragePaths> {
  const paths = generateStoragePath(category, originalFilename)

  // Ensure the category directory exists
  const dir = path.dirname(paths.absolutePath)
  await fs.mkdir(dir, { recursive: true })

  await fs.writeFile(paths.absolutePath, fileBuffer)

  return paths
}

/**
 * Deletes a file identified by its relative path.
 * Validates against traversal before deletion.
 */
export async function deleteFile(relativePath: string): Promise<void> {
  const absolutePath = getAbsolutePath(relativePath)

  try {
    await fs.unlink(absolutePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File already gone – treat as success
      return
    }
    throw error
  }
}
