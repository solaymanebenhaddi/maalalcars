'use client'

import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { DataExportModal } from '@/components/modals/data-export-modal'
import { AdvancedVehiclesFilter } from './advanced-vehicles-filter'

interface VehiclesPageActionsProps {
  availableBrands: string[]
  currentBrand?: string
  currentStatus?: string
  currentFuelType?: string
  currentSearch?: string
}

export function VehiclesPageActions({
  availableBrands,
  currentBrand,
  currentStatus,
  currentFuelType,
  currentSearch,
}: VehiclesPageActionsProps) {
  const [isExportOpen, setIsExportOpen] = useState(false)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <AdvancedVehiclesFilter
          availableBrands={availableBrands}
          currentBrand={currentBrand}
          currentStatus={currentStatus}
          currentFuelType={currentFuelType}
          currentSearch={currentSearch}
        />

        <button
          type="button"
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#282834] bg-[#14141a] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-cyan-400" />
          <span>Exporter le Parc</span>
        </button>
      </div>

      <DataExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultType="vehicles"
      />
    </>
  )
}
