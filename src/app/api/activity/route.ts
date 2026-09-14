import { NextResponse } from 'next/server'
import { auditService } from '@/services/audit.service'
import { auditFilterSchema } from '@/validation/approval.schema'
import { getActiveUserRole, isSuperAdminRole } from '@/lib/auth-roles'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || !isSuperAdminRole(activeUser.role)) {
      return NextResponse.json(
        { error: 'Accès réservé exclusivement au Super Administrateur' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const exportFormat = searchParams.get('export')

    const rawParams = {
      search: searchParams.get('search') || undefined,
      action: searchParams.get('action') || undefined,
      entityType: searchParams.get('entityType') || undefined,
      userId: searchParams.get('userId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 25,
    }

    const filters = auditFilterSchema.parse(rawParams)

    // Check if user requested CSV export
    if (exportFormat === 'csv') {
      const csv = await auditService.exportCsv(filters)
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="journal-activite-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    const result = await auditService.listLogs(filters)
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('API Activity GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
