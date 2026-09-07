'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  Download,
  Edit2,
  Check,
  X,
} from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
  assignedTo?: string
  date?: string
}

function TaskDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'TASK-2025-0048'
  const taskId = decodeURIComponent(rawId)

  const tabQuery = searchParams?.get('tab')
  const initialTab =
    tabQuery === 'workflow'
      ? 'workflow'
      : tabQuery === 'attachments'
      ? 'attachments'
      : tabQuery === 'comments'
      ? 'comments'
      : tabQuery === 'history'
      ? 'history'
      : 'checklist'

  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'attachments' | 'comments' | 'history' | 'workflow'>(initialTab)

  // Checklist items matching Reference #36 Screen 3
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Vérifier documents client', completed: true, assignedTo: 'Imane Kabbaj', date: '15/05/2025' },
    { id: '2', label: 'Contrôle véhicule', completed: true, assignedTo: 'Mehdi Lahlou', date: '15/05/2025' },
    { id: '3', label: 'Nettoyage intérieur/extérieur', completed: true, assignedTo: 'Mehdi Lahlou', date: '16/05/2025' },
    { id: '4', label: 'Plein carburant', completed: false },
    { id: '5', label: 'Plaques d’immatriculation', completed: false },
    { id: '6', label: 'Documentation livraison', completed: false },
    { id: '7', label: 'Signature client', completed: false },
  ])
  const [newItemText, setNewItemText] = useState('')

  const completedCount = checklist.filter((item) => item.completed).length

  const toggleCheck = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemText.trim()) return
    setChecklist([
      ...checklist,
      {
        id: String(Date.now()),
        label: newItemText.trim(),
        completed: false,
      },
    ])
    setNewItemText('')
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/tasks"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux tâches</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Tâches</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">{taskId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('workflow')}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Workflow d&apos;approbation</span>
          </button>
        </div>
      </div>

      {/* Header Banner matching Reference #36 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white">Préparer livraison Toyota Hilux</h1>
            <span className="rounded bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-400">
              En cours
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1 text-red-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Priorité Haute
            </span>
            <span>· Échéance : <strong className="text-white font-mono">18/05/2025</strong></span>
            <span>· Assigné à : <strong className="text-white">Mehdi Lahlou</strong></span>
            <span>· Créée le <strong className="text-white font-mono">15/05/2025 à 09:30</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-2 text-xs font-bold text-zinc-200 hover:text-white">
            <Edit2 className="h-3 w-3 text-zinc-400" />
            <span>Modifier</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow">
            <span>Actions</span>
            <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs matching Reference #36 Screen 3 */}
      <div className="flex border-b border-[#222228] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'checklist'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Checklist ({completedCount}/{checklist.length})
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Aperçu
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'workflow'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Workflow d&apos;approbation
        </button>
        <button
          onClick={() => setActiveTab('attachments')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'attachments'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Pièces jointes (2)
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'comments'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Commentaires
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'history'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Historique
        </button>
      </div>

      {/* Tab 1: Checklist matching Reference #36 Screen 3 */}
      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Checklist items (span-7) */}
          <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Points de contrôle ({completedCount}/{checklist.length})
              </h2>
              <span className="text-[10px] text-zinc-400 font-mono">
                {Math.round((completedCount / checklist.length) * 100)}% complété
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`cursor-pointer p-2.5 rounded-lg border transition-colors flex items-center justify-between ${
                    item.completed
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-[#202028] bg-[#16161c] hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-4 w-4 rounded flex items-center justify-center border ${
                        item.completed
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-zinc-600 bg-zinc-800'
                      }`}
                    >
                      {item.completed && <Check className="h-3 w-3 stroke-[3]" />}
                    </span>
                    <span
                      className={`text-xs ${
                        item.completed ? 'text-zinc-300 line-through' : 'font-semibold text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {item.assignedTo && (
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {item.assignedTo} · {item.date}
                    </div>
                  )}
                  {!item.assignedTo && (
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">En attente</span>
                  )}
                </div>
              ))}
            </div>

            {/* Add checklist item */}
            <form onSubmit={handleAddItem} className="pt-2 border-t border-[#202028] flex items-center gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="+ Ajouter un élément à la checklist..."
                className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="h-8 px-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow"
              >
                Ajouter
              </button>
            </form>
          </div>

          {/* Right: Informations & Activité récente (span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
                Informations tâche
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Véhicule</span>
                  <div className="font-bold text-white">Toyota Hilux 2.8 D-4D</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Client</span>
                  <div className="font-semibold text-white">Yassine Benali</div>
                  <div className="text-[10px] text-zinc-400 font-mono">06 12 34 56 78</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Réf. Livraison</span>
                  <div className="font-mono text-zinc-300">LIV-2025-0042</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
                Activité récente
              </h2>
              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#282834] text-xs">
                <div className="relative">
                  <span className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="font-semibold text-white text-[11px]">Statut changé en &quot;En cours&quot;</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Mehdi Lahlou · 15/05/2025 10:15</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <div className="font-semibold text-white text-[11px]">Assigné à Mehdi Lahlou</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Admin Maalal · 15/05/2025 09:35</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-zinc-500" />
                  <div className="font-semibold text-white text-[11px]">Tâche créée</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Admin Maalal · 15/05/2025 09:30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Workflow d'approbation matching Reference #36 Screen 4 */}
      {activeTab === 'workflow' && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-[#14141a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white">Achat véhicule Toyota Land Cruiser 2023</h2>
                <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  En approbation
                </span>
              </div>
              <div className="text-zinc-400 text-xs mt-1">
                Demandé par <strong className="text-white">Imane Kabbaj</strong> le 15/05/2025 à 10:30 · Réf. <span className="font-mono text-zinc-300">APP-2025-0016</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase">Montant achat TTC</span>
              <div className="font-mono font-black text-emerald-400 text-lg">86 500 DH</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Étapes d'approbation (span-7) */}
            <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
                Étapes du circuit de validation
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#282834]">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <Check className="h-3 w-3" />
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">1. Validation responsable achat</span>
                      <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-400">
                        Approuvé
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                      15/05/2025 à 11:15 par Ahmed Maalal
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                    <Clock className="h-3 w-3" />
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">2. Validation direction générale</span>
                      <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.2 text-[9px] font-bold text-amber-400">
                        En cours
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                      Assigné à Nadia K.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                    3
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-400 text-xs">3. Validation financière &amp; décaissement</span>
                      <span className="rounded bg-zinc-800 px-2 py-0.2 text-[9px] font-bold text-zinc-400">
                        En attente
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      Youssef M. (Comptabilité)
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                    4
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-400 text-xs">4. Notification finale &amp; émission du bon</span>
                      <span className="rounded bg-zinc-800 px-2 py-0.2 text-[9px] font-bold text-zinc-400">
                        En attente
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      Système automatisé
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for approvers */}
              <div className="pt-4 border-t border-[#202028] flex items-center justify-end gap-3">
                <button
                  onClick={() => alert('Demande rejetée')}
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Rejeter la demande</span>
                </button>
                <button
                  onClick={() => alert('Demande approuvée avec succès !')}
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow transition-colors flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Approuver l&apos;étape</span>
                </button>
              </div>
            </div>

            {/* Right: Informations & Documents (span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
                  Détails financiers &amp; Fournisseur
                </h2>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">Fournisseur</span>
                    <div className="font-bold text-white">Auto Plus Maroc</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">Montant total TTC</span>
                    <div className="font-mono font-bold text-emerald-400 text-sm">86 500 DH</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">Acompte demandé</span>
                    <div className="font-mono text-zinc-300">30 000 DH</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">Date souhaitée</span>
                    <div className="font-mono text-zinc-300">30/05/2025</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
                  Documents joints
                </h2>
                <div className="space-y-2">
                  {[
                    { name: 'Devis_achat_LC.pdf', size: '185 Ko' },
                    { name: 'Fiche_technique_LC.pdf', size: '2.1 Mo' },
                  ].map((doc, idx) => (
                    <div key={idx} className="p-2 rounded-lg border border-[#202028] bg-[#16161c] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white text-xs">{doc.name}</div>
                        <div className="text-[9px] text-zinc-400">{doc.size}</div>
                      </div>
                      <button className="p-1 rounded text-zinc-400 hover:text-white">
                        <Download className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pièces jointes */}
      {activeTab === 'attachments' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Pièces jointes de la tâche
            </h2>
            <button className="text-xs text-red-400 hover:underline">+ Téléverser</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Bon_de_livraison_Hilux.pdf', size: '340 Ko' },
              { name: 'Checklist_preparateur.pdf', size: '120 Ko' },
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#202028] bg-[#16161c] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{f.name}</div>
                  <div className="text-[10px] text-zinc-400">{f.size}</div>
                </div>
                <button className="p-1.5 rounded-lg border border-[#282834] text-zinc-400 hover:text-white">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Commentaires */}
      {activeTab === 'comments' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
            Discussions et notes internes
          </h2>
          <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c] space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-white">Mehdi Lahlou</span>
              <span className="text-zinc-400 font-mono">15/05/2025 à 11:20</span>
            </div>
            <p className="text-xs text-zinc-300">
              Le véhicule est au lavage. Préparation carrosserie prévue à 14h.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Aperçu */}
      {activeTab === 'overview' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
            Description détaillée
          </h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Checklist de livraison et vérification du véhicule avant remise au client. S&apos;assurer de l&apos;état esthétique impeccable, des papiers en règle et de la signature du bon de remise.
          </p>
        </div>
      )}
    </div>
  )
}

export default function TaskDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement de la tâche...</div>}>
      <TaskDetailContent />
    </Suspense>
  )
}
