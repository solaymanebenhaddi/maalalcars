'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Zap,
  Mail,
  CheckCircle2,
  Send,
  Eye,
  Settings,
  Bell,
} from 'lucide-react'

interface UpcomingReminder {
  id: string
  clientName: string
  invoiceCode: string
  dueDate: string
  reminderSchedule: string
  channels: string
  amount: number
}

const UPCOMING_REMINDERS: UpcomingReminder[] = [
  {
    id: '1',
    clientName: 'Imane Zahiri',
    invoiceCode: 'FAC-2025-038',
    dueDate: '26/06/2025',
    reminderSchedule: '1ère relance (avant) 21/06/2025',
    channels: 'Email',
    amount: 24900,
  },
  {
    id: '2',
    clientName: 'Omar Bennis',
    invoiceCode: 'FAC-2025-036',
    dueDate: '25/06/2025',
    reminderSchedule: 'Relance J+7 02/07/2025',
    channels: 'Email + SMS',
    amount: 26500,
  },
  {
    id: '3',
    clientName: "Ayoub M'rabet",
    invoiceCode: 'FAC-2025-032',
    dueDate: '21/06/2025',
    reminderSchedule: '1ère relance (avant) 16/06/2025',
    channels: 'Email',
    amount: 29900,
  },
]

export default function AutomaticRemindersPage() {
  const [isActive, setIsActive] = useState(true)
  const [triggerType, setTriggerType] = useState('Avant et après échéance')
  const [beforeDays, setBeforeDays] = useState('5 jours avant')
  const [afterDays, setAfterDays] = useState('J+7, J+15, J+30')
  const [channel, setChannel] = useState('Email et SMS')
  const [template, setTemplate] = useState('Relance standard')
  const [sentToast, setSentToast] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleSendNow = () => {
    setSentToast(true)
    setTimeout(() => setSentToast(false), 3500)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #31 Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/regularizations"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux régularisations</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Régularisations</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Relances automatiques</span>
        </div>

        {/* Toggle Actif */}
        <div className="flex items-center gap-2.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5">
          <span className="text-xs font-bold text-white">Module automatique :</span>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
            <span>{isActive ? 'Actif' : 'Inactif'}</span>
          </button>
        </div>
      </div>

      {/* Main Container matching Reference #31 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#222228] pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Relances automatiques</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Automatisez les relances préventives et curatives des impayés clients.
            </p>
          </div>
        </div>

        {/* Section 1: Paramètres de relance */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="h-3.5 w-3.5 text-cyan-400" />
            <span>Paramètres de relance</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Déclenchement
              </label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option>Avant et après échéance</option>
                <option>Après échéance uniquement</option>
                <option>Avant échéance uniquement</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                1ère relance (avant échéance)
              </label>
              <select
                value={beforeDays}
                onChange={(e) => setBeforeDays(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option>5 jours avant</option>
                <option>3 jours avant</option>
                <option>7 jours avant</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Relance après échéance
              </label>
              <select
                value={afterDays}
                onChange={(e) => setAfterDays(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option>J+7, J+15, J+30</option>
                <option>J+3, J+10, J+20</option>
                <option>J+14, J+28</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Canal de relance
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option>Email et SMS</option>
                <option>Email uniquement</option>
                <option>SMS uniquement</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-zinc-400">
                  Modèle d&apos;email
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  <span>Aperçu</span>
                </button>
              </div>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option>Relance standard</option>
                <option>Avis préventif avant date limite</option>
                <option>Dernier avertissement contentieux</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Aperçu des prochaines relances */}
        <div className="space-y-3 pt-4 border-t border-[#222228]">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-amber-400" />
            <span>Aperçu des prochaines relances</span>
          </h2>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3 font-mono">Facture</th>
                  <th className="py-2.5 px-3 font-mono">Échéance</th>
                  <th className="py-2.5 px-3">Type de relance / Date prévue</th>
                  <th className="py-2.5 px-3">Canal</th>
                  <th className="py-2.5 px-3 text-right font-mono">Solde concerné</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {UPCOMING_REMINDERS.map((item) => (
                  <tr key={item.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{item.clientName}</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">{item.invoiceCode}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300">{item.dueDate}</td>
                    <td className="py-2.5 px-3 text-amber-400 font-medium">
                      {item.reminderSchedule}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-300">
                        {item.channels}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-red-400">
                      {item.amount.toLocaleString('fr-FR')} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA Action Button matching Reference #31 Screen 4 */}
        <div className="flex items-center justify-end pt-4 border-t border-[#222228]">
          <button
            onClick={handleSendNow}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-xl shadow-red-950/50 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Envoyer les relances maintenant</span>
          </button>
        </div>
      </div>

      {/* Modal Preview Email Template */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>Aperçu du modèle : {template}</span>
              </h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="rounded-lg border border-[#24242e] bg-[#181822] p-4 text-xs text-zinc-200 space-y-2">
              <div className="text-zinc-400 text-[10px] border-b border-[#282834] pb-2">
                Objet : Rappel de règlement - MAALAL CARS [N° Facture]
              </div>
              <p>Bonjour [Nom du Client],</p>
              <p>
                Nous vous remercions de votre confiance. Sauf erreur de notre part, votre solde de{' '}
                <span className="font-bold text-red-400">[Montant Solde] DH</span> concernant la facture{' '}
                <span className="font-mono text-cyan-400">[N° Facture]</span> arrive à échéance le{' '}
                <span className="font-bold">[Date Échéance]</span>.
              </p>
              <p>
                Nous vous invitons à effectuer votre règlement par virement bancaire sur notre compte :
                <br />
                <span className="font-mono text-zinc-300">RIB : 011 780 0000 123456789012 34</span>
              </p>
              <p>Cordialement,<br />L&apos;équipe MAALAL CARS</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                Fermer l&apos;aperçu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {sentToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Toutes les relances programmées ont été transmises avec succès !</span>
        </div>
      )}
    </div>
  )
}
