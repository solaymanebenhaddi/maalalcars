'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  Download,
  Phone,
  FileText,
  Eye,
  Edit2,
  Printer,
  Check,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

const CONFORMITY_DATA = [
  { name: 'Conformes', value: 5, color: '#10b981' },
  { name: 'À vérifier', value: 2, color: '#f59e0b' },
  { name: 'Non conformes', value: 0, color: '#ef4444' },
]

const PROGRESS_DATA = [
  { name: 'Complété', value: 65, color: '#06b6d4' },
  { name: 'Restant', value: 35, color: '#202028' },
]

function RegistrationDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'IMM-2025-0056'
  const dossierCode = decodeURIComponent(rawId)

  const tabParam = searchParams?.get('tab')
  const initialTab =
    tabParam === 'documents'
      ? 'documents'
      : tabParam === 'history'
      ? 'history'
      : tabParam === 'steps'
      ? 'steps'
      : tabParam === 'fees'
      ? 'fees'
      : 'overview'

  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'documents' | 'fees' | 'history'>(initialTab)
  const isMounted = useMounted()

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/registrations"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux immatriculations</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Dossiers</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">{dossierCode}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Récépissé ${dossierCode}`)}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Printer className="h-3.5 w-3.5 text-zinc-400" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Header Banner matching Reference #35 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white font-mono">Dossier {dossierCode}</h1>
            <span className="rounded bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-400">
              En cours
            </span>
            <span className="text-xs text-zinc-400">· Toyota Land Cruiser VR-R 4.0L Essence</span>
          </div>
          <div className="text-xs text-zinc-400">
            Suivez chaque étape du dossier et l&apos;avancement en temps réel.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-2 text-xs font-bold text-zinc-200 hover:text-white">
            <span>Actions</span>
            <span className="text-[10px] text-zinc-500">▼</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs matching Reference #35 */}
      <div className="flex border-b border-[#222228] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Aperçu
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'steps'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Étapes
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'documents'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'fees'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Frais
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'history'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Historique
        </button>
      </div>

      {/* Tab 1: Aperçu matching Reference #35 Screen 3 */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Informations dossier */}
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Informations dossier
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Client</span>
                  <div className="font-semibold text-white">Yassine Benali</div>
                  <div className="text-[10px] text-zinc-400 font-mono">06 12 34 56 78</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Véhicule</span>
                  <div className="font-semibold text-white">Toyota Land Cruiser VR-R 4.0L</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Immatriculation</span>
                  <div className="text-amber-400 font-semibold">En attente</div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#202028]">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">Créé le</span>
                    <div className="font-mono text-zinc-300">15/05/2025</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">Agent assigné</span>
                    <div className="font-semibold text-white">Imane Zahiri</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Avancement du dossier (Donut Chart 65%) */}
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Avancement du dossier
              </h2>
              <div className="relative flex items-center justify-center my-1">
                {isMounted && (
                  <div className="h-28 w-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PROGRESS_DATA}
                          innerRadius={36}
                          outerRadius={48}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                        >
                          {PROGRESS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono font-black text-xl text-cyan-400">65%</span>
                </div>
              </div>
              <div className="space-y-1 text-center">
                <div className="text-[11px] text-zinc-300">
                  Étape actuelle : <strong className="text-white">Dossier en préfecture</strong>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Prochaine étape : <span className="text-zinc-200">Attente édition CG</span>
                </div>
              </div>
            </div>

            {/* Card 3: Documents requis */}
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2.5 shadow-md">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Documents requis
              </h2>
              <div className="space-y-1.5 text-xs">
                {[
                  { name: "Carte nationale d'identité", status: 'Validé', ok: true },
                  { name: "Facture d'achat", status: 'Validé', ok: true },
                  { name: 'Quitus fiscal', status: 'En attente', ok: false },
                  { name: 'Assurance', status: 'Validé', ok: true },
                  { name: 'Contrôle technique', status: 'Validé', ok: true },
                  { name: 'Mandat', status: 'En attente', ok: false },
                  { name: 'Justificatif de domicile', status: 'En attente', ok: false },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 truncate max-w-[160px]">{doc.name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        doc.ok
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Étapes du dossier (Horizontal Step Timeline matching Reference #35 Screen 3) */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Étapes du dossier
            </h2>
            <div className="grid grid-cols-5 gap-2 text-center pt-2">
              {/* Step 1 */}
              <div className="space-y-1.5">
                <div className="mx-auto h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <Check className="h-4 w-4" />
                </div>
                <div className="font-bold text-white text-[11px]">Collecte docs</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Terminé</div>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5">
                <div className="mx-auto h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <Check className="h-4 w-4" />
                </div>
                <div className="font-bold text-white text-[11px]">Contrôle dossier</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Terminé</div>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5">
                <div className="mx-auto h-7 w-7 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="font-bold text-white text-[11px]">Préfecture</div>
                <div className="text-[10px] text-blue-400 font-semibold">En cours</div>
              </div>

              {/* Step 4 */}
              <div className="space-y-1.5">
                <div className="mx-auto h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                  4
                </div>
                <div className="font-bold text-zinc-400 text-[11px]">Édition CG</div>
                <div className="text-[10px] text-zinc-500">En attente</div>
              </div>

              {/* Step 5 */}
              <div className="space-y-1.5">
                <div className="mx-auto h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                  5
                </div>
                <div className="font-bold text-zinc-400 text-[11px]">Remise client</div>
                <div className="text-[10px] text-zinc-500">En attente</div>
              </div>
            </div>

            {/* Bottom notes & action buttons */}
            <div className="pt-4 border-t border-[#202028] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-zinc-400 text-xs">
                <span className="font-bold text-white">Notes internes : </span>
                <span>Client disponible demain pour signature du mandat.</span>
                <span className="text-[10px] text-zinc-500 font-mono ml-2">Modifié le 15/05/2025 par Imane Zahiri</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
                  <Phone className="h-3 w-3 text-zinc-400" />
                  <span>Contacter le client</span>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  <FileText className="h-3 w-3" />
                  <span>Voir les documents</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Étapes */}
      {activeTab === 'steps' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Détail des étapes administratives
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">1. Collecte des documents client &amp; véhicule</div>
                <div className="text-[10px] text-zinc-400">CNI, Facture, Certificat d&apos;immatriculation précédent</div>
              </div>
              <span className="text-emerald-400 font-bold text-xs">Terminé</span>
            </div>
            <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">2. Contrôle de conformité et validation interne</div>
                <div className="text-[10px] text-zinc-400">Validé par Omar Bennis le 15/05/2025</div>
              </div>
              <span className="text-emerald-400 font-bold text-xs">Terminé</span>
            </div>
            <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">3. Dépôt et enregistrement en préfecture (Aïn Chock)</div>
                <div className="text-[10px] text-zinc-400">Accusé de réception préfecture n° AR-884920</div>
              </div>
              <span className="text-blue-400 font-bold text-xs">En cours</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Documents (Screen 4: DOCUMENTS OFFICIELS / CONFORMITÉ) */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left table (span-8) */}
          <div className="lg:col-span-8 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#222228] pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Documents du dossier
              </h2>
              <button className="text-[11px] text-red-400 hover:underline">
                + Ajouter un document
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] text-[10px] font-semibold text-zinc-400 uppercase">
                    <th className="pb-2">Document</th>
                    <th className="pb-2">Statut</th>
                    <th className="pb-2">Conformité</th>
                    <th className="pb-2 font-mono">Date ajout</th>
                    <th className="pb-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {[
                    { doc: "Carte nationale d'identité", st: 'Validé', conf: 'Conforme', date: '15/05/2025' },
                    { doc: "Facture d'achat", st: 'Validé', conf: 'Conforme', date: '15/05/2025' },
                    { doc: 'Quitus fiscal', st: 'En attente', conf: 'À vérifier', date: '—' },
                    { doc: 'Assurance', st: 'Validé', conf: 'Conforme', date: '15/05/2025' },
                    { doc: 'Contrôle technique', st: 'Validé', conf: 'Conforme', date: '14/05/2025' },
                    { doc: 'Mandat', st: 'En attente', conf: 'À vérifier', date: '—' },
                    { doc: 'Justificatif de domicile', st: 'En attente', conf: 'À vérifier', date: '—' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#18181f]">
                      <td className="py-2.5 font-medium text-white">{row.doc}</td>
                      <td className="py-2.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            row.st === 'Validé'
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                              : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          }`}
                        >
                          {row.st}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            row.conf === 'Conforme'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {row.conf}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-zinc-400 text-[10px]">{row.date}</td>
                      <td className="py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-1 rounded text-zinc-400 hover:text-white">
                            <Eye className="h-3 w-3" />
                          </button>
                          <button className="p-1 rounded text-zinc-400 hover:text-white">
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right card: Contrôle conformité Donut Gauge 71% (span-4) */}
          <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-xl space-y-3">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Contrôle conformité
              </h2>

              <div className="relative flex items-center justify-center my-3">
                {isMounted && (
                  <div className="h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={CONFORMITY_DATA}
                          innerRadius={42}
                          outerRadius={56}
                          dataKey="value"
                        >
                          {CONFORMITY_DATA.map((entry, index) => (
                            <Cell key={`cell-conf-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono font-black text-xl text-white">71%</span>
                  <span className="text-[9px] text-zinc-400">Conformité globale</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Conformes
                  </span>
                  <span className="font-mono font-bold text-white">5</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    À vérifier
                  </span>
                  <span className="font-mono font-bold text-amber-400">2</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Non conformes
                  </span>
                  <span className="font-mono font-bold text-zinc-400">0</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Téléchargement complet de l’archive')}
              className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Télécharger tout</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Frais */}
      {activeTab === 'fees' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Décomposition des frais d&apos;immatriculation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c]">
              <span className="text-[10px] text-zinc-400 uppercase">Droits de timbre fiscaux</span>
              <div className="font-mono font-bold text-white text-base mt-1">750 DH</div>
            </div>
            <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c]">
              <span className="text-[10px] text-zinc-400 uppercase">Frais de dossier et démarches</span>
              <div className="font-mono font-bold text-white text-base mt-1">200 DH</div>
            </div>
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold">Total à encaisser</span>
              <div className="font-mono font-bold text-emerald-400 text-base mt-1">950 DH HT</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Historique (Screen 5: HISTORIQUE DÉMARCHES / VALIDATION) */}
      {activeTab === 'history' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222228] pb-3">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Traçabilité complète des actions et validations
              </h2>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Historique auditable de chaque étape administrative et notification envoyée.
              </p>
            </div>
            <button
              onClick={() => alert('Export historique')}
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter l&apos;historique</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="pb-2.5 px-3">Date &amp; Heure</th>
                  <th className="pb-2.5 px-3">Utilisateur</th>
                  <th className="pb-2.5 px-3">Action</th>
                  <th className="pb-2.5 px-3">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {[
                  { dt: '15/05/2025 14:32', user: 'Imane Zahiri', act: 'Dossier créé', det: "Création du dossier d'immatriculation" },
                  { dt: '15/05/2025 14:45', user: 'Imane Zahiri', act: 'Documents ajoutés', det: '3 documents ajoutés' },
                  { dt: '15/05/2025 15:10', user: 'Omar Bennis', act: 'Contrôle documents', det: 'Documents conformes' },
                  { dt: '15/05/2025 16:05', user: 'Imane Zahiri', act: 'Dossier envoyé en préfecture', det: 'Dossier transmis' },
                  { dt: '16/05/2025 09:20', user: 'Préfecture', act: 'Dossier reçu', det: 'Accusé de réception' },
                  { dt: '16/05/2025 11:45', user: 'Préfecture', act: 'Contrôle en cours', det: 'Instruction en cours' },
                  { dt: '17/05/2025 10:15', user: 'Préfecture', act: 'Dossier validé', det: 'Prêt édition CG' },
                  { dt: '17/05/2025 14:00', user: 'Imane Zahiri', act: 'Client notifié', det: 'Notification envoyée' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#18181f]">
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{item.dt}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{item.user}</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-medium">{item.act}</td>
                    <td className="py-2.5 px-3 text-zinc-300">{item.det}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RegistrationDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement du dossier...</div>}>
      <RegistrationDetailContent />
    </Suspense>
  )
}
