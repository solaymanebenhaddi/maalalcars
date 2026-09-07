import React from 'react'
import { RegularizationsDashboardClient } from '@/features/regularizations/regularizations-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function RegularizationsPage() {
  return <RegularizationsDashboardClient />
}
