'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Car,
  User,
  DollarSign,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
} from 'lucide-react'
import { RepairPromptModal, RepairFormValues } from './repair-prompt-modal'
import { DocumentFormUploader } from '@/components/documents/document-form-uploader'
import { attachDocumentsAction } from '@/app/documents/actions'
import { MoroccanCityCombobox } from '@/components/ui/moroccan-city-combobox'

interface VehicleOption {
  id: string
  code: string
  brand: string
  model: string
  year: number
  matricule: string | null
  purchasePrice?: number
  targetSalePrice: number
  status: string
  purchases?: { commissionAmount: number }[]
  repairs?: {
    id: string
    repairType: string
    estimatedAmount: number | null
    finalAmount: number | null
    status: string
  }[]
}

interface ReservationData {
  id: string
  code: string
  clientName: string | null
  clientPhone: string | null
  clientCin: string | null
  clientAddress: string | null
  depositAmount: number
  paymentMethod: string
  vehicleId: string
}

interface SaleFormProps {
  availableVehicles: VehicleOption[]
  initialReservation?: ReservationData | null
  preselectedVehicleId?: string
  personnelList?: { id: string; name: string }[]
}

export function SaleForm({
  availableVehicles,
  initialReservation,
  preselectedVehicleId,
  personnelList = [],
}: SaleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saleDocIds, setSaleDocIds] = useState<string[]>([])

  // Selected vehicle state
  const defaultVehicleId =
    initialReservation?.vehicleId ||
    preselectedVehicleId ||
    (availableVehicles[0]?.id ?? '')

  const [selectedVehicleId, setSelectedVehicleId] = useState(defaultVehicleId)

  const currentVehicle = availableVehicles.find((v) => v.id === selectedVehicleId)

  // Financial fields
  const defaultPrice = currentVehicle?.targetSalePrice || 250000
  const [basePrice, setBasePrice] = useState<number>(defaultPrice)
  const [salePrice, setSalePrice] = useState<number>(defaultPrice)
  const advanceAmount = initialReservation?.depositAmount || 0
  const [amountReceived, setAmountReceived] = useState<number>(
    Math.max(0, defaultPrice - advanceAmount)
  )
  const [paymentMethod, setPaymentMethod] = useState<string>('VIREMENT')
  const discountAmount = 0
  const additionalFees = 0

  // Buyer snapshot
  const [buyerName, setBuyerName] = useState(initialReservation?.clientName || '')
  const [buyerPhone, setBuyerPhone] = useState(initialReservation?.clientPhone || '')
  const [buyerCin, setBuyerCin] = useState(initialReservation?.clientCin || '')
  const [buyerAddress, setBuyerAddress] = useState(initialReservation?.clientAddress || '')
  const [buyerCity, setBuyerCity] = useState('Casablanca')

  // Commissioner snapshot
  const [hasCommissioner, setHasCommissioner] = useState(false)
  const [commissionerName, setCommissionerName] = useState('')
  const [commissionerPhone, setCommissionerPhone] = useState('')
  const [commissionerCin, setCommissionerCin] = useState('')
  const [commissionerAddress, setCommissionerAddress] = useState('')
  const [commissionerCity, setCommissionerCity] = useState('Casablanca')
  const [commissionAmount, setCommissionAmount] = useState(0)
  const [commissionPaidById, setCommissionPaidById] = useState('')
  const [receivedById, setReceivedById] = useState('')
  const [notes, setNotes] = useState('')
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false)

  // Vehicle cost components breakdown
  const buyCommission = currentVehicle?.purchases?.[0]?.commissionAmount || 0
  const repairsTotal =
    currentVehicle?.repairs?.reduce(
      (sum, r) => sum + (r.finalAmount ?? r.estimatedAmount ?? 0),
      0
    ) || 0

  // Live financial calculations
  const remainingDue = Math.max(0, salePrice - advanceAmount - amountReceived - discountAmount + additionalFees)

  const handleVehicleChange = (vId: string) => {
    setSelectedVehicleId(vId)
    const veh = availableVehicles.find((v) => v.id === vId)
    if (veh) {
      const newBase = veh.targetSalePrice
      setBasePrice(newBase)
      const newSalePrice = newBase + (hasCommissioner ? commissionAmount : 0)
      setSalePrice(newSalePrice)
      setAmountReceived(Math.max(0, newSalePrice - advanceAmount))
    }
  }

  const handleManualSalePriceChange = (val: number) => {
    setSalePrice(val)
    const newBase = Math.max(0, val - (hasCommissioner ? commissionAmount : 0))
    setBasePrice(newBase)
    setAmountReceived(Math.max(0, val - advanceAmount))
  }

  const handleHasCommissionerChange = (checked: boolean) => {
    setHasCommissioner(checked)
    const commToAdd = checked ? commissionAmount : 0
    const newSalePrice = basePrice + commToAdd
    setSalePrice(newSalePrice)
    setAmountReceived(Math.max(0, newSalePrice - advanceAmount))
  }

  const handleCommissionAmountChange = (newComm: number) => {
    setCommissionAmount(newComm)
    if (hasCommissioner) {
      const newSalePrice = basePrice + newComm
      setSalePrice(newSalePrice)
      setAmountReceived(Math.max(0, newSalePrice - advanceAmount))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedVehicleId) {
      setError('Veuillez sélectionner un véhicule')
      return
    }

    if (!buyerName.trim()) {
      setError('Le nom de l’acheteur est requis')
      return
    }

    // Open reparation modal to ask whether workshop intervention is needed
    setIsRepairModalOpen(true)
  }

  const handleExecuteSale = async (
    saleStatus: 'DELIVERED' | 'PREPARATION',
    repairData?: RepairFormValues
  ) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const repairFee = repairData && saleStatus === 'PREPARATION' ? Number(repairData.estimatedAmount) || 0 : 0
      const finalSalePrice = Number(salePrice) + repairFee
      const finalAdditionalFees = Number(additionalFees) + repairFee

      const payload = {
        vehicleId: selectedVehicleId,
        reservationId: initialReservation?.id || null,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim() || null,
        buyerCin: buyerCin.trim() || null,
        buyerAddress: buyerAddress.trim() || null,
        buyerCity: buyerCity.trim() || 'Casablanca',
        salePrice: finalSalePrice,
        advanceAmount: Number(advanceAmount),
        amountReceivedAtSale: Number(amountReceived),
        discountAmount: Number(discountAmount),
        additionalFees: finalAdditionalFees,
        status: saleStatus,
        paymentMethod,
        commissionerName: hasCommissioner && commissionerName.trim() ? commissionerName.trim() : null,
        commissionerPhone: hasCommissioner && commissionerPhone.trim() ? commissionerPhone.trim() : null,
        commissionerCin: hasCommissioner && commissionerCin.trim() ? commissionerCin.trim() : null,
        commissionerAddress: hasCommissioner && commissionerAddress.trim() ? commissionerAddress.trim() : null,
        commissionerCity: hasCommissioner && commissionerCity.trim() ? commissionerCity.trim() : 'Casablanca',
        commissionAmount: hasCommissioner ? Number(commissionAmount) : 0,
        commissionPaidById: hasCommissioner && commissionPaidById ? commissionPaidById : null,
        receivedById: receivedById || null,
        notes: notes.trim() || null,
      }

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Échec de la validation de vente')
      }

      // If repair data was provided, create repair record including who paid it
      if (repairData && saleStatus === 'PREPARATION') {
        const repairRes = await fetch('/api/repairs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleId: selectedVehicleId,
            repairType: repairData.repairType,
            garageName: repairData.garageName,
            estimatedAmount: repairData.estimatedAmount,
            description: repairData.description,
            paidById: repairData.paidById || null,
          }),
        })

        if (!repairRes.ok) {
          console.warn('Vente créée mais échec de création réparation')
        }
      }

      // If documents were uploaded during sale registration, associate them with the sale
      if (saleDocIds.length > 0 && (data.id || data.code)) {
        try {
          await attachDocumentsAction(saleDocIds, {
            saleId: data.id,
            vehicleId: selectedVehicleId,
          })
        } catch (docErr) {
          console.warn('Vente créée mais échec de liaison des documents:', docErr)
        }
      }

      setIsRepairModalOpen(false)
      // Navigate directly to the live workflow screen
      router.push(`/sales/${data.code || data.id}/workflow`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setIsSubmitting(false)
      setIsRepairModalOpen(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
          {error}
        </div>
      )}

      {/* Reservation Carry-forward Banner */}
      {initialReservation && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Conversion de Réservation</span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {initialReservation.code}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Acompte reporté de {advanceAmount.toLocaleString('fr-FR')} DH — Données client préremplies
              </p>
            </div>
          </div>
          <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-400 border border-amber-500/30">
            Acompte {advanceAmount.toLocaleString('fr-FR')} DH
          </span>
        </div>
      )}

      {/* Main Form Box */}
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm space-y-6">
        {/* 1. Véhicule Concerne */}
        <div>
          <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center gap-2">
            <Car className="h-4 w-4 text-cyan-400" />
            <span>1. Véhicule Concerné</span>
          </h3>

          {initialReservation ? (
            <div className="rounded-xl border border-[#2a2a34] bg-[#16161c] p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">
                  {currentVehicle ? `${currentVehicle.brand} ${currentVehicle.model} (${currentVehicle.year})` : 'Véhicule réservé'}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                  <span className="font-mono">{currentVehicle?.code}</span>
                  {currentVehicle?.matricule && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-zinc-300">{currentVehicle.matricule}</span>
                    </>
                  )}
                </div>
              </div>
              <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-400 border border-amber-500/30">
                Véhicule Réservé
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Sélectionner un véhicule en stock *
              </label>
              <div className="relative flex items-center">
                <select
                  value={selectedVehicleId}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  required
                  className="h-10 w-full appearance-none rounded-lg border border-[#282834] bg-[#16161c] pl-3 pr-8 text-xs text-white focus:border-red-500 focus:outline-none transition-colors cursor-pointer"
                >
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[#16161c] text-white">
                      {v.brand} {v.model} ({v.year}) — {v.matricule || v.code} — {v.targetSalePrice.toLocaleString('fr-FR')} DH
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-zinc-400" />
              </div>
            </div>
          )}
        </div>

        {/* 2. Acheteur (Snapshot sans CRM) */}
        <div>
          <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" />
            <span>2. Informations Acheteur (Client)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom Complet Acheteur *</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                placeholder="Ex: Youssef El Fassi"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Téléphone</label>
              <input
                type="text"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="06XXXXXXXX"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">CIN / ICE</label>
              <input
                type="text"
                value={buyerCin}
                onChange={(e) => setBuyerCin(e.target.value)}
                placeholder="Ex: BE654321"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white uppercase placeholder-zinc-500 focus:border-red-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Adresse de l’acheteur</label>
              <input
                type="text"
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                placeholder="Ex: 45, Bd Zerktouni"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ville de l’acheteur</label>
              <MoroccanCityCombobox
                value={buyerCity}
                onChange={(c) => setBuyerCity(c)}
                placeholder="Sélectionner la ville..."
              />
            </div>
          </div>
        </div>

        {/* 3. Modalités Financières & Règlements */}
        <div>
          <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-amber-400" />
            <span>3. Modalités Financières & Encaissement</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 truncate">
                Prix de vente (DH) *
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => handleManualSalePriceChange(parseFloat(e.target.value) || 0)}
                  required
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] pl-3 pr-10 text-xs text-white font-mono font-bold focus:border-amber-500 focus:outline-none transition-colors"
                />
                <span className="pointer-events-none absolute right-3 font-mono text-[11px] font-bold text-zinc-400">
                  DH
                </span>
              </div>
              {hasCommissioner && commissionAmount > 0 && (
                <p className="text-[10px] text-purple-400 font-medium mt-1">
                  + {commissionAmount.toLocaleString('fr-FR')} DH commission intermédiaire incluse
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 truncate">
                Mode de règlement
              </label>
              <div className="relative flex items-center">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-[#282834] bg-[#16161c] pl-3 pr-8 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="VIREMENT" className="bg-[#16161c] text-white">Virement bancaire</option>
                  <option value="ESPECES" className="bg-[#16161c] text-white">Espèces</option>
                  <option value="CHEQUE" className="bg-[#16161c] text-white">Chèque certifié</option>
                  <option value="CARTE" className="bg-[#16161c] text-white">Carte bancaire</option>
                  <option value="EFFET" className="bg-[#16161c] text-white">Effet de commerce</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 truncate">
                Montant encaissé (DH) *
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full rounded-lg border border-emerald-500/40 bg-[#16161c] pl-3 pr-10 text-xs text-emerald-400 font-mono font-bold focus:border-emerald-400 focus:outline-none transition-colors"
                />
                <span className="pointer-events-none absolute right-3 font-mono text-[11px] font-bold text-emerald-500/70">
                  DH
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 truncate">
                Argent récupéré par *
              </label>
              <div className="relative flex items-center">
                <select
                  value={receivedById}
                  onChange={(e) => setReceivedById(e.target.value)}
                  required
                  className={`h-10 w-full appearance-none rounded-lg border bg-[#16161c] pl-3 pr-8 text-xs focus:outline-none transition-colors cursor-pointer ${
                    receivedById
                      ? 'border-emerald-500/40 text-emerald-300 font-semibold focus:border-emerald-400'
                      : 'border-[#282834] text-zinc-300 focus:border-amber-500'
                  }`}
                >
                  <option value="" disabled className="text-zinc-500 bg-[#16161c]">
                    -- Collaborateur --
                  </option>
                  {personnelList.map((p) => (
                    <option key={p.id} value={p.id} className="text-white bg-[#16161c]">
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Live Financial Breakdown Card */}
          <div className="mt-4 rounded-xl border border-[#2a2a34] bg-[#181820] p-4 space-y-2.5 text-xs">
            <div className="space-y-1.5 pb-2.5 border-b border-[#242430]">
              <div className="flex justify-between text-zinc-300">
                <span className="font-medium">Prix de base véhicule (Stock) :</span>
                <span className="font-mono text-zinc-200 font-semibold">
                  {basePrice.toLocaleString('fr-FR')} DH
                </span>
              </div>

              {buyCommission > 0 && (
                <div className="flex justify-between text-zinc-400 text-[11px] pl-3 border-l-2 border-amber-500/40">
                  <span className="text-zinc-400">↳ dont Courtier d&apos;achat inclus :</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    +{buyCommission.toLocaleString('fr-FR')} DH
                  </span>
                </div>
              )}

              {repairsTotal > 0 && (
                <div className="flex justify-between text-zinc-400 text-[11px] pl-3 border-l-2 border-cyan-500/40">
                  <span className="text-zinc-400">↳ dont Réparations atelier incluses :</span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    +{repairsTotal.toLocaleString('fr-FR')} DH
                  </span>
                </div>
              )}

              {hasCommissioner && commissionAmount > 0 && (
                <div className="flex justify-between text-purple-400 text-[11px] pl-3 border-l-2 border-purple-500 font-medium">
                  <span>+ Commission intermédiaire de vente :</span>
                  <span className="font-mono font-bold">
                    +{commissionAmount.toLocaleString('fr-FR')} DH
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-white font-bold">
              <span className="flex items-center gap-2">
                <span>Prix de vente convenu :</span>
                {hasCommissioner && commissionAmount > 0 && (
                  <span className="text-[10px] font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Courtier inclus
                  </span>
                )}
              </span>
              <span className="font-mono text-emerald-400 font-black text-sm">
                {salePrice.toLocaleString('fr-FR')} DH
              </span>
            </div>

            {advanceAmount > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>- Acompte réservation reporté :</span>
                <span className="font-mono font-bold">- {advanceAmount.toLocaleString('fr-FR')} DH</span>
              </div>
            )}

            <div className="flex justify-between text-emerald-400">
              <span>- Règlement encaissé aujourd&apos;hui :</span>
              <span className="font-mono font-bold">- {amountReceived.toLocaleString('fr-FR')} DH</span>
            </div>

            <div className="border-t border-[#2a2a34] pt-2 flex justify-between font-bold text-sm">
              <span className={remainingDue > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                {remainingDue > 0 ? 'Solde restant à recouvrer :' : 'Vente intégralement réglée :'}
              </span>
              <span className="font-mono">{remainingDue.toLocaleString('fr-FR')} DH</span>
            </div>
          </div>
        </div>

        {/* 4. Intermédiaire / Semsar (Optionnel) */}
        <div>
          <div className="flex items-center justify-between border-b border-[#222228] pb-3 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-400" />
              <span>4. Intermédiaire Commercial (Optionnel)</span>
            </h3>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCommissioner}
                onChange={(e) => handleHasCommissionerChange(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-[#16161c] text-purple-600 focus:ring-purple-500"
              />
              <span>Ajouter un courtier / semsar</span>
            </label>
          </div>

          {hasCommissioner && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom Courtier</label>
                <input
                  type="text"
                  value={commissionerName}
                  onChange={(e) => setCommissionerName(e.target.value)}
                  placeholder="Nom complet"
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={commissionerPhone}
                  onChange={(e) => setCommissionerPhone(e.target.value)}
                  placeholder="06XXXXXXXX"
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">CIN Courtier</label>
                <input
                  type="text"
                  value={commissionerCin}
                  onChange={(e) => setCommissionerCin(e.target.value)}
                  placeholder="CIN"
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white uppercase placeholder-zinc-500 focus:border-purple-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Montant Commission (MAD)</label>
                <input
                  type="number"
                  value={commissionAmount}
                  onChange={(e) => handleCommissionAmountChange(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-purple-400 font-mono font-bold focus:border-purple-500 focus:outline-none"
                />
                <p className="text-[10px] text-purple-400/80 mt-1">
                  💡 Ajoutée automatiquement au prix de vente convenu.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Adresse du Semsar</label>
                <input
                  type="text"
                  value={commissionerAddress}
                  onChange={(e) => setCommissionerAddress(e.target.value)}
                  placeholder="Ex: 24, Rue Ibn Sina"
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Ville du Semsar</label>
                <MoroccanCityCombobox
                  value={commissionerCity}
                  onChange={(c) => setCommissionerCity(c)}
                  placeholder="Sélectionner la ville..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 truncate">
                  Payé par qui du personnel ? (Collaborateur)
                </label>
                <div className="relative flex items-center">
                  <select
                    value={commissionPaidById}
                    onChange={(e) => setCommissionPaidById(e.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-[#282834] bg-[#16161c] pl-3 pr-8 text-xs text-white focus:border-purple-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="" className="text-zinc-500 bg-[#16161c]">-- Sélectionner le membre du personnel --</option>
                    {personnelList.map((p) => (
                      <option key={p.id} value={p.id} className="text-white bg-[#16161c]">
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-zinc-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Documents & Justificatifs de Vente */}
        <div>
          <DocumentFormUploader
            category="Ventes"
            title="5. Pièces Justificatives de Vente"
            subtitle="Contrat de vente, certificat de cession, copie CIN client acheteur, reçu d'acompte"
            fieldName="saleDocumentsData"
            vehicleId={selectedVehicleId}
            onDocumentsChange={(docs) => setSaleDocIds(docs.map((d) => d.id))}
          />
        </div>

        {/* 6. Notes */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Notes & Conditions Spéciales</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Garantie commerciale, reprise convenue, remise des clés..."
            className="w-full rounded-lg border border-[#282834] bg-[#16161c] p-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none resize-none"
          />
        </div>

        {/* Submit Actions */}
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
            disabled={isSubmitting}
            className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-6 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSubmitting ? 'Enregistrement...' : 'Confirmer la vente & Encaisser'}</span>
          </button>
        </div>
      </div>

      {/* Reparation Prompt Modal */}
      <RepairPromptModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        vehicleTitle={currentVehicle ? `${currentVehicle.brand} ${currentVehicle.model}` : undefined}
        currentSalePrice={Number(salePrice)}
        personnelList={personnelList}
        onConfirmWithoutRepair={() => handleExecuteSale('DELIVERED')}
        onConfirmWithRepair={(repairData) => handleExecuteSale('PREPARATION', repairData)}
        isLoading={isSubmitting}
      />
    </form>
  )
}
