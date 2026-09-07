import React from 'react'
import { DeliveriesDashboardClient } from '@/features/deliveries/deliveries-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DeliveriesPage() {
  return <DeliveriesDashboardClient />
}
