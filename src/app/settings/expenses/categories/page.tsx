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
  Folder,
  X,
} from 'lucide-react'

interface ExpenseCategoryItem {
  id: number
  name: string
  code: string
  description: string
  defaultTax: number
  status: 'Active' | 'Inactive'
}

const INITIAL_CATEGORIES: ExpenseCategoryItem[] = [
  { id: 1, name: 'Carburant', code: 'CARB', description: 'Dépenses de carburant (essence, gasoil...)', defaultTax: 20, status: 'Active' },
  { id: 2, name: 'Entretien & Réparations', code: 'ENT', description: 'Entretien, réparations et pièces', defaultTax: 20, status: 'Active' },
  { id: 3, name: 'Péages & Stationnement', code: 'PEA', description: 'Péages autoroutiers et stationnements', defaultTax: 20, status: 'Active' },
  { id: 4, name: 'Hébergement', code: 'HEB', description: 'Hôtels et hébergements', defaultTax: 10, status: 'Active' },
  { id: 5, name: 'Restauration', code: 'REST', description: 'Repas et frais de restauration', defaultTax: 10, status: 'Active' },
  { id: 6, name: 'Transports', code: 'TRAN', description: 'Billets, taxis, location de véhicules', defaultTax: 20, status: 'Active' },
  { id: 7, name: 'Fournitures de bureau', code: 'FOUR', description: 'Achats de fournitures et consommables', defaultTax: 20, status: 'Active' },
  { id: 8, name: 'Télécommunications', code: 'TEL', description: 'Téléphone, internet, abonnements', defaultTax: 20, status: 'Active' },
]

export default function ExpenseCategoriesSettingsPage() {
  const [categories, setCategories] = useState<ExpenseCategoryItem[]>(INITIAL_CATEGORIES)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newTax, setNewTax] = useState(20)

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newCode) return
    setCategories([
      ...categories,
      {
        id: categories.length + 1,
        name: newName,
        code: newCode.toUpperCase(),
        description: newDesc,
        defaultTax: newTax,
        status: 'Active',
      },
    ])
    setModalOpen(false)
    setNewName('')
    setNewCode('')
    setNewDesc('')
    setNewTax(20)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette catégorie ?')) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #32 Screen 2 */}
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
          <span className="font-semibold text-white">Catégories</span>
        </div>
      </div>

      {/* Main Container matching Reference #32 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              <Folder className="h-4 w-4 text-red-500" />
              <span>Catégories de dépenses</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Gérez les catégories et sous-catégories de dépenses disponibles.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Ajouter une catégorie</span>
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
              placeholder="Rechercher une catégorie..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>

        {/* 8-row Categories Table matching Reference #32 Screen 2 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">#</th>
                <th className="py-2.5 px-3">Nom de la catégorie</th>
                <th className="py-2.5 px-3 font-mono">Code</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-center font-mono">TVA par défaut</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-zinc-500">{cat.id}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{cat.name}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-300">{cat.code}</td>
                  <td className="py-2.5 px-3 text-zinc-400 max-w-xs truncate">{cat.description}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-cyan-400">
                    {cat.defaultTax}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {cat.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => alert(`Édition de ${cat.name}`)}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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

        {/* Footer Pagination matching Reference #32 Screen 2 */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400">
          <span>{categories.length} catégories</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                &lt;
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
                1
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                &gt;
              </button>
            </div>
            <span className="text-zinc-500">10 par page</span>
          </div>
        </div>
      </div>

      {/* Modal: Ajouter une catégorie */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white">
                Ajouter une catégorie de dépense
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
                  Nom de la catégorie
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Assurance flotte, Frais bancaires..."
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Ex: ASS, BQE..."
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono uppercase focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Courte description de l'usage"
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Taux TVA par défaut (%)
                </label>
                <select
                  value={newTax}
                  onChange={(e) => setNewTax(Number(e.target.value))}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value={20}>20% (Taux normal)</option>
                  <option value={10}>10% (Hébergement, restauration)</option>
                  <option value={14}>14% (Transport)</option>
                  <option value={0}>0% (Exonéré)</option>
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
