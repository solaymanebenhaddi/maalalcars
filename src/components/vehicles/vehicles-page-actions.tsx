'use client'

import React, { useState } from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { DataExportModal } from '@/components/modals/data-export-modal'
import { VehicleBulkImportModal } from '@/components/vehicles/vehicle-bulk-import-modal'
import { AdvancedVehiclesFilter } from './advanced-vehicles-filter'

interface ParkOption {
  id: string
  name: string
  city: string
  code: string
}

interface VehiclesPageActionsProps {
  availableBrands: string[]
  currentBrand?: string
  currentStatus?: string
  currentFuelType?: string
  currentSearch?: string
  parks?: ParkOption[]
}

export function VehiclesPageActions({
  availableBrands,
  currentBrand,
  currentStatus,
  currentFuelType,
  currentSearch,
  parks = [],
}: VehiclesPageActionsProps) {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

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
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors shadow-sm"
          title="Importer un fichier Excel (.xlsx, .xls, .csv) de véhicules"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
          <span>Importer (Excel / .xsl)</span>
        </button>

        <button
          type="button"
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#282834] bg-[#14141a] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-cyan-400" />
          <span>Exporter le Parc</span>
        </button>
      </div>

      <VehicleBulkImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        parks={parks}
      />

      <DataExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultType="vehicles"
      />
    </>
  )
}

