import React from 'react'
import { SettingsDashboardClient } from '@/features/settings/settings-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  return <SettingsDashboardClient />
}
