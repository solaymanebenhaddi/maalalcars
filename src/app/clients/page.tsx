import React from 'react'
import { ClientsDashboardClient } from '@/features/clients/clients-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  return <ClientsDashboardClient />
}
