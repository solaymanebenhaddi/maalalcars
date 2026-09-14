import { NextResponse } from 'next/server'
import { approvalService } from '@/services/approval.service'
import {
  approvalFilterSchema,
  createApprovalRequestSchema,
} from '@/validation/approval.schema'
import { getActiveUserRole } from '@/lib/auth-roles'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || activeUser.role === 'Invité') {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const rawParams = {
      status: searchParams.get('status') || undefined,
      actionType: searchParams.get('actionType') || undefined,
      entityType: searchParams.get('entityType') || undefined,
      search: searchParams.get('search') || undefined,
      requestedByUserId: searchParams.get('requestedByUserId') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
    }

    const filters = approvalFilterSchema.parse(rawParams)

    // Non-Super-Admins can only see their own requests when querying general list
    if (!activeUser.isSuperAdmin) {
      filters.requestedByUserId = activeUser.id
    }

    const result = await approvalService.listRequests(filters)
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('API Approvals GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || activeUser.role === 'Invité') {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const validated = createApprovalRequestSchema.parse(body)

    const result = await approvalService.requestMutation(
      validated,
      {
        userId: activeUser.id,
        userRole: activeUser.role,
        userName: activeUser.name,
      }
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error: unknown) {
    console.error('API Approvals POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur de validation' },
      { status: 400 }
    )
  }
}
