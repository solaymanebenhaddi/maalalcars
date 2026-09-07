'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Search,
  Eye,
  FileText,
} from 'lucide-react'

interface TransactionItem {
  id: number
  dateTime: string
  reference: string
  type: 'Encaissement' | 'Décaissement'
  category: string
  party: string
  method: string
  amount: string
  isPositive: boolean
  balance: string
}

const TRANSACTIONS: TransactionItem[] = [
  { id: 1, dateTime: '22/05/2025 10:24', reference: 'ENC-2025-0056', type: 'Encaissement', category: 'Vente véhicule', party: 'Imane Zahri', method: 'Virement', amount: '28 900 DH', isPositive: true, balance: '182 450 DH' },
  { id: 2, dateTime: '22/05/2025 09:15', reference: 'DEC-2025-0048', type: 'Décaissement', category: 'Achat véhicules', party: 'Auto Market Rabat', method: 'Virement', amount: '-38 900 DH', isPositive: false, balance: '153 550 DH' },
  { id: 3, dateTime: '21/05/2025 15:42', reference: 'ENC-2025-0055', type: 'Encaissement', category: 'Vente véhicule', party: 'Youssef El Idrissi', method: 'Espèces', amount: '12 400 DH', isPositive: true, balance: '192 450 DH' },
  { id: 4, dateTime: '21/05/2025 11:08', reference: 'DEC-2025-0047', type: 'Décaissement', category: 'Loyer', party: 'Local Maalal Cars', method: 'Virement', amount: '-12 000 DH', isPositive: false, balance: '180 050 DH' },
  { id: 5, dateTime: '20/05/2025 15:21', reference: 'ENC-2025-0054', type: 'Encaissement', category: 'Vente véhicule', party: 'Karim Tala', method: 'Chèque', amount: '9 800 DH', isPositive: true, balance: '192 050 DH' },
  { id: 6, dateTime: '20/05/2025 13:09', reference: 'DEC-2025-0046', type: 'Décaissement', category: 'Carburant', party: 'Afriquia', method: 'Carte bancaire', amount: '-5 450 DH', isPositive: false, balance: '182 250 DH' },
  { id: 7, dateTime: '19/05/2025 13:27', reference: 'ENC-2025-0052', type: 'Encaissement', category: 'Vente véhicule', party: 'Omar Bennis', method: 'Espèces', amount: '7 350 DH', isPositive: true, balance: '187 650 DH' },
]

export default function TransactionsHistoryPage() {
  const [search, setSearch] = useState('')

  const filteredTransactions = TRANSACTIONS.filter(
    (t) =>
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.party.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/finance"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au tableau de bord</span>
        </Link>
      </div>

      {/* Main Container matching Reference #23 Screen 5 (Transactions) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Historique des transactions
            </h1>
            <p className="text-xs text-zinc-400">
              Finance &gt; Historique
            </p>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Type: Tous</option>
            <option>Encaissement</option>
            <option>Décaissement</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Catégorie: Toutes</option>
            <option>Vente véhicule</option>
            <option>Achat véhicules</option>
            <option>Loyer</option>
            <option>Carburant</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Mode: Tous</option>
            <option>Virement</option>
            <option>Espèces</option>
            <option>Chèque</option>
            <option>Carte bancaire</option>
          </select>

          <input
            type="text"
            defaultValue="01/05/2025 - 31/05/2025"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <div className="relative col-span-2 sm:col-span-4 lg:col-span-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* 4 Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Total transactions</div>
            <div className="font-mono font-black text-white text-sm sm:text-base mt-1">73</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Encaissements</div>
            <div className="font-mono font-black text-cyan-400 text-sm sm:text-base mt-1">458 760 DH</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Décaissements</div>
            <div className="font-mono font-black text-red-400 text-sm sm:text-base mt-1">276 310 DH</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Solde net</div>
            <div className="font-mono font-black text-emerald-400 text-sm sm:text-base mt-1">+182 450 DH</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Client / Fournisseur</th>
                <th className="py-2.5 px-3">Mode de paiement</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant</th>
                <th className="py-2.5 px-3 text-right font-mono">Solde après</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-mono text-zinc-400 text-[11px]">{t.dateTime}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{t.reference}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        t.type === 'Encaissement'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{t.category}</td>
                  <td className="py-3 px-3 font-medium text-white">{t.party}</td>
                  <td className="py-3 px-3 text-zinc-300">{t.method}</td>
                  <td className={`py-3 px-3 text-right font-mono font-bold ${t.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.amount}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-300">{t.balance}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Voir">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Justificatif">
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 7 sur 73 transactions</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              1
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              2
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              3
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              4
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              5
            </button>
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              10
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
