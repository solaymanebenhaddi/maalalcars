'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Key,
  ShieldCheck,
  Download,
  Plus,
  ArrowUpRight,
  Copy,
  Trash2,
} from 'lucide-react'

function IntegrationsContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'api-webhooks' | 'logs'>('overview')
  const [logFilter, setLogFilter] = useState('Tous')

  const LOGS = [
    { dt: '15/05/2025 10:32:15', lvl: 'INFO', srv: 'API REST', mtd: 'GET', ep: '/api/v1/vehicles', st: 200, dur: '120 ms', ip: '165.***.***.12' },
    { dt: '15/05/2025 10:31:48', lvl: 'INFO', srv: 'Mobile App', mtd: 'POST', ep: '/api/v1/reservations', st: 201, dur: '210 ms', ip: '41.***.***.21' },
    { dt: '15/05/2025 10:31:12', lvl: 'WARN', srv: 'API REST', mtd: 'GET', ep: '/api/v1/login', st: 401, dur: '95 ms', ip: '185.***.***.12' },
    { dt: '15/05/2025 10:30:58', lvl: 'ERROR', srv: 'API REST', mtd: 'GET', ep: '/api/v1/documents', st: 500, dur: '1 230 ms', ip: '165.***.***.12' },
    { dt: '15/05/2025 10:30:22', lvl: 'INFO', srv: 'Webhook', mtd: 'POST', ep: '/webhooks/reservation', st: 200, dur: '340 ms', ip: '104.***.***.33' },
    { dt: '15/05/2025 10:29:47', lvl: 'INFO', srv: 'API REST', mtd: 'GET', ep: '/api/v1/clients', st: 200, dur: '110 ms', ip: '41.***.***.21' },
    { dt: '15/05/2025 10:29:10', lvl: 'WARN', srv: 'API REST', mtd: 'DELETE', ep: '/api/v1/vehicles/125', st: 403, dur: '90 ms', ip: '193.***.***.12' },
  ]

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
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
          <span className="text-zinc-300">Paramètres</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Intégrations &amp; API</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/security"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
            <span>Sécurité &amp; Rôles</span>
          </Link>

          <button
            onClick={() => setActiveTab('api-webhooks')}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Générer une clé API</span>
          </button>
        </div>
      </div>

      {/* Header Banner matching Reference #40b */}
      <div className="border-b border-[#222228] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-red-500" />
            <span>Intégrations, Clés API &amp; Sécurité</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Connectez, automatisez et sécurisez votre écosystème MAALAL CARS avec traçabilité complète.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
          <span>Période : 24h</span>
          <span className="text-zinc-600">·</span>
          <span className="text-emerald-400 font-semibold">● API Active</span>
        </div>
      </div>

      {/* Navigation Tabs matching Reference #40b */}
      <div className="flex items-center gap-1 border-b border-[#222228] pb-1">
        {[
          { id: 'overview', label: 'Aperçu & Écosystème' },
          { id: 'api-webhooks', label: 'Clés API & Webhooks' },
          { id: 'logs', label: 'Journaux / Logs API' },
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

      {/* Tab 1: Overview matching Reference #40b Screen 1 */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* 5 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 font-semibold">Appels API (24h)</span>
              <div className="text-xl font-black font-mono text-white mt-1">12 450</div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+ 18,7% vs hier</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 font-semibold">Requêtes réussies</span>
              <div className="text-xl font-black font-mono text-emerald-400 mt-1">11 925</div>
              <div className="text-[10px] text-zinc-400 mt-1">95,8% de succès</div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 font-semibold">Erreurs API</span>
              <div className="text-xl font-black font-mono text-red-400 mt-1">525</div>
              <div className="text-[10px] text-zinc-400 mt-1">4,2% du total</div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 font-semibold">Temps de réponse</span>
              <div className="text-xl font-black font-mono text-cyan-400 mt-1">128 ms</div>
              <div className="text-[10px] text-emerald-400 mt-1">↓ 12% vs hier</div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 font-semibold">Limite restante</span>
              <div className="text-xl font-black font-mono text-emerald-400 mt-1">78%</div>
              <div className="text-[10px] text-zinc-400 mt-1 font-mono">7 800 / 10 000</div>
            </div>
          </div>

          {/* Middle Row: 3 cards matching Reference #40b Screen 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plateformes connectées */}
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Plateformes connectées
                </h2>
                <span className="text-[10px] text-emerald-400 font-mono">5 actives</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { name: 'Stripe', sub: 'Paiements en ligne', ok: true },
                  { name: 'SendGrid', sub: 'Emails transactionnels', ok: true },
                  { name: 'Zapier', sub: 'Automatisations CRM', ok: true },
                  { name: 'Google Sheets', sub: 'Rapports financiers', ok: true },
                  { name: 'Slack', sub: 'Notifications internes', ok: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#16161c] border border-[#202028]">
                    <div>
                      <div className="font-bold text-white text-xs">{item.name}</div>
                      <div className="text-[9px] text-zinc-400">{item.sub}</div>
                    </div>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-400">
                      Connecté
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statut des synchronisations */}
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Statut des synchronisations
                </h2>
                <span className="text-[10px] text-zinc-400">Temps réel</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'Sync véhicules (Stock → Site)', time: 'Dernière sync : il y a 5 min', st: 'Succès', ok: true },
                  { name: 'Sync réservations (Site → CRM)', time: 'Dernière sync : il y a 3 min', st: 'Succès', ok: true },
                  { name: 'Sync clients (CRM → Mailing)', time: 'Dernière sync : il y a 12 min', st: 'En cours', ok: false },
                  { name: 'Export comptable (Ventes → ERP)', time: 'Dernière sync : il y a 45 min', st: 'Succès', ok: true },
                ].map((sync, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#16161c] border border-[#202028] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-xs">{sync.name}</div>
                      <div className="text-[9px] text-zinc-400 font-mono">{sync.time}</div>
                    </div>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                        sync.ok
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {sync.st}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertes sécurité */}
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Alertes sécurité
                </h2>
                <Link href="/settings/security" className="text-[10px] text-red-400 hover:underline">
                  Voir tout &rarr;
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-400 text-xs">Tentatives d&apos;accès échouées</span>
                    <span className="font-mono text-[9px] text-zinc-400">10:32</span>
                  </div>
                  <p className="text-[10px] text-zinc-300">
                    12 tentatives détectées depuis l&apos;IP 185.***.***.12.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-xs">Clé API expirant bientôt</span>
                    <span className="font-mono text-[9px] text-zinc-400">09:15</span>
                  </div>
                  <p className="text-[10px] text-zinc-300">
                    Clé « Mobile App » expire dans 3 jours.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-[#16161c] border border-[#202028] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 text-xs">Permissions trop larges</span>
                    <span className="font-mono text-[9px] text-zinc-400">Hier</span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Rôle « Support » avec accès suppression activé.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Intégrations récentes table matching Reference #40b Screen 1 */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Intégrations récentes
            </h2>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                    <th className="py-2.5 px-3">Nom</th>
                    <th className="py-2.5 px-3">Service</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-center">Statut</th>
                    <th className="py-2.5 px-3 font-mono">Dernier appel</th>
                    <th className="py-2.5 px-3 font-mono text-center">Erreurs (24h)</th>
                    <th className="py-2.5 px-3 font-mono text-center">Utilisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {[
                    { n: 'MAALAL Site Web', s: 'API REST', t: 'Webhook', st: 'Actif', la: 'Il y a 1 min', err: 0, u: '24%' },
                    { n: 'Mobile App Conseillers', s: 'API REST', t: 'Clé API', st: 'Actif', la: 'Il y a 2 min', err: 1, u: '12%' },
                    { n: 'Partenaire AutoScout', s: 'API REST', t: 'Clé API', st: 'Actif', la: 'Il y a 5 min', err: 0, u: '32%' },
                    { n: 'Export Comptabilité', s: 'API REST', t: 'Clé API', st: 'Actif', la: 'Il y a 10 min', err: 0, u: '27%' },
                    { n: 'Outil Marketing SMS', s: 'API REST', t: 'Webhook', st: 'Actif', la: 'Il y a 15 min', err: 2, u: '11%' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#18181f]">
                      <td className="py-2.5 px-3 font-bold text-white">{row.n}</td>
                      <td className="py-2.5 px-3 text-zinc-300">{row.s}</td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[9px] text-zinc-300">
                          {row.t}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                          {row.st}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{row.la}</td>
                      <td className="py-2.5 px-3 font-mono text-center font-bold text-zinc-200">{row.err}</td>
                      <td className="py-2.5 px-3 font-mono text-center font-bold text-cyan-400">{row.u}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Clés API & Webhooks matching Reference #40b Screen 2 */}
      {activeTab === 'api-webhooks' && (
        <div className="space-y-4">
          {/* Section Clés API */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Clés API actives
                </h2>
                <p className="text-[10px] text-zinc-400">Générez et révoquez des accès programmatiques sécurisés.</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white">
                + Générer une clé API
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                    <th className="py-2.5 px-3">Nom</th>
                    <th className="py-2.5 px-3 font-mono">Clé / Identifiant</th>
                    <th className="py-2.5 px-3">Permissions</th>
                    <th className="py-2.5 px-3 text-center">Statut</th>
                    <th className="py-2.5 px-3 font-mono">Créée le</th>
                    <th className="py-2.5 px-3 font-mono">Expire le</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {[
                    { n: 'Back Office', k: 'mc_live_••••••••••••q93', p: 'Lecture / Écriture', st: 'Active', c: '12/05/2025', e: 'Jamais' },
                    { n: 'Mobile App', k: 'mc_live_••••••••••••o2v1', p: 'Lecture', st: 'Active', c: '23/04/2025', e: '18/05/2025' },
                    { n: 'Partenaire Site', k: 'mc_live_••••••••••••964', p: 'Lecture', st: 'Active', c: '22/04/2025', e: '22/07/2025' },
                    { n: 'Export Comptable', k: 'mc_live_••••••••••••die7', p: 'Lecture / Écriture', st: 'Active', c: '15/04/2025', e: 'Jamais' },
                    { n: 'Marketing Tools', k: 'mc_live_••••••••••••g513', p: 'Lecture', st: 'Inactive', c: '05/04/2025', e: 'Expirée' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#18181f]">
                      <td className="py-2.5 px-3 font-bold text-white">{row.n}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{row.k}</td>
                      <td className="py-2.5 px-3 text-zinc-300">{row.p}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                            row.st === 'Active'
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                              : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {row.st}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{row.c}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{row.e}</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-1 rounded text-zinc-400 hover:text-white" title="Copier">
                            <Copy className="h-3 w-3" />
                          </button>
                          <button className="p-1 rounded text-zinc-400 hover:text-red-400" title="Révoquer">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section Webhooks */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Webhooks configurés
                </h2>
                <p className="text-[10px] text-zinc-400">Événements poussés automatiquement vers vos serveurs.</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-[#282834] bg-[#18181f] text-xs font-semibold text-zinc-200 hover:text-white">
                + Ajouter un webhook
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                    <th className="py-2.5 px-3">Événement</th>
                    <th className="py-2.5 px-3 font-mono">URL de destination</th>
                    <th className="py-2.5 px-3 text-center">Statut</th>
                    <th className="py-2.5 px-3 font-mono">Dernière livraison</th>
                    <th className="py-2.5 px-3 font-mono text-center">Échecs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {[
                    { ev: 'Réservation créée', u: 'https://api.monsite.com/webhooks/reservation', st: 'Actif', dl: 'Il y a 2 min', f: 0 },
                    { ev: 'Paiement reçu', u: 'https://api.monsite.com/webhooks/paiement', st: 'Actif', dl: 'Il y a 5 min', f: 0 },
                    { ev: 'Stock mis à jour', u: 'https://api.monsite.com/webhooks/stock', st: 'Actif', dl: 'Il y a 1 min', f: 0 },
                  ].map((w, i) => (
                    <tr key={i} className="hover:bg-[#18181f]">
                      <td className="py-2.5 px-3 font-bold text-white">{w.ev}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{w.u}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                          {w.st}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{w.dl}</td>
                      <td className="py-2.5 px-3 font-mono text-center font-bold text-emerald-400">{w.f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Logs matching Reference #40b Screen 3 */}
      {activeTab === 'logs' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202028] pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Journaux d&apos;appels API (Logs en direct)
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="h-7 rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-zinc-300"
              >
                <option value="Tous">Tous les niveaux</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
              <button className="px-2.5 py-1 rounded bg-[#18181f] border border-[#282834] text-[10px] text-zinc-300 hover:text-white flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>Exporter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase font-mono">
                  <th className="py-2 px-2.5">Date / Heure</th>
                  <th className="py-2 px-2.5">Niveau</th>
                  <th className="py-2 px-2.5">Service</th>
                  <th className="py-2 px-2.5">Méthode</th>
                  <th className="py-2 px-2.5">Endpoint</th>
                  <th className="py-2 px-2.5 text-center">Statut</th>
                  <th className="py-2 px-2.5 text-right">Durée</th>
                  <th className="py-2 px-2.5 text-right">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px] font-mono">
                {LOGS.filter((l) => (logFilter === 'Tous' ? true : l.lvl === logFilter)).map((log, i) => (
                  <tr key={i} className="hover:bg-[#18181f]">
                    <td className="py-2 px-2.5 text-zinc-400 text-[10px]">{log.dt}</td>
                    <td className="py-2 px-2.5">
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          log.lvl === 'INFO'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : log.lvl === 'WARN'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {log.lvl}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-zinc-300 font-sans">{log.srv}</td>
                    <td className="py-2 px-2.5 font-bold text-cyan-400">{log.mtd}</td>
                    <td className="py-2 px-2.5 text-white">{log.ep}</td>
                    <td className="py-2 px-2.5 text-center">
                      <span
                        className={`font-bold ${
                          log.st >= 200 && log.st < 300
                            ? 'text-emerald-400'
                            : log.st >= 400 && log.st < 500
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {log.st}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-right text-zinc-400 text-[10px]">{log.dur}</td>
                    <td className="py-2 px-2.5 text-right text-zinc-500 text-[10px]">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2">
            <span>Affichage de 1 à 7 sur 1 248 journaux</span>
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

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement des intégrations...</div>}>
      <IntegrationsContent />
    </Suspense>
  )
}
