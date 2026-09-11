'use client'

import React, { useState, useId, useRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import {
  Car,
  Save,
  ArrowLeft,
  User,
  Briefcase,
  Image as ImageIcon,
  ArrowLeftRight,
  ShieldAlert,
} from 'lucide-react'
import { MoroccanCityCombobox } from '@/components/ui/moroccan-city-combobox'
import { VehicleColorPicker } from '@/components/ui/vehicle-color-picker'
import { MoroccanPlateInput } from '@/components/ui'
import { VehicleTaxonomySelector } from '@/components/vehicles/vehicle-taxonomy-selector'
import { VehicleCustomsSelector } from '@/components/vehicles/vehicle-customs-selector'
import { VehiclePhotoUploader } from '@/components/vehicles/vehicle-photo-uploader'
import { DocumentFormUploader } from '@/components/documents/document-form-uploader'
import {
  VehicleRepriseForm,
  EligibleVehicle,
  PersonnelItem,
} from '@/components/vehicles/vehicle-reprise-form'

interface ParkItem {
  id: string
  name: string
  city: string
  capacity: number
  totalVehicles: number
}

interface NewVehicleFormProps {
  parks: ParkItem[]
  personnelList: PersonnelItem[]
  eligibleVehicles: EligibleVehicle[]
  action: (formData: FormData) => Promise<void>
}

export function NewVehicleForm({
  parks,
  personnelList,
  eligibleVehicles,
  action,
}: NewVehicleFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [acquisitionMode, setAcquisitionMode] = useState<'ACHAT_CLASSIQUE' | 'REPRISE'>('ACHAT_CLASSIQUE')
  const [purchasePrice, setPurchasePrice] = useState<number>(0)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [vehicleSummary, setVehicleSummary] = useState({ brand: '', model: '', year: new Date().getFullYear() })

  // Accessible IDs
  const purchasePriceId = useId()
  const targetSalePriceId = useId()
  const yearInputId = useId()
  const vinInputId = useId()
  const mileageInputId = useId()
  const fuelTypeSelectId = useId()
  const transmissionSelectId = useId()
  const bodyTypeSelectId = useId()
  const parkIdSelectId = useId()

  const handleInterceptSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setValidationError(null)

    if (acquisitionMode === 'REPRISE' && !isConfirmationOpen) {
      e.preventDefault()

      // Read current form values for validation
      const form = formRef.current
      if (!form) return

      const outgoingId = (form.elements.namedItem('outgoingVehicleId') as HTMLSelectElement)?.value
      if (!outgoingId) {
        setValidationError('Veuillez sélectionner le véhicule cédé en reprise dans la section dédiée.')
        window.scrollTo({ top: 300, behavior: 'smooth' })
        return
      }

      const brandInput = (form.elements.namedItem('brand') as HTMLInputElement)?.value || ''
      const modelInput = (form.elements.namedItem('model') as HTMLInputElement)?.value || ''
      const yearInput = parseInt((form.elements.namedItem('year') as HTMLInputElement)?.value || '2026', 10)
      setVehicleSummary({ brand: brandInput, model: modelInput, year: yearInput })

      // Open confirmation modal
      setIsConfirmationOpen(true)
    }
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleInterceptSubmit}
      className="rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm space-y-8"
    >
      {/* Validation Error Banner */}
      {validationError && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 flex items-center gap-3 text-xs text-red-300">
          <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Mode Selector & Dedicated Reprise Fields */}
      <VehicleRepriseForm
        eligibleVehicles={eligibleVehicles}
        personnelList={personnelList}
        incomingPurchasePrice={purchasePrice}
        onIncomingPriceChange={(p) => setPurchasePrice(p)}
        onModeChange={(mode) => {
          setAcquisitionMode(mode)
          setValidationError(null)
        }}
        isConfirmationOpen={isConfirmationOpen}
        setIsConfirmationOpen={setIsConfirmationOpen}
        incomingVehicleSummary={vehicleSummary}
      />

      {/* Section 1: Vehicle Information */}
      <div>
        <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600/20 text-red-500 font-mono text-xs">
            1
          </div>
          <Car className="h-4 w-4 text-red-500" />
          <span>
            {acquisitionMode === 'REPRISE'
              ? 'Informations du Nouveau Véhicule Reçu (Acquisition)'
              : 'Informations Véhicule & Caractéristiques'}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Cascading Automotive Taxonomy: Marque -> Modèle -> Version / Finition */}
          <VehicleTaxonomySelector className="col-span-1 sm:col-span-3" />

          {/* Vehicle Customs & Origin: WW Maroc vs Dédouanée */}
          <VehicleCustomsSelector className="col-span-1 sm:col-span-3" />

          {/* Moroccan License Plate (xxxxxx | x | xx) */}
          <div className="col-span-1 sm:col-span-3 rounded-xl border border-[#242430] bg-[#16161c] p-4">
            <MoroccanPlateInput name="matricule" />
          </div>

          <div>
            <label htmlFor={yearInputId} className="block text-xs font-semibold text-zinc-300 mb-1">Année *</label>
            <input
              id={yearInputId}
              type="number"
              name="year"
              required
              defaultValue={new Date().getFullYear()}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label htmlFor={vinInputId} className="block text-xs font-semibold text-zinc-300 mb-1">Numéro VIN (Châssis) *</label>
            <input
              id={vinInputId}
              type="text"
              name="vin"
              required
              placeholder="17 caractères"
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none uppercase"
            />
          </div>

          <div>
            <label htmlFor={mileageInputId} className="block text-xs font-semibold text-zinc-300 mb-1">Kilométrage (km) *</label>
            <input
              id={mileageInputId}
              type="number"
              name="mileage"
              required
              defaultValue={0}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor={fuelTypeSelectId} className="block text-xs font-semibold text-zinc-300 mb-1">Carburant *</label>
            <select
              id={fuelTypeSelectId}
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
            <label htmlFor={transmissionSelectId} className="block text-xs font-semibold text-zinc-300 mb-1">Boîte de vitesses *</label>
            <select
              id={transmissionSelectId}
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
            <VehicleColorPicker
              name="colorExterior"
              label="Couleur Extérieure"
              mode="exterior"
              required
              defaultValue="Gris Métallisé"
            />
          </div>

          <div>
            <VehicleColorPicker
              name="colorInterior"
              label="Couleur Intérieure"
              mode="interior"
              defaultValue="Standard"
            />
          </div>

          <div>
            <label htmlFor={bodyTypeSelectId} className="block text-xs font-semibold text-zinc-300 mb-1">Type Carrosserie</label>
            <select
              id={bodyTypeSelectId}
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
            <label htmlFor={purchasePriceId} className="block text-xs font-semibold text-zinc-300 mb-1">
              {acquisitionMode === 'REPRISE'
                ? "Valeur d'Acquisition Entrante (MAD) *"
                : "Prix d’Achat (MAD) *"}
            </label>
            <input
              id={purchasePriceId}
              type="number"
              name="purchasePrice"
              required
              value={purchasePrice || ''}
              onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
              placeholder="Ex: 220000"
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-emerald-400 font-mono font-bold focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor={targetSalePriceId} className="block text-xs font-semibold text-zinc-300 mb-1">Prix de Vente Cible (MAD) *</label>
            <input
              id={targetSalePriceId}
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
              <label htmlFor={parkIdSelectId} className="block text-xs font-semibold text-zinc-300">
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
              id={parkIdSelectId}
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
          <span>
            {acquisitionMode === 'REPRISE'
              ? "Cédant / Propriétaire Partenaire de l'Échange"
              : "Fournisseur / Vendeur d’Origine (Acquisition)"}
          </span>
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
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Adresse Fournisseur</label>
            <input
              type="text"
              name="supplierAddress"
              placeholder="Ex: 12 Rue des Lilas, Maarif"
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Ville Fournisseur</label>
            <MoroccanCityCombobox
              name="supplierCity"
              defaultValue="Casablanca"
              placeholder="Sélectionner la ville..."
            />
          </div>

          {acquisitionMode === 'ACHAT_CLASSIQUE' && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Section 3: Purchase Commissioner Snapshot (shown mainly for classic purchase) */}
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
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Adresse Courtier</label>
            <input
              type="text"
              name="commissionerAddress"
              placeholder="Ex: 24 Rue Ibn Sina"
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Ville Courtier</label>
            <MoroccanCityCombobox
              name="commissionerCity"
              defaultValue="Casablanca"
              placeholder="Sélectionner la ville..."
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
            subtitle="Carte grise barrée, acte de cession, facture d'achat ou contrat de reprise"
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
          className={clsx(
            'flex h-10 items-center gap-2 rounded-lg px-6 text-xs font-bold text-white shadow-lg transition-all',
            acquisitionMode === 'REPRISE'
              ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-950/50'
              : 'bg-red-600 hover:bg-red-500 shadow-red-950/50'
          )}
        >
          {acquisitionMode === 'REPRISE' ? (
            <>
              <ArrowLeftRight className="h-4 w-4" />
              <span>Vérifier et Valider la Reprise</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Enregistrer le véhicule</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
