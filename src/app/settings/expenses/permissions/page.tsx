'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Save,
  Users,
} from 'lucide-react'

interface RolePermission {
  id: string
  role: string
  createExpense: boolean
  approveExpense: boolean
  exportData: boolean
  manageSettings: boolean
}

const INITIAL_PERMISSIONS: RolePermission[] = [
  { id: '1', role: 'Administrateur', createExpense: true, approveExpense: true, exportData: true, manageSettings: true },
  { id: '2', role: 'Responsable Finance & Comptabilité', createExpense: true, approveExpense: true, exportData: true, manageSettings: false },
  { id: '3', role: 'Chef d’Atelier / Garage', createExpense: true, approveExpense: false, exportData: false, manageSettings: false },
  { id: '4', role: 'Commercial Ventes', createExpense: true, approveExpense: false, exportData: false, manageSettings: false },
  { id: '5', role: 'Assistant Administratif', createExpense: true, approveExpense: false, exportData: true, manageSettings: false },
]

export default function ExpensePermissionsSettingsPage() {
  const [permissions, setPermissions] = useState<RolePermission[]>(INITIAL_PERMISSIONS)
  const [saved, setSaved] = useState(false)

  const toggle = (id: string, key: keyof Omit<RolePermission, 'id' | 'role'>) => {
    setPermissions(
      permissions.map((p) => (p.id === id ? { ...p, [key]: !p[key] } : p))
    )
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
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
        <span className="font-semibold text-white">Autorisations &amp; accès</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Autorisations &amp; accès aux dépenses</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Contrôlez qui peut créer, approuver et gérer les dépenses au sein de l&apos;organisation.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Enregistrer</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-4">Rôle utilisateur</th>
                <th className="py-2.5 px-3 text-center">Créer une dépense</th>
                <th className="py-2.5 px-3 text-center">Approuver une dépense</th>
                <th className="py-2.5 px-3 text-center">Exporter les rapports</th>
                <th className="py-2.5 px-3 text-center">Gérer les règles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {permissions.map((p) => (
                <tr key={p.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{p.role}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.createExpense}
                      onChange={() => toggle(p.id, 'createExpense')}
                      className="rounded accent-red-600 cursor-pointer h-4 w-4"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.approveExpense}
                      onChange={() => toggle(p.id, 'approveExpense')}
                      className="rounded accent-red-600 cursor-pointer h-4 w-4"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.exportData}
                      onChange={() => toggle(p.id, 'exportData')}
                      className="rounded accent-red-600 cursor-pointer h-4 w-4"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.manageSettings}
                      onChange={() => toggle(p.id, 'manageSettings')}
                      className="rounded accent-red-600 cursor-pointer h-4 w-4"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Matrice des autorisations mise à jour !</span>
        </div>
      )}
    </div>
  )
}
