import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  Car,
  CalendarDays,
  BadgePercent,
  DollarSign,
  Wrench,
  Plus,
  User,
  CreditCard,
  UserCheck,
  Edit3,
  CheckCircle,
  Building2,
  MapPin,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Currency } from '@/components/shared/currency'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { parkRepository } from '@/repositories/park.repository'
import { transferVehicleAction } from '@/app/parks/actions'
import { financialService } from '@/services/financial.service'
import { vehicleStateMachine } from '@/services/vehicle-state-machine.service'
import { VehicleLifecycleTimeline } from '@/components/vehicles/vehicle-lifecycle-timeline'
import { getActiveUserRole } from '@/lib/auth-roles'
import prisma from '@/lib/db'
import { VehiclePhotoUploader } from '@/components/vehicles/vehicle-photo-uploader'
import {
  createRepairAction,
  completeRepairAction,
  cancelRepairAction,
  createReservationAction,
  cancelReservationAction,
  syncVehiclePhotosAction,
  deleteVehiclePhotoAction,
  setPrimaryVehiclePhotoAction,
  updatePurchaseCommissionerAction,
  updateSaleCommissionerAction,
  updateTargetPriceAction,
} from './actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string; action?: string }>
}

export default async function VehicleDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { tab = 'overview', action } = await searchParams

  await vehicleStateMachine.expireDueReservations()

  const [vehicle, personnelList, allParks, activeUser] = await Promise.all([
    vehicleRepository.getById(id),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    parkRepository.getAll(),
    getActiveUserRole(),
  ])

  if (!vehicle) {
    notFound()
  }

  // Financial Calculations - Ensuring ALL repair fees across the car's lifetime are added to initial vehicle cost
  const totalExpenses = vehicle.expenses.reduce((sum, e) => sum + e.amountTTC, 0)
  const totalRepairFees =
    vehicle.repairs?.reduce((sum, r) => sum + (r.finalAmount || r.estimatedAmount || 0), 0) || 0
  const totalFeesAndRepairs = totalExpenses + totalRepairFees

  const purchase = vehicle.purchases[0]
  const sale = vehicle.sales[0]
  const purchaseCommission = purchase?.commissionAmount || 0
  const saleCommission = sale?.commissionAmount || 0

  // Total cost = purchasePrice + purchaseCommission + totalExpenses (expenses + all repairs) + saleCommission
  const totalCost = financialService.calculateTotalVehicleCost({
    purchasePrice: vehicle.purchasePrice,
    purchaseCommission,
    expensesTotalTTC: totalFeesAndRepairs,
    saleCommission,
  })

  const effectiveSalePrice = sale?.salePrice || vehicle.targetSalePrice
  const { netProfit, marginPercent } = financialService.calculateProfitAndMargin({
    salePrice: effectiveSalePrice,
    totalVehicleCost: totalCost,
  })

  const activeReservation = vehicle.reservations.find(
    (r) => r.status === 'ACTIVE' || r.status === 'EXPIRING'
  )
  const activeRepair = vehicle.repairs?.find((r) => r.status === 'EN_COURS')

  // Derived Commissioner fields for Purchase
  const purchaseCommName =
    purchase?.commissionerName ||
    (purchase?.commissioner ? `${purchase.commissioner.firstName} ${purchase.commissioner.lastName}` : null)
  const purchaseCommPhone = purchase?.commissionerPhone || purchase?.commissioner?.phone || null
  const purchaseCommCin = purchase?.commissionerCin || purchase?.commissioner?.cin || null
  const purchaseCommAddress = purchase?.commissionerAddress || purchase?.commissioner?.address || null
  const purchaseCommPaidByName = purchase?.commissionPaidBy?.name || purchase?.handledBy?.name || null

  // Derived Commissioner fields for Sale
  const saleCommName =
    sale?.commissionerName ||
    (sale?.commissioner ? `${sale.commissioner.firstName} ${sale.commissioner.lastName}` : null)
  const saleCommPhone = sale?.commissionerPhone || sale?.commissioner?.phone || null
  const saleCommCin = sale?.commissionerCin || sale?.commissioner?.cin || null
  const saleCommAddress = sale?.commissionerAddress || sale?.commissioner?.address || null
  const saleCommPaidByName = sale?.commissionPaidBy?.name || sale?.salesperson?.name || null
  const saleReceivedByName = sale?.receivedBy?.name || null

  // Bound Server actions
  const handleCreateRepair = createRepairAction.bind(null, id)
  const handleCompleteRepair = completeRepairAction.bind(null, id)
  const handleCancelRepair = cancelRepairAction.bind(null, id)
  const handleCreateReservation = createReservationAction.bind(null, id)
  const handleCancelReservation = cancelReservationAction.bind(null, id)
  const handleSyncPhotos = syncVehiclePhotosAction.bind(null, id)
  const handleUpdatePurchaseCommissioner = updatePurchaseCommissionerAction.bind(null, id)
  const handleUpdateSaleCommissioner = updateSaleCommissionerAction.bind(null, id)
  const handleUpdateTargetPrice = updateTargetPriceAction.bind(null, id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} (${vehicle.year})`}
        subtitle={`Code: ${vehicle.code} — VIN: ${vehicle.vin} — Matricule: ${vehicle.matricule || 'En cours d\'immatriculation'}`}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Véhicules', href: '/vehicles' },
          { label: `${vehicle.brand} ${vehicle.model}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={vehicle.status} />
          </div>
        }
      />

      {/* Financial Summary KPI Ribbon - Explicitly showing Fees & Repairs accumulated to initial price */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5">
          <span className="text-[11px] font-semibold text-zinc-400 block uppercase">Prix d’Achat</span>
          <Currency amount={vehicle.purchasePrice} className="text-lg text-white font-bold font-mono" />
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">Frais & Atelier</span>
            <span className="text-[10px] text-zinc-500 font-mono">({vehicle.repairs.length} travaux)</span>
          </div>
          <Currency amount={totalFeesAndRepairs} className="text-lg text-purple-400 font-bold font-mono" />
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">Coût Total Véhicule</span>
            <span className="text-[9px] text-amber-500/80 font-mono">Achat+Frais</span>
          </div>
          <Currency amount={totalCost} className="text-lg text-amber-400 font-bold font-mono" />
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">
              {vehicle.status === 'SOLD' ? 'Prix Vendu' : 'Prix Vente Souhaité'}
            </span>
            {vehicle.status !== 'SOLD' && (
              <Link
                href={`/vehicles/${vehicle.id}?tab=${tab}&action=edit-target-price`}
                className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
                title="Modifier le prix de vente souhaité"
              >
                <Edit3 className="h-2.5 w-2.5" />
                <span>Modifier</span>
              </Link>
            )}
          </div>
          <Currency amount={effectiveSalePrice} className="text-lg text-cyan-400 font-bold font-mono" />
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-[#121216] p-3.5 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-emerald-400 block uppercase">Bénéfice Net ({marginPercent}%)</span>
          <Currency amount={netProfit} className="text-lg text-emerald-400 font-bold font-mono" />
        </div>
      </div>

      {/* Quick Edit Modal/Banner for Target Sale Price */}
      {action === 'edit-target-price' && vehicle.status !== 'SOLD' && (
        <form
          action={handleUpdateTargetPrice}
          className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/30 to-[#121216] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Mettre à jour le prix de vente souhaité</h4>
              <p className="text-xs text-zinc-400">
                Ajustez le prix affiché dans le showroom et le catalogue à tout moment selon le marché.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <input
                type="number"
                name="targetSalePrice"
                required
                defaultValue={vehicle.targetSalePrice}
                className="h-10 w-44 rounded-xl border border-cyan-500/50 bg-[#16161c] px-3 text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-zinc-500 font-bold">DH</span>
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-cyan-600 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-sm"
            >
              Enregistrer
            </button>
            <Link
              href={`/vehicles/${vehicle.id}?tab=${tab}`}
              className="h-10 px-3 rounded-xl border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-400 flex items-center"
            >
              Annuler
            </Link>
          </div>
        </form>
      )}

      {/* Action Banner: Transférer vers un autre Parc */}
      {action === 'transfer-park' && (
        <form
          action={async (formData: FormData) => {
            'use server'
            const targetParkId = formData.get('targetParkId') as string
            if (targetParkId) {
              await transferVehicleAction(vehicle.id, targetParkId)
            }
          }}
          className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Transfert Inter-Parcs Automobile</h4>
              <p className="text-xs text-zinc-300">
                Déplacer ce véhicule vers un autre parc du réseau (ex: Casablanca vers Fès).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              name="targetParkId"
              defaultValue={vehicle.parkId || ''}
              className="h-10 rounded-xl border border-cyan-500/50 bg-[#16161c] px-3 text-xs text-white focus:outline-none"
            >
              {allParks.map((p) => (
                <option key={p.id} value={p.id}>
                  📍 {p.city} — {p.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-cyan-600 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-sm"
            >
              Transférer
            </button>
            <Link
              href={`/vehicles/${vehicle.id}?tab=${tab}`}
              className="h-10 px-3 rounded-xl border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-400 flex items-center"
            >
              Annuler
            </Link>
          </div>
        </form>
      )}

      {/* Split Layout: Left (Detailed Life Stage Content) + Right (Glowing Agency Life Process Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Stage View Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* STAGE 1 / TAB 1: INFORMATIONS GÉNÉRALES / SHOWROOM */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Hero Vehicle Photo Card */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#282834] bg-gradient-to-t from-black via-zinc-950 to-zinc-900 shadow-md">
                {vehicle.photos[0]?.url ? (
                  <Image
                    src={vehicle.photos[0].url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-zinc-600">
                    <Car className="h-20 w-20 mb-2" />
                    <span className="text-xs">Aucune photo principale</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <StatusBadge status={vehicle.status} />
                  {vehicle.matricule && (
                    <span className="rounded-md bg-black/80 px-2.5 py-1 font-mono text-xs font-bold text-white border border-zinc-700 backdrop-blur-sm">
                      {vehicle.matricule}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                      {vehicle.brand} {vehicle.model}
                    </h2>
                    <p className="text-xs text-zinc-300 drop-shadow">
                      {vehicle.version || 'Version Standard'} • {vehicle.year} • {vehicle.mileage.toLocaleString('fr-FR')} km
                    </p>
                  </div>

                  <div className="text-right bg-black/70 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-zinc-700/50 flex items-center gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Prix Affiché</span>
                      <Currency amount={vehicle.targetSalePrice} className="text-lg font-bold text-cyan-400 font-mono" />
                    </div>
                    {vehicle.status !== 'SOLD' && (
                      <Link
                        href={`/vehicles/${vehicle.id}?tab=overview&action=edit-target-price`}
                        className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-1.5 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                        title="Modifier le prix souhaité"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Fiche Technique */}
              <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm">
                <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center justify-between">
                  <span>Fiche Technique & Caractéristiques</span>
                  <span className="font-mono text-xs font-bold text-zinc-400">{vehicle.code}</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Marque & Modèle</span>
                    <span className="font-bold text-white text-sm">{vehicle.brand} {vehicle.model}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Version</span>
                    <span className="font-semibold text-zinc-200">{vehicle.version || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Année</span>
                    <span className="font-semibold text-zinc-200">{vehicle.year}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Kilométrage</span>
                    <span className="font-semibold text-zinc-200 font-mono">{vehicle.mileage.toLocaleString('fr-FR')} km</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Carburant</span>
                    <span className="font-semibold text-zinc-200">{vehicle.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Boîte de vitesses</span>
                    <span className="font-semibold text-zinc-200">{vehicle.transmission}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Couleur Extérieure</span>
                    <span className="font-semibold text-zinc-200">{vehicle.colorExterior}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Couleur Intérieure</span>
                    <span className="font-semibold text-zinc-200">{vehicle.colorInterior || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Puissance Fiscale</span>
                    <span className="font-semibold text-zinc-200 font-mono">{vehicle.fiscalPower} CV</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Matricule Maroc</span>
                    <span className="font-mono font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-zinc-700 inline-block">
                      {vehicle.matricule || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Parc &amp; Emplacement</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-bold text-cyan-400 flex items-center gap-1 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span>{vehicle.park?.name || vehicle.location}</span>
                      </span>
                      <Link
                        href={`/vehicles/${vehicle.id}?tab=overview&action=transfer-park`}
                        className="text-[10px] text-zinc-300 hover:text-white px-2 py-0.5 rounded border border-zinc-700 bg-[#1a1a22] font-semibold"
                        title="Transférer vers un autre parc"
                      >
                        Transférer
                      </Link>
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Entrée en stock</span>
                    <span className="font-semibold text-zinc-200">{new Date(vehicle.entryDate).toLocaleDateString('fr-MA')}</span>
                  </div>
                </div>

                {vehicle.description && (
                  <div className="mt-5 pt-4 border-t border-[#222228]">
                    <span className="text-zinc-400 block text-[11px] mb-1">Description & Remarques</span>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-[#16161c] p-3 rounded-xl border border-[#222228]">
                      {vehicle.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 2 / TAB 2: ACQUISITION & FOURNISSEUR & COMMISSIONNAIRE (OPTIONNEL) */}
          {tab === 'acquisition' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Détails Financiers de l'Acquisition */}
                <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <span>Détails Financiers de l&apos;Acquisition</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Réf. Dossier Achat</span>
                      <span className="font-mono font-bold text-white text-sm">{purchase?.code || 'ACH-DIRECT'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Date d&apos;acquisition</span>
                      <span className="font-semibold text-zinc-200">
                        {purchase?.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString('fr-MA') : new Date(vehicle.entryDate).toLocaleDateString('fr-MA')}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Prix d&apos;Achat Net</span>
                      <Currency amount={vehicle.purchasePrice} className="text-base font-bold text-emerald-400 font-mono" />
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Commission Achat</span>
                      <Currency amount={purchaseCommission} className="text-base font-bold text-amber-400 font-mono" />
                    </div>
                  </div>
                </div>

                {/* Fournisseur / Vendeur d'Origine */}
                <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-400" />
                    <span>Fournisseur / Vendeur d&apos;Origine</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Nom / Raison Sociale</span>
                      <span className="font-bold text-white">
                        {purchase?.supplierName || (purchase?.seller ? `${purchase.seller.firstName} ${purchase.seller.lastName}` : 'Non renseigné')}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Téléphone</span>
                      <span className="font-semibold text-zinc-200 font-mono">
                        {purchase?.supplierPhone || purchase?.seller?.phone || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">CIN / ICE</span>
                      <span className="font-mono text-zinc-300">
                        {purchase?.supplierCin || purchase?.seller?.cin || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Adresse / Ville</span>
                      <span className="text-zinc-300">
                        {purchase?.supplierAddress || purchase?.seller?.address || 'Maroc'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Fournisseur Payé Par</span>
                      <span className="font-bold text-cyan-400 flex items-center gap-1">
                        <User className="h-3 w-3 text-cyan-400" />
                        <span>{purchase?.handledBy?.name || 'Non spécifié'}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Mode de Règlement</span>
                      <span className="font-semibold text-zinc-200">
                        {purchase?.paymentMethod || 'VIREMENT'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intermédiaire & Commissionnaire d'Acquisition (Semsar - Optionnel) */}
              <div className="rounded-2xl border border-amber-500/20 bg-[#121216] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#222228] pb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4.5 w-4.5 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">
                          Intermédiaire & Courtier d&apos;Acquisition (Semsar)
                        </h3>
                        <span className="text-[10px] font-bold text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Optionnel
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Détails d&apos;identification, commission perçue et traçabilité du collaborateur payeur
                      </p>
                    </div>
                  </div>

                  {purchase && (
                    <Link
                      href={
                        action === 'edit-commission'
                          ? `/vehicles/${vehicle.id}?tab=acquisition`
                          : `/vehicles/${vehicle.id}?tab=acquisition&action=edit-commission`
                      }
                      className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>{action === 'edit-commission' ? 'Fermer formulaire' : purchaseCommName ? 'Modifier commission' : '+ Déclarer un courtier'}</span>
                    </Link>
                  )}
                </div>

                {action === 'edit-commission' && purchase ? (
                  <form action={handleUpdatePurchaseCommissioner} className="space-y-4 pt-2">
                    <input type="hidden" name="purchaseId" value={purchase.id} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Nom du Commissionnaire
                        </label>
                        <input
                          type="text"
                          name="commissionerName"
                          defaultValue={purchaseCommName || ''}
                          placeholder="Nom complet (laisser vide si sans)"
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Téléphone du Semsar
                        </label>
                        <input
                          type="text"
                          name="commissionerPhone"
                          defaultValue={purchaseCommPhone || ''}
                          placeholder="06XXXXXXXX"
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          CIN / Pièce d&apos;Identité
                        </label>
                        <input
                          type="text"
                          name="commissionerCin"
                          defaultValue={purchaseCommCin || ''}
                          placeholder="Ex: BE987654"
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white uppercase focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Adresse / Quartier
                        </label>
                        <input
                          type="text"
                          name="commissionerAddress"
                          defaultValue={purchaseCommAddress || ''}
                          placeholder="Ex: Maârif, Casablanca"
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Montant Commission (MAD)
                        </label>
                        <input
                          type="number"
                          name="commissionAmount"
                          defaultValue={purchase.commissionAmount || 0}
                          className="h-9 w-full rounded-lg border border-amber-500/30 bg-[#16161c] px-3 text-xs text-amber-400 font-mono font-bold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Commission Payée Par ? (Personnel Agence)
                        </label>
                        <select
                          name="commissionPaidById"
                          defaultValue={purchase.commissionPaidById || ''}
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="">-- Sélectionner le membre du personnel --</option>
                          {personnelList.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Fournisseur Payé Par ? (Personnel Agence)
                        </label>
                        <select
                          name="handledById"
                          defaultValue={purchase.handledById || ''}
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        >
                          <option value="">-- Sélectionner le membre ayant payé le fournisseur --</option>
                          {personnelList.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e1e24]">
                      <Link
                        href={`/vehicles/${vehicle.id}?tab=acquisition`}
                        className="px-3 py-1.5 rounded-lg border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-300"
                      >
                        Annuler
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white hover:bg-amber-500 shadow-sm"
                      >
                        Enregistrer la commission & le payeur
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {purchaseCommName ? (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">
                              Nom du Commissionnaire
                            </span>
                            <span className="font-bold text-white text-sm">
                              {purchaseCommName}
                            </span>
                          </div>

                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">
                              Téléphone Direct
                            </span>
                            <span className="font-mono text-zinc-200">
                              {purchaseCommPhone || 'N/A'}
                            </span>
                          </div>

                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">
                              CIN / Pièce d&apos;Identité
                            </span>
                            <span className="font-mono text-zinc-200">
                              {purchaseCommCin || 'N/A'}
                            </span>
                          </div>

                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">
                              Adresse / Ville
                            </span>
                            <span className="text-zinc-300 truncate block">
                              {purchaseCommAddress || 'Maroc'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#1e1e24] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">
                              Montant Perçu par le Semsar
                            </span>
                            <div className="font-mono text-lg font-bold text-amber-400">
                              {purchase?.commissionAmount
                                ? `${purchase.commissionAmount.toLocaleString('fr-MA')} DH`
                                : '0 DH'}
                            </div>
                          </div>

                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">
                              Payé par (Personnel de l&apos;Agence)
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="inline-flex items-center gap-1 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/20">
                                <User className="h-3 w-3" />
                                <span>{purchaseCommPaidByName || 'Maalal Admin (Direction)'}</span>
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">
                              Statut de Règlement
                            </span>
                            <div className="mt-0.5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                                ✓ Commission réglée & décaissée
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#282834] bg-[#16161c]/50 p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-zinc-300">
                            Aucun intermédiaire / semsar sur cette acquisition
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            Achat direct auprès du vendeur sans commission de courtage.
                          </p>
                        </div>
                        <Link
                          href={`/vehicles/${vehicle.id}?tab=acquisition&action=edit-commission`}
                          className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-400 hover:bg-amber-500/20"
                        >
                          + Déclarer un semsar
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 3 / TAB 3: RÉPARATIONS & ATELIER (MULTIPLE POSSIBLE & PAYER TRACKING) */}
          {tab === 'repairs' && (
            <div className="space-y-6">
              {/* Information Banner on Multiple Repairs & Cumulative Cost */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3.5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-purple-300 block">
                    Gestion des Réparations Multiples & Traçabilité des Dépenses
                  </span>
                  <span className="text-zinc-300">
                    Un véhicule peut subir plusieurs interventions atelier au fil de sa présence en agence. Chaque facture est enregistrée avec le membre du personnel payeur et son montant est <strong>automatiquement ajouté au prix initial du véhicule</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-purple-400" />
                  <span>Historique des Interventions ({vehicle.repairs.length}) — Total : {totalRepairFees.toLocaleString('fr-MA')} DH</span>
                </h3>

                {vehicle.status === 'IN_STOCK' && (
                  <Link
                    href={`/vehicles/${vehicle.id}?tab=repairs&action=new`}
                    className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Nouvelle Réparation</span>
                  </Link>
                )}
              </div>

              {/* Form to open new repair */}
              {action === 'new' && vehicle.status === 'IN_STOCK' && (
                <form action={handleCreateRepair} className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Enregistrer une nouvelle intervention atelier
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Type de Réparation *</label>
                      <select
                        name="repairType"
                        required
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                      >
                        <option value="MECANIQUE">Mécanique</option>
                        <option value="CARROSSERIE">Carrosserie & Peinture</option>
                        <option value="ELECTRICITE">Électricité & Électronique</option>
                        <option value="PNEUMATIQUES">Pneumatiques & Freinage</option>
                        <option value="CLIMATISATION">Climatisation</option>
                        <option value="ENTRETIEN">Vidange & Révision</option>
                        <option value="NETTOYAGE">Lavage & Rénovation esthétique</option>
                        <option value="AUTRE">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Garage / Atelier Prestataire</label>
                      <input
                        type="text"
                        name="garageName"
                        placeholder="Ex: Garage Atlas Casablanca"
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Devis Estimatif (MAD)</label>
                      <input
                        type="number"
                        name="estimatedAmount"
                        placeholder="Ex: 2500"
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Description des travaux</label>
                      <input
                        type="text"
                        name="description"
                        placeholder="Détail des pièces à remplacer ou travaux à effectuer"
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Link
                      href={`/vehicles/${vehicle.id}?tab=repairs`}
                      className="px-3 py-1.5 rounded-lg border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-300"
                    >
                      Annuler
                    </Link>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-purple-600 text-xs font-bold text-white hover:bg-purple-500"
                    >
                      Confirmer et envoyer en atelier
                    </button>
                  </div>
                </form>
              )}

              {/* List of repairs */}
              <div className="space-y-3">
                {(!vehicle.repairs || vehicle.repairs.length === 0) ? (
                  <div className="rounded-2xl border border-[#222228] bg-[#121216] p-8 text-center text-xs text-zinc-500">
                    Aucune réparation enregistrée pour ce véhicule
                  </div>
                ) : (
                  vehicle.repairs.map((rep, idx) => (
                    <div
                      key={rep.id}
                      className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e1e24] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold text-zinc-500 uppercase">Intervention #{vehicle.repairs.length - idx}</span>
                          <span className="font-mono text-xs font-bold text-purple-400">{rep.code}</span>
                          <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                            {rep.repairType}
                          </span>
                          <StatusBadge status={rep.status} />
                        </div>
                        <div className="text-xs text-zinc-400 font-mono">
                          Débuté le {new Date(rep.startedAt).toLocaleDateString('fr-MA')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Garage / Atelier</span>
                          <span className="font-semibold text-zinc-200">{rep.garageName || 'Atelier interne'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Devis Estimé</span>
                          <span className="font-mono text-zinc-300">
                            {rep.estimatedAmount ? <Currency amount={rep.estimatedAmount} /> : 'Non chiffré'}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Facture Réelle Final</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {rep.finalAmount ? <Currency amount={rep.finalAmount} /> : 'En attente facture'}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Payé par (Personnel)</span>
                          <div className="flex items-center gap-1 text-cyan-300 font-semibold mt-0.5">
                            <User className="h-3 w-3" />
                            <span>{rep.paidBy?.name || (rep.status === 'TERMINEE' ? 'Maalal Admin' : 'À définir')}</span>
                          </div>
                        </div>
                      </div>

                      {rep.description && (
                        <p className="text-xs text-zinc-400 bg-[#16161c] p-2.5 rounded-lg border border-[#222228]">
                          {rep.description}
                        </p>
                      )}

                      {/* Cumulative Cost Notification */}
                      {rep.status === 'TERMINEE' && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/20 font-medium">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>Frais de {((rep.finalAmount || rep.estimatedAmount || 0)).toLocaleString('fr-MA')} DH inclus dans le coût total du véhicule.</span>
                        </div>
                      )}

                      {/* Complete / Cancel actions if EN_COURS */}
                      {rep.status === 'EN_COURS' && (
                        <div className="pt-3 border-t border-[#1e1e24] flex flex-wrap items-center justify-between gap-3">
                          <form action={handleCompleteRepair} className="flex flex-wrap items-center gap-2">
                            <input type="hidden" name="repairId" value={rep.id} />
                            <div>
                              <input
                                type="number"
                                name="finalAmount"
                                required
                                defaultValue={rep.estimatedAmount || 0}
                                placeholder="Montant TTC (MAD)"
                                className="h-8 w-32 rounded-lg border border-emerald-500/30 bg-[#16161c] px-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none"
                              />
                            </div>
                            <div>
                              <select
                                name="paidById"
                                required
                                defaultValue={personnelList[0]?.id || ''}
                                className="h-8 rounded-lg border border-[#282834] bg-[#16161c] px-2.5 text-xs text-white focus:outline-none"
                              >
                                <option value="">-- Payé par qui du personnel ? --</option>
                                {personnelList.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="submit"
                              className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                              Valider facture & clôturer
                            </button>
                          </form>

                          <form action={handleCancelRepair}>
                            <input type="hidden" name="repairId" value={rep.id} />
                            <button
                              type="submit"
                              className="text-xs text-red-400 hover:text-red-300 hover:underline"
                            >
                              Annuler intervention
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STAGE 4 / TAB 4: RÉSERVATIONS */}
          {tab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-amber-400" />
                  <span>Dossiers de Réservation Client</span>
                </h3>

                {vehicle.status === 'IN_STOCK' && (
                  <Link
                    href={`/vehicles/${vehicle.id}?tab=reservations&action=new`}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-500 transition-colors shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Nouvelle Réservation</span>
                  </Link>
                )}
              </div>

              {/* Form to open new reservation */}
              {action === 'new' && vehicle.status === 'IN_STOCK' && (
                <form action={handleCreateReservation} className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Créer une réservation (Snapshot sans CRM requis)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom Client *</label>
                      <input
                        type="text"
                        name="clientName"
                        required
                        placeholder="Nom complet"
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Téléphone *</label>
                      <input
                        type="text"
                        name="clientPhone"
                        required
                        placeholder="06XXXXXXXX"
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">CIN Client</label>
                      <input
                        type="text"
                        name="clientCin"
                        placeholder="Ex: AB123456"
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white uppercase focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Acompte Versé (MAD) *</label>
                      <input
                        type="number"
                        name="depositAmount"
                        required
                        defaultValue={10000}
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-emerald-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Mode de Règlement</label>
                      <select
                        name="paymentMethod"
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="ESPECES">Espèces</option>
                        <option value="VIREMENT">Virement bancaire</option>
                        <option value="CHEQUE">Chèque</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Durée de Validité</label>
                      <select
                        name="expiryDays"
                        defaultValue="7"
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="3">3 jours</option>
                        <option value="7">7 jours (Standard)</option>
                        <option value="15">15 jours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Acompte Reçu Par (Personnel) *
                      </label>
                      <select
                        name="salespersonName"
                        required
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="">-- Qui a reçu l&apos;acompte ? --</option>
                        {personnelList.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Link
                      href={`/vehicles/${vehicle.id}?tab=reservations`}
                      className="px-3 py-1.5 rounded-lg border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-300"
                    >
                      Annuler
                    </Link>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white hover:bg-amber-500 shadow-sm"
                    >
                      Enregistrer et bloquer le véhicule
                    </button>
                  </div>
                </form>
              )}

              {/* List of reservations */}
              <div className="space-y-3">
                {vehicle.reservations.length === 0 ? (
                  <div className="rounded-2xl border border-[#222228] bg-[#121216] p-8 text-center text-xs text-zinc-500">
                    Aucune réservation enregistrée pour ce véhicule
                  </div>
                ) : (
                  vehicle.reservations.map((res) => (
                    <div
                      key={res.id}
                      className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e1e24] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-amber-400">{res.code}</span>
                          <StatusBadge status={res.status} />
                        </div>
                        <div className="text-xs text-zinc-400 font-mono">
                          Échéance : {new Date(res.expiryDate).toLocaleDateString('fr-MA')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Client</span>
                          <span className="font-bold text-white">
                            {res.clientName || (res.contact ? `${res.contact.firstName} ${res.contact.lastName}` : 'Client')}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Téléphone</span>
                          <span className="font-mono text-zinc-200">{res.clientPhone || res.contact?.phone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Acompte</span>
                          <Currency amount={res.depositAmount} className="text-emerald-400 font-mono font-bold" />
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Acompte Reçu Par</span>
                          <span className="font-semibold text-cyan-400 flex items-center gap-1">
                            <User className="h-3 w-3 text-cyan-400" />
                            <span>{res.salespersonName || 'Non spécifié'}</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Règlement</span>
                          <span className="font-semibold text-zinc-300">{res.paymentMethod}</span>
                        </div>
                      </div>

                      {res.status === 'ACTIVE' && (
                        <div className="pt-2 border-t border-[#1e1e24] flex items-center justify-between">
                          <Link
                            href={`/sales/new?vehicleId=${vehicle.id}&reservationId=${res.id}`}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm transition-colors"
                          >
                            <BadgePercent className="h-3.5 w-3.5" />
                            <span>Convertir en vente</span>
                          </Link>

                          <form action={handleCancelReservation}>
                            <input type="hidden" name="reservationId" value={res.id} />
                            <button
                              type="submit"
                              className="text-xs text-red-400 hover:text-red-300 hover:underline"
                            >
                              Annuler la réservation
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STAGE 5 / TAB 5: VENTE & RÈGLEMENTS (COMMISSIONNAIRE OPTIONNEL) */}
          {tab === 'sale' && (
            <div className="space-y-6">
              {sale ? (
                <div className="rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-[#222228] pb-4">
                    <div>
                      <span className="text-xs text-zinc-400 block">Dossier de Vente Clôturé</span>
                      <h3 className="text-base font-black text-white font-mono">{sale.code}</h3>
                    </div>
                    <StatusBadge status={sale.status} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Acheteur</span>
                      <span className="font-bold text-white text-sm">
                        {sale.buyerName || (sale.buyer ? `${sale.buyer.firstName} ${sale.buyer.lastName}` : 'Client')}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Téléphone</span>
                      <span className="font-mono text-zinc-200">{sale.buyerPhone || sale.buyer?.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">CIN Acheteur</span>
                      <span className="font-mono text-zinc-200">{sale.buyerCin || sale.buyer?.cin || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Date de Vente</span>
                      <span className="text-zinc-200">{new Date(sale.saleDate).toLocaleDateString('fr-MA')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1e1e24] text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Prix Vendu Net</span>
                      <Currency amount={sale.salePrice} className="text-lg font-mono font-bold text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Acompte Reporté</span>
                      <Currency amount={sale.advanceAmount} className="text-lg font-mono font-bold text-amber-400" />
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Commission Vente</span>
                      <Currency amount={sale.commissionAmount} className="text-lg font-mono font-bold text-zinc-300" />
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Bénéfice Net</span>
                      <Currency amount={netProfit} className="text-lg font-mono font-bold text-emerald-400" />
                    </div>
                  </div>

                  {/* Argent Récupéré Par */}
                  {saleReceivedByName && (
                    <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-zinc-500 block">Argent Récupéré Par (Personnel)</span>
                        <span className="font-semibold text-cyan-300">{saleReceivedByName}</span>
                      </div>
                    </div>
                  )}

                  {/* Intermédiaire / Commissionnaire de Vente (Optionnel) */}
                  <div className="rounded-xl border border-amber-500/20 bg-[#16161c] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          Intermédiaire & Commissionnaire de Vente (Semsar)
                        </span>
                        <span className="text-[10px] font-bold text-amber-400/80 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          Optionnel
                        </span>
                      </div>
                      <Link
                        href={
                          action === 'edit-sale-commission'
                            ? `/vehicles/${vehicle.id}?tab=sale`
                            : `/vehicles/${vehicle.id}?tab=sale&action=edit-sale-commission`
                        }
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                      >
                        {action === 'edit-sale-commission' ? 'Fermer' : saleCommName ? 'Modifier' : '+ Déclarer un courtier'}
                      </Link>
                    </div>

                    {action === 'edit-sale-commission' ? (
                      <form action={handleUpdateSaleCommissioner} className="space-y-3 pt-1 text-xs">
                        <input type="hidden" name="saleId" value={sale.id} />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Nom du Commissionnaire</label>
                            <input
                              type="text"
                              name="commissionerName"
                              defaultValue={saleCommName || ''}
                              placeholder="Nom du semsar (laisser vide si sans)"
                              className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Téléphone</label>
                            <input
                              type="text"
                              name="commissionerPhone"
                              defaultValue={saleCommPhone || ''}
                              placeholder="06XXXXXXXX"
                              className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">CIN</label>
                            <input
                              type="text"
                              name="commissionerCin"
                              defaultValue={saleCommCin || ''}
                              placeholder="CIN"
                              className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white uppercase focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Adresse / Ville</label>
                            <input
                              type="text"
                              name="commissionerAddress"
                              defaultValue={saleCommAddress || ''}
                              placeholder="Ex: Casablanca"
                              className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Montant Commission (MAD)</label>
                            <input
                              type="number"
                              name="commissionAmount"
                              defaultValue={sale.commissionAmount || 0}
                              className="h-8 w-full rounded-lg border border-amber-500/30 bg-[#121216] px-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] text-zinc-400 mb-1">
                              Payé par qui du Personnel ?
                            </label>
                            <select
                              name="commissionPaidById"
                              defaultValue={sale.commissionPaidById || sale.salespersonId || ''}
                              className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none"
                            >
                              <option value="">-- Sélectionner le collaborateur --</option>
                              {personnelList.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Link
                            href={`/vehicles/${vehicle.id}?tab=sale`}
                            className="px-2.5 py-1 rounded-md border border-[#282834] text-xs text-zinc-400"
                          >
                            Annuler
                          </Link>
                          <button
                            type="submit"
                            className="px-3 py-1 rounded-md bg-amber-600 text-xs font-bold text-white hover:bg-amber-500"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-2">
                        {saleCommName ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-zinc-500 block text-[10px] uppercase">Courtier / Semsar</span>
                              <span className="font-semibold text-white">
                                {saleCommName}
                              </span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block text-[10px] uppercase">Contact</span>
                              <span className="font-mono text-zinc-300">
                                {saleCommPhone || 'N/A'} {saleCommCin ? `(${saleCommCin})` : ''}
                              </span>
                              {saleCommAddress && (
                                <span className="text-[10px] text-zinc-500 block truncate">{saleCommAddress}</span>
                              )}
                            </div>
                            <div>
                              <span className="text-zinc-500 block text-[10px] uppercase">Commission Versée</span>
                              <span className="font-mono font-bold text-amber-400">
                                {sale.commissionAmount ? `${sale.commissionAmount.toLocaleString('fr-MA')} DH` : '0 DH'}
                              </span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block text-[10px] uppercase">Payé par (Personnel)</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-cyan-300">
                                <User className="h-3 w-3" />
                                <span>{saleCommPaidByName || 'Maalal Admin'}</span>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400">
                            Aucun intermédiaire déclaré sur cette vente (Vente directe en concession).
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payments History */}
                  <div className="pt-4 border-t border-[#1e1e24] space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-emerald-400" />
                      <span>Règlements & Paiements Enregistrés ({sale.payments.length})</span>
                    </h4>

                    <div className="space-y-2">
                      {sale.payments.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-xl border border-[#222228] bg-[#16161c] px-3.5 py-2.5 text-xs"
                        >
                          <div>
                            <span className="font-mono text-zinc-300 font-semibold">{p.code}</span>
                            <span className="text-zinc-500 ml-2">({p.paymentMethod})</span>
                            {p.notes && <p className="text-[11px] text-zinc-400 mt-0.5">{p.notes}</p>}
                          </div>
                          <div className="text-right">
                            <Currency amount={p.amount} className="font-mono font-bold text-emerald-400" />
                            <span className="text-[10px] text-zinc-500 block">
                              {new Date(p.paymentDate).toLocaleDateString('fr-MA')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#222228] bg-[#121216] p-8 text-center space-y-4">
                  <BadgePercent className="h-12 w-12 text-zinc-600 mx-auto" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Ce véhicule n&apos;est pas encore vendu</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Enregistrez une vente directe ou convertissez une réservation active.
                    </p>
                  </div>

                  {vehicle.status === 'IN_STOCK' && (
                    <Link
                      href={`/sales/new?vehicleId=${vehicle.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Enregistrer une vente</span>
                    </Link>
                  )}

                  {vehicle.status === 'RESERVED' && activeReservation && (
                    <Link
                      href={`/sales/new?vehicleId=${vehicle.id}&reservationId=${activeReservation.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                    >
                      <BadgePercent className="h-4 w-4" />
                      <span>Convertir la réservation en vente</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STAGE 6 / TAB 6: PHOTOS & DOCUMENTS */}
          {tab === 'documents' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm">
                <VehiclePhotoUploader
                  initialPhotos={vehicle.photos.map((ph) => ({
                    id: ph.id,
                    url: ph.url,
                    isPrimary: ph.isPrimary,
                    name: `Photo #${ph.order + 1}`,
                  }))}
                  vehicleId={vehicle.id}
                  maxPhotos={10}
                  onDeletePhoto={deleteVehiclePhotoAction}
                  onSetPrimaryPhoto={setPrimaryVehiclePhotoAction}
                  onPhotosChange={handleSyncPhotos}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Glowing Lifecycle Timeline */}
        <div className="lg:col-span-4">
          <VehicleLifecycleTimeline
            vehicleId={vehicle.id}
            vehicleStatus={vehicle.status}
            activeTab={tab}
            entryDate={vehicle.entryDate}
            purchasePrice={vehicle.purchasePrice}
            targetSalePrice={vehicle.targetSalePrice}
            supplierName={
              purchase?.supplierName ||
              (purchase?.seller ? `${purchase.seller.firstName} ${purchase.seller.lastName}` : null)
            }
            repairsCount={vehicle.repairs?.length || 0}
            activeRepairGarage={activeRepair?.garageName}
            activeRepairType={activeRepair?.repairType}
            totalRepairCost={totalRepairFees}
            reservationsCount={vehicle.reservations.length}
            activeClientName={activeReservation?.clientName}
            activeDepositAmount={activeReservation?.depositAmount}
            isReserved={vehicle.status === 'RESERVED'}
            isSold={vehicle.status === 'SOLD'}
            saleId={sale?.id}
            saleCode={sale?.code}
            saleStatus={sale?.status}
            isSuperAdmin={activeUser.isSuperAdmin}
            currentUserRole={activeUser.role}
            currentUserName={activeUser.name}
            salePrice={sale?.salePrice}
            buyerName={sale?.buyerName}
            netProfit={netProfit}
            photosCount={vehicle.photos.length}
            documentsCount={vehicle.documents.length}
            commissionerName={purchaseCommName}
            commissionAmount={purchaseCommission}
            commissionPaidByName={purchaseCommPaidByName}
          />
        </div>
      </div>
    </div>
  )
}
