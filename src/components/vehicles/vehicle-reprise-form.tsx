'use client'

import React, { useState, useId } from 'react'
import Image from 'next/image'
import {
  ArrowLeftRight,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Car,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import clsx from 'clsx'
import { SoulteDirection, validateExchangeFinancials } from '@/domain/vehicle'

export interface EligibleVehicle {
  id: string
  code: string
  brand: string
  model: string
  version?: string | null
  year: number
  matricule?: string | null
  mileage: number
  purchasePrice: number
  targetSalePrice: number
  status: string
  location: string
  photos?: Array<{ url: string }>
}

export interface PersonnelItem {
  id: string
  name: string
  role?: { name: string } | null
}

interface VehicleRepriseFormProps {
  eligibleVehicles: EligibleVehicle[]
  personnelList: PersonnelItem[]
  // Controlled or linked values
  incomingPurchasePrice: number
  onIncomingPriceChange: (price: number) => void
  onModeChange: (mode: 'ACHAT_CLASSIQUE' | 'REPRISE') => void
  isConfirmationOpen: boolean
  setIsConfirmationOpen: (open: boolean) => void
  incomingVehicleSummary: {
    brand: string
    model: string
    year: number
  }
}

export function VehicleRepriseForm({
  eligibleVehicles,
  personnelList,
  incomingPurchasePrice,
  onIncomingPriceChange,
  onModeChange,
  isConfirmationOpen,
  setIsConfirmationOpen,
  incomingVehicleSummary,
}: VehicleRepriseFormProps) {
  const [acquisitionMode, setAcquisitionMode] = useState<'ACHAT_CLASSIQUE' | 'REPRISE'>('ACHAT_CLASSIQUE')
  const [selectedOutgoingId, setSelectedOutgoingId] = useState<string>('')
  const [outgoingValue, setOutgoingValue] = useState<number>(0)
  const [direction, setDirection] = useState<SoulteDirection>('NONE')
  const [soulteAmount, setSoulteAmount] = useState<number>(0)
  const [soultePaymentMethod, setSoultePaymentMethod] = useState<string>('VIREMENT')
  const [handledById, setHandledById] = useState<string>('')
  const [exchangeNotes, setExchangeNotes] = useState<string>('')

  // Unique IDs for accessibility
  const outgoingVehicleSelectId = useId()
  const outgoingValueInputId = useId()
  const incomingValueInputId = useId()
  const soulteDirectionSelectId = useId()
  const soulteAmountInputId = useId()
  const soultePaymentMethodSelectId = useId()
  const handledByIdSelectId = useId()
  const exchangeNotesTextareaId = useId()

  const selectedVehicle = eligibleVehicles.find((v) => v.id === selectedOutgoingId)

  // Handle vehicle selection
  const handleSelectOutgoing = (id: string) => {
    setSelectedOutgoingId(id)
    const veh = eligibleVehicles.find((v) => v.id === id)
    if (veh) {
      // Default agreed value to the vehicle purchase price or target sale price
      const suggestedVal = veh.purchasePrice || veh.targetSalePrice || 0
      setOutgoingValue(suggestedVal)
    }
  }

  // Handle mode toggle
  const handleModeToggle = (mode: 'ACHAT_CLASSIQUE' | 'REPRISE') => {
    setAcquisitionMode(mode)
    onModeChange(mode)
  }

  // Financial equation validation
  const validation = validateExchangeFinancials({
    incomingVehicleValueDH: incomingPurchasePrice || 0,
    outgoingVehicleValueDH: outgoingValue || 0,
    direction,
    soulteAmountDH: direction === 'NONE' ? 0 : soulteAmount || 0,
  })

  // Auto-calculate helper: computes soulte direction and amount from incoming and outgoing values
  const handleAutoAdjustSoulte = () => {
    const inc = incomingPurchasePrice || 0
    const out = outgoingValue || 0
    const diff = inc - out

    if (diff === 0) {
      setDirection('NONE')
      setSoulteAmount(0)
    } else if (diff > 0) {
      setDirection('COMPANY_TO_SUPPLIER')
      setSoulteAmount(diff)
    } else {
      setDirection('SUPPLIER_TO_COMPANY')
      setSoulteAmount(Math.abs(diff))
    }
  }

  // Auto-adjust incoming value to match outgoing + soulte
  const handleAlignIncomingValue = () => {
    if (validation.expectedIncomingValue >= 0) {
      onIncomingPriceChange(validation.expectedIncomingValue)
    }
  }

  return (
    <div className="space-y-6">
      {/* Hidden input to pass acquisition mode to Server Action */}
      <input type="hidden" name="acquisitionMode" value={acquisitionMode} />

      {/* Mode d'Acquisition Toggle Banner */}
      <div className="rounded-2xl border border-[#222228] bg-[#14141a] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600/20 text-red-500 font-mono text-xs font-bold">
                ★
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Mode d&apos;Acquisition du Véhicule
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Précisez si ce véhicule entre dans le parc par un achat direct classique ou dans le cadre d&apos;une reprise / échange de véhicule.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#0c0c10] p-1.5 border border-[#242430] shrink-0">
            <button
              type="button"
              onClick={() => handleModeToggle('ACHAT_CLASSIQUE')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all',
                acquisitionMode === 'ACHAT_CLASSIQUE'
                  ? 'bg-zinc-200 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Achat classique</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeToggle('REPRISE')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all',
                acquisitionMode === 'REPRISE'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              )}
            >
              <ArrowLeftRight className="h-4 w-4 text-amber-300" />
              <span>Reprise / Échange</span>
              <span className="rounded-full bg-amber-400/20 text-amber-300 px-1.5 py-0.2 text-[9px] font-mono">
                SOULTE
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* REPRISE / ÉCHANGE Dedicated Section */}
      {acquisitionMode === 'REPRISE' && (
        <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-[#181512] via-[#121216] to-[#121216] p-6 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <ArrowLeftRight className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Dossier de Reprise & Échange</h3>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    Transaction Liée
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Échange d&apos;un véhicule actif du parc contre le nouveau véhicule entrant, avec ou sans ajustement financier (soulte).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/40 px-3 py-1.5 rounded-lg border border-[#282834]">
              <span>Éligibles :</span>
              <strong className="text-amber-400 font-bold">{eligibleVehicles.length}</strong>
              <span>véhicules en stock</span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Outgoing Vehicle Selection */}
            <div className="space-y-4">
              <div>
                <label htmlFor={outgoingVehicleSelectId} className="block text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span>A. Véhicule Cédé / Donné en Échange *</span>
                  <span className="text-[10px] font-normal text-zinc-400">
                    Uniquement véhicules actifs &apos;En Stock&apos;
                  </span>
                </label>

                {eligibleVehicles.length > 0 ? (
                  <select
                    id={outgoingVehicleSelectId}
                    name="outgoingVehicleId"
                    required={acquisitionMode === 'REPRISE'}
                    value={selectedOutgoingId}
                    onChange={(e) => handleSelectOutgoing(e.target.value)}
                    className="h-11 w-full rounded-xl border border-amber-500/40 bg-[#181820] px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">-- Sélectionner le véhicule à céder du parc --</option>
                    {eligibleVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.year}) — {v.matricule || v.code} — {v.mileage.toLocaleString('fr-MA')} km — Valeur: {v.purchasePrice.toLocaleString('fr-MA')} DH
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-300">
                    ⚠️ Aucun véhicule actif éligible en stock. Tous les véhicules sont soit réservés, en réparation, vendus ou archivés.
                  </div>
                )}
              </div>

              {/* Selected Vehicle Snapshot Card */}
              {selectedVehicle && (
                <div className="rounded-xl border border-[#282834] bg-[#16161e] p-4 flex gap-4 items-center">
                  <div className="relative h-16 w-20 rounded-lg bg-[#0c0c10] overflow-hidden shrink-0 border border-[#2a2a38]">
                    {selectedVehicle.photos && selectedVehicle.photos[0] ? (
                      <Image
                        src={selectedVehicle.photos[0].url}
                        alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <Car className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-xs flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white truncate">
                        {selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.version || ''}
                      </h4>
                      <span className="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                        EN STOCK
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 text-[11px] text-zinc-400 font-mono">
                      <span>Année: <strong className="text-zinc-200">{selectedVehicle.year}</strong></span>
                      <span>Matricule: <strong className="text-zinc-200">{selectedVehicle.matricule || 'N/A'}</strong></span>
                      <span>Km: <strong className="text-zinc-200">{selectedVehicle.mileage.toLocaleString('fr-MA')}</strong></span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Prix d&apos;acquisition d&apos;origine : <strong className="text-emerald-400 font-mono font-bold">{selectedVehicle.purchasePrice.toLocaleString('fr-MA')} DH</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* B. Outgoing Agreed Value */}
              <div>
                <label htmlFor={outgoingValueInputId} className="block text-xs font-bold text-zinc-200 mb-1">
                  B. Valeur Convenue du Véhicule Cédé (MAD / DH) *
                </label>
                <div className="relative">
                  <input
                    id={outgoingValueInputId}
                    type="number"
                    name="outgoingVehicleValue"
                    required={acquisitionMode === 'REPRISE'}
                    min={0}
                    step={100}
                    value={outgoingValue || ''}
                    onChange={(e) => setOutgoingValue(parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 550000"
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs font-mono font-bold text-amber-400 focus:border-amber-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-500 font-bold">DH</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Valeur de reprise accordée au client / fournisseur pour son véhicule.
                </p>
              </div>

              {/* C. Incoming Vehicle Acquisition Value (Sync reminder) */}
              <div>
                <label htmlFor={incomingValueInputId} className="block text-xs font-bold text-zinc-200 mb-1">
                  C. Valeur d&apos;Acquisition du Nouveau Véhicule (MAD / DH) *
                </label>
                <div className="relative">
                  <input
                    id={incomingValueInputId}
                    type="number"
                    name="incomingVehicleValue"
                    required={acquisitionMode === 'REPRISE'}
                    min={0}
                    step={100}
                    value={incomingPurchasePrice || ''}
                    onChange={(e) => onIncomingPriceChange(parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 650000"
                    className="h-10 w-full rounded-lg border border-emerald-500/40 bg-[#16161c] px-3 text-xs font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-500 font-bold">DH</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Synchronisé avec le prix d&apos;achat officiel du véhicule entrant (Section 1).
                </p>
              </div>
            </div>

            {/* Right Column: Soulte and Operation Actors */}
            <div className="space-y-4">
              {/* D. Soulte Direction */}
              <div>
                <label htmlFor={soulteDirectionSelectId} className="block text-xs font-bold text-zinc-200 mb-1">
                  D. Direction de la Soulte (Ajustement financier) *
                </label>
                <select
                  id={soulteDirectionSelectId}
                  name="cashAdjustmentDirection"
                  value={direction}
                  onChange={(e) => {
                    const dir = e.target.value as SoulteDirection
                    setDirection(dir)
                    if (dir === 'NONE') setSoulteAmount(0)
                  }}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none font-semibold"
                >
                  <option value="NONE">Aucune soulte (Échange direct valeur pour valeur)</option>
                  <option value="COMPANY_TO_SUPPLIER">
                    MAALAL CARS paie le fournisseur (Complément décaissé)
                  </option>
                  <option value="SUPPLIER_TO_COMPANY">
                    Le fournisseur paie MAALAL CARS (Complément encaissé)
                  </option>
                </select>
              </div>

              {/* E. Soulte Amount (visible if direction !== NONE) */}
              {direction !== 'NONE' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={soulteAmountInputId} className="block text-xs font-bold text-zinc-200">
                      E. Montant de la Soulte (MAD / DH) *
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoAdjustSoulte}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Ajuster selon la différence</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id={soulteAmountInputId}
                      type="number"
                      name="cashAdjustmentAmount"
                      min={0}
                      step={100}
                      required
                      value={soulteAmount || ''}
                      onChange={(e) => setSoulteAmount(parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 100000"
                      className="h-10 w-full rounded-lg border border-amber-500/50 bg-[#16161c] px-3 text-xs font-mono font-bold text-amber-400 focus:border-amber-400 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-zinc-500 font-bold">DH</span>
                  </div>
                </div>
              )}

              {/* F. Soulte Payment Method (visible if direction !== NONE) */}
              {direction !== 'NONE' && (
                <div>
                  <label htmlFor={soultePaymentMethodSelectId} className="block text-xs font-bold text-zinc-200 mb-1">
                    F. Mode de Paiement de la Soulte *
                  </label>
                  <select
                    id={soultePaymentMethodSelectId}
                    name="soultePaymentMethod"
                    value={soultePaymentMethod}
                    onChange={(e) => setSoultePaymentMethod(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="VIREMENT">Virement bancaire</option>
                    <option value="ESPECES">Espèces (Cash)</option>
                    <option value="CHEQUE">Chèque bancaire certifié</option>
                    <option value="AUTRE">Autre mode convenu</option>
                  </select>
                </div>
              )}

              {/* G. Personnel / Handled By */}
              <div>
                <label htmlFor={handledByIdSelectId} className="block text-xs font-bold text-zinc-200 mb-1">
                  G. Opération Effectuée & Validée Par (Personnel de l&apos;Agence) *
                </label>
                <select
                  id={handledByIdSelectId}
                  name="exchangeHandledById"
                  value={handledById}
                  onChange={(e) => setHandledById(e.target.value)}
                  required={acquisitionMode === 'REPRISE'}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Sélectionner le collaborateur responsable --</option>
                  {personnelList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.role?.name ? `(${p.role.name})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-400 mt-1">
                  {direction === 'COMPANY_TO_SUPPLIER'
                    ? 'Membre du personnel ayant ordonnancé ou remis le paiement de la soulte.'
                    : direction === 'SUPPLIER_TO_COMPANY'
                    ? 'Membre du personnel ayant réceptionné et encaissé la soulte.'
                    : 'Conseiller commercial ou responsable ayant formalisé l’échange.'}
                </p>
              </div>

              {/* H. Notes */}
              <div>
                <label htmlFor={exchangeNotesTextareaId} className="block text-xs font-semibold text-zinc-300 mb-1">
                  H. Notes Spécifiques sur la Reprise (Optionnel)
                </label>
                <textarea
                  id={exchangeNotesTextareaId}
                  name="exchangeNotes"
                  rows={2}
                  value={exchangeNotes}
                  onChange={(e) => setExchangeNotes(e.target.value)}
                  placeholder="Accords particuliers, état du véhicule repris, modalité de livraison..."
                  className="w-full rounded-lg border border-[#282834] bg-[#16161c] p-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Live Financial Consistency Status Card */}
          <div
            className={clsx(
              'rounded-xl border p-4 transition-all',
              validation.isValid
                ? 'border-emerald-500/40 bg-emerald-950/20'
                : 'border-red-500/50 bg-red-950/30'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                {validation.isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={clsx(
                        'text-xs font-bold uppercase tracking-wider',
                        validation.isValid ? 'text-emerald-300' : 'text-red-300'
                      )}
                    >
                      {validation.isValid
                        ? 'Équation Financière Validée'
                        : 'Incohérence Financière Détectée'}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5 font-mono">
                    {incomingPurchasePrice.toLocaleString('fr-MA')} DH (Entrant) ={' '}
                    {outgoingValue.toLocaleString('fr-MA')} DH (Cédé){' '}
                    {direction === 'COMPANY_TO_SUPPLIER' && `+ ${soulteAmount.toLocaleString('fr-MA')} DH (Soulte versée)`}
                    {direction === 'SUPPLIER_TO_COMPANY' && `- ${soulteAmount.toLocaleString('fr-MA')} DH (Soulte reçue)`}
                    {direction === 'NONE' && '± 0 DH (Sans soulte)'}
                  </p>
                  {!validation.isValid && (
                    <p className="text-[11px] text-red-300 mt-1">{validation.errorMessage}</p>
                  )}
                </div>
              </div>

              {!validation.isValid && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAutoAdjustSoulte}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-colors shadow-sm"
                  >
                    Ajuster la soulte ({Math.abs(incomingPurchasePrice - outgoingValue).toLocaleString('fr-MA')} DH)
                  </button>
                  <button
                    type="button"
                    onClick={handleAlignIncomingValue}
                    className="px-3 py-1.5 rounded-lg bg-[#242430] hover:bg-[#2c2c3c] text-xs font-bold text-zinc-200 transition-colors"
                  >
                    Ajuster valeur entrant ({validation.expectedIncomingValue.toLocaleString('fr-MA')} DH)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Summary Modal (Section 14) */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-amber-500/40 bg-[#14141a] p-6 shadow-2xl space-y-6">
            {/* Modal Title */}
            <div className="flex items-center gap-3 border-b border-[#282834] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-lg shadow-amber-950/40">
                <ArrowLeftRight className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Confirmation de la Reprise / Échange
                </h3>
                <p className="text-xs text-zinc-400">
                  Vérifiez le bilan de la transaction avant engagement comptable et archivage définitif.
                </p>
              </div>
            </div>

            {/* Exchange Breakdown Cards */}
            <div className="space-y-3">
              {/* MAALAL CARS CÈDE */}
              <div className="rounded-xl border border-red-500/30 bg-red-950/15 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                    MAALAL CARS CÈDE (Véhicule du Parc)
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.year})
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    Matricule : {selectedVehicle?.matricule || selectedVehicle?.code}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block">Valeur convenue</span>
                  <span className="text-base font-bold font-mono text-red-400">
                    {outgoingValue.toLocaleString('fr-MA')} DH
                  </span>
                </div>
              </div>

              {/* MAALAL CARS REÇOIT */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    MAALAL CARS REÇOIT (Nouveau Véhicule)
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {incomingVehicleSummary.brand || 'Nouveau Véhicule'} {incomingVehicleSummary.model || ''} ({incomingVehicleSummary.year})
                  </h4>
                  <p className="text-xs text-zinc-400">Entrée en stock actif showroom</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block">Valeur d&apos;acquisition</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {incomingPurchasePrice.toLocaleString('fr-MA')} DH
                  </span>
                </div>
              </div>

              {/* SOULTE SUMMARY */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    SOULTE (Règlement Financier Complémentaire)
                  </span>
                  <p className="text-xs text-zinc-200 mt-0.5 font-semibold">
                    {direction === 'COMPANY_TO_SUPPLIER' && 'MAALAL CARS → Fournisseur'}
                    {direction === 'SUPPLIER_TO_COMPANY' && 'Fournisseur → MAALAL CARS'}
                    {direction === 'NONE' && 'Aucune soulte (Échange équilibré)'}
                  </p>
                  {direction !== 'NONE' && (
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Mode : {soultePaymentMethod}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block">Montant</span>
                  <span className="text-base font-bold font-mono text-amber-400">
                    {direction === 'NONE' ? '0 DH' : `${soulteAmount.toLocaleString('fr-MA')} DH`}
                  </span>
                </div>
              </div>

              {/* POST-VALIDATION CONSEQUENCES */}
              <div className="rounded-xl border border-[#262634] bg-[#101016] p-4 text-xs space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  APRÈS VALIDATION ATOMIQUE
                </span>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/20">
                    <strong className="text-white block truncate">{selectedVehicle?.brand} {selectedVehicle?.model}</strong>
                    <span className="text-red-300 font-semibold font-mono">→ ÉCHANGÉ / ARCHIVÉ</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <strong className="text-white block truncate">{incomingVehicleSummary.brand || 'Nouveau Véhicule'} {incomingVehicleSummary.model}</strong>
                    <span className="text-emerald-300 font-semibold font-mono">→ EN STOCK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#282834]">
              <button
                type="button"
                onClick={() => setIsConfirmationOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#2e2e3e] bg-[#181822] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Modifier les informations
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-xs font-bold text-white shadow-lg shadow-red-950/50 transition-all"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Confirmer et Acter la Reprise</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
