import React from 'react'
import { InvoicesSettingsClient } from '@/features/settings/invoices-settings-client'

export const dynamic = 'force-dynamic'

export default async function InvoicesSettingsPage() {
  return <InvoicesSettingsClient />
}
