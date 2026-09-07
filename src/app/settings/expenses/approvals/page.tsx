'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Users,
  X,
} from 'lucide-react'

interface ApprovalRuleItem {
  id: number
  name: string
  scope: string
  minAmount: number
  maxAmount: number | null
  levels: number
  status: 'Active' | 'Inactive'
}

const INITIAL_RULES: ApprovalRuleItem[] = [
  { id: 1, name: 'Moins de 1 000 DH', scope: 'Toutes catégories', minAmount: 0, maxAmount: 1000, levels: 1, status: 'Active' },
  { id: 2, name: 'De 1 001 à 5 000 DH', scope: 'Toutes catégories', minAmount: 1001, maxAmount: 5000, levels: 2, status: 'Active' },
  { id: 3, name: 'De 5 001 à 20 000 DH', scope: 'Toutes catégories', minAmount: 5001, maxAmount: 20000, levels: 2, status: 'Active' },
  { id: 4, name: 'Plus de 20 000 DH', scope: 'Toutes catégories', minAmount: 20001, maxAmount: null, levels: 3, status: 'Active' },
  { id: 5, name: 'Carburant (tous montants)', scope: 'Carburant', minAmount: 0, maxAmount: null, levels: 1, status: 'Active' },
  { id: 6, name: 'Urgence (tous montants)', scope: 'Toutes catégories', minAmount: 0, maxAmount: null, levels: 1, status: 'Active' },
]

export default function ExpenseApprovalsSettingsPage() {
  const [rules, setRules] = useState<ApprovalRuleItem[]>(INITIAL_RULES)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newScope, setNewScope] = useState('Toutes catégories')
  const [newMin, setNewMin] = useState(0)
  const [newMax, setNewMax] = useState<string>('')
  const [newLevels, setNewLevels] = useState(1)

  const filtered = rules.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.scope.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName) return
    setRules([
      ...rules,
      {
        id: rules.length + 1,
        name: newName,
        scope: newScope,
        minAmount: Number(newMin) || 0,
        maxAmount: newMax ? Number(newMax) : null,
        levels: Number(newLevels) || 1,
        status: 'Active',
      },
    ])
    setModalOpen(false)
    setNewName('')
    setNewMin(0)
    setNewMax('')
    setNewLevels(1)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette règle d’approbation ?')) {
      setRules(rules.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #32 Screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/settings/expenses"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux paramètres dépenses</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Paramètres</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-300">Dépenses</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Règles d&apos;approbation</span>
        </div>
      </div>

      {/* Main Container matching Reference #32 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400" />
              <span>Règles d&apos;approbation</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Définissez les workflows d&apos;approbation et les niveaux de validation.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouvelle règle</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une règle..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>

        {/* 6-row Rules Table matching Reference #32 Screen 3 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">#</th>
                <th className="py-2.5 px-3">Nom de la règle</th>
                <th className="py-2.5 px-3">Portée</th>
                <th className="py-2.5 px-3 font-mono">Montant min.</th>
                <th className="py-2.5 px-3 font-mono">Montant max.</th>
                <th className="py-2.5 px-3 text-center">Niveaux d&apos;approbation</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-zinc-500">{r.id}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{r.name}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{r.scope}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-300">
                    {r.minAmount.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-300">
                    {r.maxAmount ? `${r.maxAmount.toLocaleString('fr-FR')} DH` : 'Aucun'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                      {r.levels} {r.levels > 1 ? 'niveaux' : 'niveau'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => alert(`Édition de ${r.name}`)}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400">
          <span>{rules.length} règles</span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">10 par page</span>
            <div className="flex items-center gap-1">
              <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
                1
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Nouvelle règle */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white">
                Créer une règle d&apos;approbation
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Nom de la règle
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Achats exceptionnels > 50 000 DH"
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Portée
                </label>
                <select
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Toutes catégories">Toutes catégories</option>
                  <option value="Carburant">Carburant</option>
                  <option value="Entretien & Réparations">Entretien & Réparations</option>
                  <option value="Hébergement">Hébergement</option>
                  <option value="Transports">Transports</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Montant min. (DH)
                  </label>
                  <input
                    type="number"
                    value={newMin}
                    onChange={(e) => setNewMin(Number(e.target.value) || 0)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Montant max. (DH)
                  </label>
                  <input
                    type="number"
                    value={newMax}
                    onChange={(e) => setNewMax(e.target.value)}
                    placeholder="Laisser vide si aucun"
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Nombre de niveaux d&apos;approbation requis
                </label>
                <select
                  value={newLevels}
                  onChange={(e) => setNewLevels(Number(e.target.value))}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value={1}>1 niveau (Manager direct)</option>
                  <option value={2}>2 niveaux (Manager + Direction)</option>
                  <option value={3}>3 niveaux (Manager + Finance + DG)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222228]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
