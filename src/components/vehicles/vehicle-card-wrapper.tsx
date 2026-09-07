'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface VehicleCardWrapperProps {
  vehicleId: string
  children: React.ReactNode
  className?: string
}

export function VehicleCardWrapper({
  vehicleId,
  children,
  className,
}: VehicleCardWrapperProps) {
  const router = useRouter()

  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) {
      return
    }
    router.push(`/vehicles/${vehicleId}`)
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={className}
      title="Double-cliquez pour ouvrir la fiche détaillée"
    >
      {children}
    </div>
  )
}
