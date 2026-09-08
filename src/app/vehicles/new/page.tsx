import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import { PageHeader } from '@/components/shared/page-header'
import {
  Car,
  Save,
  ArrowLeft,
  User,
  Briefcase,
  Image as ImageIcon,
} from 'lucide-react'

import { parkRepository } from '@/repositories/park.repository'
import { VehiclePhotoUploader } from '@/components/vehicles/vehicle-photo-uploader'
import { DocumentFormUploader } from '@/components/documents/document-form-uploader'

export const dynamic = 'force-dynamic'

async function createVehicleAction(formData: FormData) {
  'use server'

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
  const handledById = (formData.get('handledById') as string) || null
  const paymentMethod = (formData.get('paymentMethod') as string) || 'VIREMENT'

  // Section 3: Purchase Commissioner Snapshot
  const commissionerName = (formData.get('commissionerName') as string) || null
  const commissionerPhone = (formData.get('commissionerPhone') as string) || null
  const commissionerCin = (formData.get('commissionerCin') as string) || null
  const commissionerAddress = (formData.get('commissionerAddress') as string) || null
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

  // Generate unique vehicle code
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
      handledById: handledById || null,
      commissionerName,
      commissionerPhone,
      commissionerCin,
      commissionerAddress,
      commissionAmount,
      commissionPaidById: commissionPaidById || null,
      paymentMethod,
      status: 'CONFIRMED',
      notes: documentNotes || 'Acquisition initiale du véhicule',
    },
  })

  // Associate documents uploaded during vehicle creation
  const documentsDataRaw = (formData.get('vehicleDocumentsData') as string) || ''
  if (documentsDataRaw) {
    try {
      const parsedDocIds = JSON.parse(documentsDataRaw) as string[]
      if (Array.isArray(parsedDocIds) && parsedDocIds.length > 0) {
        await prisma.document.updateMany({
          where: { id: { in: parsedDocIds } },
          data: {
            vehicleId: vehicle.id,
            purchaseId: purchase.id,
          },
        })
      }
    } catch (_) {}
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
  const [parks, personnelList] = await Promise.all([
    parkRepository.getAll(),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, role: { select: { name: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Nouveau Véhicule"
        subtitle="Formulaire d'entrée en stock en 4 étapes : Caractéristiques, Fournisseur, Intermédiaire et Documents"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Véhicules', href: '/vehicles' },
          { label: 'Nouveau Véhicule' },
        ]}
      />

      <form action={createVehicleAction} className="rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm space-y-8">
        {/* Section 1: Vehicle Information */}
        <div>
          <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600/20 text-red-500 font-mono text-xs">
              1
            </div>
            <Car className="h-4 w-4 text-red-500" />
            <span>Informations Véhicule & Caractéristiques</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Marque *</label>
              <input
                type="text"
                name="brand"
                required
                placeholder="Ex: Toyota, BMW, Mercedes"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Modèle *</label>
              <input
                type="text"
                name="model"
                required
                placeholder="Ex: Land Cruiser, X5, GLC"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Version / Finition</label>
              <input
                type="text"
                name="version"
                placeholder="Ex: VXR 4.0L Auto, Pack M"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Année *</label>
              <input
                type="number"
                name="year"
                required
                defaultValue={new Date().getFullYear()}
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Numéro VIN (Châssis) *</label>
              <input
                type="text"
                name="vin"
                required
                placeholder="17 caractères"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Matricule (Maroc)</label>
              <input
                type="text"
                name="matricule"
                placeholder="Ex: 12345 | A | 6"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Carburant *</label>
              <select
                name="fuelType"
                required
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="DIESEL">Diesel</option>
                <option value="ESSENCE">Essence</option>
                <option value="HYBRIDE">Hybride</option>
                <option value="HYBRIDE_RECHARGEABLE">Hybride Rechargeable</option>
                <option value="ELECTRIQUE">Électrique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Boîte de vitesses *</label>
              <select
                name="transmission"
                required
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="AUTOMATIQUE">Automatique</option>
                <option value="MANUELLE">Manuelle</option>
                <option value="SEMI_AUTO">Semi-automatique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Kilométrage (km) *</label>
              <input
                type="number"
                name="mileage"
                required
                defaultValue={0}
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Couleur Extérieure *</label>
              <input
                type="text"
                name="colorExterior"
                required
                placeholder="Ex: Blanc Nacré, Noir Saphir"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Couleur Intérieure</label>
              <input
                type="text"
                name="colorInterior"
                placeholder="Ex: Cuir Beige, Cuir Noir"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Type Carrosserie</label>
              <select
                name="bodyType"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="SUV">SUV</option>
                <option value="Berline">Berline</option>
                <option value="4x4 & Pick-up">4x4 & Pick-up</option>
                <option value="Citadine">Citadine</option>
                <option value="Coupé">Coupé</option>
                <option value="Utilitaire">Utilitaire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Prix d’Achat (MAD) *</label>
              <input
                type="number"
                name="purchasePrice"
                required
                placeholder="Ex: 220000"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-emerald-400 font-mono font-bold focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Prix de Vente Cible (MAD) *</label>
              <input
                type="number"
                name="targetSalePrice"
                required
                placeholder="Ex: 255000"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-cyan-400 font-mono font-bold focus:border-red-500 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                💡 Si un intermédiaire d&apos;achat existe (section 3), sa commission sera automatiquement ajoutée au prix de vente convenu.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-300">
                  Parc Automobile d&apos;Affectation *
                </label>
                <Link
                  href="/parks?action=new"
                  target="_blank"
                  className="text-[10px] text-red-400 hover:underline font-medium"
                >
                  + Nouveau Parc
                </Link>
              </div>
              <select
                name="parkId"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                {parks.map((p) => (
                  <option key={p.id} value={p.id}>
                    📍 {p.city} — {p.name} ({p.totalVehicles}/{p.capacity} places)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Supplier / Seller Snapshot */}
        <div>
          <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-600/20 text-cyan-400 font-mono text-xs">
              2
            </div>
            <User className="h-4 w-4 text-cyan-400" />
            <span>Fournisseur / Vendeur d’Origine (Acquisition)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom Complet / Raison Sociale *</label>
              <input
                type="text"
                name="supplierName"
                placeholder="Ex: Tariq Naciri ou Auto Import SARL"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Téléphone Fournisseur</label>
              <input
                type="text"
                name="supplierPhone"
                placeholder="06XXXXXXXX"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">CIN / ICE Fournisseur</label>
              <input
                type="text"
                name="supplierCin"
                placeholder="Ex: BK123456"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white uppercase placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Adresse / Ville Fournisseur</label>
              <input
                type="text"
                name="supplierAddress"
                placeholder="Ex: Maarif, Casablanca"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Fournisseur Payé Par (Membre du Personnel) *
              </label>
              <select
                name="handledById"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">-- Sélectionner le membre du personnel payeur --</option>
                {personnelList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.role?.name ? `(${p.role.name})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Mode de Règlement Fournisseur
              </label>
              <select
                name="paymentMethod"
                defaultValue="VIREMENT"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="VIREMENT">Virement bancaire</option>
                <option value="CHEQUE">Chèque bancaire</option>
                <option value="ESPECES">Espèces (Cash)</option>
                <option value="EFFET">Effet de commerce</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Purchase Commissioner Snapshot */}
        <div>
          <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-600/20 text-amber-400 font-mono text-xs">
              3
            </div>
            <Briefcase className="h-4 w-4 text-amber-400" />
            <span>Intermédiaire / Semsar d’Achat (Optionnel)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom Intermédiaire / Courtier</label>
              <input
                type="text"
                name="commissionerName"
                placeholder="Nom complet (laisser vide si sans courtier)"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Téléphone Courtier</label>
              <input
                type="text"
                name="commissionerPhone"
                placeholder="06XXXXXXXX"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">CIN Courtier</label>
              <input
                type="text"
                name="commissionerCin"
                placeholder="Ex: BE987654"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white uppercase placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Adresse / Ville Courtier</label>
              <input
                type="text"
                name="commissionerAddress"
                placeholder="Ex: Maârif, Casablanca"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Montant Commission (DH)</label>
              <input
                type="number"
                name="commissionAmount"
                defaultValue={0}
                placeholder="0"
                className="h-10 w-full rounded-lg border border-amber-500/30 bg-[#16161c] px-3 text-xs text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Commission Payée Par (Personnel Agence)
              </label>
              <select
                name="commissionPaidById"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="">-- Sélectionner le payeur si commission existante --</option>
                {personnelList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.role?.name ? `(${p.role.name})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Photos & Documents */}
        <div>
          <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-600/20 text-purple-400 font-mono text-xs">
              4
            </div>
            <ImageIcon className="h-4 w-4 text-purple-400" />
            <span>Photos & Documents d’Entrée en Stock</span>
          </h3>

          <div className="space-y-6">
            <VehiclePhotoUploader maxPhotos={10} />

            {/* Documents & Pièces d'Acquisition */}
            <DocumentFormUploader
              category="Achats"
              title="Pièces Justificatives d'Acquisition"
              subtitle="Carte grise barrée, acte de cession, facture d'achat, CIN vendeur ou semsar"
              fieldName="vehicleDocumentsData"
            />

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Notes & Pièces Justificatives</label>
              <textarea
                name="documentNotes"
                rows={2}
                placeholder="Mention carte grise, double de clés, carnet d'entretien, décharge..."
                className="w-full rounded-lg border border-[#282834] bg-[#16161c] p-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222228]">
          <Link
            href="/vehicles"
            className="flex h-10 items-center gap-2 rounded-lg border border-[#282834] bg-[#181820] px-4 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Annuler</span>
          </Link>
          <button
            type="submit"
            className="flex h-10 items-center gap-2 rounded-lg bg-red-600 px-6 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Enregistrer le véhicule</span>
          </button>
        </div>
      </form>
    </div>
  )
}
