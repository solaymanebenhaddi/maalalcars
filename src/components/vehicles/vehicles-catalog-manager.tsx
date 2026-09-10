'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Car,
  LayoutGrid,
  Grid2X2,
  List as ListIcon,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  Eye,
  CalendarDays,
  Wrench,
  BadgePercent,
  CheckCircle2,
  MapPin,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react'
import clsx from 'clsx'
import { StatusBadge } from '@/components/shared/status-badge'
import { Currency } from '@/components/shared/currency'
import { ConfirmDialog } from '@/components/modals/confirm-dialog'
import { Pagination } from '@/components/ui'
import { RestoreVehicleButton } from './restore-vehicle-button'
import { VehicleCompletenessResult } from '@/services/vehicle-completeness.service'

export interface SerializedVehicle {
  id: string
  code: string
  vin: string
  matricule?: string | null
  brand: string
  model: string
  version?: string | null
  bodyType: string
  year: number
  colorExterior: string
  colorInterior?: string | null
  fuelType: string
  transmission: string
  mileage: number
  doors: number
  seats: number
  fiscalPower: number
  location: string
  customsStatus?: string
  customsYear?: number | null
  purchasePrice: number
  targetSalePrice: number
  minSalePrice?: number | null
  actualSalePrice?: number | null
  status: string
  description?: string | null
  archivedAt?: string | null
  park?: {
    id: string
    code: string
    name: string
    city: string
  } | null
  photos: Array<{ id: string; url: string; isPrimary: boolean }>
  reservations: Array<{ id: string; status: string; clientName?: string | null; depositAmount?: number | null }>
  repairs?: Array<{ id: string; status: string; repairType: string; garageName?: string | null }>
  sales: Array<{ id: string; buyerName?: string | null }>
}

interface VehiclesCatalogManagerProps {
  vehicles: SerializedVehicle[]
  total: number
  page: number
  totalPages: number
  pageSize: number
  activeView: 'grid' | 'compact' | 'list'
  vehicleCompletenessMap: Record<string, VehicleCompletenessResult>
  isSuperAdmin: boolean
}

const PAGE_SIZE_OPTIONS = [6, 9, 12, 18, 24]

export function VehiclesCatalogManager({
  vehicles,
  total,
  page,
  totalPages,
  pageSize,
  activeView,
  vehicleCompletenessMap,
  isSuperAdmin,
}: VehiclesCatalogManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Delete modal state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const isAllSelected = vehicles.length > 0 && vehicles.every((v) => selectedIds.has(v.id))
  const isSomeSelected = selectedIds.size > 0 && !isAllSelected

  // URL Query builder helper
  const createQueryString = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    return `${pathname}?${params.toString()}`
  }

  // Handle View Change
  const handleViewChange = (newView: 'grid' | 'compact' | 'list') => {
    startTransition(() => {
      router.push(createQueryString({ view: newView }))
    })
  }

  // Handle Page Size Change
  const handlePageSizeChange = (newSize: number) => {
    startTransition(() => {
      router.push(createQueryString({ pageSize: String(newSize), page: '1' }))
    })
  }

  // Selection toggle for single vehicle
  const toggleSelectVehicle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Toggle select all on current page
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(vehicles.map((v) => v.id)))
    }
  }

  // Open confirmation for single vehicle delete
  const confirmSingleDelete = (vehicle: SerializedVehicle, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteTarget({
      ids: [vehicle.id],
      label: `${vehicle.brand} ${vehicle.model} (${vehicle.matricule || vehicle.code})`,
    })
    setIsDeleteDialogOpen(true)
  }

  // Open confirmation for bulk delete
  const confirmBulkDelete = () => {
    if (selectedIds.size === 0) return
    const count = selectedIds.size
    setDeleteTarget({
      ids: Array.from(selectedIds),
      label: `${count} véhicule${count > 1 ? 's' : ''} sélectionné${count > 1 ? 's' : ''}`,
    })
    setIsDeleteDialogOpen(true)
  }

  // Execute deletion
  const executeDelete = async () => {
    if (!deleteTarget || deleteTarget.ids.length === 0) return
    setIsDeleting(true)
    setFeedbackMessage(null)

    try {
      const isSingle = deleteTarget.ids.length === 1
      const url = isSingle ? `/api/vehicles/${deleteTarget.ids[0]}` : '/api/vehicles/bulk-delete'
      const method = isSingle ? 'DELETE' : 'POST'
      const body = isSingle ? undefined : JSON.stringify({ ids: deleteTarget.ids })

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      // Success
      const count = deleteTarget.ids.length
      setFeedbackMessage({
        type: 'success',
        text: isSingle
          ? `${deleteTarget.label} a été supprimé avec succès.`
          : `${count} véhicule(s) ont été traités avec succès (${data.deletedCount || 0} supprimé(s), ${data.archivedCount || 0} archivé(s)).`,
      })

      // Remove deleted IDs from selection
      setSelectedIds((prev) => {
        const next = new Set(prev)
        deleteTarget.ids.forEach((id) => next.delete(id))
        return next
      })

      setIsDeleteDialogOpen(false)
      setDeleteTarget(null)

      // Refresh server component data
      startTransition(() => {
        router.refresh()
      })
    } catch (err: unknown) {
      setFeedbackMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toast Feedback Message */}
      {feedbackMessage && (
        <div
          className={clsx(
            'flex items-center justify-between p-3.5 rounded-2xl text-xs font-semibold shadow-lg transition-all animate-in fade-in slide-in-from-top-2',
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/50 text-red-200'
          )}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Control Bar: View Switcher (Grid / Compact / List), Select All, Page Size */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121216] border border-[#222228] p-3 rounded-2xl shadow-sm">
        {/* Left: Select All & Counter */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#262632] bg-[#171720] hover:bg-[#20202c] hover:border-zinc-600 text-xs font-semibold text-zinc-300 transition-colors"
            title={isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner sur cette page'}
          >
            {isAllSelected ? (
              <CheckSquare className="h-4 w-4 text-red-500" />
            ) : isSomeSelected ? (
              <div className="h-4 w-4 rounded bg-red-600/30 border border-red-500 flex items-center justify-center">
                <div className="h-1.5 w-1.5 bg-red-500 rounded-sm" />
              </div>
            ) : (
              <Square className="h-4 w-4 text-zinc-500" />
            )}
            <span>
              {isAllSelected
                ? 'Page sélectionnée'
                : selectedIds.size > 0
                ? `${selectedIds.size} sélectionné(s)`
                : 'Sélectionner tout'}
            </span>
          </button>

          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={confirmBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-all animate-in fade-in"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Supprimer ({selectedIds.size})</span>
            </button>
          )}
        </div>

        {/* Right: View Switcher & Page Size Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Page Size Options */}
          <div className="flex items-center gap-1.5 bg-[#171720] border border-[#262632] p-1 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3 text-zinc-400" />
              <span>Par page :</span>
            </span>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handlePageSizeChange(size)}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all',
                  pageSize === size
                    ? 'bg-red-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
                title={`Afficher ${size} véhicules par page`}
              >
                {size}
                {size === 9 && <span className="text-[9px] text-zinc-300 font-sans ml-0.5">★</span>}
              </button>
            ))}
          </div>

          {/* View Presentation Switcher */}
          <div className="flex items-center gap-1 bg-[#171720] border border-[#262632] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleViewChange('grid')}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeView === 'grid'
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
              title="Grande Grille — Présentation détaillée (3 colonnes, 9 par défaut)"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grande Grille</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('compact')}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeView === 'compact'
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
              title="Grille Compacte — Vue dense (4 colonnes)"
            >
              <Grid2X2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Compacte</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('list')}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeView === 'list'
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
              title="Présentation en Liste / Tableau"
            >
              <ListIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Liste</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. GRANDE GRILLE (Bigger View Presentation - 3 Colonnes)   */}
      {/* ========================================================= */}
      {activeView === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {vehicles.map((v) => {
            const completeness = vehicleCompletenessMap[v.id]
            const isSelected = selectedIds.has(v.id)
            const activeReservation = v.reservations.find(
              (r) => r.status === 'ACTIVE' || r.status === 'EXPIRING'
            )
            const activeRepair = v.repairs?.find((r) => r.status === 'EN_COURS')
            const lastSale = v.sales[0]

            return (
              <div
                key={v.id}
                onClick={() => toggleSelectVehicle(v.id)}
                className={clsx(
                  'group flex flex-col justify-between rounded-2xl overflow-hidden shadow-sm transition-all cursor-pointer select-none relative',
                  isSelected
                    ? 'border-2 border-red-500 bg-[#161217] ring-4 ring-red-500/20 shadow-lg shadow-red-950/40'
                    : completeness?.needsUrgentUpdates
                    ? 'border-2 border-red-500/90 bg-gradient-to-b from-[#220d12] via-[#151014] to-[#121216] shadow-[0_0_22px_rgba(239,68,68,0.22)] hover:border-red-400'
                    : 'border border-[#222228] bg-[#121216] hover:border-zinc-700 hover:bg-[#15151a]'
                )}
              >
                {/* Urgent Updates Top Banner */}
                {completeness?.needsUrgentUpdates && (
                  <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-black tracking-wide shadow-md z-20">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 animate-pulse text-white" />
                      <span>MISE À JOUR URGENTE</span>
                    </div>
                    <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                      {completeness.completedCount}/{completeness.totalRequired} complété
                      {completeness.hasDefaultedFields && (
                        <span className="text-amber-300 ml-1 font-extrabold">• {completeness.defaultedCount} def-</span>
                      )}
                    </span>
                  </div>
                )}

                {/* Photo & Top Badges */}
                <div className="relative h-48 w-full bg-gradient-to-t from-black via-zinc-900 to-zinc-950 flex items-center justify-center border-b border-[#222228] overflow-hidden">
                  {v.photos[0]?.url ? (
                    <Image
                      src={v.photos[0].url}
                      alt={`${v.brand} ${v.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 group-hover:text-red-400 transition-colors">
                      <Car className={clsx('h-16 w-16 mb-1', completeness?.needsUrgentUpdates ? 'text-red-400/80' : 'text-zinc-600')} />
                      <span className={clsx('text-[11px] font-semibold', completeness?.needsUrgentUpdates ? 'text-red-400 font-bold' : 'text-zinc-400')}>
                        {completeness?.needsUrgentUpdates ? '⚠️ Photos requises' : (v.bodyType || 'Véhicule')}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

                  {/* Selection Checkbox (Top Left) */}
                  <div
                    onClick={(e) => toggleSelectVehicle(v.id, e)}
                    className="absolute top-3 left-3 z-30 p-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-zinc-700/80 hover:bg-black transition-colors"
                    title={isSelected ? 'Désélectionner' : 'Sélectionner'}
                  >
                    {isSelected ? (
                      <CheckSquare className="h-4 w-4 text-red-500" />
                    ) : (
                      <Square className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-12 z-10">
                    <StatusBadge status={v.status} />
                  </div>

                  {/* Delete Button & Code (Top Right) */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => confirmSingleDelete(v, e)}
                      className="p-1.5 rounded-lg bg-black/60 border border-zinc-700/80 text-zinc-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-950/40 backdrop-blur-sm transition-colors"
                      title="Supprimer ce véhicule"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-200 border border-zinc-700 backdrop-blur-sm">
                      {v.code}
                    </span>
                  </div>

                  {/* Plate */}
                  {v.matricule && (
                    <div className="absolute bottom-2.5 left-3 z-10 rounded-md bg-black/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-white border border-zinc-700 backdrop-blur-sm">
                      {v.matricule}
                    </div>
                  )}

                  {/* Park Location */}
                  <div className="absolute bottom-2.5 right-3 z-10 rounded-md bg-black/80 px-2.5 py-1 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 backdrop-blur-sm flex items-center gap-1 shadow">
                    <MapPin className="h-3 w-3" />
                    <span>{v.park?.city || v.location}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/vehicles/${v.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-base font-bold text-white group-hover:text-red-400 transition-colors"
                      >
                        {v.brand} {v.model}
                      </Link>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {v.customsStatus === 'DEDOUANEE' ? (
                          <span
                            className="rounded-lg bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300 flex items-center gap-1"
                            title={`Véhicule dédouané au Maroc${v.customsYear ? ` en ${v.customsYear}` : ''}`}
                          >
                            <span>🌍 Déd.</span>
                            {v.customsYear && <span className="font-mono">{v.customsYear}</span>}
                          </span>
                        ) : (
                          <span
                            className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1"
                            title="Véhicule WW Maroc (concessionnaire marocain)"
                          >
                            <span>🇲🇦 WW</span>
                          </span>
                        )}
                        <span className="rounded-lg bg-[#1a1a22] px-2 py-0.5 text-xs font-bold text-zinc-300 font-mono">
                          {v.year}
                        </span>
                      </div>
                    </div>

                    {v.version && (
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{v.version}</p>
                    )}

                    {/* Specs Bar */}
                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#17171e] p-2.5 text-center text-[11px] border border-[#22222a]">
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Boîte</span>
                        <span className="font-semibold text-zinc-200">{v.transmission}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Carburant</span>
                        <span className="font-semibold text-zinc-200">{v.fuelType}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Kilométrage</span>
                        <span className="font-semibold text-zinc-200 font-mono">
                          {v.mileage?.toLocaleString('fr-FR')} km
                        </span>
                      </div>
                    </div>

                    {/* Operational Alert Tags */}
                    {activeReservation && (
                      <div className="mt-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-300 flex items-center justify-between">
                        <span>Réservé par {activeReservation.clientName || 'Client'}</span>
                        <span className="font-mono font-bold text-amber-400">
                          <Currency amount={activeReservation.depositAmount} />
                        </span>
                      </div>
                    )}

                    {activeRepair && (
                      <div className="mt-2.5 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1.5 text-[11px] text-purple-300 flex items-center justify-between">
                        <span>En atelier : {activeRepair.garageName || activeRepair.repairType}</span>
                        <span className="font-bold text-purple-400">{activeRepair.repairType}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Status-Dependent Quick Actions */}
                  <div className="pt-3 border-t border-[#1e1e24] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-zinc-500 block uppercase">
                          {v.status === 'SOLD' ? 'Prix Vendu' : 'Prix de Vente'}
                        </span>
                        <div className="font-mono font-bold text-base text-white">
                          <Currency amount={v.actualSalePrice || v.targetSalePrice} />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/vehicles/${v.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-[#2e2e38] bg-[#1a1a22] px-3 text-xs font-semibold text-zinc-300 hover:bg-[#252530] hover:text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Fiche</span>
                        </Link>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      {v.status === 'IN_STOCK' && (
                        <>
                          <Link
                            href={`/vehicles/${v.id}?tab=reservations&action=new`}
                            className="flex-1 flex h-8 items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 text-[11px] font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
                          >
                            <CalendarDays className="h-3 w-3" />
                            <span>Réserver</span>
                          </Link>
                          <Link
                            href={`/vehicles/${v.id}?tab=repairs&action=new`}
                            className="flex-1 flex h-8 items-center justify-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 text-[11px] font-bold text-purple-400 hover:bg-purple-500/20 transition-colors"
                          >
                            <Wrench className="h-3 w-3" />
                            <span>Réparation</span>
                          </Link>
                          <Link
                            href={`/sales/new?vehicleId=${v.id}`}
                            className="flex-1 flex h-8 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 text-[11px] font-bold text-white hover:bg-emerald-500 transition-colors"
                          >
                            <BadgePercent className="h-3 w-3" />
                            <span>Vendre</span>
                          </Link>
                        </>
                      )}

                      {v.status === 'RESERVED' && (
                        <>
                          <Link
                            href={`/sales/new?vehicleId=${v.id}${activeReservation ? `&reservationId=${activeReservation.id}` : ''}`}
                            className="flex-1 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                          >
                            <BadgePercent className="h-3.5 w-3.5" />
                            <span>Convertir en vente</span>
                          </Link>
                        </>
                      )}

                      {v.status === 'WORKSHOP' && (
                        <>
                          <Link
                            href={`/vehicles/${v.id}#repairs`}
                            className="flex-1 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-3 text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-sm"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Clôturer réparation</span>
                          </Link>
                        </>
                      )}

                      {(v.status === 'ARCHIVED' || v.status === 'SOLD') && (
                        <div className="w-full space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400 border border-zinc-700">
                              {lastSale ? 'VENDU & ARCHIVÉ' : 'ARCHIVÉ — HORS STOCK'}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {v.archivedAt ? new Date(v.archivedAt).toLocaleDateString('fr-FR') : 'Archive'}
                            </span>
                          </div>
                          <RestoreVehicleButton
                            vehicleId={v.id}
                            vehicleTitle={`${v.brand} ${v.model}`}
                            isSuperAdmin={isSuperAdmin}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. GRILLE COMPACTE (4 Colonnes)                            */}
      {/* ========================================================= */}
      {activeView === 'compact' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map((v) => {
            const isSelected = selectedIds.has(v.id)
            return (
              <div
                key={v.id}
                onClick={() => toggleSelectVehicle(v.id)}
                className={clsx(
                  'group flex flex-col justify-between rounded-2xl overflow-hidden shadow-sm transition-all cursor-pointer select-none border',
                  isSelected
                    ? 'border-red-500 bg-[#171218] ring-2 ring-red-500/30'
                    : 'border-[#222228] bg-[#121216] hover:border-zinc-700 hover:bg-[#15151a]'
                )}
              >
                {/* Compact Photo */}
                <div className="relative h-36 w-full bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-[#222228]">
                  {v.photos[0]?.url ? (
                    <Image
                      src={v.photos[0].url}
                      alt={`${v.brand} ${v.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <Car className="h-12 w-12 text-zinc-600 group-hover:text-red-400 transition-colors" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                  {/* Checkbox */}
                  <div
                    onClick={(e) => toggleSelectVehicle(v.id, e)}
                    className="absolute top-2 left-2 z-20 p-1 rounded-lg bg-black/70 backdrop-blur-sm"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-3.5 w-3.5 text-red-500" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2 z-10 scale-90 origin-top-right">
                    <StatusBadge status={v.status} />
                  </div>

                  {/* Matricule */}
                  {v.matricule && (
                    <div className="absolute bottom-2 left-2 z-10 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white border border-zinc-700">
                      {v.matricule}
                    </div>
                  )}

                  {/* Park */}
                  <div className="absolute bottom-2 right-2 z-10 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400 border border-cyan-500/30">
                    {v.park?.city || v.location}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        href={`/vehicles/${v.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-white hover:text-red-400 transition-colors truncate"
                      >
                        {v.brand} {v.model}
                      </Link>
                      <span className="text-[10px] font-bold text-zinc-400 font-mono shrink-0">
                        {v.year}
                      </span>
                    </div>
                    {v.version && <p className="text-[10px] text-zinc-500 truncate">{v.version}</p>}

                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 border-t border-[#1e1e24] pt-1.5">
                      <span>{v.fuelType}</span>
                      <span>{v.transmission}</span>
                      <span className="font-mono">{v.mileage?.toLocaleString('fr-FR')} km</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[#1e1e24] flex items-center justify-between">
                    <div className="font-mono font-bold text-xs text-white">
                      <Currency amount={v.actualSalePrice || v.targetSalePrice} />
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => confirmSingleDelete(v, e)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/vehicles/${v.id}`}
                        className="p-1 rounded bg-[#1c1c24] text-zinc-300 hover:text-white"
                        title="Voir la fiche"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PRÉSENTATION EN LISTE / TABLEAU                         */}
      {/* ========================================================= */}
      {activeView === 'list' && (
        <div className="rounded-2xl border border-[#222228] bg-[#121216] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#222228] bg-[#16161c] text-zinc-400 uppercase text-[10px] font-bold">
                  <th className="py-3 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="p-1 rounded hover:bg-white/10 text-zinc-400"
                      title={isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                    >
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4 text-red-500" />
                      ) : (
                        <Square className="h-4 w-4 text-zinc-500" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-2 w-16">Photo</th>
                  <th className="py-3 px-3">Véhicule</th>
                  <th className="py-3 px-3">Immatriculation</th>
                  <th className="py-3 px-2">Année</th>
                  <th className="py-3 px-3">Kilométrage</th>
                  <th className="py-3 px-3">Carburant / Boîte</th>
                  <th className="py-3 px-3">Site / Parc</th>
                  <th className="py-3 px-3">Prix Vente</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {vehicles.map((v) => {
                  const isSelected = selectedIds.has(v.id)
                  const completeness = vehicleCompletenessMap[v.id]
                  return (
                    <tr
                      key={v.id}
                      onClick={() => toggleSelectVehicle(v.id)}
                      className={clsx(
                        'transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-red-950/25 hover:bg-red-950/35'
                          : 'hover:bg-[#181820]'
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => toggleSelectVehicle(v.id, e)}
                          className="p-1 rounded hover:bg-white/10"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-red-500" />
                          ) : (
                            <Square className="h-4 w-4 text-zinc-500" />
                          )}
                        </button>
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="py-2.5 px-2">
                        <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                          {v.photos[0]?.url ? (
                            <Image
                              src={v.photos[0].url}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Car className="h-5 w-5 text-zinc-600" />
                          )}
                        </div>
                      </td>

                      {/* Brand & Model */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/vehicles/${v.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-bold text-white hover:text-red-400 transition-colors"
                            >
                              {v.brand} {v.model}
                            </Link>
                            {completeness?.needsUrgentUpdates && (
                              <span
                                className="rounded bg-red-600/20 text-red-400 px-1.5 py-0.5 text-[9px] font-bold border border-red-500/40"
                                title="Mise à jour urgente requise"
                              >
                                ⚠️ Urgent
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">{v.code}</span>
                        </div>
                      </td>

                      {/* Matricule */}
                      <td className="py-2.5 px-3">
                        {v.matricule ? (
                          <span className="font-mono font-semibold text-zinc-200 bg-[#1a1a22] px-2 py-0.5 rounded border border-zinc-800">
                            {v.matricule}
                          </span>
                        ) : (
                          <span className="text-zinc-600 italic text-[11px]">En arrivage</span>
                        )}
                      </td>

                      {/* Year & Customs */}
                      <td className="py-2.5 px-2 font-mono font-bold text-zinc-300">
                        {v.year}
                      </td>

                      {/* Mileage */}
                      <td className="py-2.5 px-3 font-mono text-zinc-300">
                        {v.mileage?.toLocaleString('fr-FR')} km
                      </td>

                      {/* Fuel & Trans */}
                      <td className="py-2.5 px-3 text-zinc-400">
                        <div>{v.fuelType}</div>
                        <div className="text-[10px] text-zinc-500">{v.transmission}</div>
                      </td>

                      {/* Park */}
                      <td className="py-2.5 px-3 text-zinc-300">
                        <div className="flex items-center gap-1 text-cyan-400">
                          <MapPin className="h-3 w-3" />
                          <span>{v.park?.city || v.location}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-2.5 px-3 font-mono font-bold text-white">
                        <Currency amount={v.actualSalePrice || v.targetSalePrice} />
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <StatusBadge status={v.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/vehicles/${v.id}`}
                            className="p-1.5 rounded-lg border border-[#282834] bg-[#181820] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Consulter la fiche"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => confirmSingleDelete(v, e)}
                            className="p-1.5 rounded-lg border border-[#282834] bg-[#181820] text-zinc-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-950/30 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PAGINATION & INFORMATIONS                               */}
      {/* ========================================================= */}
      <div className="pt-2">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          itemName="véhicules"
          createPageUrl={(p) => createQueryString({ page: p === 1 ? undefined : String(p) })}
        />
      </div>

      {/* ========================================================= */}
      {/* 5. BARRE FLOTTANTE D'ACTIONS GROUPÉES (BULK ACTION BAR)    */}
      {/* ========================================================= */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#14141cf0] backdrop-blur-xl border border-red-500/40 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold text-white">
              {selectedIds.size} véhicule{selectedIds.size > 1 ? 's' : ''} sélectionné{selectedIds.size > 1 ? 's' : ''}
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-700 mx-1" />

          <button
            type="button"
            onClick={confirmBulkDelete}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-950/60 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Supprimer ({selectedIds.size})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Désélectionner
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL DE CONFIRMATION DE SUPPRESSION                    */}
      {/* ========================================================= */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(false)
            setDeleteTarget(null)
          }
        }}
        onConfirm={executeDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer ${deleteTarget?.label || 'cette sélection'} ?\n\nRemarque : Les véhicules sans historique commercial ou technique seront définitivement supprimés. Les véhicules disposant de ventes ou réparations rattachées seront automatiquement archivés afin de préserver l'intégrité comptable de l'entreprise.`}
        confirmText={isDeleting ? 'Suppression en cours...' : 'Oui, supprimer'}
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
