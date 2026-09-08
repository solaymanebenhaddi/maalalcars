'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from '@/lib/session'
import { saveFile, deleteFile } from '@/lib/storage'
import prisma from '@/lib/db'
import { getDocumentTypeLabel, DOCUMENT_TYPES } from '@/domain/document'

export async function uploadDocumentAction(formData: FormData) {
  const sessionUser = await getServerSession()
  if (!sessionUser) {
    throw new Error('Non authentifié. Connexion requise.')
  }

  const file = formData.get('file') as File | null
  const type = (formData.get('type') as string) || 'AUTRE'
  let category = (formData.get('category') as string) || ''
  const customTitle = (formData.get('title') as string) || ''
  const vehicleId = (formData.get('vehicleId') as string) || null
  const purchaseId = (formData.get('purchaseId') as string) || null
  const saleId = (formData.get('saleId') as string) || null
  const repairId = (formData.get('repairId') as string) || null
  const expiryDateStr = (formData.get('expiryDate') as string) || null
  const returnPath = (formData.get('returnPath') as string) || null

  if (!file || !(file instanceof File) || file.size === 0) {
    throw new Error('Veuillez sélectionner un fichier valide.')
  }

  if (file.size > 25 * 1024 * 1024) {
    throw new Error('La taille du fichier dépasse la limite maximale autorisée de 25 Mo.')
  }

  if (!category) {
    const typeDef = DOCUMENT_TYPES.find((dt) => dt.value === type)
    category = typeDef?.category || 'Administratif'
  }

  const typeLabel = getDocumentTypeLabel(type)
  const title = customTitle.trim() || typeLabel

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const saved = await saveFile('documents', buffer, file.name)
  const fileUrl = `/api/storage/${saved.relativePath.replace(/\\/g, '/')}`

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
      vehicleId,
      purchaseId,
      saleId,
      repairId,
    },
  })

  if (vehicleId) {
    revalidatePath(`/vehicles/${vehicleId}`)
  }
  if (saleId) {
    revalidatePath(`/sales/${saleId}`)
  }
  if (repairId) {
    revalidatePath(`/workshop/${repairId}`)
  }
  if (returnPath) {
    revalidatePath(returnPath)
  }
  revalidatePath('/documents')

  return document
}

export async function attachDocumentsAction(
  documentIds: string[],
  relations: {
    vehicleId?: string | null
    purchaseId?: string | null
    saleId?: string | null
    repairId?: string | null
  }
) {
  if (!documentIds || documentIds.length === 0) return { count: 0 }

  const dataToUpdate: Record<string, string> = {}
  if (relations.vehicleId) dataToUpdate.vehicleId = relations.vehicleId
  if (relations.purchaseId) dataToUpdate.purchaseId = relations.purchaseId
  if (relations.saleId) dataToUpdate.saleId = relations.saleId
  if (relations.repairId) dataToUpdate.repairId = relations.repairId

  if (Object.keys(dataToUpdate).length === 0) return { count: 0 }

  const result = await prisma.document.updateMany({
    where: { id: { in: documentIds } },
    data: dataToUpdate,
  })

  if (relations.vehicleId) {
    revalidatePath(`/vehicles/${relations.vehicleId}`)
  }
  if (relations.saleId) {
    revalidatePath(`/sales/${relations.saleId}`)
  }

  return { count: result.count }
}

export async function deleteDocumentAction(documentId: string, revalidateTarget?: string) {
  const sessionUser = await getServerSession()
  if (!sessionUser) {
    throw new Error('Non authentifié. Connexion requise.')
  }

  const document = await prisma.document.findUnique({ where: { id: documentId } })
  if (!document) return

  await prisma.document.delete({ where: { id: documentId } })

  if (document.fileUrl && document.fileUrl.startsWith('/api/storage/')) {
    try {
      const relativePath = document.fileUrl.replace('/api/storage/', '')
      await deleteFile(relativePath)
    } catch (_) {}
  }

  if (document.vehicleId) {
    revalidatePath(`/vehicles/${document.vehicleId}`)
  }
  if (document.saleId) {
    revalidatePath(`/sales/${document.saleId}`)
  }
  if (revalidateTarget) {
    revalidatePath(revalidateTarget)
  }
  revalidatePath('/documents')
}
