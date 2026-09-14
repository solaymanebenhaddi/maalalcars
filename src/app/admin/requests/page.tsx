'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  ArrowLeft,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react'
import {
  APPROVAL_STATUS_COLORS,
  APPROVAL_STATUS_LABELS,
  APPROVAL_ACTION_LABELS,
  ApprovalStatus,
  ApprovalActionType,
} from '@/domain/approval'

interface RequestItem {
  id: string
  requestNumber: string
  actionType: ApprovalActionType
  entityType: string
  entityId: string | null
  entityLabel: string | null
  status: ApprovalStatus
  beforeData: string | null
  requestedData: string
  entityUpdatedAt: string | null
  targetUrl: string | null
  reason: string | null
  rejectionReason: string | null
  conflictDetails: string | null
  createdAt: string
  updatedAt: string
  requestedBy: {
    id: string
    name: string
    email: string
    role: { name: string } | null
  }
  reviewedBy: {
    id: string
    name: string
    email: string
  } | null
}

interface RequestCounts {
  totalPending: number
  urgents: number
  creations: number
  updates: number
  deletions: number
  sales: number
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [counts, setCounts] = useState<RequestCounts | null>(null)
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFLICTED' | 'ALL'>('PENDING')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [approveModalRequest, setApproveModalRequest] = useState<RequestItem | null>(null)
  const [rejectModalRequest, setRejectModalRequest] = useState<RequestItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    fetch('/api/approvals/counts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) setCounts(data)
      })
      .catch((err) => console.error('Failed to load counts:', err))

    return () => {
      ignore = true
    }
  }, [refreshKey])

  useEffect(() => {
    let ignore = false
    const params = new URLSearchParams()
    if (activeTab !== 'ALL') {
      params.set('status', activeTab)
    }
    if (search.trim()) {
      params.set('search', search.trim())
    }
    params.set('limit', '50')

    fetch(`/api/approvals?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setRequests(data.items || [])
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load requests:', err)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [activeTab, search, refreshKey])

  const handleApprove = async (overrideConflict = false) => {
    if (!approveModalRequest) return
    setIsProcessing(true)
    setActionError(null)

    try {
      const res = await fetch(`/api/approvals/${approveModalRequest.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrideConflict }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’approbation')
      }

      setApproveModalRequest(null)
      setRefreshKey((k) => k + 1)
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectModalRequest) return
    if (!rejectionReason || rejectionReason.trim().length < 5) {
      setActionError('Le motif du rejet doit comporter au moins 5 caractères.')
      return
    }

    setIsProcessing(true)
    setActionError(null)

    try {
      const res = await fetch(`/api/approvals/${rejectModalRequest.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du rejet')
      }

      setRejectModalRequest(null)
      setRejectionReason('')
      setRefreshKey((k) => k + 1)
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderChangesPreview = (req: RequestItem) => {
    try {
      const reqData = JSON.parse(req.requestedData || '{}')
      const before = req.beforeData ? JSON.parse(req.beforeData) : null

      if (req.actionType === 'CREATE') {
        return (
          <div className="mt-2 text-[11px] text-zinc-300 space-y-1 bg-[#16161d] p-2.5 rounded-lg border border-[#262632]">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Plus className="h-3.5 w-3.5" />
              <span>Nouveau véhicule proposé</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1 text-zinc-400">
              <div>Marque/Modèle : <span className="text-white font-semibold">{reqData.brand} {reqData.model}</span></div>
              <div>Prix achat : <span className="text-white font-semibold">{Number(reqData.purchasePrice || 0).toLocaleString('fr-FR')} DH</span></div>
              <div>Prix cible : <span className="text-white font-semibold">{Number(reqData.targetSalePrice || 0).toLocaleString('fr-FR')} DH</span></div>
            </div>
          </div>
        )
      }

      if (req.actionType === 'DELETE') {
        return (
          <div className="mt-2 text-[11px] text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-2 rounded-lg flex items-center gap-2">
            <Trash2 className="h-3.5 w-3.5" />
            <span>Demande de suppression / retrait définitif de cet élément</span>
          </div>
        )
      }

      if (before && reqData) {
        const diffs: Array<{ field: string; before: unknown; after: unknown }> = []
        for (const key of Object.keys(reqData)) {
          if (before[key] !== reqData[key] && !['updatedAt', 'id'].includes(key)) {
            diffs.push({ field: key, before: before[key], after: reqData[key] })
          }
        }

        if (diffs.length > 0) {
          return (
            <div className="mt-2 flex flex-wrap gap-2">
              {diffs.slice(0, 3).map((d, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16161d] border border-[#2a2a36] text-[11px]"
                >
                  <span className="text-zinc-400 font-medium">{d.field} :</span>
                  <span className="line-through text-red-400/80">{String(d.before || '—')}</span>
                  <ArrowRight className="h-3 w-3 text-zinc-500" />
                  <span className="font-bold text-emerald-400">{String(d.after || '—')}</span>
                </div>
              ))}
              {diffs.length > 3 && (
                <span className="text-[10px] text-zinc-500 self-center">+{diffs.length - 3} autres champs</span>
              )}
            </div>
          )
        }
      }

      return null
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-white pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Tableau de bord</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300">Pilotage &amp; Sécurité</span>
            <span className="text-zinc-600">&gt;</span>
            <span className="font-semibold text-white">Centre des demandes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 pt-1">
            <CheckCircle2 className="h-6 w-6 text-amber-500" />
            <span>Centre des demandes d’approbation</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Contrôle préalable obligatoire des créations, modifications, prix et ventes initiées par l’équipe
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/activity"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#16161c] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
          >
            <span>Journal d’activité</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-amber-500/30 bg-[#141410] p-3.5 shadow-lg">
          <div className="text-[11px] font-semibold text-amber-400">En attente</div>
          <div className="text-2xl font-black text-amber-300 mt-1">
            {counts?.totalPending ?? 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">À valider</div>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-[#161012] p-3.5 shadow-lg">
          <div className="text-[11px] font-semibold text-red-400">Urgentes / Prix</div>
          <div className="text-2xl font-black text-red-300 mt-1">
            {counts?.urgents ?? 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Suppr. &amp; Prix</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Créations</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {counts?.creations ?? 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Nouveaux objets</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Modifications</div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {counts?.updates ?? 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Champs modifiés</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Ventes</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {counts?.sales ?? 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Transactions</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Suppressions</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {counts?.deletions ?? 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Retraits du parc</div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#222228] pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'PENDING', label: 'En attente', count: counts?.totalPending },
            { id: 'APPROVED', label: 'Approuvées' },
            { id: 'REJECTED', label: 'Rejetées' },
            { id: 'CONFLICTED', label: 'Conflits' },
            { id: 'ALL', label: 'Toutes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher code, demandeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-[#282834] bg-[#16161c] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Request Cards List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-12 text-center text-zinc-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-amber-500 mb-2" />
            <span>Chargement des demandes d&apos;approbation...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-12 text-center text-zinc-500">
            <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-zinc-300">Aucune demande dans cette catégorie</p>
            <p className="text-xs text-zinc-600 mt-1">Toutes les opérations soumises ont été traitées.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="rounded-xl border border-[#222228] bg-[#121216] hover:border-[#323240] p-4 transition-all shadow-md space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c24] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {req.requestNumber}
                  </span>
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    {APPROVAL_ACTION_LABELS[req.actionType] || req.actionType}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold border uppercase ${
                      APPROVAL_STATUS_COLORS[req.status]?.bg || 'bg-zinc-800'
                    } ${APPROVAL_STATUS_COLORS[req.status]?.text || 'text-zinc-400'} ${
                      APPROVAL_STATUS_COLORS[req.status]?.border || 'border-zinc-700'
                    }`}
                  >
                    {APPROVAL_STATUS_LABELS[req.status] || req.status}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-zinc-500" />
                  <span>Demandée le {new Date(req.createdAt).toLocaleString('fr-FR')}</span>
                </div>
              </div>

              {/* Body: Requester & Entity Details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500">Demandé par :</span>
                    <span className="font-bold text-white">{req.requestedBy.name}</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-400">
                      {req.requestedBy.role?.name || 'Collaborateur'}
                    </span>
                  </div>

                  {req.entityLabel && (
                    <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                      <Car className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{req.entityLabel}</span>
                      {req.targetUrl && (
                        <Link
                          href={req.targetUrl}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>[Ouvrir fiche]</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  )}

                  {req.reason && (
                    <div className="text-[11px] text-zinc-400 italic">
                      &laquo; {req.reason} &raquo;
                    </div>
                  )}

                  {req.rejectionReason && (
                    <div className="text-[11px] text-red-400 bg-red-950/20 border border-red-900/30 p-2 rounded">
                      <span className="font-bold">Motif du rejet :</span> {req.rejectionReason}
                    </div>
                  )}

                  {renderChangesPreview(req)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      setSelectedRequest(req)
                      setIsDetailOpen(true)
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#2a2a36] bg-[#16161c] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                  >
                    Voir détails
                  </button>

                  {req.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          setRejectModalRequest(req)
                          setRejectionReason('')
                          setActionError(null)
                        }}
                        className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        Rejeter
                      </button>

                      <button
                        onClick={() => {
                          setApproveModalRequest(req)
                          setActionError(null)
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition-all"
                      >
                        Approuver
                      </button>
                    </>
                  )}

                  {req.status === 'CONFLICTED' && (
                    <button
                      onClick={() => {
                        setApproveModalRequest(req)
                        setActionError(null)
                      }}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white shadow-lg"
                    >
                      Résoudre conflit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approve Confirmation Modal */}
      {approveModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121216] border border-[#282834] rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Approuver cette demande ?</span>
              </h3>
              <button
                onClick={() => setApproveModalRequest(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <p>
                Vous êtes sur le point d’appliquer définitivement cette opération dans le système :
              </p>
              <div className="bg-[#16161c] p-3 rounded-xl border border-[#262632] space-y-1">
                <div>Demande : <span className="font-mono font-bold text-amber-400">{approveModalRequest.requestNumber}</span></div>
                <div>Opération : <span className="font-bold text-white">{APPROVAL_ACTION_LABELS[approveModalRequest.actionType]}</span></div>
                <div>Objet : <span className="font-semibold text-zinc-200">{approveModalRequest.entityLabel || '—'}</span></div>
                <div>Demandeur : <span className="text-zinc-300">{approveModalRequest.requestedBy.name}</span></div>
              </div>

              {actionError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {actionError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#222228] pt-4">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setApproveModalRequest(null)}
                className="px-4 py-2 rounded-lg border border-[#282834] text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleApprove(approveModalRequest.status === 'CONFLICTED')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
              >
                {isProcessing && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirmer l’approbation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121216] border border-[#282834] rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Rejeter cette demande</span>
              </h3>
              <button
                onClick={() => setRejectModalRequest(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p>
                La demande sera marquée comme <span className="text-red-400 font-bold">REJETÉE</span>.
                Aucune modification ne sera appliquée aux données réelles.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  Motif du rejet (obligatoire) *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ex : Prix d'achat incohérent avec le marché, informations incomplètes..."
                  className="w-full p-2.5 rounded-lg border border-[#282834] bg-[#16161c] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {actionError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {actionError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#222228] pt-4">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setRejectModalRequest(null)}
                className="px-4 py-2 rounded-lg border border-[#282834] text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleReject}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-950/50 flex items-center gap-1.5"
              >
                {isProcessing && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>Rejeter la demande</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Slide-Over */}
      {isDetailOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-[#121216] border-l border-[#282834] h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222228] pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{selectedRequest.requestNumber}</span>
                <h3 className="text-base font-black text-white mt-0.5">
                  {APPROVAL_ACTION_LABELS[selectedRequest.actionType]} — {selectedRequest.entityType}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#16161c] p-4 rounded-xl border border-[#222228]">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold">Demandeur</span>
                <div className="font-bold text-white mt-0.5">{selectedRequest.requestedBy.name}</div>
                <div className="text-zinc-400 text-[11px]">{selectedRequest.requestedBy.email}</div>
              </div>

              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold">Statut actuel</span>
                <div className="mt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${APPROVAL_STATUS_COLORS[selectedRequest.status]?.bg} ${APPROVAL_STATUS_COLORS[selectedRequest.status]?.text} ${APPROVAL_STATUS_COLORS[selectedRequest.status]?.border}`}>
                    {APPROVAL_STATUS_LABELS[selectedRequest.status]}
                  </span>
                </div>
              </div>

              {selectedRequest.reason && (
                <div className="col-span-2 border-t border-[#222228] pt-2">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold">Justification du demandeur</span>
                  <div className="text-zinc-300 mt-0.5">&laquo; {selectedRequest.reason} &raquo;</div>
                </div>
              )}
            </div>

            {/* Payloads */}
            {selectedRequest.beforeData && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">État initial (Snapshot)</h4>
                <pre className="rounded-xl border border-[#282834] bg-[#0c0c0e] p-4 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-48">
                  {JSON.stringify(JSON.parse(selectedRequest.beforeData), null, 2)}
                </pre>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Modifications demandées</h4>
              <pre className="rounded-xl border border-[#282834] bg-[#0c0c0e] p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56">
                {JSON.stringify(JSON.parse(selectedRequest.requestedData), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
