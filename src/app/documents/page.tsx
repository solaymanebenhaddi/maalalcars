import React from 'react'
import { DocumentsDashboardClient } from '@/features/documents/documents-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  return <DocumentsDashboardClient />
}
