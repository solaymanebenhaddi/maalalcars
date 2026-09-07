import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params
  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key },
    })

    if (!flag) {
      return NextResponse.json(
        { error: `Fonctionnalité introuvable: ${key}` },
        { status: 404 }
      )
    }

    return NextResponse.json(flag)
  } catch (error: unknown) {
    console.error('API Feature GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params
  try {
    const user = await getServerSession()
    if (!user || user.role.name !== 'Administrateur') {
      return NextResponse.json(
        { error: 'Accès réservé aux administrateurs' },
        { status: 403 }
      )
    }

    const body = await request.json()
    if (typeof body.enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Le champ "enabled" (booléen) est requis' },
        { status: 400 }
      )
    }

    const updated = await prisma.featureFlag.update({
      where: { key },
      data: { enabled: body.enabled },
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('API Feature PATCH error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur mise à jour' },
      { status: 500 }
    )
  }
}
