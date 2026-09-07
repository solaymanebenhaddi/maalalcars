'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Download,
  Fuel,
  GitFork,
  Palette,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react'

interface FuelItem {
  id: number
  name: string
  code: string
  status: 'Actif' | 'Inactif'
  vehiclesCount: number
}

interface TransmissionItem {
  id: number
  name: string
  code: string
}

interface ColorItem {
  id: number
  name: string
  hex: string
}

const INITIAL_FUELS: FuelItem[] = [
  { id: 1, name: 'Essence', code: 'ESS', status: 'Actif', vehiclesCount: 96 },
  { id: 2, name: 'Diesel', code: 'DIE', status: 'Actif', vehiclesCount: 74 },
  { id: 3, name: 'Hybride', code: 'HYB', status: 'Actif', vehiclesCount: 28 },
  { id: 4, name: 'Électrique', code: 'ELEC', status: 'Actif', vehiclesCount: 12 },
  { id: 5, name: 'GPL', code: 'GPL', status: 'Actif', vehiclesCount: 9 },
  { id: 6, name: 'Hybride rechargeable', code: 'PHEV', status: 'Actif', vehiclesCount: 6 },
  { id: 7, name: 'E85', code: 'E85', status: 'Inactif', vehiclesCount: 2 },
]

const INITIAL_TRANSMISSIONS: TransmissionItem[] = [
  { id: 1, name: 'Manuelle', code: 'MAN' },
  { id: 2, name: 'Automatique', code: 'AUTO' },
  { id: 3, name: 'Semi-automatique', code: 'SEMI' },
  { id: 4, name: 'CVT', code: 'CVT' },
  { id: 5, name: 'Robotisée', code: 'ROBO' },
]

const INITIAL_COLORS: ColorItem[] = [
  { id: 1, name: 'Noir', hex: '#000000' },
  { id: 2, name: 'Blanc', hex: '#FFFFFF' },
  { id: 3, name: 'Gris', hex: '#808080' },
  { id: 4, name: 'Argent', hex: '#C0C0C0' },
  { id: 5, name: 'Bleu', hex: '#1E3A8A' },
]

export default function VehicleAttributesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'carburants' | 'transmissions' | 'couleurs'>('all')
  const [fuels, setFuels] = useState<FuelItem[]>(INITIAL_FUELS)
  const [transmissions, setTransmissions] = useState<TransmissionItem[]>(INITIAL_TRANSMISSIONS)
  const [colors, setColors] = useState<ColorItem[]>(INITIAL_COLORS)

  // Modals state
  const [modalType, setModalType] = useState<'fuel' | 'transmission' | 'color' | null>(null)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newHex, setNewHex] = useState('#ff0000')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'fuel' && newName && newCode) {
      setFuels([
        ...fuels,
        {
          id: fuels.length + 1,
          name: newName,
          code: newCode.toUpperCase(),
          status: 'Actif',
          vehiclesCount: 0,
        },
      ])
    } else if (modalType === 'transmission' && newName && newCode) {
      setTransmissions([
        ...transmissions,
        {
          id: transmissions.length + 1,
          name: newName,
          code: newCode.toUpperCase(),
        },
      ])
    } else if (modalType === 'color' && newName && newHex) {
      setColors([
        ...colors,
        {
          id: colors.length + 1,
          name: newName,
          hex: newHex,
        },
      ])
    }
    setModalType(null)
    setNewName('')
    setNewCode('')
    setNewHex('#ff0000')
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header & Breadcrumb matching Reference #31 Screen 3 */}
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
          <span className="font-semibold text-white">Référentiels</span>
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
          Tous les référentiels
        </button>
        <button
          onClick={() => setActiveTab('carburants')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
            activeTab === 'carburants'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <Fuel className="h-3.5 w-3.5 text-emerald-400" />
          <span>Carburants</span>
        </button>
        <button
          onClick={() => setActiveTab('transmissions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
            activeTab === 'transmissions'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <GitFork className="h-3.5 w-3.5 text-cyan-400" />
          <span>Transmissions</span>
        </button>
        <button
          onClick={() => setActiveTab('couleurs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
            activeTab === 'couleurs'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <Palette className="h-3.5 w-3.5 text-amber-400" />
          <span>Couleurs</span>
        </button>
      </div>

      {/* Main Grid: Left Carburants (span-7), Right Transmissions & Couleurs (span-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Carburants */}
        {(activeTab === 'all' || activeTab === 'carburants') && (
          <div className={`${activeTab === 'all' ? 'lg:col-span-7' : 'lg:col-span-12'} rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-emerald-400" />
                  <span>Liste des carburants</span>
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Types de carburant disponibles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalType('fuel')}
                  className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Ajouter</span>
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
                    <th className="py-2.5 px-3">Carburant</th>
                    <th className="py-2.5 px-3 font-mono">Code</th>
                    <th className="py-2.5 px-3 text-center">Statut</th>
                    <th className="py-2.5 px-3 text-right font-mono">Véhicules</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {fuels.map((f) => (
                    <tr key={f.id} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-zinc-500">{f.id}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{f.name}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-300">{f.code}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                            f.status === 'Actif'
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                              : 'bg-red-500/15 border border-red-500/30 text-red-400'
                          }`}
                        >
                          {f.status === 'Actif' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          <span>{f.status}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">
                        {f.vehiclesCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400">
              Afficher 1 à {fuels.length} sur {fuels.length} éléments
            </div>
          </div>
        )}

        {/* Right Column: Transmissions & Couleurs */}
        {(activeTab === 'all' || activeTab === 'transmissions' || activeTab === 'couleurs') && (
          <div className={`${activeTab === 'all' ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
            {/* Transmissions Card */}
            {(activeTab === 'all' || activeTab === 'transmissions') && (
              <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#222228] pb-3">
                  <h2 className="text-sm font-black text-white flex items-center gap-2">
                    <GitFork className="h-4 w-4 text-cyan-400" />
                    <span>Transmissions</span>
                  </h2>

                  <button
                    onClick={() => setModalType('transmission')}
                    className="flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Ajouter</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-[#202028]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        <th className="py-2 px-3">Transmission</th>
                        <th className="py-2 px-3 font-mono text-right">Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                      {transmissions.map((t) => (
                        <tr key={t.id} className="hover:bg-[#18181f] transition-colors">
                          <td className="py-2 px-3 font-semibold text-white">{t.name}</td>
                          <td className="py-2 px-3 font-mono text-right text-zinc-400">{t.code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-zinc-400">
                  Afficher 1 à {transmissions.length} sur {transmissions.length}
                </div>
              </div>
            )}

            {/* Couleurs Card */}
            {(activeTab === 'all' || activeTab === 'couleurs') && (
              <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#222228] pb-3">
                  <h2 className="text-sm font-black text-white flex items-center gap-2">
                    <Palette className="h-4 w-4 text-amber-400" />
                    <span>Couleurs</span>
                  </h2>

                  <button
                    onClick={() => setModalType('color')}
                    className="flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Ajouter</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-[#202028]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        <th className="py-2 px-3">Aperçu</th>
                        <th className="py-2 px-3">Couleur</th>
                        <th className="py-2 px-3 font-mono text-right">Code hex</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                      {colors.map((c) => (
                        <tr key={c.id} className="hover:bg-[#18181f] transition-colors">
                          <td className="py-2 px-3">
                            <span
                              className="inline-block h-4 w-4 rounded-full border border-zinc-600 shadow-inner"
                              style={{ backgroundColor: c.hex }}
                            />
                          </td>
                          <td className="py-2 px-3 font-semibold text-white">{c.name}</td>
                          <td className="py-2 px-3 font-mono text-right text-zinc-400">{c.hex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-zinc-400">
                  Afficher 1 à {colors.length} sur 18
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for adding element */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white">
                {modalType === 'fuel' && 'Ajouter un type de carburant'}
                {modalType === 'transmission' && 'Ajouter un type de transmission'}
                {modalType === 'color' && 'Ajouter une couleur'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Nom / Libellé
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Bioéthanol, Séquentielle, Gris Nardo..."
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {modalType !== 'color' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Code abrégé
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ex: BIO, SEQ..."
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono uppercase focus:outline-none focus:border-red-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Code Hexadécimal
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newHex}
                      onChange={(e) => setNewHex(e.target.value)}
                      className="h-8 w-10 rounded border border-[#282834] bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      required
                      value={newHex}
                      onChange={(e) => setNewHex(e.target.value)}
                      placeholder="#000000"
                      className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono uppercase focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
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
