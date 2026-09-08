import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from '@/lib/session'
import { saveFile } from '@/lib/storage'
import prisma from '@/lib/db'
import { getDocumentTypeLabel, DOCUMENT_TYPES, validateDocumentUpload } from '@/domain/document'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const sessionUser = await getServerSession()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non authentifié. Connexion requise.' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string) || 'AUTRE'
    let category = (formData.get('category') as string) || ''
    const customTitle = (formData.get('title') as string) || ''
    const vehicleId = (formData.get('vehicleId') as string) || null
    const purchaseId = (formData.get('purchaseId') as string) || null
    const saleId = (formData.get('saleId') as string) || null
    const repairId = (formData.get('repairId') as string) || null
    const expiryDateStr = (formData.get('expiryDate') as string) || null
    const tagsStr = (formData.get('tags') as string) || null

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Veuillez sélectionner un fichier valide' }, { status: 400 })
    }

    // Domain validation
    const validation = validateDocumentUpload({
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
    })
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Determine category from type if not provided
    if (!category) {
      const typeDef = DOCUMENT_TYPES.find((dt) => dt.value === type)
      category = typeDef?.category || 'Administratif'
    }

    // Default title
    const typeLabel = getDocumentTypeLabel(type)
    const title = customTitle.trim() || typeLabel

    // Read buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save to storage/documents
    const saved = await saveFile('documents', buffer, file.name)
    const fileUrl = `/api/storage/${saved.relativePath.replace(/\\/g, '/')}`

    // Count for unique document code
    const count = await prisma.document.count()
    const code = `DOC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null

    const document = await prisma.document.create({
      data: {
        code,
        title,
        type,
        category,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        issueDate: new Date(),
        expiryDate,
        status: 'VALID',
        tags: tagsStr,
        vehicleId,
        purchaseId,
        saleId,
        repairId,
      },
    })

    revalidatePath('/vehicles')
    if (vehicleId) {
      revalidatePath(`/vehicles/${vehicleId}`)
    }

    return NextResponse.json(document, { status: 201 })
  } catch (error: unknown) {
    console.error('Error uploading document:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du téléversement du document' },
      { status: 500 }
    )
  }
}
