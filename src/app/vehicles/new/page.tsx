import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import { PageHeader } from '@/components/shared/page-header'
import { FileSpreadsheet } from 'lucide-react'

import { parkRepository } from '@/repositories/park.repository'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { exchangeService } from '@/services/exchange.service'
import { NewVehicleForm } from '@/components/vehicles/new-vehicle-form'
import { SoulteDirection } from '@/domain/vehicle'

export const dynamic = 'force-dynamic'

async function createVehicleAction(formData: FormData) {
  'use server'

  const acquisitionMode = (formData.get('acquisitionMode') as string) || 'ACHAT_CLASSIQUE'

  // Section 1: Vehicle Information
  const brand = (formData.get('brand') as string) || ''
  const model = (formData.get('model') as string) || ''
  const version = (formData.get('version') as string) || ''
  const year = parseInt(formData.get('year') as string, 10) || new Date().getFullYear()
  const vin = (formData.get('vin') as string) || ''
  const matricule = (formData.get('matricule') as string) || ''
  const fuelType = (formData.get('fuelType') as string) || 'DIESEL'
  const transmission = (formData.get('transmission') as string) || 'AUTOMATIQUE'
  const mileage = parseInt(formData.get('mileage') as string, 10) || 0
  const colorExterior = (formData.get('colorExterior') as string) || ''
  const colorInterior = (formData.get('colorInterior') as string) || ''
  const bodyType = (formData.get('bodyType') as string) || 'SUV'
  const fiscalPower = parseInt(formData.get('fiscalPower') as string, 10) || 8
  const customsStatus = ((formData.get('customsStatus') as string) || 'MAROC').toUpperCase() === 'DEDOUANEE' ? 'DEDOUANEE' : 'MAROC'
  const rawCustomsYear = formData.get('customsYear') as string
  const customsYear = customsStatus === 'DEDOUANEE' && rawCustomsYear ? parseInt(rawCustomsYear, 10) : null
  const parkId = (formData.get('parkId') as string) || null
  let location = (formData.get('location') as string) || 'Casablanca'
  if (parkId) {
    const selectedPark = await prisma.park.findUnique({ where: { id: parkId } })
    if (selectedPark) {
      location = selectedPark.name
    }
  }
  const purchasePrice = parseFloat(formData.get('purchasePrice') as string) || 0
  const rawTargetSalePrice = parseFloat(formData.get('targetSalePrice') as string) || 0
  const description = (formData.get('description') as string) || ''

  // Section 2: Supplier / Seller Snapshot
  const supplierName = (formData.get('supplierName') as string) || null
  const supplierPhone = (formData.get('supplierPhone') as string) || null
  const supplierCin = (formData.get('supplierCin') as string) || null
  const supplierAddress = (formData.get('supplierAddress') as string) || null
  const supplierCity = (formData.get('supplierCity') as string) || 'Casablanca'
  const handledById = (formData.get('handledById') as string) || null
  const paymentMethod = (formData.get('paymentMethod') as string) || 'VIREMENT'

  // Section 3: Purchase Commissioner Snapshot
  const commissionerName = (formData.get('commissionerName') as string) || null
  const commissionerPhone = (formData.get('commissionerPhone') as string) || null
  const commissionerCin = (formData.get('commissionerCin') as string) || null
  const commissionerAddress = (formData.get('commissionerAddress') as string) || null
  const commissionerCity = (formData.get('commissionerCity') as string) || 'Casablanca'
  const commissionAmount = parseFloat(formData.get('commissionAmount') as string) || 0
  const commissionPaidById = (formData.get('commissionPaidById') as string) || null

  // Le prix de vente cible intègre automatiquement la commission de l'intermédiaire d'achat si existante
  const targetSalePrice = rawTargetSalePrice + (commissionAmount > 0 ? commissionAmount : 0)

  // Section 4: Photos & Documents
  const photosDataRaw = (formData.get('vehiclePhotosData') as string) || ''
  const legacyPhotoUrl = (formData.get('photoUrl') as string) || ''
  const documentNotes = (formData.get('documentNotes') as string) || ''

  let parsedPhotos: Array<{ url: string; isPrimary: boolean; order: number }> = []
  if (photosDataRaw) {
    try {
      parsedPhotos = JSON.parse(photosDataRaw)
    } catch (_) {}
  }

  // Fallback to single legacy photoUrl if provided
  if (parsedPhotos.length === 0 && legacyPhotoUrl) {
    parsedPhotos = [{ url: legacyPhotoUrl, isPrimary: true, order: 0 }]
  }

  // Strict enforcement: Maximum 10 photos
  parsedPhotos = parsedPhotos.slice(0, 10)

  const documentsDataRaw = (formData.get('vehicleDocumentsData') as string) || ''
  let parsedDocIds: string[] = []
  if (documentsDataRaw) {
    try {
      parsedDocIds = JSON.parse(documentsDataRaw) as string[]
    } catch (_) {}
  }

  // =========================================================================
  // WORKFLOW A: REPRISE / ÉCHANGE (Atomic Transaction)
  // =========================================================================
  if (acquisitionMode === 'REPRISE') {
    const outgoingVehicleId = (formData.get('outgoingVehicleId') as string) || ''
    const outgoingVehicleValueDH = parseFloat(formData.get('outgoingVehicleValue') as string) || 0
    const incomingVehicleValueDH = parseFloat(formData.get('incomingVehicleValue') as string) || purchasePrice || 0
    const direction = (formData.get('cashAdjustmentDirection') as SoulteDirection) || 'NONE'
    const soulteAmountDH = parseFloat(formData.get('cashAdjustmentAmount') as string) || 0
    const soultePaymentMethod = (formData.get('soultePaymentMethod') as string) || 'VIREMENT'
    const exchangeHandledById = (formData.get('exchangeHandledById') as string) || handledById || null
    const exchangeNotes = (formData.get('exchangeNotes') as string) || ''

    const result = await exchangeService.executeExchange({
      outgoingVehicleId,
      outgoingVehicleValueDH,
      incomingVehicleValueDH,
      direction,
      soulteAmountDH,
      soultePaymentMethod,
      handledById: exchangeHandledById,
      notes: exchangeNotes || documentNotes || undefined,
      incomingVehicle: {
        brand,
        model,
        version: version || null,
        year,
        vin,
        matricule: matricule || null,
        fuelType,
        transmission,
        mileage,
        colorExterior,
        colorInterior: colorInterior || null,
        bodyType,
        fiscalPower,
        customsStatus,
        customsYear,
        parkId,
        location,
        targetSalePrice,
        description: description || null,
        photos: parsedPhotos,
        documentIds: parsedDocIds,
      },
      supplier: {
        supplierName,
        supplierPhone,
        supplierCin,
        supplierAddress,
        supplierCity,
      },
      actorName: 'Admin Maalal',
    })

    redirect(`/vehicles/${result.incomingVehicle.id}?tab=acquisition&reprise=success`)
  }

  // =========================================================================
  // WORKFLOW B: ACHAT CLASSIQUE (Existing unchanged workflow)
  // =========================================================================
  const count = await prisma.vehicle.count()
  const code = `V-2026-${String(count + 1).padStart(4, '0')}`

  const vehicle = await prisma.vehicle.create({
    data: {
      code,
      brand,
      model,
      version,
      year,
      vin,
      matricule: matricule || null,
      fuelType,
      transmission,
      mileage,
      colorExterior,
      colorInterior,
      bodyType,
      fiscalPower,
      customsStatus,
      customsYear,
      parkId,
      location,
      purchasePrice,
      targetSalePrice,
      description: description || null,
      status: 'IN_STOCK',
      ...(parsedPhotos.length > 0
        ? {
            photos: {
              create: parsedPhotos.map((p, idx) => ({
                url: p.url,
                isPrimary: Boolean(p.isPrimary),
                category: 'EXTERIEUR',
                order: typeof p.order === 'number' ? p.order : idx,
              })),
            },
          }
        : {}),
    },
  })

  // Create initial Purchase record to persist acquisition & supplier snapshots
  const purchaseCount = await prisma.purchase.count()
  const purchaseCode = `ACH-${new Date().getFullYear()}-${String(purchaseCount + 1).padStart(4, '0')}`

  const purchase = await prisma.purchase.create({
    data: {
      code: purchaseCode,
      vehicleId: vehicle.id,
      purchasePrice,
      supplierName,
      supplierPhone,
      supplierCin,
      supplierAddress,
      supplierCity,
      handledById: handledById || null,
      commissionerName,
      commissionerPhone,
      commissionerCin,
      commissionerAddress,
      commissionerCity,
      commissionAmount,
      commissionPaidById: commissionPaidById || null,
      paymentMethod,
      status: 'CONFIRMED',
      notes: documentNotes || 'Acquisition initiale du véhicule',
    },
  })

  // Associate documents uploaded during vehicle creation
  if (parsedDocIds.length > 0) {
    await prisma.document.updateMany({
      where: { id: { in: parsedDocIds } },
      data: {
        vehicleId: vehicle.id,
        purchaseId: purchase.id,
      },
    })
  }

  // Create initial status history entry
  await prisma.vehicleStatusHistory.create({
    data: {
      vehicleId: vehicle.id,
      newStatus: 'IN_STOCK',
      reason: 'Entrée en stock initiale et dossier d\'acquisition créé',
      changedBy: 'Admin Maalal',
    },
  })

  redirect(`/vehicles/${vehicle.id}`)
}

export default async function NewVehiclePage() {
  const [parks, personnelList, eligibleVehicles] = await Promise.all([
    parkRepository.getAll(),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, role: { select: { name: true } } },
      orderBy: { name: 'asc' },
    }),
    vehicleRepository.getEligibleForExchange(),
  ])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Nouveau Véhicule"
        subtitle="Formulaire d'entrée en stock en 4 étapes : Mode d'acquisition (Achat ou Reprise/Échange), Caractéristiques, Fournisseur et Documents"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Véhicules', href: '/vehicles' },
          { label: 'Nouveau Véhicule' },
        ]}
        actions={
          <Link
            href="/vehicles/import"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Import Groupé (.xsl)</span>
          </Link>
        }
      />

      {/* Bulk Import Notification Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Vous avez plusieurs véhicules à intégrer en une seule fois ?</h4>
            <p className="text-[11px] text-zinc-400">
              Gagnez du temps en téléversant directement un fichier Excel (.xsl, .xlsx, .csv) pré-rempli.
            </p>
          </div>
        </div>

        <Link
          href="/vehicles/import"
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors shrink-0 shadow-sm"
        >
          Accéder à l&apos;Import Excel
        </Link>
      </div>

      <NewVehicleForm
        parks={parks.map((p) => ({
          id: p.id,
          name: p.name,
          city: p.city,
          capacity: p.capacity,
          totalVehicles: p.totalVehicles,
        }))}
        personnelList={personnelList}
        eligibleVehicles={eligibleVehicles.map((v) => ({
          id: v.id,
          code: v.code,
          brand: v.brand,
          model: v.model,
          version: v.version,
          year: v.year,
          matricule: v.matricule,
          mileage: v.mileage,
          purchasePrice: v.purchasePrice,
          targetSalePrice: v.targetSalePrice,
          status: v.status,
          location: v.location,
          photos: v.photos,
        }))}
        action={createVehicleAction}
      />
    </div>
  )
}
