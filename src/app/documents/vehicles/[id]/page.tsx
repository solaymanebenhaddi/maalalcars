import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  FileText,
  Download,
  Plus,
  Eye,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface VehicleDoc {
  id: number
  name: string
  type: string
  reference: string
  category: string
  addedDate: string
  expirationDate: string
  status: 'Valide' | 'Expire bientôt'
  size: string
}

const VEHICLE_DOCS: VehicleDoc[] = [
  { id: 1, name: 'Carte grise', type: 'Administratif', reference: 'CG-2025-01245', category: 'Administratif', addedDate: '29/05/2025', expirationDate: '-', status: 'Valide', size: '128 KB' },
  { id: 2, name: 'Contrôle technique', type: 'Technique', reference: 'CT-2025-00456', category: 'Technique', addedDate: '24/05/2025', expirationDate: '24/05/2026', status: 'Expire bientôt', size: '216 KB' },
  { id: 3, name: 'Attestation d\'assurance', type: 'Assurance', reference: 'ASS-2025-078', category: 'Assurance', addedDate: '28/05/2025', expirationDate: '28/05/2026', status: 'Valide', size: '312 KB' },
  { id: 4, name: 'Bon de livraison', type: 'Livraison', reference: 'BL-2025-091', category: 'Livraison', addedDate: '26/05/2025', expirationDate: '-', status: 'Valide', size: '164 KB' },
  { id: 5, name: 'Facture achat', type: 'Achats', reference: 'FAC-ACH-2025-032', category: 'Achats', addedDate: '27/05/2025', expirationDate: '-', status: 'Valide', size: '512 KB' },
  { id: 6, name: 'Photos véhicule', type: 'Média', reference: 'PHOTOS-2025-078', category: 'Média', addedDate: '20/05/2025', expirationDate: '-', status: 'Valide', size: '3.2 MB' },
  { id: 7, name: 'Contrat de garantie', type: 'Garantie', reference: 'GAR-2025-056', category: 'Garantie', addedDate: '25/05/2025', expirationDate: '25/05/2026', status: 'Expire bientôt', size: '298 KB' },
  { id: 8, name: 'Historique entretien', type: 'Entretien', reference: 'ENT-2025-034', category: 'Entretien', addedDate: '22/05/2025', expirationDate: '-', status: 'Valide', size: '245 KB' },
]

export default async function VehicleDocumentsPage({ params }: Props) {
  const { id } = await params
  const vehicleId = id || 'VEH-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/documents"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux documents</span>
        </Link>
      </div>

      {/* Main Container matching Reference #17 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Vehicle Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-24 overflow-hidden rounded-lg bg-black border border-[#2c2c3c] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vehicles/toyota-land-cruiser-2023.jpg"
                alt="Toyota Land Cruiser 2023"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Toyota Land Cruiser 2023
                </h1>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  En stock
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                VR-A 4.0L Essence • 12 450 km • Blanc Nacré
              </p>
              <p className="font-mono text-[10px] text-zinc-500">
                N° VIN : JTMHE05J304001923
              </p>
            </div>
          </div>

          <Link
            href={`/vehicles/${vehicleId}`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            <span>Voir le véhicule</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="text-zinc-400 hover:text-white font-semibold">Aperçu</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Informations</button>
          <button className="font-bold text-white relative pb-1">
            <span>Documents (8)</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Historique</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Entretien</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Ventes</button>
        </div>

        {/* Table Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-white">Documents du véhicule</h2>
            <p className="text-[10px] text-zinc-400">8 documents attachés</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/documents/upload"
              className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
            >
              <Plus className="h-3 w-3" />
              <span>Ajouter un document</span>
            </Link>
            <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1 text-xs text-zinc-300 hover:text-white">
              <Download className="h-3 w-3 text-zinc-400" />
              <span>Tout télécharger</span>
            </button>
          </div>
        </div>

        {/* 8-row Documents Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Nom du doc</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Associé à</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3 font-mono">Date d&apos;ajout</th>
                <th className="py-2.5 px-3 font-mono">Expiration</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-right">Taille</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {VEHICLE_DOCS.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{doc.type}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{doc.reference}</td>
                  <td className="py-3 px-3 text-zinc-400">{doc.category}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{doc.addedDate}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{doc.expirationDate}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                        doc.status === 'Valide'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <ShieldCheck className="h-2.5 w-2.5" />
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-400">{doc.size}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Télécharger">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <Link href={`/documents/DOC-00${doc.id}`} className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Voir">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
