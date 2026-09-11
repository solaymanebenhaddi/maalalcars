import React from 'react'
import Link from 'next/link'
import {
  Plus,
  Filter,
  Search,
  MapPin,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { parkRepository } from '@/repositories/park.repository'
import { vehicleStateMachine } from '@/services/vehicle-state-machine.service'
import { getActiveUserRole } from '@/lib/auth-roles'
import { checkVehicleCompleteness, VehicleCompletenessResult } from '@/services/vehicle-completeness.service'
import clsx from 'clsx'

import { VehiclesPageActions } from '@/components/vehicles/vehicles-page-actions'
import { VehiclesCatalogManager } from '@/components/vehicles/vehicles-catalog-manager'
import prisma from '@/lib/db'
import { requireAuth } from '@/lib/session'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    brand?: string
    status?: string
    fuelType?: string
    parkId?: string
    park?: string
    search?: string
    urgent?: string
    page?: string
    pageSize?: string
    view?: string
  }>
}

export default async function VehiclesPage({ searchParams }: Props) {
  await requireAuth()

  // Preemptively expire reservations
  await vehicleStateMachine.expireDueReservations()

  const activeUser = await getActiveUserRole()
  const params = await searchParams
  const activeStatus = params.status || 'Tous'

  // Pagination parameters: dynamic page size (default 9, options: 6, 9, 12, 18, 24)
  const pageSizeParam = parseInt(params.pageSize || '9', 10)
  const PAGE_SIZE = [6, 9, 12, 18, 24].includes(pageSizeParam) ? pageSizeParam : 9
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const activeView = (['grid', 'compact', 'list'].includes(params.view || '')
    ? params.view
    : 'grid') as 'grid' | 'compact' | 'list'

  // Fetch parks for multi-park filtering
  const allParks = await parkRepository.getAll()
  let activeParkId = params.parkId
  if (!activeParkId && params.park) {
    const matched = allParks.find(
      (p) =>
        p.city.toLowerCase() === params.park?.toLowerCase() ||
        p.code.toLowerCase() === params.park?.toLowerCase() ||
        p.name.toLowerCase().includes(params.park?.toLowerCase() || '')
    )
    if (matched) activeParkId = matched.id
  }

  const { vehicles, total, totalPages, page } = await vehicleRepository.getPaginated({
    brand: params.brand,
    status: activeStatus === 'Tous' ? undefined : activeStatus,
    fuelType: params.fuelType,
    parkId: activeParkId,
    search: params.search,
    urgent: params.urgent === 'true',
    page: currentPage,
    pageSize: PAGE_SIZE,
  })

  const counts = await vehicleRepository.countByStatus()
  const exchangedCount = await prisma.vehicle.count({ where: { status: 'ECHANGE' } })
  const distinctBrands = await prisma.vehicle.findMany({
    where: { archivedAt: null, status: { not: 'ARCHIVED' } },
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  })
  const brands = ['Toutes', ...distinctBrands.map((v) => v.brand)]

  const statusTabs = [
    { label: 'Tous (En stock)', value: 'Tous', count: counts.total, color: 'text-zinc-300' },
    { label: 'En stock', value: 'IN_STOCK', count: counts.inStock, color: 'text-emerald-400' },
    { label: 'Réservés', value: 'RESERVED', count: counts.reserved, color: 'text-amber-400' },
    { label: 'En réparation', value: 'WORKSHOP', count: counts.workshop, color: 'text-purple-400' },
    { label: 'Archivés (Vendus & Sortis)', value: 'ARCHIVED', count: counts.archived, color: 'text-zinc-400' },
  ]

  const buildQueryUrl = (newParams: Record<string, string | undefined>) => {
    const q = new URLSearchParams()
    if (activeStatus !== 'Tous') q.set('status', activeStatus)
    if (params.brand && params.brand !== 'Toutes') q.set('brand', params.brand)
    if (params.fuelType && params.fuelType !== 'Tous') q.set('fuelType', params.fuelType)
    if (activeParkId) q.set('parkId', activeParkId)
    if (params.search) q.set('search', params.search)
    if (params.urgent) q.set('urgent', params.urgent)
    if (params.page && params.page !== '1') q.set('page', params.page)
    if (params.pageSize && params.pageSize !== '9') q.set('pageSize', params.pageSize)
    if (params.view && params.view !== 'grid') q.set('view', params.view)

    for (const [k, v] of Object.entries(newParams)) {
      if (!v || v === 'Tous' || v === 'Toutes' || (k === 'page' && v === '1')) {
        q.delete(k)
      } else {
        q.set(k, v)
      }
    }

    const str = q.toString()
    return `/vehicles${str ? `?${str}` : ''}`
  }

  // Pre-calculate completeness for all vehicles on the current page
  const completenessRecord: Record<string, VehicleCompletenessResult> = {}
  vehicles.forEach((v) => {
    completenessRecord[v.id] = checkVehicleCompleteness(v)
  })

  const urgentCount = await prisma.vehicle.count({
    where: {
      isBulkImport: true,
      status: { notIn: ['ARCHIVED', 'SOLD'] },
      archivedAt: null,
    },
  })
  const isUrgentFilterActive = params.urgent === 'true'
  const displayedVehicles = vehicles

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parc Automobile — Gestion des Véhicules"
        subtitle="Catalogue complet du parc : disponibilité, réservations, réparations et ventes"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Véhicules' }]}
        actions={
          <Link
            href="/vehicles/import"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Import Groupé (.xsl)</span>
          </Link>
        }
        primaryAction={{
          label: 'Ajouter un véhicule',
          href: '/vehicles/new',
          icon: Plus,
        }}
      />

      {/* Multi-Park Filter Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-[#121216] border border-[#222228] p-2.5 rounded-2xl shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-2 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-red-500" />
          <span>Site / Parc :</span>
        </span>

        <Link
          href={buildQueryUrl({ parkId: undefined, park: undefined })}
          className={clsx(
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
            !activeParkId
              ? 'bg-zinc-200 text-black font-bold shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          )}
        >
          Tous les Parcs ({counts.total})
        </Link>

        {allParks.map((p) => {
          const isSelected = activeParkId === p.id
          return (
            <Link
              key={p.id}
              href={buildQueryUrl({ parkId: p.id, park: undefined })}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                isSelected
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              )}
            >
              <span>📍 {p.city} ({p.name.split('—')[0].trim()})</span>
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-mono',
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#1e1e26] text-zinc-400'
                )}
              >
                {p.totalVehicles}
              </span>
            </Link>
          )
        })}

        <Link
          href="/parks"
          className="ml-auto text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600/10 border border-red-500/20 transition-colors"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Gérer le Réseau des Parcs</span>
        </Link>
      </div>

      {/* Tab-based status filtering + Advanced Filters and Export Modal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => {
            const isActive = activeStatus === tab.value
            const href = buildQueryUrl({ status: tab.value })

            return (
              <Link
                key={tab.value}
                href={href}
                className={clsx(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all',
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
                    : 'bg-[#121216] text-zinc-400 border border-[#222228] hover:bg-[#181820] hover:text-zinc-200'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={clsx(
                    'rounded-full px-2 py-0.5 text-[10px] font-mono font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#1e1e26] text-zinc-400'
                  )}
                >
                  {tab.count}
                </span>
              </Link>
            )
          })}
        </div>

        <VehiclesPageActions
          availableBrands={brands.filter((b) => b !== 'Toutes')}
          currentBrand={params.brand}
          currentStatus={params.status}
          currentFuelType={params.fuelType}
          currentSearch={params.search}
          parks={allParks.map((p) => ({
            id: p.id,
            name: p.name,
            city: p.city,
            code: p.code,
          }))}
        />
      </div>

      {/* Archive Sub-Filter for Exchanged vs Sold/Other */}
      {(activeStatus === 'ARCHIVED' || activeStatus === 'ECHANGE') && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 text-xs">
          <span className="text-zinc-400 font-semibold mr-1">Filtre d&apos;archive :</span>
          <Link
            href={buildQueryUrl({ status: 'ARCHIVED' })}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              activeStatus === 'ARCHIVED'
                ? 'bg-zinc-200 text-black shadow'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            )}
          >
            Tous les archivés ({counts.archived})
          </Link>
          <Link
            href={buildQueryUrl({ status: 'ECHANGE' })}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              activeStatus === 'ECHANGE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-indigo-300 hover:text-white hover:bg-indigo-900/40'
            )}
          >
            <span>Échangés (Reprise)</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
              {exchangedCount}
            </span>
          </Link>
        </div>
      )}

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-4 shadow-sm">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <input type="hidden" name="status" value={activeStatus} />

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Recherche</label>
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                name="search"
                defaultValue={params.search || ''}
                placeholder="Marque, modèle, VIN, matricule marocain..."
                className="h-9 w-full rounded-lg border border-[#262630] bg-[#16161c] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Marque</label>
            <select
              name="brand"
              defaultValue={params.brand || 'Toutes'}
              className="h-9 w-full rounded-lg border border-[#262630] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-sm"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filtrer</span>
            </button>
            <Link
              href="/vehicles"
              className="flex h-9 items-center justify-center rounded-lg border border-[#282834] bg-[#181820] px-3 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Effacer
            </Link>
          </div>
        </form>
      </div>

      {/* Urgent Updates Filter Notification Banner */}
      {urgentCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border-2 border-red-500/80 bg-gradient-to-r from-red-950/40 via-[#180e12] to-red-950/20 p-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/40 shrink-0">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  Mises à jour urgentes requises
                </h4>
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                  {urgentCount} véhicule{urgentCount > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                Véhicule{urgentCount > 1 ? 's issus' : ' issu'} d&apos;un import groupé en attente de photos, fournisseur, payeur, courtier ou documents.
              </p>
            </div>
          </div>

          <Link
            href={isUrgentFilterActive ? buildQueryUrl({ urgent: undefined }) : buildQueryUrl({ urgent: 'true' })}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 shadow',
              isUrgentFilterActive
                ? 'bg-zinc-200 text-black hover:bg-white'
                : 'bg-red-600 text-white hover:bg-red-500'
            )}
          >
            <span>{isUrgentFilterActive ? 'Afficher tout le stock' : 'Filtrer uniquement les urgences'}</span>
          </Link>
        </div>
      )}

      {/* Catalog & Pagination Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Catalogue :</span>
          <strong className="text-white font-mono font-bold">{total}</strong> véhicule{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
          {totalPages > 1 && (
            <span className="text-zinc-500 font-medium">
              — Page <strong className="text-red-400 font-mono font-bold">{page}</strong> sur {totalPages}
            </span>
          )}
        </div>

        <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>{PAGE_SIZE} véhicules par page</span>
        </div>
      </div>

      {/* Vehicles Catalog Interactive Manager (Grid / Compact / List & Bulk Deletion) */}
      {displayedVehicles.length > 0 ? (
        <VehiclesCatalogManager
          vehicles={displayedVehicles.map((v) => ({
            id: v.id,
            code: v.code,
            vin: v.vin,
            matricule: v.matricule,
            brand: v.brand,
            model: v.model,
            version: v.version,
            bodyType: v.bodyType,
            year: v.year,
            colorExterior: v.colorExterior,
            colorInterior: v.colorInterior,
            fuelType: v.fuelType,
            transmission: v.transmission,
            mileage: v.mileage,
            doors: v.doors,
            seats: v.seats,
            fiscalPower: v.fiscalPower,
            location: v.location,
            customsStatus: v.customsStatus,
            customsYear: v.customsYear,
            purchasePrice: v.purchasePrice,
            targetSalePrice: v.targetSalePrice,
            minSalePrice: v.minSalePrice,
            actualSalePrice: v.actualSalePrice,
            status: v.status,
            description: v.description,
            archivedAt: v.archivedAt ? v.archivedAt.toISOString() : null,
            park: v.park
              ? {
                  id: v.park.id,
                  code: v.park.code,
                  name: v.park.name,
                  city: v.park.city,
                }
              : null,
            photos: v.photos
              .slice()
              .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
              .map((p) => ({
                id: p.id,
                url: p.url,
                isPrimary: p.isPrimary,
              })),
            reservations: v.reservations.map((r) => ({
              id: r.id,
              status: r.status,
              clientName: r.clientName,
              depositAmount: r.depositAmount,
            })),
            repairs: v.repairs?.map((rep) => ({
              id: rep.id,
              status: rep.status,
              repairType: rep.repairType,
              garageName: rep.garageName,
            })),
            sales: v.sales.map((s) => ({
              id: s.id,
              buyerName: s.buyerName,
            })),
          }))}
          total={total}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          activeView={activeView}
          vehicleCompletenessMap={completenessRecord}
          isSuperAdmin={activeUser.isSuperAdmin}
        />
      ) : (
        <EmptyState
          type="vehicles"
          title="Aucun véhicule trouvé"
          description="Aucun véhicule ne correspond aux critères de statut ou de filtre sélectionnés."
          actionHref="/vehicles/new"
        />
      )}
    </div>
  )
}
