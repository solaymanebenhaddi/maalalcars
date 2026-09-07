import React from 'react'
import { SuppliersDashboardClient } from '@/features/suppliers/suppliers-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function SuppliersPage() {
  return <SuppliersDashboardClient />
}
