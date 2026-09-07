import React from 'react'
import { ReportsDashboardClient } from '@/features/reports/reports-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  return <ReportsDashboardClient />
}
