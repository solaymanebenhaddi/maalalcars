import React from 'react'
import { PurchasesDashboardClient } from '@/features/purchases/purchases-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function PurchasesPage() {
  return <PurchasesDashboardClient />
}
