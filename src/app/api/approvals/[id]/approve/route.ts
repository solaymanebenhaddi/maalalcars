import { NextResponse } from 'next/server'
import { approvalService } from '@/services/approval.service'
import { getActiveUserRole, isSuperAdminRole } from '@/lib/auth-roles'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || !isSuperAdminRole(activeUser.role)) {
      return NextResponse.json(
        { error: 'Action réservée exclusivement au Super Administrateur' },
        { status: 403 }
      )
    }

    const { id } = await context.params
    let overrideConflict = false

    try {
      const body = await request.json()
      if (body && body.overrideConflict) {
        overrideConflict = true
      }
    } catch {
      // Body may be empty
    }

    const result = await approvalService.approveRequest({
      requestId: id,
      superAdminUserId: activeUser.id,
      superAdminRole: activeUser.role,
      overrideConflict,
    })

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('API Approvals [id]/approve error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l’approbation' },
      { status: 400 }
    )
  }
}
