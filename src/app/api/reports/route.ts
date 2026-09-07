import { NextResponse } from 'next/server'
import { reportService } from '@/services/report.service'

export async function GET() {
  try {
    const report = await reportService.getExecutiveMonthlyReport()
    return NextResponse.json(report)
  } catch (error: unknown) {
    console.error('API Reports GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
