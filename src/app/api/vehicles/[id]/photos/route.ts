import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vehicleId } = await context.params
    const photos = await prisma.vehiclePhoto.findMany({
      where: { vehicleId },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ success: true, photos })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la récupération des photos' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const { id: vehicleId } = await context.params
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } })
    if (!vehicle) {
      return NextResponse.json({ error: 'Véhicule introuvable' }, { status: 404 })
    }

    const body = await request.json()
    const photos: Array<{ url: string; isPrimary?: boolean; category?: string }> = Array.isArray(body.photos)
      ? body.photos
      : [body]

    const currentCount = await prisma.vehiclePhoto.count({ where: { vehicleId } })
    const hasPrimary = await prisma.vehiclePhoto.findFirst({ where: { vehicleId, isPrimary: true } })

    const created = []
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i]
      const rec = await prisma.vehiclePhoto.create({
        data: {
          vehicleId,
          url: p.url,
          isPrimary: p.isPrimary ?? (!hasPrimary && i === 0),
          order: currentCount + i,
          category: p.category || 'EXTERIEUR',
        },
      })
      created.push(rec)
    }

    return NextResponse.json({ success: true, count: created.length, photos: created })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement des photos' },
      { status: 500 }
    )
  }
}
