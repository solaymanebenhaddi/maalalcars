'use client'

import React from 'react'
import Link from 'next/link'
import {
  Car,
  Layers,
  Fuel,
  GitFork,
  Palette,
  CheckSquare,
  Sparkles,
  Tag,
  ChevronRight,
} from 'lucide-react'

interface VehicleCategoryCard {
  id: string
  title: string
  count: number
  desc: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const VEHICLE_SETTINGS_CARDS: VehicleCategoryCard[] = [
  {
    id: 'brands',
    title: 'Marques',
    count: 28,
    desc: 'Marques de véhicules',
    href: '/settings/vehicles/brands',
    icon: Car,
  },
  {
    id: 'models',
    title: 'Modèles',
    count: 142,
    desc: 'Modèles par marque',
    href: '/settings/vehicles/models',
    icon: Layers,
  },
  {
    id: 'types',
    title: 'Types de véhicules',
    count: 12,
    desc: 'Catégories de carrosserie',
    href: '/settings/vehicles/models',
    icon: Car,
  },
  {
    id: 'fuels',
    title: 'Carburants',
    count: 7,
    desc: 'Types de carburant',
    href: '/settings/vehicles/attributes',
    icon: Fuel,
  },
  {
    id: 'transmissions',
    title: 'Transmissions',
    count: 5,
    desc: 'Types de transmission',
    href: '/settings/vehicles/attributes',
    icon: GitFork,
  },
  {
    id: 'colors',
    title: 'Couleurs',
    count: 18,
    desc: 'Couleurs disponibles',
    href: '/settings/vehicles/attributes',
    icon: Palette,
  },
  {
    id: 'statuses',
    title: 'Statuts',
    count: 6,
    desc: 'Statuts des véhicules',
    href: '/settings/vehicles/statuses',
    icon: CheckSquare,
  },
  {
    id: 'options',
    title: 'Options par défaut',
    count: 24,
    desc: 'Équipements par défaut',
    href: '/settings/vehicles/statuses',
    icon: Sparkles,
  },
  {
    id: 'tags',
    title: "Tags d'équipements",
    count: 86,
    desc: "Étiquettes d'équipements disponibles",
    href: '/settings/vehicles/statuses',
    icon: Tag,
  },
]

export function VehiclesSettingsClient() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #31 Screen 0 */}
      <div>
        <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
          Paramètres véhicules
        </h1>
        <p className="text-xs text-zinc-400">
          Gérez les références et options utilisées dans vos véhicules et annonces.
        </p>
      </div>

      {/* Grid of category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VEHICLE_SETTINGS_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-sm hover:border-zinc-500 hover:bg-[#15151b] transition-all flex flex-col justify-between h-[160px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700 text-cyan-400">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="text-lg font-mono font-black text-white">
                  {card.count}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {card.desc}
                </p>
              </div>

              <div className="flex items-center justify-end text-[10px] font-bold text-red-400 group-hover:text-red-300">
                <span>Gérer</span>
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom summary bar matching Reference #31 Screen 0 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-white">
          Résumé global
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-1 text-center">
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Marques</div>
            <div className="font-mono font-black text-white text-base mt-1">28</div>
          </div>
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Modèles</div>
            <div className="font-mono font-black text-cyan-400 text-base mt-1">142</div>
          </div>
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Types</div>
            <div className="font-mono font-black text-white text-base mt-1">12</div>
          </div>
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Carburants</div>
            <div className="font-mono font-black text-emerald-400 text-base mt-1">7</div>
          </div>
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Transmissions</div>
            <div className="font-mono font-black text-white text-base mt-1">5</div>
          </div>
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Couleurs</div>
            <div className="font-mono font-black text-amber-400 text-base mt-1">18</div>
          </div>
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Statuts</div>
            <div className="font-mono font-black text-white text-base mt-1">6</div>
          </div>
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Options</div>
            <div className="font-mono font-black text-red-400 text-base mt-1">86</div>
          </div>
        </div>
      </div>
    </div>
  )
}
