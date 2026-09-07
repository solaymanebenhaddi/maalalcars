import React from 'react'
import { VehiclesSettingsClient } from '@/features/settings/vehicles-settings-client'

export const dynamic = 'force-dynamic'

export default async function VehiclesSettingsPage() {
  return <VehiclesSettingsClient />
}
