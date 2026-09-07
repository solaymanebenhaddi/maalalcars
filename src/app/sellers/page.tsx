import React from 'react'
import { SellersDashboardClient } from '@/features/sellers/sellers-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function SellersPage() {
  return <SellersDashboardClient />
}
