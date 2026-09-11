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
      orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
    })
    return NextResponse.json({ success: true, photos })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la récupération des photos' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const { id: vehicleId } = await context.params
    const body = await request.json()
    const photoId = body.photoId

    if (!photoId) {
      return NextResponse.json({ error: 'photoId requis' }, { status: 400 })
    }

    const target = await prisma.vehiclePhoto.findUnique({
      where: { id: photoId },
    })

    if (!target || target.vehicleId !== vehicleId) {
      return NextResponse.json({ error: 'Photo introuvable pour ce véhicule' }, { status: 404 })
    }

    const allPhotos = await prisma.vehiclePhoto.findMany({
      where: { vehicleId },
      orderBy: { order: 'asc' },
    })

    const otherPhotos = allPhotos.filter((p) => p.id !== photoId)

    await prisma.$transaction([
      prisma.vehiclePhoto.update({
        where: { id: photoId },
        data: { isPrimary: true, order: 0 },
      }),
      ...otherPhotos.map((p, idx) =>
        prisma.vehiclePhoto.update({
          where: { id: p.id },
          data: { isPrimary: false, order: idx + 1 },
        })
      ),
      prisma.vehicle.update({
        where: { id: vehicleId },
        data: { updatedAt: new Date() },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Photo de couverture mise à jour avec succès',
      primaryPhotoId: photoId,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la photo de couverture' },
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
      const isThisPrimary = p.isPrimary ?? (!hasPrimary && i === 0)
      const rec = await prisma.vehiclePhoto.create({
        data: {
          vehicleId,
          url: p.url,
          isPrimary: isThisPrimary,
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
