import React from 'react'
import { ContractsDashboardClient } from '@/features/contracts/contracts-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  return <ContractsDashboardClient />
}
