'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  RefreshCw,
  Search,
  Shield,
  User,
  X,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react'

interface ActivityItem {
  id: string
  action: string
  entityType: string
  entityId: string | null
  entityLabel: string | null
  details: string | null
  beforeData: string | null
  afterData: string | null
  approvalRequestId: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
    role: { name: string } | null
  } | null
  approvalRequest: {
    id: string
    requestNumber: string
    status: string
    actionType: string
  } | null
}

interface ActivityStats {
  actionsToday: number
  updatesToday: number
  approvedToday: number
  rejectedToday: number
  activeUsersToday: number
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityItem[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<ActivityItem | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    let ignore = false
    fetch('/api/activity/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) setStats(data)
      })
      .catch((err) => console.error('Failed to load activity stats:', err))

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (selectedAction) params.set('action', selectedAction)
    if (selectedEntity) params.set('entityType', selectedEntity)
    params.set('page', String(currentPage))
    params.set('limit', '20')

    fetch(`/api/activity?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setLogs(data.items || [])
          setTotalPages(data.pagination?.totalPages || 1)
          setTotalCount(data.pagination?.total || 0)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load activity logs:', err)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [search, selectedAction, selectedEntity, currentPage])

  const getActionColor = (action: string) => {
    const act = action.toUpperCase()
    if (act.includes('CREATE') || act.includes('APPROVED')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (act.includes('UPDATE') || act.includes('EDIT')) return 'text-sky-400 border-sky-500/30 bg-sky-500/10'
    if (act.includes('DELETE') || act.includes('REJECTED')) return 'text-red-400 border-red-500/30 bg-red-500/10'
    if (act.includes('SALE') || act.includes('RESERVATION')) return 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  }

  const renderDiffSnippet = (log: ActivityItem) => {
    if (!log.beforeData && !log.afterData) return null
    try {
      const b = log.beforeData ? JSON.parse(log.beforeData) : null
      const a = log.afterData ? JSON.parse(log.afterData) : null
      if (!b || !a) return null

      // Check key common fields
      const diffs: Array<{ label: string; from: unknown; to: unknown }> = []
      if (b.targetSalePrice !== undefined && a.targetSalePrice !== undefined && b.targetSalePrice !== a.targetSalePrice) {
        diffs.push({
          label: 'Prix de vente',
          from: `${Number(b.targetSalePrice).toLocaleString('fr-FR')} DH`,
          to: `${Number(a.targetSalePrice).toLocaleString('fr-FR')} DH`,
        })
      }
      if (b.purchasePrice !== undefined && a.purchasePrice !== undefined && b.purchasePrice !== a.purchasePrice) {
        diffs.push({
          label: "Prix d'achat",
          from: `${Number(b.purchasePrice).toLocaleString('fr-FR')} DH`,
          to: `${Number(a.purchasePrice).toLocaleString('fr-FR')} DH`,
        })
      }
      if (b.mileage !== undefined && a.mileage !== undefined && b.mileage !== a.mileage) {
        diffs.push({
          label: 'Kilométrage',
          from: `${Number(b.mileage).toLocaleString('fr-FR')} km`,
          to: `${Number(a.mileage).toLocaleString('fr-FR')} km`,
        })
      }
      if (b.status !== undefined && a.status !== undefined && b.status !== a.status) {
        diffs.push({
          label: 'Statut',
          from: String(b.status),
          to: String(a.status),
        })
      }

      if (diffs.length === 0) return null

      return (
        <div className="mt-2 flex flex-wrap gap-2 pt-2 border-t border-[#222228]">
          {diffs.map((d, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16161d] border border-[#2a2a36] text-[11px]"
            >
              <span className="text-zinc-400 font-medium">{d.label} :</span>
              <span className="line-through text-red-400/80">{String(d.from)}</span>
              <ArrowRight className="h-3 w-3 text-zinc-500" />
              <span className="font-bold text-emerald-400">{String(d.to)}</span>
            </div>
          ))}
        </div>
      )
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-white pb-12">
      {/* Top Header Navigation */}
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
            <span className="font-semibold text-white">Journal d&apos;activité</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 pt-1">
            <Shield className="h-6 w-6 text-red-500" />
            <span>Journal d’activité &amp; Audit système</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Vue chronologique et immuable de toutes les opérations, mutations et validations sur la plateforme
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/requests"
            className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Centre des demandes</span>
          </Link>
          <a
            href="/api/activity?export=csv"
            download
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#16161c] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>Exporter CSV</span>
          </a>
        </div>
      </div>

      {/* 5 KPI Cards matching spec */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Actions aujourd&apos;hui</div>
          <div className="text-2xl font-black text-white mt-1">
            {stats?.actionsToday ?? '—'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3 text-cyan-400" />
            <span>Total opérations</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Modifications</div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {stats?.updatesToday ?? '—'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
            <RefreshCw className="h-3 w-3 text-sky-400" />
            <span>Mutations de données</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Demandes approuvées</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {stats?.approvedToday ?? '—'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Validées Super Admin</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Demandes rejetées</div>
          <div className="text-2xl font-black text-red-400 mt-1">
            {stats?.rejectedToday ?? '—'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
            <XCircle className="h-3 w-3 text-red-400" />
            <span>Refusées avec motif</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-zinc-400">Utilisateurs actifs</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {stats?.activeUsersToday ?? '—'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
            <User className="h-3 w-3 text-purple-400" />
            <span>Comptes connectés</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher par utilisateur, action, véhicule, libellé ou détails..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#282834] bg-[#16161c] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value)
                setCurrentPage(1)
              }}
              className="h-9 px-3 rounded-lg border border-[#282834] bg-[#16161c] text-xs text-zinc-300 focus:outline-none"
            >
              <option value="">Tous les types d&apos;action</option>
              <option value="VEHICLE_CREATED">Création de véhicule</option>
              <option value="VEHICLE_UPDATED">Modification de véhicule</option>
              <option value="VEHICLE_DELETED">Suppression de véhicule</option>
              <option value="VEHICLE_ARCHIVED">Archivage véhicule</option>
              <option value="SALE_CREATED">Création de vente</option>
              <option value="REQUEST_SUBMITTED">Demande soumise</option>
              <option value="REQUEST_APPROVED">Demande approuvée</option>
              <option value="REQUEST_REJECTED">Demande rejetée</option>
            </select>

            <select
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value)
                setCurrentPage(1)
              }}
              className="h-9 px-3 rounded-lg border border-[#282834] bg-[#16161c] text-xs text-zinc-300 focus:outline-none"
            >
              <option value="">Toutes les entités</option>
              <option value="Vehicle">Véhicules</option>
              <option value="Sale">Ventes</option>
              <option value="Reservation">Réservations</option>
              <option value="Repair">Réparations</option>
              <option value="Contact">Contacts CRM</option>
              <option value="User">Utilisateurs</option>
            </select>

            {(search || selectedAction || selectedEntity) && (
              <button
                onClick={() => {
                  setSearch('')
                  setSelectedAction('')
                  setSelectedEntity('')
                  setCurrentPage(1)
                }}
                className="h-9 px-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
          <span>{totalCount} événement(s) enregistré(s)</span>
          <span>Page {currentPage} sur {totalPages}</span>
        </div>
      </div>

      {/* Activity Feed Timeline */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-12 text-center text-zinc-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-red-500 mb-2" />
            <span>Chargement du journal d&apos;activité...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-12 text-center text-zinc-500">
            <Activity className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm font-semibold text-zinc-400">Aucun événement ne correspond à vos filtres</p>
            <p className="text-xs text-zinc-600 mt-1">Modifiez vos critères ou réinitialisez la recherche.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border border-[#222228] bg-[#121216] hover:border-[#323240] p-4 transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* User Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 text-xs font-bold text-white shadow">
                  {(log.user?.name || 'S').slice(0, 2).toUpperCase()}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-xs">
                      {log.user?.name || 'Système'}
                    </span>
                    {log.user?.role && (
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 border border-zinc-700">
                        {log.user.role.name}
                      </span>
                    )}
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    {log.approvalRequest && (
                      <span className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                        {log.approvalRequest.requestNumber}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 font-medium">
                    {log.details || log.action}
                  </p>

                  {log.entityLabel && (
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <span className="text-zinc-500">Objet :</span>
                      <span className="font-semibold text-zinc-200">{log.entityLabel}</span>
                    </div>
                  )}

                  {/* Diff rendering if price or mileage modified */}
                  {renderDiffSnippet(log)}
                </div>
              </div>

              {/* Timestamp & Actions */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-[#222228] pt-2 sm:pt-0">
                <div className="text-right">
                  <div className="text-xs font-semibold text-zinc-300 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {new Date(log.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {log.entityType === 'Vehicle' && log.entityId && (
                    <Link
                      href={`/vehicles/${log.entityId}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#1c1c24] border border-[#2a2a36] text-[11px] font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                    >
                      <Eye className="h-3 w-3 text-cyan-400" />
                      <span>Fiche</span>
                    </Link>
                  )}
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c1c24] border border-[#2a2a36] text-[11px] font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                  >
                    <span>Détails</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#222228] pt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#282834] bg-[#141418] text-xs font-semibold text-zinc-300 hover:text-white disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Précédent</span>
          </button>
          <span className="text-xs font-semibold text-zinc-400">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#282834] bg-[#141418] text-xs font-semibold text-zinc-300 hover:text-white disabled:opacity-40"
          >
            <span>Suivant</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Inspection Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#121216] border-l border-[#282834] h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222228] pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span>Détail de l&apos;événement d&apos;audit</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">ID: {selectedLog.id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Metadatas */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#16161c] p-4 rounded-xl border border-[#222228]">
              <div>
                <div className="text-zinc-500 text-[10px] uppercase font-bold">Utilisateur</div>
                <div className="font-semibold text-white mt-0.5">
                  {selectedLog.user?.name || 'Système'}
                </div>
                <div className="text-[11px] text-zinc-400">{selectedLog.user?.email || '—'}</div>
              </div>

              <div>
                <div className="text-zinc-500 text-[10px] uppercase font-bold">Rôle &amp; Accès</div>
                <div className="font-semibold text-red-400 mt-0.5">
                  {selectedLog.user?.role?.name || 'Système'}
                </div>
                <div className="text-[10px] text-zinc-500">IP: {selectedLog.ipAddress || '—'}</div>
              </div>

              <div>
                <div className="text-zinc-500 text-[10px] uppercase font-bold">Action</div>
                <div className="font-mono font-bold text-zinc-200 mt-0.5">{selectedLog.action}</div>
              </div>

              <div>
                <div className="text-zinc-500 text-[10px] uppercase font-bold">Date &amp; Heure</div>
                <div className="font-mono text-zinc-300 mt-0.5">
                  {new Date(selectedLog.createdAt).toLocaleString('fr-FR')}
                </div>
              </div>

              {selectedLog.approvalRequest && (
                <div className="col-span-2 border-t border-[#222228] pt-2">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">Demande d&apos;approbation rattachée</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono font-bold text-amber-400">{selectedLog.approvalRequest.requestNumber}</span>
                    <span className="text-zinc-400">({selectedLog.approvalRequest.status})</span>
                  </div>
                </div>
              )}
            </div>

            {/* JSON Snapshots */}
            {selectedLog.beforeData && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span>État avant mutation (Snapshot initial)</span>
                </h4>
                <pre className="rounded-xl border border-[#282834] bg-[#0c0c0e] p-4 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-60">
                  {JSON.stringify(JSON.parse(selectedLog.beforeData), null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.afterData && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>État après mutation / Demande</span>
                </h4>
                <pre className="rounded-xl border border-[#282834] bg-[#0c0c0e] p-4 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-60">
                  {JSON.stringify(JSON.parse(selectedLog.afterData), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
