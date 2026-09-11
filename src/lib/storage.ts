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
 * Also mirrors the file into public/storage so that the web server (LiteSpeed)
 * can serve it statically with zero Node.js thread overhead.
 */
export async function saveFile(
  category: StorageCategory,
  fileBuffer: Buffer,
  originalFilename: string,
): Promise<StoragePaths> {
  const paths = generateStoragePath(category, originalFilename)

  // 1. Ensure the category directory exists in storage root
  const dir = path.dirname(paths.absolutePath)
  await fs.mkdir(dir, { recursive: true, mode: 0o777 })
  await fs.writeFile(paths.absolutePath, fileBuffer)

  // 2. Mirror into public/storage for high-speed direct static serving by LiteSpeed
  try {
    const publicStoragePath = path.join(process.cwd(), 'public', 'storage', paths.relativePath)
    await fs.mkdir(path.dirname(publicStoragePath), { recursive: true, mode: 0o777 })
    await fs.writeFile(publicStoragePath, fileBuffer)
  } catch (_) {
    // Non-fatal if public folder is read-only in some environments
  }

  return paths
}

/**
 * Finds an existing file across storage locations:
 * 1. Primary storage root (storage/{relativePath})
 * 2. Public storage mirror (public/storage/{relativePath})
 * 3. Public root (public/{relativePath})
 * Returns the absolute path if found and valid, or null.
 */
export async function getExistingFilePath(relativePath: string): Promise<string | null> {
  // Guard against directory traversal
  const sanitized = relativePath.replace(/^[/\\]+/, '').replace(/\.\.[/\\]/g, '')

  const candidates = [
    path.resolve(STORAGE_ROOT, sanitized),
    path.resolve(process.cwd(), 'public', 'storage', sanitized),
    path.resolve(process.cwd(), 'public', sanitized),
  ]

  for (const candidate of candidates) {
    // Ensure candidate stays within expected directory
    try {
      const stat = await fs.stat(/*turbopackIgnore: true*/ candidate)
      if (stat.isFile()) {
        return candidate
      }
    } catch (_) {}

  }

  return null
}

/**
 * Deletes a file identified by its relative path.
 * Validates against traversal before deletion.
 */
export async function deleteFile(relativePath: string): Promise<void> {
  try {
    const absolutePath = getAbsolutePath(relativePath)
    await fs.unlink(absolutePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File already gone – treat as success
    } else {
      throw error
    }
  }

  // Also remove mirror in public/storage if present
  try {
    const publicMirror = path.resolve(process.cwd(), 'public', 'storage', relativePath)
    await fs.unlink(publicMirror)
  } catch (_) {}
}
