'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  Download,
  Send,
  AlertTriangle,
  Check,
} from 'lucide-react'

function WarrantyDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'GAR-2025-0050'
  const warrantyCode = decodeURIComponent(rawId)

  const initialTab = searchParams?.get('tab') === 'workflow' ? 'workflow' : 'overview'
  const [activeTab, setActiveTab] = useState<'overview' | 'incident' | 'vehicle' | 'documents' | 'workflow'>(initialTab)

  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Expert technique',
      date: '29/05/2025 à 14:20',
      text: 'Diagnostic validé. Pièces défectueuses confirmées. Montant estimé conforme aux barèmes Toyota.',
    },
  ])
  const [newComment, setNewComment] = useState('')

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setComments([
      ...comments,
      {
        id: String(Date.now()),
        author: 'Gestionnaire SAV',
        date: 'À l’instant',
        text: newComment,
      },
    ])
    setNewComment('')
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #33 Sub-screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/warranties"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux garanties</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Garanties</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Détail dossier</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/warranties/claims/new"
            className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Déclarer un sinistre</span>
          </Link>
        </div>
      </div>

      {/* Header Banner matching Reference #33 Sub-screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white font-mono">{warrantyCode}</h1>
            <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              En cours
            </span>
            <span className="text-xs text-zinc-400">· Toyota Land Cruiser VR-R 4.0L</span>
          </div>
          <div className="text-xs text-zinc-400">
            Dossier créé le <strong className="text-white">28 mai 2025 à 10:30</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('workflow')}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Workflow d&apos;approbation</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#222228] gap-2 overflow-x-auto">
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
          onClick={() => setActiveTab('incident')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'incident'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Sinistre / Panne
        </button>
        <button
          onClick={() => setActiveTab('vehicle')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'vehicle'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Véhicule &amp; Client
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'documents'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Documents
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
      </div>

      {/* Tab 1: Aperçu matching Reference #33 Sub-screen 3 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Informations générales */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Informations générales
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Type</span>
                <div className="font-semibold text-white">Extension garantie</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Fournisseur</span>
                <div className="font-semibold text-white">Toyota Maroc</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Période</span>
                <div className="font-mono text-zinc-300">18/05/2025 &rarr; 18/05/2027</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Kilométrage couvert</span>
                <div className="font-mono text-zinc-300">120 000 km</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Plafond de couverture</span>
                <div className="font-mono font-bold text-emerald-400">15 000 DH</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Franchise</span>
                <div className="font-mono text-zinc-300">150 DH</div>
              </div>
            </div>
          </div>

          {/* Card 2: Sinistre / Panne */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Sinistre / Panne
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Type</span>
                <div className="font-semibold text-red-400">Problème moteur</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Date de l&apos;incident</span>
                <div className="font-mono text-zinc-300">28/05/2025</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Kilométrage relevé</span>
                <div className="font-mono text-zinc-300">98 450 km</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Lieu</span>
                <div className="text-zinc-300">Casablanca</div>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-zinc-400 uppercase">Description</span>
                <p className="text-zinc-300 mt-0.5 leading-relaxed text-[11px]">
                  Perte de puissance, témoin moteur allumé, claquements au niveau du moteur.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Montants */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Décomposition financière
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg border border-[#202028] bg-[#16161c]">
                <span className="text-[10px] text-zinc-400 uppercase">Montant estimé</span>
                <div className="font-mono font-bold text-white text-sm">4 800 DH</div>
              </div>
              <div className="p-2.5 rounded-lg border border-[#202028] bg-[#16161c]">
                <span className="text-[10px] text-zinc-400 uppercase">Validé fournisseur</span>
                <div className="font-mono font-bold text-cyan-400 text-sm">4 800 DH</div>
              </div>
              <div className="p-2.5 rounded-lg border border-[#202028] bg-[#16161c]">
                <span className="text-[10px] text-zinc-400 uppercase">Montant approuvé (garantie)</span>
                <div className="font-mono font-bold text-emerald-400 text-sm">2 400 DH</div>
              </div>
              <div className="p-2.5 rounded-lg border border-[#202028] bg-[#16161c]">
                <span className="text-[10px] text-zinc-400 uppercase">Reste à charge client</span>
                <div className="font-mono font-bold text-amber-400 text-sm">2 400 DH</div>
              </div>
            </div>
          </div>

          {/* Card 4: Statut d'approbation */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Statut d&apos;approbation
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Statut actuel</span>
                  <div className="font-bold text-amber-400 text-sm">En cours</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase">Taux d&apos;approbation</span>
                  <div className="font-mono font-bold text-white text-sm">50%</div>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-[#202028] overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-1/2" />
              </div>

              <div className="text-[11px] text-zinc-400">
                Validé par : <strong className="text-white">Expert technique</strong> le 29/05/2025 à 14:20
              </div>
            </div>

            <button
              onClick={() => setActiveTab('workflow')}
              className="w-full py-2 rounded-lg border border-[#282834] bg-[#18181f] text-center font-bold text-xs text-zinc-200 hover:text-white hover:bg-zinc-800"
            >
              Consulter le workflow complet
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Sinistre / Panne */}
      {activeTab === 'incident' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Rapport détaillé de panne
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c]">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Organe en cause</span>
              <div className="font-bold text-white mt-0.5">Moteur - Galet tendeur et courroie d&apos;accessoires</div>
            </div>
            <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c]">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Atelier réparateur agréé</span>
              <div className="font-bold text-white mt-0.5">AutoPro Services Casablanca (Agréé Toyota Maroc)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Véhicule & Client */}
      {activeTab === 'vehicle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Véhicule
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Modèle</span>
                <div className="font-bold text-white">Toyota Land Cruiser VR-R 4.0L Essence</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">VIN</span>
                <div className="font-mono text-zinc-300">JTMHV02J804567890</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Client
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Nom</span>
                <div className="font-bold text-white">Omar Bennis</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Contact</span>
                <div className="text-zinc-300">06 77 88 99 00 · omar.bennis@email.com</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === 'documents' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Documents du dossier
            </h2>
            <button
              onClick={() => alert('Ajout de document')}
              className="text-xs text-red-400 hover:underline"
            >
              + Ajouter un document
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Facture-réparation.pdf', size: '245 Ko' },
              { name: 'Rapport-expertise.pdf', size: '310 Ko' },
              { name: 'Photos-dommages.zip', size: '2.4 Mo' },
              { name: 'Bon de commande.pdf', size: '180 Ko' },
            ].map((doc, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#202028] bg-[#16161c] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white text-xs">{doc.name}</div>
                  <div className="text-[10px] text-zinc-400">{doc.size}</div>
                </div>
                <button className="p-1.5 rounded-lg border border-[#282834] text-zinc-400 hover:text-white">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Workflow d'approbation matching Reference #33 Sub-screen 4 */}
      {activeTab === 'workflow' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
            <span className="font-bold text-amber-400 text-xs">
              {warrantyCode} · Workflow d&apos;approbation
            </span>
            <span className="text-[11px] text-amber-300 font-mono">
              Statut actuel : <strong>En cours (50%)</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: 5 Pipeline Steps (span-7) */}
            <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Étapes du processus d&apos;approbation
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#282834]">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <Check className="h-3 w-3" />
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">1. Déclaration du sinistre</span>
                      <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-400">
                        Terminé
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                      28/05/2025 à 10:30 par Omar Bennis
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <Check className="h-3 w-3" />
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">2. Réception et vérification</span>
                      <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-400">
                        Terminé
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                      28/05/2025 à 11:15 par Service garanties
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                    <Clock className="h-3 w-3" />
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">3. Expertise technique</span>
                      <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.2 text-[9px] font-bold text-amber-400">
                        En cours
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                      29/05/2025 à 14:00 par Expert technique
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
                      <span className="font-bold text-zinc-300 text-xs">4. Approbation finale</span>
                      <span className="rounded bg-zinc-800 px-2 py-0.2 text-[9px] font-bold text-zinc-400">
                        En attente
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      Direction technique &amp; Fournisseur
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                    5
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-300 text-xs">5. Paiement / Remboursement</span>
                      <span className="rounded bg-zinc-800 px-2 py-0.2 text-[9px] font-bold text-zinc-400">
                        En attente
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      Comptabilité MAALAL CARS
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Documents & Commentaires (span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-[#222228] pb-2">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Documents du dossier
                  </h2>
                  <button className="text-[11px] text-red-400 hover:underline">
                    + Ajouter un document
                  </button>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Facture-réparation.pdf', size: '245 Ko' },
                    { name: 'Rapport-expertise.pdf', size: '310 Ko' },
                    { name: 'Photos-dommages.zip', size: '2.4 Mo' },
                    { name: 'Bon de commande.pdf', size: '180 Ko' },
                  ].map((doc, idx) => (
                    <div key={idx} className="p-2 rounded-lg border border-[#202028] bg-[#16161c] flex items-center justify-between">
                      <div className="truncate max-w-[180px]">
                        <div className="font-semibold text-white text-xs truncate">{doc.name}</div>
                        <div className="text-[9px] text-zinc-400">{doc.size}</div>
                      </div>
                      <button className="p-1 rounded text-zinc-400 hover:text-white">
                        <Download className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md flex flex-col justify-between">
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 mb-2">
                    Commentaires
                  </h2>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {comments.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-lg border border-[#202028] bg-[#16161c] space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-white">{c.author}</span>
                          <span className="text-zinc-400 font-mono">{c.date}</span>
                        </div>
                        <p className="text-zinc-300 text-xs leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddComment} className="pt-2 border-t border-[#222228] flex items-center gap-1.5 mt-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="h-8 px-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 flex items-center justify-center shadow transition-colors"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function WarrantyDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement de la garantie...</div>}>
      <WarrantyDetailContent />
    </Suspense>
  )
}
