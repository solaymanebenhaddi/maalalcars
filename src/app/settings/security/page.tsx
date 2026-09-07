'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Lock,
  Plus,
  Search,
  Download,
} from 'lucide-react'

const ROLES = [
  { name: 'Administrateur', users: 2, perms: 'Accès total système & finance', status: 'Actif' },
  { name: 'Gestionnaire', users: 5, perms: 'Véhicules, Réservations, Clients, Rapports', status: 'Actif' },
  { name: 'Comptable', users: 3, perms: 'Ventes, Paiements, Export comptable ERP', status: 'Actif' },
  { name: 'Support', users: 4, perms: 'Clients, Réservations (lecture seule)', status: 'Actif' },
  { name: 'Invité', users: 0, perms: 'Lecture limitée stock public', status: 'Inactif' },
]

const AUDIT_LOGS = [
  { dt: '15/05/2025 10:32:15', user: 'Admin Maalal', action: 'Connexion réussie', resource: '—', ip: '165.***.***.12' },
  { dt: '15/05/2025 10:31:48', user: 'Yassine Benali', action: 'Modification véhicule', resource: 'Toyota Land Cruiser 2023', ip: '41.***.***.21' },
  { dt: '15/05/2025 10:30:58', user: 'Sarah El Amrani', action: 'Export données', resource: 'Ventes (Mai 2025)', ip: '41.***.***.21' },
  { dt: '15/05/2025 10:29:10', user: 'Nadia K.', action: 'Tentative de connexion échouée', resource: '—', ip: '185.***.***.12' },
  { dt: '15/05/2025 10:28:44', user: 'Omar Tazi', action: 'Suppression réservation', resource: 'RES-2025-00123', ip: '41.***.***.21' },
  { dt: '15/05/2025 10:27:33', user: 'Admin Maalal', action: 'Modification rôle', resource: 'Support', ip: '165.***.***.12' },
]

function SecuritySettingsContent() {
  const [activeTab, setActiveTab] = useState<'roles' | 'policies' | 'audit'>('roles')
  const [twoFactor, setTwoFactor] = useState(true)
  const [sessionLockout, setSessionLockout] = useState(true)
  const [searchAudit, setSearchAudit] = useState('')

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Paramètres</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Sécurité</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Rôles &amp; Audit</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/integrations"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
            <span>Clés API &amp; Webhooks</span>
          </Link>

          {activeTab === 'roles' && (
            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nouveau rôle</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Banner matching Reference #40b Screen 4 */}
      <div className="border-b border-[#222228] pb-3">
        <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-red-500" />
          <span>Sécurité des accès, Rôles &amp; Audit d&apos;activité</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Gérez le contrôle d&apos;accès basé sur les rôles (RBAC), les règles de connexion et l&apos;audit des actions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#222228] pb-1">
        {[
          { id: 'roles', label: 'Rôles & Permissions' },
          { id: 'policies', label: 'Politiques de sécurité & 2FA' },
          { id: 'audit', label: 'Audit d’activité / Connexions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-red-500 text-white bg-[#141418]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Rôles matching Reference #40b Screen 4 */}
      {activeTab === 'roles' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Rôles utilisateurs (RBAC)
              </h2>
              <p className="text-[10px] text-zinc-400">Définissez les privilèges d&apos;accès aux modules selon la fonction.</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">5 rôles configurés</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2.5 px-3">Rôle</th>
                  <th className="py-2.5 px-3 font-mono text-center">Utilisateurs</th>
                  <th className="py-2.5 px-3">Permissions clés</th>
                  <th className="py-2.5 px-3 text-center">Statut</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {ROLES.map((role, i) => (
                  <tr key={i} className="hover:bg-[#18181f]">
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                      <Lock className="h-3 w-3 text-zinc-500" />
                      <span>{role.name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-center text-zinc-200">{role.users}</td>
                    <td className="py-2.5 px-3 text-zinc-300">{role.perms}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                          role.status === 'Actif'
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                            : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                        }`}
                      >
                        {role.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button className="text-[10px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-[#18181f] border border-[#282834]">
                        Configurer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Politiques */}
      {activeTab === 'policies' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4 max-w-3xl">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
            Politiques d&apos;authentification &amp; sessions
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#16161c] border border-[#202028]">
              <div>
                <div className="font-bold text-white text-xs">Authentification à deux facteurs (2FA)</div>
                <div className="text-[10px] text-zinc-400">Exiger un code TOTP ou SMS pour tous les administrateurs.</div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactor(!twoFactor)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  twoFactor ? 'bg-emerald-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    twoFactor ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#16161c] border border-[#202028]">
              <div>
                <div className="font-bold text-white text-xs">Verrouillage automatique de session</div>
                <div className="text-[10px] text-zinc-400">Déconnexion après 15 minutes d&apos;inactivité.</div>
              </div>
              <button
                type="button"
                onClick={() => setSessionLockout(!sessionLockout)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  sessionLockout ? 'bg-emerald-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    sessionLockout ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Audit matching Reference #40b Screen 5 */}
      {activeTab === 'audit' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202028] pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Journal d&apos;audit des connexions et actions
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3 w-3 text-zinc-500" />
                <input
                  type="text"
                  value={searchAudit}
                  onChange={(e) => setSearchAudit(e.target.value)}
                  placeholder="Rechercher utilisateur, action..."
                  className="h-7 w-48 rounded border border-[#282834] bg-[#18181f] pl-7 pr-2 text-[10px] text-white"
                />
              </div>

              <button className="px-2.5 py-1 rounded bg-[#18181f] border border-[#282834] text-[10px] text-zinc-300 hover:text-white flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>Exporter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2.5 px-3 font-mono">Date / Heure</th>
                  <th className="py-2.5 px-3">Utilisateur</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Ressource</th>
                  <th className="py-2.5 px-3 font-mono text-right">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {AUDIT_LOGS.map((a, idx) => (
                  <tr key={idx} className="hover:bg-[#18181f]">
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{a.dt}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{a.user}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{a.action}</td>
                    <td className="py-2.5 px-3 text-zinc-300">{a.resource}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-500 text-[10px] text-right">{a.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2">
            <span>Affichage de 1 à 6 sur 562 activités</span>
            <div className="flex items-center gap-1">
              <button className="h-5 w-5 rounded border border-[#282834] bg-[#18181f] text-zinc-400">&lt;</button>
              <button className="h-5 w-5 rounded bg-red-600 text-white font-bold">1</button>
              <button className="h-5 w-5 rounded border border-[#282834] bg-[#18181f] text-zinc-400">2</button>
              <button className="h-5 w-5 rounded border border-[#282834] bg-[#18181f] text-zinc-400">&gt;</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SecuritySettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement des paramètres de sécurité...</div>}>
      <SecuritySettingsContent />
    </Suspense>
  )
}
