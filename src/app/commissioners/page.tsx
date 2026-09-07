import React from 'react'
import { CommissionersDashboardClient } from '@/features/commissioners/commissioners-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function CommissionersPage() {
  return <CommissionersDashboardClient />
}
