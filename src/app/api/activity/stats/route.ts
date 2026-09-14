import { NextResponse } from 'next/server'
import { auditService } from '@/services/audit.service'
import { getActiveUserRole, isSuperAdminRole } from '@/lib/auth-roles'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || !isSuperAdminRole(activeUser.role)) {
      return NextResponse.json(
        { error: 'Accès réservé exclusivement au Super Administrateur' },
        { status: 403 }
      )
    }

    const stats = await auditService.getStats()
    return NextResponse.json(stats)
  } catch (error: unknown) {
    console.error('API Activity stats error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
