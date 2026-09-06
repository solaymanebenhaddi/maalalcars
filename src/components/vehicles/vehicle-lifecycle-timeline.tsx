'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Car,
  DollarSign,
  Wrench,
  CalendarDays,
  BadgePercent,
  FolderArchive,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Crown,
  Lock,
  Archive,
  AlertCircle,
} from 'lucide-react'
import { WheelSpinner } from '@/components/ui/wheel-spinner'

interface VehicleTimelineProps {
  vehicleId: string
  vehicleStatus: string
  activeTab: string
  entryDate: string | Date
  purchasePrice: number
  targetSalePrice: number
  supplierName?: string | null
  repairsCount: number
  activeRepairGarage?: string | null
  activeRepairType?: string | null
  totalRepairCost: number
  reservationsCount: number
  activeClientName?: string | null
  activeDepositAmount?: number
  isReserved: boolean
  isSold: boolean
  salePrice?: number | null
  buyerName?: string | null
  netProfit?: number
  photosCount: number
  documentsCount: number
  commissionerName?: string | null
  commissionAmount?: number
  commissionPaidByName?: string | null
  saleId?: string | null
  saleCode?: string | null
  saleStatus?: string | null
  isSuperAdmin?: boolean
  currentUserRole?: string | null
  currentUserName?: string | null
}

export function VehicleLifecycleTimeline({
  vehicleId,
  vehicleStatus,
  activeTab,
  entryDate,
  purchasePrice,
  targetSalePrice,
  supplierName,
  repairsCount,
  activeRepairGarage,
  activeRepairType,
  totalRepairCost,
  reservationsCount,
  activeClientName,
  activeDepositAmount,
  isReserved,
  isSold,
  salePrice,
  buyerName,
  netProfit,
  photosCount,
  documentsCount,
  commissionerName,
  commissionAmount,
  commissionPaidByName,
  saleId,
  saleCode,
  saleStatus,
  isSuperAdmin,
  currentUserRole,
  currentUserName,
}: VehicleTimelineProps) {
  const router = useRouter()
  const [isSuperAdminState, setIsSuperAdminState] = React.useState<boolean>(isSuperAdmin ?? true)
  const [currentRole, setCurrentRole] = React.useState<string>(currentUserRole || 'Utilisateur')
  const [currentName, setCurrentName] = React.useState<string>(currentUserName || 'Utilisateur')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleSwitchRole = async (targetRole: 'super_admin' | 'vendeur') => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/active-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      })
      const data = await res.json()
      if (data.active) {
        setIsSuperAdminState(data.active.isSuperAdmin)
        setCurrentRole(data.active.role)
        setCurrentName(data.active.name)
        showToast(`Rôle actif : ${data.active.name} (${data.active.role})`)
        router.refresh()
      }
    } catch {
      showToast('Erreur lors du changement de rôle')
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidateSale = async () => {
    if (!saleId) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch(`/api/sales/${saleId}/validate-delivery`, {
        method: 'POST',
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la validation')
      }

      setIsConfirmModalOpen(false)
      showToast('Vente validée et livraison effectuée par le Super Admin ! Véhicule archivé hors stock.')
      router.refresh()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur lors de la validation')
    } finally {
      setIsLoading(false)
    }
  }

  const isInSalePhase = Boolean(saleId) && saleStatus !== 'DELIVERED' && vehicleStatus !== 'ARCHIVED'
  const isDeliveredAndArchived = saleStatus === 'DELIVERED' || vehicleStatus === 'ARCHIVED'

  // Define the stages in agency vehicle lifecycle
  const stages = [
    {
      id: 'acquisition',
      title: '1. Acquisition & Entrée en Stock',
      shortTitle: 'Acquisition',
      icon: DollarSign,
      isCompleted: true,
      isCurrent: false,
      color: 'cyan',
      date: new Date(entryDate).toLocaleDateString('fr-MA'),
      badge: 'Acquis',
      summary: `${purchasePrice.toLocaleString('fr-MA')} DH`,
      detail: commissionerName
        ? `Semsar: ${commissionerName} (${(commissionAmount || 0).toLocaleString('fr-MA')} DH${commissionPaidByName ? ` • payé par ${commissionPaidByName}` : ''})`
        : supplierName
        ? `Fournisseur : ${supplierName}`
        : 'Acquisition directe',
    },
    {
      id: 'repairs',
      title: '2. Préparation & Atelier',
      shortTitle: 'Atelier / Entretien',
      icon: Wrench,
      isCompleted: repairsCount > 0 && vehicleStatus !== 'WORKSHOP',
      isCurrent: vehicleStatus === 'WORKSHOP',
      color: 'purple',
      date: vehicleStatus === 'WORKSHOP' ? 'En cours atelier' : (repairsCount > 0 ? `${repairsCount} travaux effectués` : 'Aucun frais'),
      badge: vehicleStatus === 'WORKSHOP' ? 'En Atelier' : (repairsCount > 0 ? 'Révisé' : 'Prêt'),
      summary: totalRepairCost > 0 ? `${totalRepairCost.toLocaleString('fr-MA')} DH` : '0 DH',
      detail: activeRepairType ? `${activeRepairType} (${activeRepairGarage || 'Atelier'})` : `${repairsCount} réparation(s)`,
    },
    {
      id: 'overview',
      title: '3. Exposition & Showroom',
      shortTitle: 'En Stock Vente',
      icon: Car,
      isCompleted: isReserved || isSold,
      isCurrent: vehicleStatus === 'IN_STOCK',
      color: 'blue',
      date: vehicleStatus === 'IN_STOCK' ? 'Disponible à la vente' : 'Exposé',
      badge: vehicleStatus === 'IN_STOCK' ? 'Actif Showroom' : 'Passé',
      summary: `${targetSalePrice.toLocaleString('fr-MA')} DH`,
      detail: 'Fiche commerciale & photos',
    },
    {
      id: 'reservations',
      title: '4. Réservation & Acompte',
      shortTitle: 'Réservation Client',
      icon: CalendarDays,
      isCompleted: isSold && reservationsCount > 0,
      isCurrent: isReserved,
      color: 'amber',
      date: isReserved ? 'Acompte bloqué' : (reservationsCount > 0 ? 'Réservation passée' : 'Non réservé'),
      badge: isReserved ? 'Réservé' : (reservationsCount > 0 ? 'Converti' : 'Libre'),
      summary: activeDepositAmount ? `${activeDepositAmount.toLocaleString('fr-MA')} DH` : (reservationsCount > 0 ? 'Acompte reporté' : 'Sans acompte'),
      detail: activeClientName ? `Client : ${activeClientName}` : `${reservationsCount} dossier(s)`,
    },
    {
      id: 'sale',
      title: '5. Vente Clôturée & Règlements',
      shortTitle: 'Vente & Clôture',
      icon: BadgePercent,
      isCompleted: isSold,
      isCurrent: isSold,
      color: 'emerald',
      date: isSold ? 'Vente confirmée' : 'En attente vente',
      badge: isSold ? 'Vendu' : 'Disponible',
      summary: salePrice ? `${salePrice.toLocaleString('fr-MA')} DH` : 'En attente',
      detail: isSold ? (buyerName ? `Acheteur : ${buyerName}` : 'Dossier clôturé') : (netProfit !== undefined ? `Marge estimée : +${netProfit.toLocaleString('fr-MA')} DH` : 'Dossier vente'),
    },
    {
      id: 'documents',
      title: '6. Documents & Galerie Photos',
      shortTitle: 'Photos & Documents',
      icon: FolderArchive,
      isCompleted: photosCount > 0,
      isCurrent: activeTab === 'documents',
      color: 'indigo',
      date: `${photosCount} photos`,
      badge: `${photosCount + documentsCount} fichiers`,
      summary: `${documentsCount} document(s)`,
      detail: 'Cartes grises & justificatifs',
    },
  ]

  return (
    <aside className="sticky top-20 rounded-2xl border border-[#262632] bg-[#121217]/95 p-5 shadow-2xl backdrop-blur-md space-y-5">
      {/* Timeline Header */}
      <div className="flex items-center justify-between border-b border-[#22222c] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Cycle de Vie en Agence
            </h3>
            <p className="text-[10px] text-zinc-400">
              Parcours complet du véhicule en temps réel
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#1c1c24] px-2.5 py-0.5 font-mono text-[10px] font-bold text-zinc-300 border border-[#2a2a38]">
          {vehicleStatus}
        </span>
      </div>

      {/* Role Switcher in Timeline */}
      <div className="flex items-center justify-between bg-[#171720] border border-[#262634] p-2 rounded-xl text-[10px]">
        <div className="flex items-center gap-1.5">
          {isSuperAdminState ? (
            <Crown className="h-3.5 w-3.5 text-amber-400" />
          ) : (
            <Lock className="h-3.5 w-3.5 text-blue-400" />
          )}
          <span className="font-semibold text-white truncate max-w-[110px]">{currentName}</span>
          <span
            className={`px-1 py-0.2 rounded font-bold ${
              isSuperAdminState
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}
          >
            {currentRole}
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleSwitchRole(isSuperAdminState ? 'vendeur' : 'super_admin')}
          disabled={isLoading}
          className="text-zinc-400 hover:text-amber-400 font-bold underline transition-colors disabled:opacity-50"
        >
          {isSuperAdminState ? 'Test: Vendeur' : 'Test: Super Admin'}
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-[#121814] p-2.5 text-[11px] font-semibold text-emerald-400 shadow-lg flex items-center gap-2">
          <Check className="h-3.5 w-3.5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-2.5 text-[11px] font-semibold text-red-400 shadow-lg flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Vertical Glowing Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-purple-500 before:via-amber-500 before:to-emerald-500 before:opacity-30">
        {stages.map((stage) => {
          const Icon = stage.icon
          const isSelected = activeTab === stage.id

          // Visual glowing style for the dot
          let dotStyle = 'border-zinc-700 bg-[#16161e] text-zinc-500'
          let pingAnimation = false

          if (stage.isCurrent) {
            pingAnimation = true
            if (stage.color === 'purple') {
              dotStyle = 'border-purple-400 bg-purple-600 text-white shadow-[0_0_16px_rgba(192,132,252,0.9)]'
            } else if (stage.color === 'amber') {
              dotStyle = 'border-amber-400 bg-amber-500 text-black shadow-[0_0_16px_rgba(251,191,36,0.9)]'
            } else if (stage.color === 'emerald') {
              dotStyle = 'border-emerald-400 bg-emerald-500 text-white shadow-[0_0_18px_rgba(52,211,153,0.9)]'
            } else {
              dotStyle = 'border-cyan-400 bg-cyan-500 text-black shadow-[0_0_16px_rgba(34,211,238,0.9)]'
            }
          } else if (stage.isCompleted) {
            dotStyle = 'border-emerald-500/60 bg-emerald-950/80 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
          }

          return (
            <div key={stage.id} className="relative group">
              {/* Glowing Dot on vertical spine */}
              <div className="absolute -left-[24px] top-1.5 flex items-center justify-center">
                {pingAnimation && (
                  <span
                    className={`absolute inline-flex h-6 w-6 animate-ping rounded-full opacity-75 ${
                      stage.color === 'purple'
                        ? 'bg-purple-400'
                        : stage.color === 'amber'
                        ? 'bg-amber-400'
                        : stage.color === 'emerald'
                        ? 'bg-emerald-400'
                        : 'bg-cyan-400'
                    }`}
                  />
                )}
                <div
                  className={`relative flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold transition-transform group-hover:scale-125 ${dotStyle}`}
                >
                  {stage.isCompleted && !stage.isCurrent ? (
                    <Check className="h-3 w-3 stroke-[3]" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </div>
              </div>

              {/* Interactive Stage Card Link */}
              <Link
                href={`/vehicles/${vehicleId}?tab=${stage.id}`}
                className={`block rounded-xl border p-3 transition-all ${
                  isSelected
                    ? 'border-red-500/60 bg-red-950/20 shadow-lg shadow-red-950/30 translate-x-1'
                    : 'border-[#22222a] bg-[#16161c]/80 hover:border-zinc-700 hover:bg-[#1a1a22] hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        isSelected
                          ? 'text-red-400'
                          : stage.isCurrent
                          ? 'text-white'
                          : 'text-zinc-400'
                      }`}
                    />
                    <span
                      className={`text-xs font-bold transition-colors ${
                        isSelected
                          ? 'text-white'
                          : stage.isCurrent
                          ? 'text-white font-black'
                          : 'text-zinc-300 group-hover:text-white'
                      }`}
                    >
                      {stage.shortTitle}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      stage.isCurrent
                        ? 'bg-red-600 text-white shadow'
                        : stage.isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-[#22222a] text-zinc-500'
                    }`}
                  >
                    {stage.isCurrent ? 'En cours' : stage.badge}
                  </span>
                </div>

                {/* Sub-metrics */}
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-white text-xs">
                    {stage.summary}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {stage.date}
                  </span>
                </div>

                <div className="mt-1 text-[10px] text-zinc-400 truncate">
                  {stage.detail}
                </div>

                {/* Micro indicator when selected */}
                {isSelected && (
                  <div className="mt-2 pt-1.5 border-t border-red-500/20 flex items-center justify-between text-[10px] text-red-400 font-bold">
                    <span>Fiche active</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </Link>
            </div>
          )
        })}
      </div>

      {/* Footer Snapshot */}
      <div className="rounded-xl border border-[#202028] bg-[#16161c] p-3 text-[11px] text-zinc-400 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Statut Véhicule :</span>
          </span>
          <span className="font-bold text-white font-mono">{vehicleStatus}</span>
        </div>
        <div className="text-[10px] text-zinc-500">
          Cliquez sur une étape de la timeline pour accéder instantanément aux actions et documents correspondants.
        </div>
      </div>

      {/* SUPER ADMIN SALE VALIDATION AT BOTTOM OF TIMELINE */}
      {isInSalePhase && (
        <div className="pt-3 border-t border-[#242432] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5" />
              <span>Validation Vente Super Admin</span>
            </span>
            {saleCode && (
              <Link
                href={`/sales/${saleCode}/workflow`}
                className="text-[10px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                {saleCode} ↗
              </Link>
            )}
          </div>

          {isSuperAdminState ? (
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={isLoading}
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
                    Livraison finale &amp; Archivage hors stock
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Lock className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[11px] font-bold">Validation réservée au Super Admin</span>
              </div>
              <p className="text-[10px] text-zinc-300 leading-relaxed">
                Le véhicule est en phase de vente. Seul le <strong>Super Admin</strong> est habilité à valider définitivement la vente, autoriser la livraison et archiver le véhicule.
              </p>
              <div className="rounded bg-[#121216]/70 p-1.5 text-[9px] text-amber-300/90 border border-amber-500/20 font-mono">
                ⏳ En attente de validation Super Admin
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delivered & Archived Status Card */}
      {isDeliveredAndArchived && (
        <div className="pt-3 border-t border-[#242432]">
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 space-y-1.5 text-left text-emerald-300">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Vente Validée &amp; Livrée</span>
              </span>
              <span className="rounded bg-zinc-900/80 px-1.5 py-0.2 text-[9px] font-bold text-zinc-300 border border-zinc-700">
                ARCHIVÉ
              </span>
            </div>
            <p className="text-[10px] text-zinc-300 leading-snug">
              Validée par le Super Admin. Le véhicule a été remis à l&apos;acheteur et retiré de l&apos;inventaire actif.
            </p>
            <div className="pt-1.5 border-t border-emerald-500/20">
              <Link
                href="/vehicles?status=ARCHIVED"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                <Archive className="h-3 w-3" />
                <span>Consulter dans les Archives</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-[#14141a] p-6 space-y-4 shadow-2xl text-left">
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
                En confirmant cette validation en tant que Super Admin :
              </p>
              <ul className="space-y-1.5 text-[11px] text-zinc-300 list-disc list-inside">
                <li>La vente {saleCode ? <strong className="text-white">({saleCode})</strong> : ''} passe au statut <strong className="text-emerald-400">LIVRÉE</strong>.</li>
                <li>Toute préparation atelier en cours est automatiquement clôturée.</li>
                <li>Le véhicule est <strong className="text-amber-300">automatiquement archivé et retiré du stock</strong>.</li>
                <li>Ce véhicule ne pourra être restauré en stock que par un Super Admin.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isLoading}
                className="h-9 px-4 rounded-lg border border-[#282834] bg-[#1a1a22] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleValidateSale}
                disabled={isLoading}
                className="h-9 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
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
    </aside>
  )
}
