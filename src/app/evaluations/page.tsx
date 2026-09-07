import React from 'react'
import { EvaluationsDashboardClient } from '@/features/evaluations/evaluations-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function EvaluationsPage() {
  return <EvaluationsDashboardClient />
}
