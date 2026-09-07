'use client'

import React from 'react'
import { useFeatures } from '@/contexts/features.context'
import { ModuleDisabled } from './module-disabled'

interface FeatureGateProps {
  featureKey: string
  moduleName?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function FeatureGate({
  featureKey,
  moduleName,
  fallback,
  children,
}: FeatureGateProps) {
  const { isEnabled, isLoading } = useFeatures()

  // While loading, we still show children if it matches initial default,
  // but if disabled once loaded or by default, show disabled notice
  if (!isLoading && !isEnabled(featureKey)) {
    return fallback ?? <ModuleDisabled moduleName={moduleName} featureKey={featureKey} />
  }

  return <>{children}</>
}
