import React from 'react'
import { SalesDashboardClient } from '@/features/sales/sales-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function SalesPage() {
  return <SalesDashboardClient />
}
