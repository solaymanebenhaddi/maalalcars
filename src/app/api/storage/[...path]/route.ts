import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  context?: { params?: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const rawParams = context?.params ? await context.params : null
    const pathSegments = rawParams?.path

    if (!pathSegments || !Array.isArray(pathSegments) || pathSegments.length === 0) {
      return NextResponse.json({ error: 'Chemin introuvable' }, { status: 400 })
    }

    const relativePath = pathSegments.join('/')
    const redirectUrl = new URL(`/storage/${relativePath}`, request.url)

    return NextResponse.redirect(redirectUrl, 307)
  } catch (error: unknown) {
    console.error('Storage route redirect error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur de redirection de fichier' },
      { status: 500 }
    )
  }
}


