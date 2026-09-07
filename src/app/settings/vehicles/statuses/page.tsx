'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Download,
  CheckSquare,
  Sparkles,
  Tag,
  X,
  Check,
} from 'lucide-react'

interface VehicleStatusItem {
  id: number
  name: string
  color: string
  isDefault: boolean
  vehiclesCount: number
}

interface DefaultOptionItem {
  id: number
  name: string
  category: 'Confort' | 'Sécurité' | 'Multimédia' | 'Design'
}

interface EquipmentTagItem {
  id: number
  name: string
  category: string
  usageCount: number
}

const INITIAL_STATUSES: VehicleStatusItem[] = [
  { id: 1, name: 'En stock', color: '#22c55e', isDefault: false, vehiclesCount: 124 },
  { id: 2, name: 'Réservé', color: '#eab308', isDefault: false, vehiclesCount: 18 },
  { id: 3, name: 'Vendu', color: '#3b82f6', isDefault: false, vehiclesCount: 36 },
  { id: 4, name: 'En attente', color: '#f97316', isDefault: false, vehiclesCount: 22 },
  { id: 5, name: 'Indisponible', color: '#ef4444', isDefault: false, vehiclesCount: 7 },
  { id: 6, name: 'Retiré', color: '#6b7280', isDefault: false, vehiclesCount: 3 },
]

const INITIAL_OPTIONS: DefaultOptionItem[] = [
  { id: 1, name: 'Climatisation', category: 'Confort' },
  { id: 2, name: 'Direction assistée', category: 'Confort' },
  { id: 3, name: 'Vitres électriques', category: 'Confort' },
  { id: 4, name: 'Fermeture centralisée', category: 'Sécurité' },
  { id: 5, name: 'Airbags', category: 'Sécurité' },
  { id: 6, name: 'ABS', category: 'Sécurité' },
  { id: 7, name: 'ESP', category: 'Sécurité' },
  { id: 8, name: 'Radio / USB', category: 'Multimédia' },
]

const INITIAL_TAGS: EquipmentTagItem[] = [
  { id: 1, name: 'Toit ouvrant panoramique', category: 'Confort', usageCount: 42 },
  { id: 2, name: 'Caméra de recul 360°', category: 'Sécurité', usageCount: 38 },
  { id: 3, name: 'Sièges en cuir chauffants', category: 'Confort', usageCount: 51 },
  { id: 4, name: 'Cockpit digital', category: 'Multimédia', usageCount: 64 },
  { id: 5, name: 'Jantes alliage 19"', category: 'Design', usageCount: 35 },
  { id: 6, name: 'Apple CarPlay & Android Auto', category: 'Multimédia', usageCount: 86 },
]

export default function VehicleStatusesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'statuses' | 'options' | 'tags'>('all')
  const [statuses, setStatuses] = useState<VehicleStatusItem[]>(INITIAL_STATUSES)
  const [options, setOptions] = useState<DefaultOptionItem[]>(INITIAL_OPTIONS)
  const [tags, setTags] = useState<EquipmentTagItem[]>(INITIAL_TAGS)

  // Modals state
  const [modalType, setModalType] = useState<'status' | 'option' | 'tag' | null>(null)
  const [newStatusName, setNewStatusName] = useState('')
  const [newStatusColor, setNewStatusColor] = useState('#22c55e')
  const [newOptionName, setNewOptionName] = useState('')
  const [newOptionCategory, setNewOptionCategory] = useState<'Confort' | 'Sécurité' | 'Multimédia' | 'Design'>('Confort')
  const [newTagName, setNewTagName] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'status' && newStatusName) {
      setStatuses([
        ...statuses,
        {
          id: statuses.length + 1,
          name: newStatusName,
          color: newStatusColor,
          isDefault: false,
          vehiclesCount: 0,
        },
      ])
    } else if (modalType === 'option' && newOptionName) {
      setOptions([
        ...options,
        {
          id: options.length + 1,
          name: newOptionName,
          category: newOptionCategory,
        },
      ])
    } else if (modalType === 'tag' && newTagName) {
      setTags([
        ...tags,
        {
          id: tags.length + 1,
          name: newTagName,
          category: newOptionCategory,
          usageCount: 0,
        },
      ])
    }
    setModalType(null)
    setNewStatusName('')
    setNewOptionName('')
    setNewTagName('')
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header & Breadcrumbs matching Reference #31 Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <Link
            href="/settings/vehicles"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux paramètres</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Accueil</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-300">Paramètres</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-300">Véhicules</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Statuts & Options</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222228] pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
            activeTab === 'all'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          Vue combinée
        </button>
        <button
          onClick={() => setActiveTab('statuses')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
            activeTab === 'statuses'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
          <span>Statuts</span>
        </button>
        <button
          onClick={() => setActiveTab('options')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
            activeTab === 'options'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Options par défaut</span>
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
            activeTab === 'tags'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <Tag className="h-3.5 w-3.5 text-amber-400" />
          <span>Tags d&apos;équipements</span>
        </button>
      </div>

      {/* 2-Column Layout matching Reference #31 Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Statuts des véhicules */}
        {(activeTab === 'all' || activeTab === 'statuses') && (
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-400" />
                  <span>Statuts des véhicules</span>
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Définissez les statuts disponibles pour vos véhicules.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalType('status')}
                  className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Ajouter un statut</span>
                </button>
                <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
                  <Download className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Exporter</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 font-mono">#</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-3 text-center">Couleur</th>
                    <th className="py-2.5 px-3 text-center">Par défaut</th>
                    <th className="py-2.5 px-3 text-right font-mono">Véhicules</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {statuses.map((s) => (
                    <tr key={s.id} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-zinc-500">{s.id}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{s.name}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className="inline-block h-3.5 w-3.5 rounded-full border border-zinc-700 shadow-sm"
                          style={{ backgroundColor: s.color }}
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center text-zinc-500">
                        {s.isDefault ? (
                          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">
                        {s.vehiclesCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400">
              Afficher 1 à {statuses.length} sur {statuses.length} statuts
            </div>
          </div>
        )}

        {/* Right Column: Options par défaut */}
        {(activeTab === 'all' || activeTab === 'options') && (
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>Options par défaut</span>
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Équipements inclus par défaut sur tous les véhicules.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalType('option')}
                  className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Ajouter option</span>
                </button>
                <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
                  <Download className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Exporter</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Option</th>
                    <th className="py-2.5 px-3 text-right">Catégorie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {options.map((o) => (
                    <tr key={o.id} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">{o.name}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            o.category === 'Confort'
                              ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                              : o.category === 'Sécurité'
                              ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                              : o.category === 'Multimédia'
                              ? 'bg-purple-500/15 border border-purple-500/30 text-purple-400'
                              : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          }`}
                        >
                          {o.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400">
              Afficher 1 à {options.length} sur 24 options
            </div>
          </div>
        )}

        {/* Optional Tags Card */}
        {activeTab === 'tags' && (
          <div className="col-span-2 rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <Tag className="h-4 w-4 text-amber-400" />
                  <span>Tags d&apos;équipements disponibles</span>
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Étiquettes utilisées pour enrichir la visibilité des fiches véhicules et annonces.
                </p>
              </div>

              <button
                onClick={() => setModalType('tag')}
                className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ajouter un tag</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tags.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white text-xs">{t.name}</div>
                    <div className="text-[10px] text-zinc-400">{t.category}</div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-cyan-400">
                    {t.usageCount} utilisations
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding element */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white">
                {modalType === 'status' && 'Ajouter un statut véhicule'}
                {modalType === 'option' && 'Ajouter une option par défaut'}
                {modalType === 'tag' && "Ajouter un tag d'équipement"}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              {modalType === 'status' && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Nom du statut
                    </label>
                    <input
                      type="text"
                      required
                      value={newStatusName}
                      onChange={(e) => setNewStatusName(e.target.value)}
                      placeholder="Ex: En arrivage, En révision..."
                      className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Couleur indicatrice
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newStatusColor}
                        onChange={(e) => setNewStatusColor(e.target.value)}
                        className="h-8 w-10 rounded border border-[#282834] bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newStatusColor}
                        onChange={(e) => setNewStatusColor(e.target.value)}
                        className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono uppercase focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {(modalType === 'option' || modalType === 'tag') && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Libellé
                    </label>
                    <input
                      type="text"
                      required
                      value={modalType === 'option' ? newOptionName : newTagName}
                      onChange={(e) =>
                        modalType === 'option'
                          ? setNewOptionName(e.target.value)
                          : setNewTagName(e.target.value)
                      }
                      placeholder="Ex: Détecteur d'angle mort, Hayon électrique..."
                      className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={newOptionCategory}
                      onChange={(e) =>
                        setNewOptionCategory(e.target.value as 'Confort' | 'Sécurité' | 'Multimédia' | 'Design')
                      }
                      className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Confort">Confort</option>
                      <option value="Sécurité">Sécurité</option>
                      <option value="Multimédia">Multimédia</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222228]">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
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
