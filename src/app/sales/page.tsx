import React from 'react'
import { SalesDashboardClient } from '@/features/sales/sales-dashboard-client'
import { requireAuth } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function SalesPage() {
  await requireAuth()
  return <SalesDashboardClient />
}
