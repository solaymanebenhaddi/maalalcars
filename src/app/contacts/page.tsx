import React from 'react'
import { ContactsDashboardClient } from '@/features/contacts/contacts-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
  return <ContactsDashboardClient />
}
