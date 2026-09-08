import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { deleteFile } from '@/lib/storage'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const sessionUser = await getServerSession()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const document = await prisma.document.findUnique({ where: { id } })

    if (!document) {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    }

    // Delete database record
    await prisma.document.delete({ where: { id } })

    // Try deleting physical file
    if (document.fileUrl && document.fileUrl.startsWith('/api/storage/')) {
      try {
        const relativePath = document.fileUrl.replace('/api/storage/', '')
        await deleteFile(relativePath)
      } catch (err) {
        console.warn('Could not delete physical file:', err)
      }
    }

    return NextResponse.json({ success: true, id })
  } catch (error: unknown) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
