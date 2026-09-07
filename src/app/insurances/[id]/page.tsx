'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  ShieldCheck,
  Download,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'

interface InsurancePaymentRecord {
  id: string
  date: string
  type: string
  amount: number
  method: string
  status: 'Payé' | 'En attente'
}

const INITIAL_PAYMENTS: InsurancePaymentRecord[] = [
  { id: '1', date: '15/05/2025', type: 'Prime annuelle', amount: 1250, method: 'Virement bancaire', status: 'Payé' },
  { id: '2', date: '15/05/2024', type: 'Prime annuelle', amount: 1200, method: 'Virement bancaire', status: 'Payé' },
  { id: '3', date: '15/05/2023', type: 'Prime annuelle', amount: 1150, method: 'Virement bancaire', status: 'Payé' },
  { id: '4', date: '15/05/2022', type: 'Prime annuelle', amount: 1100, method: 'Virement bancaire', status: 'Payé' },
  { id: '5', date: '15/05/2021', type: 'Prime annuelle', amount: 1050, method: 'Virement bancaire', status: 'Payé' },
]

export default function InsuranceDetailPage() {
  const params = useParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'ASS-2025-0048'
  const policyCode = decodeURIComponent(rawId)

  const [activeTab, setActiveTab] = useState<'overview' | 'guarantees' | 'schedules' | 'documents' | 'history'>('overview')
  const [renewToast, setRenewToast] = useState(false)

  const handleRenew = () => {
    setRenewToast(true)
    setTimeout(() => setRenewToast(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #34 Sub-screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/insurances"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux assurances</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Accueil</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-300">Assurances</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Détail contrat</span>
        </div>

        <Link
          href="/insurances/claims/new"
          className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
        >
          <span>Déclarer un sinistre pour ce contrat</span>
        </Link>
      </div>

      {/* Header Banner matching Reference #34 Sub-screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white">Toyota Land Cruiser 2023</h1>
            <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Active
            </span>
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            Contrat <strong className="text-white">{policyCode}</strong> · VIN: JTMHV02J804567890
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Prime annuelle</div>
            <div className="text-lg font-black font-mono text-emerald-400">1 250 DH</div>
          </div>

          <button
            onClick={handleRenew}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Renouveler</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs matching Reference #34 Sub-screen 3 */}
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
          onClick={() => setActiveTab('guarantees')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'guarantees'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Garanties
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'schedules'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Échéances
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
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'history'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Historique &amp; Paiements
        </button>
      </div>

      {/* Tab 1: Aperçu matching Sub-screen 3 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Informations contrat
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Assureur</span>
                <div className="font-bold text-white">AXA Assurance</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Type de contrat</span>
                <div className="font-bold text-cyan-400">Tous risques</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Date d&apos;effet</span>
                <div className="font-mono text-zinc-200">15/01/2025</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Date d&apos;échéance</span>
                <div className="font-mono text-zinc-200">15/01/2026</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Durée</span>
                <div className="text-zinc-200">12 mois</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Usage</span>
                <div className="text-zinc-200">Usage privé</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Kilométrage annuel</span>
                <div className="font-mono text-zinc-200">12 000 km</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Localisation</span>
                <div className="text-zinc-200">Casablanca, Maroc</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Échéances &amp; suivi
            </h2>
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Échéance annuelle</div>
                  <div className="text-[10px] font-mono text-zinc-400">15/01/2026</div>
                </div>
                <span className="font-mono font-bold text-amber-400 text-xs">364 jours</span>
              </div>

              <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Paiement prochain</div>
                  <div className="text-[10px] font-mono text-zinc-400">15/01/2026</div>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-xs">1 250 DH</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Garanties */}
      {activeTab === 'guarantees' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Tableau des garanties souscrites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              'Responsabilité civile (Illimitée)',
              'Défense et recours',
              'Dommages collision & accidents',
              'Vol et tentative de vol',
              'Incendie, explosion et forces de la nature',
              'Bris de glaces sans franchise',
              'Assistance dépannage 24/7 au Maroc',
              'Garantie du conducteur',
            ].map((g, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-[#202028] bg-[#16161c]">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-white">{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Échéances */}
      {activeTab === 'schedules' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Calendrier des appels de primes
          </h2>
          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16161c] text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Échéance</th>
                  <th className="p-3">Nature</th>
                  <th className="p-3 text-right">Montant</th>
                  <th className="p-3 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                <tr>
                  <td className="p-3 font-mono text-white">15/01/2026</td>
                  <td className="p-3 text-zinc-300">Renouvellement annuel 2026-2027</td>
                  <td className="p-3 text-right font-mono font-bold text-white">1 250 DH</td>
                  <td className="p-3 text-center">
                    <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      À venir
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === 'documents' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Pièces jointes au contrat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'Attestation_assurance_2025.pdf', size: '240 Ko' },
              { name: 'Carte_verte_maroc.pdf', size: '180 Ko' },
              { name: 'Contrat_signe_AXA.pdf', size: '1.2 Mo' },
            ].map((doc, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white truncate max-w-[180px]">{doc.name}</div>
                  <div className="text-[10px] text-zinc-400">{doc.size}</div>
                </div>
                <button className="p-1.5 rounded-lg border border-[#282834] text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Historique Paiements / Renouvellements matching Reference #34 Sub-screen 4 */}
      {activeTab === 'history' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Historique des paiements &amp; renouvellements
            </h2>
            <button
              onClick={() => alert('Export du relevé des primes')}
              className="text-xs text-red-400 hover:underline"
            >
              Voir tous les paiements
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 font-mono text-right">Montant</th>
                  <th className="py-2.5 px-3">Mode de paiement</th>
                  <th className="py-2.5 px-3 text-center">Statut</th>
                  <th className="py-2.5 px-3 text-center">Reçu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {INITIAL_PAYMENTS.map((item) => (
                  <tr key={item.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-zinc-300">{item.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{item.type}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                      {item.amount.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300">{item.method}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => alert(`Téléchargement de la quittance du ${item.date}`)}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                        title="Télécharger la quittance"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {renewToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Procédure de renouvellement de police initiée auprès d&apos;AXA !</span>
        </div>
      )}
    </div>
  )
}
