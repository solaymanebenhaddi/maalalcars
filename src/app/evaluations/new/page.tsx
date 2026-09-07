'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Scan,
  UserPlus,
  Car,
} from 'lucide-react'

export default function NewEvaluationPage() {
  const [bodyScore, setBodyScore] = useState(85)
  const [mechanicScore, setMechanicScore] = useState(78)
  const [interiorScore, setInteriorScore] = useState(80)
  const [electricScore, setElectricScore] = useState(74)
  const [docScore, setDocScore] = useState(100)

  const overallScore = Math.round((bodyScore + mechanicScore + interiorScore + electricScore + docScore) / 5)

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/evaluations"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">
              Nouvelle évaluation
            </h1>
            <p className="text-[10px] text-zinc-400">
              Évaluations &gt; Nouvelle évaluation
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Container matching Reference #25 Screen 25A */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        {/* Informations générales */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-2">
            <Car className="h-3.5 w-3.5 text-red-500" />
            <span>Informations générales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Immatriculation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="AA-123-BB"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between pb-1">
                <label className="text-[11px] font-semibold text-zinc-300">
                  VIN <span className="text-red-500">*</span>
                </label>
                <button className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold">
                  <Scan className="h-3 w-3" />
                  <span>Scanner VIN</span>
                </button>
              </div>
              <input
                type="text"
                defaultValue="WBA5R31070FK12345"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Marque <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none focus:border-red-500">
                <option>BMW</option>
                <option>Mercedes-Benz</option>
                <option>Audi</option>
                <option>Peugeot</option>
                <option>Toyota</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Modèle <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Série 3</option>
                <option>Série 5</option>
                <option>X3</option>
                <option>X5</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Année <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                defaultValue={2021}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Kilométrage (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                defaultValue={45230}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Carburant
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Diesel</option>
                <option>Essence</option>
                <option>Hybride</option>
                <option>Électrique</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Boîte de vitesse
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Automatique</option>
                <option>Manuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Couleur
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Noir métallisé</option>
                <option>Gris argent</option>
                <option>Blanc nacré</option>
                <option>Bleu nuit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Client & Inspection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Client */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Client
            </h3>

            <div>
              <div className="flex items-center justify-between pb-1">
                <label className="text-[11px] font-semibold text-zinc-300">
                  Client existant
                </label>
                <button className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-semibold">
                  <UserPlus className="h-3 w-3" />
                  <span>Nouveau client</span>
                </button>
              </div>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Michel Dupont (CLI-1524)</option>
                <option>Sara Martin (CLI-1525)</option>
                <option>Sofiane Ait (CLI-1526)</option>
              </select>
            </div>
          </div>

          {/* Inspection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Inspection
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Inspecteur <span className="text-red-500">*</span>
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none focus:border-red-500">
                  <option>Yacine Benali</option>
                  <option>Karim Leblanc</option>
                  <option>Lynda Karim</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Date d&apos;évaluation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="28/05/2025 14:32"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Lieu / Site
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Garage Maalal - Casablanca</option>
                <option>Showroom Rabat</option>
                <option>Atelier Tanger</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résumé rapide (5 Dials + Score global) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
            Résumé rapide de l&apos;inspection
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-center">
            {/* Carrosserie */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center space-y-1">
              <div className="text-[10px] text-zinc-400">Carrosserie</div>
              <div className="font-mono font-black text-white text-base">
                {bodyScore}<span className="text-[10px] text-zinc-500 font-normal">/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bodyScore}
                onChange={(e) => setBodyScore(Number(e.target.value))}
                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Mécanique */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center space-y-1">
              <div className="text-[10px] text-zinc-400">Mécanique</div>
              <div className="font-mono font-black text-white text-base">
                {mechanicScore}<span className="text-[10px] text-zinc-500 font-normal">/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={mechanicScore}
                onChange={(e) => setMechanicScore(Number(e.target.value))}
                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Intérieur */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center space-y-1">
              <div className="text-[10px] text-zinc-400">Intérieur</div>
              <div className="font-mono font-black text-white text-base">
                {interiorScore}<span className="text-[10px] text-zinc-500 font-normal">/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={interiorScore}
                onChange={(e) => setInteriorScore(Number(e.target.value))}
                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Électronique */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center space-y-1">
              <div className="text-[10px] text-zinc-400">Électronique</div>
              <div className="font-mono font-black text-white text-base">
                {electricScore}<span className="text-[10px] text-zinc-500 font-normal">/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={electricScore}
                onChange={(e) => setElectricScore(Number(e.target.value))}
                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Documents */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center space-y-1">
              <div className="text-[10px] text-zinc-400">Documents</div>
              <div className="font-mono font-black text-white text-base">
                {docScore}<span className="text-[10px] text-zinc-500 font-normal">/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={docScore}
                onChange={(e) => setDocScore(Number(e.target.value))}
                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Score global */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center space-y-0.5">
              <div className="text-[10px] font-bold text-emerald-400 uppercase">Score global</div>
              <div className="font-mono font-black text-emerald-400 text-lg sm:text-xl">
                {overallScore}<span className="text-xs text-emerald-400/70 font-normal">/100</span>
              </div>
              <div className="text-[9px] text-emerald-400 font-semibold">Conforme</div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/evaluations"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="rounded-lg bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            Enregistrer l&apos;évaluation
          </button>
        </div>
      </div>
    </div>
  )
}
