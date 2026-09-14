import { NextResponse } from 'next/server'
import { approvalService } from '@/services/approval.service'
import { getActiveUserRole } from '@/lib/auth-roles'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || activeUser.role === 'Invité') {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const counts = await approvalService.getPendingCounts()
    return NextResponse.json(counts)
  } catch (error: unknown) {
    console.error('API Approvals counts error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
