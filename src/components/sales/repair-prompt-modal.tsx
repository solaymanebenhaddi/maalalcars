'use client'

import React, { useState } from 'react'
import {
  Wrench,
  CheckCircle2,
  X,
  AlertCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { WheelSpinner } from '@/components/ui/wheel-spinner'

export interface RepairFormValues {
  repairType: string
  garageName: string
  estimatedAmount: number
  description: string
  paidById?: string | null
}

interface RepairPromptModalProps {
  isOpen: boolean
  onClose: () => void
  vehicleTitle?: string
  currentSalePrice?: number
  personnelList?: { id: string; name: string }[]
  onConfirmWithoutRepair: () => Promise<void> | void
  onConfirmWithRepair: (repairData: RepairFormValues) => Promise<void> | void
  isLoading?: boolean
}

const REPAIR_TYPES = [
  { value: 'ENTRETIEN', label: 'Entretien & Révision générale' },
  { value: 'NETTOYAGE', label: 'Préparation esthétique & Lustrage' },
  { value: 'MECANIQUE', label: 'Mécanique & Moteur' },
  { value: 'CARROSSERIE', label: 'Carrosserie & Retouches peinture' },
  { value: 'ELECTRICITE', label: 'Électricité & Diagnostic' },
  { value: 'CLIMATISATION', label: 'Climatisation & Recharge' },
  { value: 'PNEUMATIQUES', label: 'Pneumatiques & Freinage' },
  { value: 'AUTRE', label: 'Autre intervention atelier' },
]

export function RepairPromptModal({
  isOpen,
  onClose,
  vehicleTitle,
  currentSalePrice,
  personnelList = [],
  onConfirmWithoutRepair,
  onConfirmWithRepair,
  isLoading = false,
}: RepairPromptModalProps) {
  const [needsRepair, setNeedsRepair] = useState<'yes' | 'no'>('no')
  const [repairType, setRepairType] = useState('ENTRETIEN')
  const [garageName, setGarageName] = useState('Atelier Interne Maalal')
  const [estimatedAmount, setEstimatedAmount] = useState<number | ''>('')
  const [paidById, setPaidById] = useState<string>('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (needsRepair === 'no') {
        await onConfirmWithoutRepair()
      } else {
        if (!description.trim()) {
          setError('Veuillez décrire brièvement les travaux à effectuer')
          return
        }
        await onConfirmWithRepair({
          repairType,
          garageName: garageName.trim() || 'Atelier Interne Maalal',
          estimatedAmount: Number(estimatedAmount) || 0,
          description: description.trim(),
          paidById: paidById || null,
        })
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-[#262632] bg-[#121216] shadow-2xl p-6 text-white space-y-5 animate-in fade-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Validation de Vente & Intervention Atelier</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Le véhicule {vehicleTitle ? <strong className="text-zinc-200">« {vehicleTitle} »</strong> : ''} nécessite-t-il un passage en atelier ou des réparations avant livraison ?
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Binary Options Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Option NO -> Direct delivery */}
          <button
            type="button"
            onClick={() => {
              setNeedsRepair('no')
              setError(null)
            }}
            disabled={isLoading}
            className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
              needsRepair === 'no'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950/30'
                : 'border-[#262632] bg-[#16161c] hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span
                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  needsRepair === 'no' ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600'
                }`}
              >
                {needsRepair === 'no' && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
              </span>
            </div>
            <span className="text-xs font-bold text-white">Non, prêt pour livraison</span>
            <span className="text-[11px] text-zinc-400 mt-1 leading-snug">
              Le véhicule est prêt. Valider la vente et passer directement à la phase finale de <strong>Livraison</strong>.
            </span>
          </button>

          {/* Option YES -> Repair needed */}
          <button
            type="button"
            onClick={() => {
              setNeedsRepair('yes')
              setError(null)
            }}
            disabled={isLoading}
            className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
              needsRepair === 'yes'
                ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-950/30'
                : 'border-[#262632] bg-[#16161c] hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Wrench className="h-4 w-4" />
              </div>
              <span
                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  needsRepair === 'yes' ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'
                }`}
              >
                {needsRepair === 'yes' && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
              </span>
            </div>
            <span className="text-xs font-bold text-white">Oui, passage atelier requis</span>
            <span className="text-[11px] text-zinc-400 mt-1 leading-snug">
              Planifier des réparations, révision ou préparation esthétique avant la remise des clés.
            </span>
          </button>
        </div>

        {/* Repair Form (Displayed only if YES selected) */}
        {needsRepair === 'yes' && (
          <div className="rounded-xl border border-amber-500/30 bg-[#16161e] p-4 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#262636] pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Formulaire d&apos;intervention atelier</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Ordre de réparation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Type */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Type d&apos;intervention *
                </label>
                <div className="relative flex items-center">
                  <select
                    value={repairType}
                    onChange={(e) => setRepairType(e.target.value)}
                    className="h-9 w-full appearance-none rounded-lg border border-[#2c2c3a] bg-[#121216] pl-3 pr-8 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    {REPAIR_TYPES.map((rt) => (
                      <option key={rt.value} value={rt.value} className="bg-[#121216] text-white">
                        {rt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-zinc-400" />
                </div>
              </div>

              {/* Garage / Prestataire */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Atelier / Prestataire
                </label>
                <input
                  type="text"
                  value={garageName}
                  onChange={(e) => setGarageName(e.target.value)}
                  placeholder="Atelier Interne Maalal ou nom du garage"
                  className="h-9 w-full rounded-lg border border-[#2c2c3a] bg-[#121216] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Devis estimé */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Devis / Coût estimé (DH) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={estimatedAmount}
                    onChange={(e) =>
                      setEstimatedAmount(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))
                    }
                    placeholder="ex: 1800"
                    className="h-9 w-full rounded-lg border border-[#2c2c3a] bg-[#121216] pl-3 pr-12 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <span className="pointer-events-none absolute right-3 text-[10px] font-bold text-zinc-400">
                    DH
                  </span>
                </div>
              </div>

              {/* Payé par qui */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1 truncate">
                  Payé par qui (Personnel / Collaborateur) ?
                </label>
                <div className="relative flex items-center">
                  <select
                    value={paidById}
                    onChange={(e) => setPaidById(e.target.value)}
                    className="h-9 w-full appearance-none rounded-lg border border-[#2c2c3a] bg-[#121216] pl-3 pr-8 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-[#121216] text-zinc-400">-- Sélectionner le collaborateur --</option>
                    {personnelList.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#121216] text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-zinc-400" />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Description des travaux à exécuter *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="ex: Vidange complète, changement plaquettes AV, lustrage carrosserie avant remise..."
                  className="w-full rounded-lg border border-[#2c2c3a] bg-[#121216] p-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Fee Added to Sale Price Card */}
              <div className="sm:col-span-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">
                    Frais de réparation ajoutés au prix
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    +{(Number(estimatedAmount) || 0).toLocaleString('fr-FR')} DH répercutés sur le prix de vente
                  </span>
                </div>
                {currentSalePrice !== undefined && (
                  <div className="sm:text-right border-t sm:border-t-0 border-[#243428] pt-1.5 sm:pt-0">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">
                      Nouveau Prix Total Client
                    </span>
                    <span className="font-mono text-sm font-black text-white">
                      {(currentSalePrice + (Number(estimatedAmount) || 0)).toLocaleString('fr-FR')} DH
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222228]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#282834] bg-[#181820] px-4 text-xs font-semibold text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex h-9 items-center gap-2 rounded-lg px-5 text-xs font-bold text-white shadow-lg transition-all disabled:opacity-50 ${
              needsRepair === 'yes'
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/50'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50'
            }`}
          >
            {isLoading ? (
              <>
                <WheelSpinner size="xs" speed="normal" glow={false} />
                <span>Enregistrement...</span>
              </>
            ) : needsRepair === 'yes' ? (
              <>
                <Wrench className="h-3.5 w-3.5" />
                <span>Valider la vente & Envoyer en atelier</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Valider la vente (Livraison directe)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
