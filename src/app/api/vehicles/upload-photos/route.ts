import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { saveFile } from '@/lib/storage'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const sessionUser = await getServerSession()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non authentifié. Connexion requise.' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('photos') as File[]
    const vehicleId = formData.get('vehicleId') as string | null

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (files.length > 20) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas téléverser plus de 20 photos simultanément' },
        { status: 400 }
      )
    }

    const uploadedPhotos: Array<{
      id?: string
      url: string
      name: string
      size: number
      isPrimary?: boolean
    }> = []

    for (const file of files) {
      // Validate that the item is a File and an image
      if (!(file instanceof File) || file.size === 0) {
        continue
      }

      const isValidImage =
        file.type.startsWith('image/') ||
        /\.(webp|jpg|jpeg|png|gif|avif)$/i.test(file.name)

      if (!isValidImage) {
        return NextResponse.json(
          { error: `Le fichier ${file.name} n'est pas une image valide` },
          { status: 400 }
        )
      }

      // Read buffer from file
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Ensure filename ends with .webp if it's WebP, or preserve extension
      let filename = file.name
      if (!filename.toLowerCase().endsWith('.webp') && file.type === 'image/webp') {
        filename = `${filename.replace(/\.[^/.]+$/, '')}.webp`
      }

      // Save to storage/vehicles
      const saved = await saveFile('vehicles', buffer, filename)

      // Generate public API URL
      const publicUrl = `/api/storage/${saved.relativePath.replace(/\\/g, '/')}`

      uploadedPhotos.push({
        url: publicUrl,
        name: file.name,
        size: file.size,
      })
    }

    // If vehicleId is provided, associate photos directly in the database
    if (vehicleId && uploadedPhotos.length > 0) {
      const currentCount = await prisma.vehiclePhoto.count({ where: { vehicleId } })
      const hasPrimary = await prisma.vehiclePhoto.findFirst({ where: { vehicleId, isPrimary: true } })

      for (let i = 0; i < uploadedPhotos.length; i++) {
        const photoRecord = await prisma.vehiclePhoto.create({
          data: {
            vehicleId,
            url: uploadedPhotos[i].url,
            isPrimary: !hasPrimary && i === 0,
            order: currentCount + i,
            category: 'EXTERIEUR',
          },
        })
        uploadedPhotos[i].id = photoRecord.id
        uploadedPhotos[i].isPrimary = photoRecord.isPrimary
      }
    }

    return NextResponse.json({
      success: true,
      count: uploadedPhotos.length,
      photos: uploadedPhotos,
    })
  } catch (error: unknown) {
    console.error('Vehicle photo upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du téléversement sur le serveur' },
      { status: 500 }
    )
  }
}

