import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { getExistingFilePath } from '@/lib/storage'

export const dynamic = 'force-dynamic'

const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

export async function GET(
  _request: Request,
  context?: { params?: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const rawParams = context?.params ? await context.params : null
    const pathSegments = rawParams?.path

    if (!pathSegments || !Array.isArray(pathSegments) || pathSegments.length === 0) {
      return NextResponse.json({ error: 'Chemin introuvable' }, { status: 400 })
    }

    const relativePath = pathSegments.join('/')
    const absolutePath = await getExistingFilePath(relativePath)

    if (!absolutePath) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 })
    }

    const ext = path.extname(absolutePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    const fileBuffer = await fs.readFile(absolutePath)

    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error: unknown) {
    console.error('Storage route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur de lecture du fichier' },
      { status: 500 }
    )
  }
}

