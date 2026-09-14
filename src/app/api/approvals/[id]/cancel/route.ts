import { NextResponse } from 'next/server'
import { approvalService } from '@/services/approval.service'
import { getActiveUserRole } from '@/lib/auth-roles'

export const dynamic = 'force-dynamic'

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || activeUser.role === 'Invité') {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await context.params
    const cancelled = await approvalService.cancelRequest(id, activeUser.id)

    return NextResponse.json({ success: true, request: cancelled })
  } catch (error: unknown) {
    console.error('API Approvals [id]/cancel error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l’annulation' },
      { status: 400 }
    )
  }
}
