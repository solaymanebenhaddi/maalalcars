import { NextResponse } from 'next/server'
import { approvalService } from '@/services/approval.service'
import { getActiveUserRole } from '@/lib/auth-roles'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || activeUser.role === 'Invité') {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await context.params
    const requestDetails = await approvalService.getRequestById(id)

    if (!requestDetails) {
      return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })
    }

    // Non-Super-Admin can only access their own request
    if (!activeUser.isSuperAdmin && requestDetails.requestedByUserId !== activeUser.id) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    return NextResponse.json(requestDetails)
  } catch (error: unknown) {
    console.error('API Approvals [id] GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
