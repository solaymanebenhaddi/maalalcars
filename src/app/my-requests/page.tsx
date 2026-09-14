'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  RefreshCw,
  Car,
  ExternalLink,
} from 'lucide-react'
import {
  APPROVAL_STATUS_COLORS,
  APPROVAL_STATUS_LABELS,
  APPROVAL_ACTION_LABELS,
  ApprovalStatus,
  ApprovalActionType,
} from '@/domain/approval'

interface MyRequestItem {
  id: string
  requestNumber: string
  actionType: ApprovalActionType
  entityType: string
  entityId: string | null
  entityLabel: string | null
  status: ApprovalStatus
  targetUrl: string | null
  reason: string | null
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  reviewedBy: {
    name: string
  } | null
}

function MyRequestsContent() {
  const searchParams = useSearchParams()
  const justSubmitted = searchParams.get('submitted') === '1'
  const submittedReq = searchParams.get('req')

  const [requests, setRequests] = useState<MyRequestItem[]>([])
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    const params = new URLSearchParams()
    if (activeTab !== 'ALL') {
      params.set('status', activeTab)
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
          console.error('Failed to load my requests:', err)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [activeTab, refreshKey])

  const handleCancelRequest = async (id: string) => {
    setCancellingId(id)
    setCancelError(null)

    try {
      const res = await fetch(`/api/approvals/${id}/cancel`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’annulation')
      }
      setRefreshKey((k) => k + 1)
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setCancellingId(null)
    }
  }

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs text-white pb-12">
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
            <span className="font-semibold text-white">Mes demandes d’approbation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 pt-1">
            <Clock className="h-6 w-6 text-amber-500" />
            <span>Mes demandes soumises</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Suivi en temps réel de vos demandes d’ajout, modification et vente soumises à validation
          </p>
        </div>
      </div>

      {/* Just Submitted Success Banner */}
      {justSubmitted && submittedReq && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-1 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <CheckCircle2 className="h-5 w-5" />
            <span>Demande envoyée avec succès ({submittedReq})</span>
          </div>
          <p className="text-xs text-zinc-300">
            Votre opération a été enregistrée. Elle doit être validée par un Super Administrateur avant d’apparaître dans le stock actif.
          </p>
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-amber-500/30 bg-[#141410] p-4">
          <div className="text-[11px] font-semibold text-amber-400">En attente</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-[#101412] p-4">
          <div className="text-[11px] font-semibold text-emerald-400">Approuvées</div>
          <div className="text-2xl font-black text-emerald-300 mt-1">{approvedCount}</div>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-[#161012] p-4">
          <div className="text-[11px] font-semibold text-red-400">Rejetées</div>
          <div className="text-2xl font-black text-red-300 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222228] pb-2">
        {[
          { id: 'ALL', label: 'Toutes mes demandes' },
          { id: 'PENDING', label: 'En attente' },
          { id: 'APPROVED', label: 'Approuvées' },
          { id: 'REJECTED', label: 'Rejetées' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-zinc-800 text-white border border-zinc-600'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {cancelError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {cancelError}
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-12 text-center text-zinc-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-amber-500 mb-2" />
            <span>Chargement de vos demandes...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-12 text-center text-zinc-500">
            <Clock className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm font-semibold text-zinc-400">Aucune demande enregistrée</p>
            <p className="text-xs text-zinc-600 mt-1">Vos futures demandes soumises s&apos;afficheront ici.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-md space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c24] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {req.requestNumber}
                  </span>
                  <span className="font-bold text-white text-xs">
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
                  <span>Soumise le {new Date(req.createdAt).toLocaleString('fr-FR')}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  {req.entityLabel && (
                    <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                      <Car className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{req.entityLabel}</span>
                      {req.targetUrl && (
                        <Link
                          href={req.targetUrl}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>[Voir la fiche]</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  )}

                  {req.reason && (
                    <div className="text-[11px] text-zinc-400 italic">
                      Votre note : &laquo; {req.reason} &raquo;
                    </div>
                  )}

                  {req.status === 'REJECTED' && req.rejectionReason && (
                    <div className="mt-2 rounded-lg bg-red-950/20 border border-red-900/30 p-2.5 text-xs text-red-300">
                      <span className="font-bold">Motif du rejet par le Super Admin :</span> {req.rejectionReason}
                    </div>
                  )}

                  {req.status === 'APPROVED' && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Validée et appliquée en base de données</span>
                    </div>
                  )}
                </div>

                {req.status === 'PENDING' && (
                  <button
                    disabled={cancellingId === req.id}
                    onClick={() => handleCancelRequest(req.id)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold self-end md:self-center transition-colors"
                  >
                    {cancellingId === req.id ? 'Annulation...' : 'Annuler ma demande'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function MyRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-500">
          Chargement de vos demandes...
        </div>
      }
    >
      <MyRequestsContent />
    </Suspense>
  )
}
