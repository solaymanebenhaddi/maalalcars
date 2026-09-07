import React from 'react'
import { FinanceDashboardClient } from '@/features/finance/finance-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function FinancePage() {
  return <FinanceDashboardClient />
}
