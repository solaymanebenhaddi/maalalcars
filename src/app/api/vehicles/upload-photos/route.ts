import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { saveFile } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const sessionUser = await getServerSession()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non authentifié. Connexion requise.' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('photos') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas téléverser plus de 10 photos simultanément' },
        { status: 400 }
      )
    }

    const uploadedPhotos: Array<{
      url: string
      name: string
      size: number
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

    return NextResponse.json({
      success: true,
      count: uploadedPhotos.length,
      photos: uploadedPhotos,
    })
  } catch (error: unknown) {
    console.error('Vehicle photo upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du téléversement' },
      { status: 500 }
    )
  }
}
