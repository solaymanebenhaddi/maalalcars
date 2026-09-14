import { NextResponse } from 'next/server'
import { approvalService } from '@/services/approval.service'
import { getActiveUserRole, isSuperAdminRole } from '@/lib/auth-roles'
import { rejectRequestSchema } from '@/validation/approval.schema'

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
    const body = await request.json()
    const validated = rejectRequestSchema.parse({ ...body, requestId: id })

    const result = await approvalService.rejectRequest({
      requestId: id,
      superAdminUserId: activeUser.id,
      superAdminRole: activeUser.role,
      rejectionReason: validated.rejectionReason,
    })

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('API Approvals [id]/reject error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du rejet' },
      { status: 400 }
    )
  }
}
