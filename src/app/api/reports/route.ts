import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/session'
import { reportService } from '@/services/report.service'

export async function GET() {
  try {
    const auth = await requireApiAuth()
    if (auth instanceof NextResponse) return auth
    const report = await reportService.getExecutiveMonthlyReport()
    return NextResponse.json(report)
  } catch (error: unknown) {
    console.error('API Reports GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
