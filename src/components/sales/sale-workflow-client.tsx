'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Printer,
  Send,
  Wrench,
  Clock,
  Car,
  AlertCircle,
  Check,
  Crown,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Archive,
} from 'lucide-react'
import { RepairPromptModal, RepairFormValues } from './repair-prompt-modal'
import { ActiveUserRoleInfo } from '@/lib/auth-roles'
import { WheelSpinner } from '@/components/ui/wheel-spinner'

interface SaleData {
  id: string
  code: string
  saleDate: string | Date
  createdAt: string | Date
  updatedAt: string | Date
  status: string
  salePrice: number
  advanceAmount: number
  paymentMethod: string
  buyerName: string | null
  buyerPhone: string | null
  vehicleId: string
  vehicle?: {
    id: string
    code: string
    brand: string
    model: string
    year: number
    matricule: string | null
    status: string
    repairs?: Array<{
      id: string
      code: string
      repairType: string
      garageName: string | null
      estimatedAmount: number | null
      finalAmount: number | null
      status: string
      description: string | null
      startedAt: string | Date
      completedAt: string | Date | null
      paidById?: string | null
      paidBy?: { id: string; name: string } | null
    }>
  } | null
  additionalFees?: number
  salesperson?: { id: string; name: string } | null
  receivedBy?: { id: string; name: string } | null
  payments?: Array<{
    id: string
    code: string
    amount: number
    paymentDate: string | Date
    status: string
  }>
}

interface Props {
  initialSale: SaleData | null
  fallbackCode: string
  personnelList?: { id: string; name: string }[]
  currentUser?: ActiveUserRoleInfo
}

export function SaleWorkflowClient({
  initialSale,
  fallbackCode,
  personnelList = [],
  currentUser: initialCurrentUser,
}: Props) {
  const router = useRouter()
  const [sale, setSale] = useState<SaleData | null>(initialSale)
  const [currentUser, setCurrentUser] = useState<ActiveUserRoleInfo>(
    initialCurrentUser || {
      id: '',
      name: 'Utilisateur',
      email: '',
      role: '',
      isSuperAdmin: false,
    }
  )
  const [isSuperAdminConfirmOpen, setIsSuperAdminConfirmOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const code = sale?.code || fallbackCode
  const status = sale?.status || 'CONFIRMED'
  const vehicle = sale?.vehicle
  const vehicleTitle = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : 'Véhicule'

  // Look for active repair on this vehicle
  const activeRepair = vehicle?.repairs?.find((r) => r.status === 'EN_COURS')
  const completedRepairs = vehicle?.repairs?.filter((r) => r.status === 'TERMINEE') || []

  const totalPayments = sale?.payments?.reduce((sum, p) => (p.status === 'PAID' ? sum + p.amount : sum), 0) ?? (sale?.advanceAmount || 0)

  const formatDate = (d: string | Date | undefined | null) => {
    if (!d) return '—'
    const date = new Date(d)
    if (isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Determine which steps are completed/current based on status
  // Status flow: NEW -> NEGOTIATION -> PENDING_PAYMENT -> CONFIRMED -> PREPARATION -> DELIVERED
  const isDelivered = status === 'DELIVERED'
  const isPreparation = status === 'PREPARATION'
  const isConfirmed = status === 'CONFIRMED' || isPreparation || isDelivered
  const isPendingPayment = totalPayments > 0 || isConfirmed

  const steps = [
    {
      id: 1,
      title: 'Nouvelle vente',
      dateTime: formatDate(sale?.createdAt),
      description: `Créée par ${sale?.salesperson?.name || sale?.receivedBy?.name || 'Collaborateur Commercial'}`,
      completed: true,
      current: status === 'NEW',
    },
    {
      id: 2,
      title: 'En négociation',
      dateTime: formatDate(sale?.createdAt),
      description: `Conditions et prix validés avec ${sale?.buyerName || 'l’acheteur'}`,
      completed: status !== 'NEW',
      current: status === 'NEGOTIATION',
    },
    {
      id: 3,
      title: 'En attente paiement',
      dateTime: formatDate(sale?.saleDate),
      description: totalPayments > 0
        ? `Règlement / Acompte perçu : ${totalPayments.toLocaleString('fr-FR')} DH`
        : 'Paiement à percevoir',
      completed: isPendingPayment && status !== 'PENDING_PAYMENT',
      current: status === 'PENDING_PAYMENT',
    },
    {
      id: 4,
      title: 'Confirmée',
      dateTime: formatDate(sale?.saleDate),
      description: 'Commande confirmée et contrat enregistré',
      completed: isPreparation || isDelivered,
      current: status === 'CONFIRMED',
    },
    {
      id: 5,
      title: 'Préparation',
      dateTime: activeRepair ? formatDate(activeRepair.startedAt) : formatDate(sale?.updatedAt),
      description: activeRepair
        ? `Atelier : ${activeRepair.repairType} (${activeRepair.garageName || 'Atelier Interne'}) — Devis : ${(activeRepair.estimatedAmount || 0).toLocaleString('fr-FR')} DH`
        : completedRepairs.length > 0
        ? `Préparation atelier terminée (${completedRepairs[0].repairType})`
        : isDelivered
        ? 'Contrôle qualité effectué — Livraison directe sans atelier'
        : 'Véhicule en attente de préparation ou décision atelier',
      completed: isDelivered,
      current: isPreparation,
    },
    {
      id: 6,
      title: 'Livrée',
      dateTime: isDelivered ? formatDate(sale?.updatedAt) : 'En attente',
      description: isDelivered
        ? `Validée par le Super Admin — Remise des clés à ${sale?.buyerName || 'l’acheteur'} et véhicule archivé hors stock`
        : 'Validation finale réservée au Super Admin & remise des clés',
      completed: isDelivered,
      current: isDelivered,
    },
  ]

  // Handlers for quick actions
  const handleSwitchRole = async (targetRole: 'super_admin' | 'vendeur') => {
    setIsActionLoading(true)
    try {
      const res = await fetch('/api/auth/active-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      })
      const data = await res.json()
      if (data.active) {
        setCurrentUser(data.active)
        showToast(`Rôle actif basculé : ${data.active.name} (${data.active.role})`)
        router.refresh()
      }
    } catch {
      showToast('Erreur lors du changement de rôle')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleSuperAdminValidateDelivery = async () => {
    if (!sale) return
    setIsActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch(`/api/sales/${sale.id}/validate-delivery`, {
        method: 'POST',
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la validation Super Admin')
      }

      setSale((prev) => {
        if (!prev) return null
        return {
          ...prev,
          status: 'DELIVERED',
          updatedAt: new Date(),
          vehicle: prev.vehicle
            ? {
                ...prev.vehicle,
                status: 'ARCHIVED',
                repairs: (prev.vehicle.repairs || []).map((r) => ({ ...r, status: 'TERMINEE' })),
              }
            : null,
        }
      })

      setIsSuperAdminConfirmOpen(false)
      showToast('Vente validée et livraison effectuée par le Super Admin ! Véhicule archivé hors stock.')
      router.refresh()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur lors de la validation')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleConfirmWithoutRepair = async () => {
    if (!sale) return
    setIsActionLoading(true)
    setErrorMessage(null)

    try {
      if (currentUser.isSuperAdmin) {
        setIsModalOpen(false)
        setIsSuperAdminConfirmOpen(true)
        return
      }

      // Non-super-admin confirms the sale order without repair, but final delivery remains pending Super Admin validation
      const res = await fetch(`/api/sales/${sale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Impossible de mettre à jour le statut')
      }

      const updated = await res.json()
      setSale((prev) => (prev ? { ...prev, status: updated.status, updatedAt: new Date() } : null))
      setIsModalOpen(false)
      showToast('Vente confirmée sans réparation — En attente de validation finale par le Super Admin !')
      router.refresh()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur lors de la validation')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleConfirmWithRepair = async (repairData: RepairFormValues) => {
    if (!sale || !vehicle) return
    setIsActionLoading(true)
    setErrorMessage(null)

    try {
      const repairFee = Number(repairData.estimatedAmount) || 0
      const newSalePrice = (sale.salePrice || 0) + repairFee
      const newAdditionalFees = (sale.additionalFees || 0) + repairFee

      // 1. Create Repair record with who paid it (paidById)
      const repairRes = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          repairType: repairData.repairType,
          garageName: repairData.garageName,
          estimatedAmount: repairFee,
          description: repairData.description,
          paidById: repairData.paidById || null,
        }),
      })

      if (!repairRes.ok) {
        const repairErr = await repairRes.json()
        throw new Error(repairErr.error || 'Erreur lors de la création de la réparation')
      }

      const newRepair = await repairRes.json()

      // 2. Update Sale Status to PREPARATION, adding all repair fees to the sale price
      const saleRes = await fetch(`/api/sales/${sale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PREPARATION',
          salePrice: newSalePrice,
          additionalFees: newAdditionalFees,
        }),
      })

      if (!saleRes.ok) {
        const saleErr = await saleRes.json()
        throw new Error(saleErr.error || 'Impossible de mettre la vente en préparation')
      }

      const updatedSale = await saleRes.json()
      const payerObj = personnelList.find((p) => p.id === repairData.paidById)
      const attachedRepair = {
        ...newRepair,
        paidBy: payerObj || newRepair.paidBy || null,
      }

      setSale((prev) => {
        if (!prev) return null
        const prevRepairs = prev.vehicle?.repairs || []
        return {
          ...prev,
          status: updatedSale.status,
          salePrice: newSalePrice,
          additionalFees: newAdditionalFees,
          updatedAt: new Date(),
          vehicle: prev.vehicle
            ? {
                ...prev.vehicle,
                repairs: [attachedRepair, ...prevRepairs],
              }
            : null,
        }
      })

      setIsModalOpen(false)
      showToast(`Véhicule en préparation : +${repairFee.toLocaleString('fr-FR')} DH ajoutés au prix de vente !`)
      router.refresh()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur lors de l’envoi en atelier')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleSendReminder = () => {
    showToast(`Rappel et statut envoyés à ${sale?.buyerName || 'l’acheteur'} (${sale?.buyerPhone || 'WhatsApp'}) !`)
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'DELIVERED':
        return { label: 'Livrée', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' }
      case 'PREPARATION':
        return { label: 'En Préparation', color: 'bg-amber-500/15 border-amber-500/30 text-amber-400' }
      case 'CONFIRMED':
        return { label: 'Confirmée', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' }
      case 'PENDING_PAYMENT':
        return { label: 'En attente paiement', color: 'bg-purple-500/15 border-purple-500/30 text-purple-400' }
      case 'NEGOTIATION':
        return { label: 'En négociation', color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' }
      default:
        return { label: 'Nouvelle', color: 'bg-zinc-500/15 border-zinc-500/30 text-zinc-400' }
    }
  }

  const currentBadge = getStatusBadge(status)

  const nextStepLabel = isDelivered
    ? 'Vente finalisée'
    : isPreparation
    ? 'Livraison client'
    : 'Préparation atelier ou Livraison'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121814] px-4 py-3 text-xs font-semibold text-emerald-400 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Check className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/sales/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour {code}</span>
        </Link>

        {/* Tab links */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href={`/sales/${code}`}
            className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white font-semibold transition-colors"
          >
            Résumé
          </Link>
          <Link
            href={`/sales/${code}/documents`}
            className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white font-semibold transition-colors"
          >
            Documents
          </Link>
          <span className="px-3 py-1.5 rounded-lg bg-[#22222c] text-white font-bold border border-[#2a2a36]">
            Workflow &amp; Statut
          </span>
        </div>
      </div>

      {/* Interactive Role Switcher Banner */}
      <div className="rounded-xl border border-[#2c2c3c] bg-[#14141c] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          {currentUser.isSuperAdmin ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Crown className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
              <Lock className="h-4 w-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[11px]">Profil Actif :</span>
              <span className="text-white font-bold text-xs">{currentUser.name}</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[10px] font-bold border ${
                  currentUser.isSuperAdmin
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              {currentUser.isSuperAdmin
                ? 'Habilitation Super Admin active : Pouvoir exclusif de validation finale de vente, livraison et archivage du véhicule.'
                : 'Habilitation Vendeur standard : Seul le Super Admin peut confirmer la livraison finale et archiver la voiture.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleSwitchRole(currentUser.isSuperAdmin ? 'vendeur' : 'super_admin')}
            disabled={isActionLoading}
            className="flex items-center gap-1.5 rounded-lg border border-[#383848] bg-[#1a1a24] hover:bg-[#222230] hover:text-white px-3 py-1.5 text-[11px] font-semibold text-zinc-300 transition-colors disabled:opacity-50"
          >
            <span>Bascule Test :</span>
            <span className="font-bold text-amber-400">
              {currentUser.isSuperAdmin ? 'Passer en Vendeur' : 'Passer en Super Admin'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-black text-white font-mono">
              {code}
            </h1>
            <span
              className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${currentBadge.color}`}
            >
              {currentBadge.label}
            </span>
            {vehicle && (
              <span className="hidden md:inline-flex items-center gap-1.5 text-zinc-400 text-xs pl-2 border-l border-[#24242e]">
                <Car className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-semibold text-white">{vehicleTitle}</span>
                {vehicle.matricule && (
                  <span className="font-mono text-zinc-400">({vehicle.matricule})</span>
                )}
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400">
            Créée le {formatDate(sale?.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Étapes du workflow */}
          <div className="lg:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Étapes du workflow</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">
                Progression temps réel
              </span>
            </div>

            <div className="space-y-4 py-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs transition-colors ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : step.current
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500 shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>
                    {step.id < steps.length && (
                      <div
                        className={`w-0.5 h-10 ${
                          step.completed ? 'bg-emerald-600/50' : 'bg-zinc-800'
                        }`}
                      />
                    )}
                  </div>

                  <div className="space-y-0.5 flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold text-xs ${
                          step.current ? 'text-emerald-400' : step.completed ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {step.dateTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 1 Col: Informations & Actions rapides */}
          <div className="space-y-4">
            {/* Informations */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Informations
              </h3>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Statut actuel</span>
                  <span
                    className={`font-bold ${
                      isDelivered
                        ? 'text-emerald-400'
                        : isPreparation
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {currentBadge.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Étape actuelle depuis</span>
                  <span className="font-mono text-zinc-200">
                    {formatDate(sale?.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Prochaine étape</span>
                  <span className="text-cyan-400 font-semibold">{nextStepLabel}</span>
                </div>
                <div className="flex justify-between border-t border-[#202028] pt-2">
                  <span className="text-zinc-400">Responsable</span>
                  <span className="text-white font-medium">
                    {sale?.salesperson?.name || sale?.receivedBy?.name || 'Admin Maalal'}
                  </span>
                </div>
                {sale?.buyerName && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Acheteur</span>
                    <span className="text-white font-medium">{sale.buyerName}</span>
                  </div>
                )}
                {sale?.salePrice && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Prix de vente</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {sale.salePrice.toLocaleString('fr-FR')} DH
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Active Repair Card if in PREPARATION */}
            {isPreparation && activeRepair && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Réparation en cours</span>
                  </span>
                  <span className="font-mono text-[10px] text-amber-300 font-bold">
                    {activeRepair.code}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Type :</span>
                    <span className="font-semibold text-white">{activeRepair.repairType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Atelier :</span>
                    <span className="text-zinc-200">{activeRepair.garageName || 'Atelier Interne'}</span>
                  </div>
                  {activeRepair.paidBy && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Payé par :</span>
                      <span className="text-amber-300 font-semibold">{activeRepair.paidBy.name}</span>
                    </div>
                  )}
                  {activeRepair.estimatedAmount !== null && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Frais de réparation :</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        + {activeRepair.estimatedAmount.toLocaleString('fr-FR')} DH (inclus au prix)
                      </span>
                    </div>
                  )}
                  {activeRepair.description && (
                    <p className="text-[10px] text-zinc-400 pt-1 border-t border-amber-500/20 italic">
                      « {activeRepair.description} »
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Delivered Success Card */}
            {isDelivered && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-2.5 text-emerald-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Vente Validée &amp; Véhicule Livré</span>
                      <span className="text-[10px] text-amber-300 font-semibold">Confirmée par le Super Admin</span>
                    </div>
                  </div>
                  <span className="rounded bg-zinc-900/80 px-2 py-0.5 text-[9px] font-bold text-zinc-300 border border-zinc-700">
                    ARCHIVÉ HORS STOCK
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  La transaction est clôturée et remise des clés effectuée. Le véhicule a été automatiquement archivé et retiré de l&apos;inventaire actif.
                </p>
                <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                  <Link
                    href="/vehicles?status=ARCHIVED"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    <span>Consulter dans les Archives</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Actions rapides
              </h3>

              <div className="space-y-2.5">
                {/* When NOT DELIVERED: buttons for repair or final Super Admin validation */}
                {!isDelivered && (
                  <>
                    {/* Atelier Decision (available for workshop planning) */}
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      disabled={isActionLoading}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c] hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors text-left group disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="text-white font-semibold text-xs block">
                            Décision Atelier / Réparation
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {isPreparation ? 'Ajouter / modifier intervention' : 'Planifier révision avant remise'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-3 w-3 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                    </button>

                    {/* SUPER ADMIN EXCLUSIVE VALIDATION BUTTON */}
                    {currentUser.isSuperAdmin ? (
                      <button
                        type="button"
                        onClick={() => setIsSuperAdminConfirmOpen(true)}
                        disabled={isActionLoading}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-600/25 via-emerald-500/20 to-amber-500/15 border border-emerald-500/60 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/50 transition-all text-left group disabled:opacity-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                            <Crown className="h-4 w-4 text-amber-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white font-bold text-xs">
                                Valider la Vente &amp; Livrer
                              </span>
                              <span className="rounded bg-amber-500/25 px-1 py-0.2 text-[9px] font-black text-amber-300 border border-amber-500/50">
                                Super Admin
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-300/80 block">
                              Confirmation finale &amp; Archivage hors stock
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ) : (
                      /* NON-SUPER ADMIN LOCK CARD */
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2 text-left">
                        <div className="flex items-center gap-2 text-amber-400">
                          <ShieldAlert className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-bold">Validation réservée au Super Admin</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed">
                          En tant que <strong>{currentUser.role}</strong>, vous ne disposez pas des habilitations pour valider définitivement la vente. Seul le <strong>Super Admin</strong> est autorisé à confirmer la livraison et archiver le véhicule.
                        </p>
                        <div className="rounded bg-[#121216]/70 p-2 text-[10px] text-amber-300/90 border border-amber-500/20 font-mono">
                          ⏳ En attente de validation finale par le Super Admin
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Remind client */}
                <button
                  type="button"
                  onClick={handleSendReminder}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c] hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <Send className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-semibold text-xs">
                      Envoyer un rappel au client
                    </span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                </button>

                {/* Print */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c] hover:border-red-500/50 hover:bg-red-500/5 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="h-3.5 w-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-semibold text-xs">
                      {isDelivered ? 'Imprimer le bon de livraison' : 'Imprimer le bon de commande'}
                    </span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-zinc-500 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Super Admin Confirmation Modal */}
      {isSuperAdminConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-[#14141a] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Validation Finale &amp; Livraison</h3>
                <span className="text-[11px] text-amber-400 font-semibold">Pouvoir Exclusif Super Admin</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#1a1a24] border border-[#282836] p-3.5 space-y-2 text-xs text-zinc-300">
              <p className="font-semibold text-white">
                En confirmant cette action en tant que Super Admin :
              </p>
              <ul className="space-y-1.5 text-[11px] text-zinc-300 list-disc list-inside">
                <li>La vente <strong className="text-white">{code}</strong> passe au statut <strong className="text-emerald-400">LIVRÉE</strong>.</li>
                <li>Toute préparation atelier en cours est automatiquement clôturée.</li>
                <li>Le véhicule <strong className="text-white">{vehicleTitle}</strong> est <strong className="text-amber-300">automatiquement archivé et retiré du stock</strong>.</li>
                <li>Ce véhicule ne pourra être restauré en stock que par un Super Admin.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsSuperAdminConfirmOpen(false)}
                disabled={isActionLoading}
                className="h-9 px-4 rounded-lg border border-[#282834] bg-[#1a1a22] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSuperAdminValidateDelivery}
                disabled={isActionLoading}
                className="h-9 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isActionLoading ? (
                  <>
                    <WheelSpinner size="xs" speed="normal" glow={false} />
                    <span>Validation &amp; Archivage...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Valider &amp; Archiver le véhicule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reparation Prompt Modal */}
      <RepairPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleTitle={vehicleTitle}
        currentSalePrice={sale?.salePrice}
        personnelList={personnelList}
        onConfirmWithoutRepair={handleConfirmWithoutRepair}
        onConfirmWithRepair={handleConfirmWithRepair}
        isLoading={isActionLoading}
      />
    </div>
  )
}
