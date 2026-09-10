'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Camera,
  User,
  CreditCard,
  UserCheck,
  FileText,
  Sparkles,
  ArrowRight,
  Edit3,
  X,
} from 'lucide-react'
import type { VehicleCompletenessResult } from '@/services/vehicle-completeness.service'
import { completeAcquisitionDossierAction } from '@/app/vehicles/[id]/actions'
import { MoroccanCityCombobox } from '@/components/ui/moroccan-city-combobox'
import { VehicleColorPicker } from '@/components/ui/vehicle-color-picker'

interface PersonnelOption {
  id: string
  name: string
}

interface BulkImportUrgentBannerProps {
  vehicleId: string
  vehicleCode: string
  completeness: VehicleCompletenessResult
  personnelList: PersonnelOption[]
  vehicleData?: {
    vin: string
    brand: string
    model: string
    colorExterior: string
    mileage?: number | null
    purchasePrice?: number | null
  } | null
  currentPurchase?: {
    id: string
    supplierName?: string | null
    supplierPhone?: string | null
    supplierCin?: string | null
    supplierAddress?: string | null
    supplierCity?: string | null
    handledById?: string | null
    paymentMethod?: string | null
    commissionerName?: string | null
    commissionerPhone?: string | null
    commissionerCin?: string | null
    commissionerAddress?: string | null
    commissionerCity?: string | null
    commissionAmount?: number | null
    commissionPaidById?: string | null
    hasCommissioner?: boolean | null
  } | null
  initialOpen?: boolean
}

export function BulkImportUrgentBanner({
  vehicleId,
  vehicleCode,
  completeness,
  personnelList,
  vehicleData,
  currentPurchase,
  initialOpen = false,
}: BulkImportUrgentBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(initialOpen)
  const [hasComm, setHasComm] = useState<boolean>(
    currentPurchase?.hasCommissioner === true ||
      Boolean(
        currentPurchase?.commissionerName &&
          currentPurchase.commissionerName !== 'SANS' &&
          !currentPurchase.commissionerName.toLowerCase().includes('sans')
      )
  )

  // If not a bulk import vehicle, don't show the banner
  if (!completeness.isBulkImport) {
    return null
  }

  // If bulk import but 100% complete, show a discrete success confirmation
  if (completeness.isComplete) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Dossier d&apos;import groupé complet et conforme</h4>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Informations et acteurs validés
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Photos, caractéristiques du véhicule, fournisseur, payeur, courtier et documents officiels sont à jour.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-700 bg-[#16161c] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Modifier l&apos;acquisition</span>
        </button>

        {isModalOpen && renderModal()}
      </div>
    )
  }

  const { items, completedCount, totalRequired, missingCount, defFields, hasDefaultedFields, defaultedCount } = completeness
  const progressPercent = Math.round((completedCount / totalRequired) * 100)

  function renderModal() {
    const handleAction = completeAcquisitionDossierAction.bind(null, vehicleId)

    const isVinDef = vehicleData?.vin?.startsWith('def-') || defFields.some((f) => f.key === 'vin' && f.isDefaulted)
    const isBrandDef = vehicleData?.brand === 'def-Marque' || defFields.some((f) => f.key === 'brand' && f.isDefaulted)
    const isModelDef = vehicleData?.model === 'def-Modèle' || defFields.some((f) => f.key === 'model' && f.isDefaulted)
    const isColorDef = vehicleData?.colorExterior === 'def-Couleur' || defFields.some((f) => f.key === 'colorExterior' && f.isDefaulted)

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
        <div className="relative w-full max-w-2xl rounded-3xl border border-red-500/40 bg-[#141216] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between border-b border-[#28242c] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Compléter le dossier d&apos;acquisition — {vehicleCode}
                </h3>
                <p className="text-xs text-zinc-400">
                  Renseignez les données réelles du véhicule et les acteurs d&apos;achat pour clore l&apos;alerte d&apos;urgence.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form action={handleAction} className="space-y-5">
            {/* Section 0: Données Techniques Initialisées par Défaut (def-) */}
            {(hasDefaultedFields || vehicleData) && (
              <div className="space-y-3 rounded-2xl border-2 border-red-500/60 bg-[#1f1014] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wide">
                    <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
                    <span>0. Données du Véhicule (Remplacement des valeurs def-)</span>
                  </div>
                  {hasDefaultedFields && (
                    <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                      {defaultedCount} à remplacer
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Code VIN (Châssis — 17 caractères){' '}
                      {isVinDef && <span className="text-red-400 font-mono text-[10px]">[Provisoire : def-VIN]</span>}
                    </label>
                    <input
                      type="text"
                      name="vin"
                      maxLength={17}
                      defaultValue={vehicleData?.vin || ''}
                      placeholder="Ex: VF1BB0A0F12345678"
                      className={`h-9 w-full rounded-xl border px-3 text-xs uppercase font-mono text-white focus:outline-none focus:ring-1 ${
                        isVinDef
                          ? 'border-red-500 bg-red-950/30 text-amber-200 focus:ring-red-500'
                          : 'border-[#33303c] bg-[#121016] focus:ring-cyan-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Marque{' '}
                      {isBrandDef && <span className="text-red-400 font-mono text-[10px]">[À renseigner]</span>}
                    </label>
                    <input
                      type="text"
                      name="brand"
                      defaultValue={vehicleData?.brand && vehicleData.brand !== 'def-Marque' ? vehicleData.brand : ''}
                      placeholder="Ex: Renault, Peugeot, Volkswagen..."
                      className={`h-9 w-full rounded-xl border px-3 text-xs text-white focus:outline-none focus:ring-1 ${
                        isBrandDef
                          ? 'border-red-500 bg-red-950/30 text-amber-200 focus:ring-red-500'
                          : 'border-[#33303c] bg-[#121016] focus:ring-cyan-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Modèle{' '}
                      {isModelDef && <span className="text-red-400 font-mono text-[10px]">[À renseigner]</span>}
                    </label>
                    <input
                      type="text"
                      name="model"
                      defaultValue={vehicleData?.model && vehicleData.model !== 'def-Modèle' ? vehicleData.model : ''}
                      placeholder="Ex: Clio 5, Golf 8, Tucson..."
                      className={`h-9 w-full rounded-xl border px-3 text-xs text-white focus:outline-none focus:ring-1 ${
                        isModelDef
                          ? 'border-red-500 bg-red-950/30 text-amber-200 focus:ring-red-500'
                          : 'border-[#33303c] bg-[#121016] focus:ring-cyan-500'
                      }`}
                    />
                  </div>

                  <div>
                    <VehicleColorPicker
                      name="colorExterior"
                      label={isColorDef ? 'Couleur Extérieure [À renseigner]' : 'Couleur Extérieure'}
                      mode="exterior"
                      defaultValue={vehicleData?.colorExterior && vehicleData.colorExterior !== 'def-Couleur' ? vehicleData.colorExterior : ''}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Kilométrage (km)</label>
                    <input
                      type="number"
                      name="mileage"
                      defaultValue={vehicleData?.mileage ?? ''}
                      placeholder="Ex: 45000"
                      className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Prix d&apos;Achat (DH)</label>
                    <input
                      type="number"
                      name="purchasePrice"
                      defaultValue={vehicleData?.purchasePrice ?? ''}
                      placeholder="Ex: 140000"
                      className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 1: Fournisseur */}
            <div className="space-y-3 rounded-2xl border border-[#282834] bg-[#1a1820] p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wide">
                <User className="h-4 w-4" />
                <span>1. Fournisseur / Vendeur d&apos;Origine</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Nom du Fournisseur / Particulier <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="supplierName"
                    required
                    defaultValue={currentPurchase?.supplierName || ''}
                    placeholder="Ex: Auto Nejma / Ahmed Benali"
                    className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Téléphone</label>
                  <input
                    type="text"
                    name="supplierPhone"
                    defaultValue={currentPurchase?.supplierPhone || ''}
                    placeholder="06XXXXXXXX"
                    className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">CIN / ICE</label>
                  <input
                    type="text"
                    name="supplierCin"
                    defaultValue={currentPurchase?.supplierCin || ''}
                    placeholder="CIN ou ICE"
                    className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white uppercase focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Adresse (Rue, Quartier)</label>
                  <input
                    type="text"
                    name="supplierAddress"
                    defaultValue={currentPurchase?.supplierAddress || ''}
                    placeholder="Ex: Bd Zerktouni, Maârif"
                    className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <MoroccanCityCombobox
                    name="supplierCity"
                    label="Ville du Fournisseur"
                    defaultValue={currentPurchase?.supplierCity || 'Casablanca'}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Qui a payé le fournisseur */}
            <div className="space-y-3 rounded-2xl border border-[#282834] bg-[#1a1820] p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                <CreditCard className="h-4 w-4" />
                <span>2. Règlement Fournisseur & Collaborateur Payeur</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Fournisseur payé par (Collaborateur) <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="handledById"
                    required
                    defaultValue={currentPurchase?.handledById || ''}
                    className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">Sélectionnez le collaborateur ayant réglé l&apos;achat...</option>
                    {personnelList.map((p) => (
                      <option key={p.id} value={p.id}>
                        👤 {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Mode de règlement</label>
                  <select
                    name="paymentMethod"
                    defaultValue={currentPurchase?.paymentMethod || 'VIREMENT'}
                    className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="VIREMENT">Virement bancaire</option>
                    <option value="CHEQUE">Chèque</option>
                    <option value="ESPECES">Espèces</option>
                    <option value="EFFET">Effet de commerce</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Commissionnaire / Semsar */}
            <div className="space-y-3 rounded-2xl border border-[#282834] bg-[#1a1820] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wide">
                  <UserCheck className="h-4 w-4" />
                  <span>3. Intermédiaire / Courtier (Semsar)</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="commissionerOption"
                      value="NONE"
                      checked={!hasComm}
                      onChange={() => setHasComm(false)}
                      className="accent-purple-500"
                    />
                    <span className="text-zinc-300 font-semibold">Sans intermédiaire (Direct)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="commissionerOption"
                      value="WITH_COMMISSIONER"
                      checked={hasComm}
                      onChange={() => setHasComm(true)}
                      className="accent-purple-500"
                    />
                    <span className="text-zinc-300 font-semibold">Avec courtier (Semsar)</span>
                  </label>
                </div>
              </div>

              {hasComm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2a2632] text-xs">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Nom du courtier <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="commissionerName"
                      required={hasComm}
                      defaultValue={currentPurchase?.commissionerName || ''}
                      placeholder="Nom du semsar"
                      className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Téléphone courtier</label>
                    <input
                      type="text"
                      name="commissionerPhone"
                      defaultValue={currentPurchase?.commissionerPhone || ''}
                      placeholder="06XXXXXXXX"
                      className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Adresse courtier</label>
                    <input
                      type="text"
                      name="commissionerAddress"
                      defaultValue={currentPurchase?.commissionerAddress || ''}
                      placeholder="Ex: Bd d'Anfa"
                      className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <MoroccanCityCombobox
                      name="commissionerCity"
                      label="Ville du Courtier"
                      defaultValue={currentPurchase?.commissionerCity || 'Casablanca'}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Montant commission (DH)
                    </label>
                    <input
                      type="number"
                      name="commissionAmount"
                      defaultValue={currentPurchase?.commissionAmount || 0}
                      className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-amber-400 font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Commission payée par (Collaborateur)
                    </label>
                    <select
                      name="commissionPaidById"
                      defaultValue={currentPurchase?.commissionPaidById || ''}
                      className="h-9 w-full rounded-xl border border-[#33303c] bg-[#121016] px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="">Sélectionnez le collaborateur ayant réglé la commission...</option>
                      {personnelList.map((p) => (
                        <option key={p.id} value={p.id}>
                          👤 {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28242c]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-10 px-4 rounded-xl border border-[#33303c] bg-[#1a1820] text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-bold text-white shadow-lg transition-all"
              >
                Enregistrer les informations d&apos;achat
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border-2 border-red-500/80 bg-gradient-to-r from-red-950/40 via-[#180e12] to-red-950/30 p-5 sm:p-6 shadow-[0_0_30px_rgba(239,68,68,0.25)] space-y-5 animate-in fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-500/20 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30 shrink-0">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="rounded-lg bg-red-600 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow">
                Mise à jour urgente
              </span>
              <span className="text-xs font-mono font-bold text-zinc-300">
                Véhicule issu d&apos;un import groupé Excel
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              Dossier Incomplet ({missingCount} manquante{missingCount > 1 ? 's' : ''}) — Complétion requise
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              Ce véhicule reste marqué en alerte rouge tant que ses pièces et acteurs d&apos;acquisition ne sont pas tous renseignés.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-bold text-white shadow-lg shadow-red-600/30 hover:scale-[1.02] transition-all shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Compléter le dossier d&apos;achat</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-300">
            Avancement des informations obligatoires :
          </span>
          <span className="font-mono font-bold text-red-400">
            {completedCount} sur {totalRequired} complétés ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-black/50 border border-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Defaulted def- Fields Alert Box */}
      {hasDefaultedFields && (
        <div className="rounded-2xl border-2 border-red-500/80 bg-red-950/30 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse shrink-0" />
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                Données du véhicule initialisées par défaut (def-) à remplacer :
              </h4>
            </div>
            <span className="rounded-md bg-red-600/30 border border-red-500/60 px-2 py-0.5 text-[10px] font-mono font-bold text-red-200 shrink-0">
              {defaultedCount} information{defaultedCount > 1 ? 's' : ''} manquante{defaultedCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {defFields
              .filter((f) => f.isDefaulted)
              .map((f) => (
                <div
                  key={f.key}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/50 bg-black/50 px-3 py-1.5 text-xs text-red-200"
                >
                  <span className="font-bold text-red-400">⚠️ {f.label} :</span>
                  <span className="font-mono font-bold text-white bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
                    {f.currentValue}
                  </span>
                </div>
              ))}
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1.5 underline pt-1 transition-colors"
          >
            <span>Remplacer ces valeurs par les vraies caractéristiques du véhicule</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 5 Cards Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Photos */}
        <div
          className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
            items.images.satisfied
              ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-300'
              : 'border-red-500/40 bg-red-950/20 text-red-300'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Camera className="h-4 w-4 text-zinc-300" />
              {items.images.satisfied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
            <h4 className="text-xs font-bold text-white">1. Photos</h4>
            <p className="text-[11px] text-zinc-400 line-clamp-2">{items.images.details}</p>
          </div>
          <Link
            href={`/vehicles/${vehicleId}?tab=documents`}
            className="mt-3 text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>{items.images.satisfied ? 'Gérer photos' : '+ Ajouter photos'}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* 2. Fournisseur */}
        <div
          className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
            items.supplier.satisfied
              ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-300'
              : 'border-red-500/40 bg-red-950/20 text-red-300'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <User className="h-4 w-4 text-zinc-300" />
              {items.supplier.satisfied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
            <h4 className="text-xs font-bold text-white">2. Fournisseur</h4>
            <p className="text-[11px] text-zinc-400 line-clamp-2">{items.supplier.details}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 text-left"
          >
            <span>{items.supplier.satisfied ? 'Modifier' : '+ Renseigner'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* 3. Qui a payé */}
        <div
          className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
            items.whoPaid.satisfied
              ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-300'
              : 'border-red-500/40 bg-red-950/20 text-red-300'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <CreditCard className="h-4 w-4 text-zinc-300" />
              {items.whoPaid.satisfied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
            <h4 className="text-xs font-bold text-white">3. Payé par</h4>
            <p className="text-[11px] text-zinc-400 line-clamp-2">{items.whoPaid.details}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 text-left"
          >
            <span>{items.whoPaid.satisfied ? 'Modifier' : '+ Assigner payeur'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* 4. Courtier / Semsar */}
        <div
          className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
            items.commissioner.satisfied
              ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-300'
              : 'border-red-500/40 bg-red-950/20 text-red-300'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <UserCheck className="h-4 w-4 text-zinc-300" />
              {items.commissioner.satisfied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
            <h4 className="text-xs font-bold text-white">4. Courtier (Semsar)</h4>
            <p className="text-[11px] text-zinc-400 line-clamp-2">{items.commissioner.details}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1 text-left"
          >
            <span>{items.commissioner.satisfied ? 'Modifier statut' : '+ Déclarer statut'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* 5. Documents */}
        <div
          className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
            items.documents.satisfied
              ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-300'
              : 'border-red-500/40 bg-red-950/20 text-red-300'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <FileText className="h-4 w-4 text-zinc-300" />
              {items.documents.satisfied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
            <h4 className="text-xs font-bold text-white">5. Documents</h4>
            <p className="text-[11px] text-zinc-400 line-clamp-2">{items.documents.details}</p>
          </div>
          <Link
            href={`/vehicles/${vehicleId}?tab=documents`}
            className="mt-3 text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>{items.documents.satisfied ? 'Gérer documents' : '+ Joindre pièces'}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {isModalOpen && renderModal()}
    </div>
  )
}
