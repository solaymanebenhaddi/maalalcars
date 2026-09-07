'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Bell,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Save,
} from 'lucide-react'

interface BudgetThresholdItem {
  id: number
  category: string
  periodicity: string
  alertThreshold: number
  criticalThreshold: number
  recipients: string
  status: 'Active' | 'Inactive'
}

const INITIAL_THRESHOLDS: BudgetThresholdItem[] = [
  { id: 1, category: 'Carburant', periodicity: 'Mensuelle', alertThreshold: 80, criticalThreshold: 100, recipients: 'Admin, Finance', status: 'Active' },
  { id: 2, category: 'Entretien & Réparations', periodicity: 'Mensuelle', alertThreshold: 75, criticalThreshold: 100, recipients: 'Admin, Garage', status: 'Active' },
  { id: 3, category: 'Hébergement', periodicity: 'Mensuelle', alertThreshold: 70, criticalThreshold: 100, recipients: 'Admin, Comptabilité', status: 'Active' },
  { id: 4, category: 'Restauration', periodicity: 'Mensuelle', alertThreshold: 80, criticalThreshold: 100, recipients: 'Admin, Comptabilité', status: 'Active' },
  { id: 5, category: 'Transports', periodicity: 'Mensuelle', alertThreshold: 75, criticalThreshold: 100, recipients: 'Admin, Comptabilité', status: 'Active' },
]

export default function BudgetAlertsSettingsPage() {
  const [thresholds, setThresholds] = useState<BudgetThresholdItem[]>(INITIAL_THRESHOLDS)
  const [modalOpen, setModalOpen] = useState(false)
  const [newCat, setNewCat] = useState('Fournitures de bureau')
  const [newPeriod, setNewPeriod] = useState('Mensuelle')
  const [newAlert, setNewAlert] = useState(80)
  const [newCritical, setNewCritical] = useState(100)
  const [newRecipients, setNewRecipients] = useState('Admin, Comptabilité')

  // Notifications settings
  const [notificationChannel, setNotificationChannel] = useState('Email')
  const [reportFrequencyDays, setReportFrequencyDays] = useState(7)
  const [includeExpenseDetails, setIncludeExpenseDetails] = useState(true)

  const [savedToast, setSavedToast] = useState(false)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setThresholds([
      ...thresholds,
      {
        id: thresholds.length + 1,
        category: newCat,
        periodicity: newPeriod,
        alertThreshold: Number(newAlert) || 80,
        criticalThreshold: Number(newCritical) || 100,
        recipients: newRecipients,
        status: 'Active',
      },
    ])
    setModalOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce seuil budgétaire ?')) {
      setThresholds(thresholds.filter((t) => t.id !== id))
    }
  }

  const handleSaveNotifications = () => {
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #32 Screen 5 */}
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
          <span className="font-semibold text-white">Alertes budgétaires</span>
        </div>
      </div>

      {/* Main Container matching Reference #32 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-yellow-400" />
              <span>Seuils d&apos;alertes budgétaires</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Définissez les seuils, alertes et notifications par catégorie de dépense.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau seuil</span>
          </button>
        </div>

        {/* Thresholds Table matching Reference #32 Screen 5 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Périodicité</th>
                <th className="py-2.5 px-3 text-center">Seuil d&apos;alerte</th>
                <th className="py-2.5 px-3 text-center">Seuil critique</th>
                <th className="py-2.5 px-3">Destinataires</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {thresholds.map((t) => (
                <tr key={t.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">{t.category}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{t.periodicity}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      {t.alertThreshold}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
                      {t.criticalThreshold}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-300 font-medium">{t.recipients}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => alert(`Modifier seuil ${t.category}`)}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
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
      </div>

      {/* Bottom Card: Notifications matching Reference #32 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#222228] pb-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Notifications
          </h2>
          <button
            onClick={handleSaveNotifications}
            className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-red-700"
          >
            <Save className="h-3 w-3" />
            <span>Enregistrer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Canal de notification principal
            </label>
            <select
              value={notificationChannel}
              onChange={(e) => setNotificationChannel(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Email">Email</option>
              <option value="Slack">Slack</option>
              <option value="SMS">SMS</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Envoyer les rapports tous les
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={reportFrequencyDays}
                onChange={(e) => setReportFrequencyDays(Number(e.target.value) || 0)}
                className="h-8 w-20 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
              />
              <span className="text-zinc-400">jours</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#24242e] bg-[#16161c]">
            <div>
              <div className="font-semibold text-white">Inclure les détails des dépenses</div>
              <div className="text-[10px] text-zinc-400">
                Inclure le détail des dépenses dans les notifications
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIncludeExpenseDetails(!includeExpenseDetails)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                includeExpenseDetails ? 'bg-emerald-500' : 'bg-[#282834]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  includeExpenseDetails ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="text-[10px] text-zinc-400 italic pt-1">
          Les alertes sont calculées en fonction du budget défini et des dépenses approuvées.
        </div>
      </div>

      {/* Modal: Nouveau seuil */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white">
                Ajouter un seuil d&apos;alerte budgétaire
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
                  Catégorie
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Fournitures de bureau">Fournitures de bureau</option>
                  <option value="Télécommunications">Télécommunications</option>
                  <option value="Carburant">Carburant</option>
                  <option value="Entretien & Réparations">Entretien & Réparations</option>
                  <option value="Péages & Stationnement">Péages & Stationnement</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Périodicité
                </label>
                <select
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Mensuelle">Mensuelle</option>
                  <option value="Trimestrielle">Trimestrielle</option>
                  <option value="Annuelle">Annuelle</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Seuil d&apos;alerte (%)
                  </label>
                  <input
                    type="number"
                    value={newAlert}
                    onChange={(e) => setNewAlert(Number(e.target.value) || 0)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Seuil critique (%)
                  </label>
                  <input
                    type="number"
                    value={newCritical}
                    onChange={(e) => setNewCritical(Number(e.target.value) || 0)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Destinataires
                </label>
                <input
                  type="text"
                  value={newRecipients}
                  onChange={(e) => setNewRecipients(e.target.value)}
                  placeholder="Ex: Admin, Finance, Garage"
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                />
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

      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Paramètres de notifications enregistrés avec succès !</span>
        </div>
      )}
    </div>
  )
}
