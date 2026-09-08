import React from 'react'
import {
  Download,
  ArrowLeft,
  Table,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { requireAuth } from '@/lib/session'
import { parkRepository } from '@/repositories/park.repository'
import { VehicleBulkImporterClient } from './vehicle-bulk-importer-client'

export const dynamic = 'force-dynamic'

export default async function VehicleImportPage() {
  await requireAuth()

  const allParks = await parkRepository.getAll()
  const parkOptions = allParks.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city,
    code: p.code,
  }))

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Import Groupé de Véhicules (.xlsx / .xsl / .csv)"
        subtitle="Alimentez votre stock en masse enImportant un fichier Excel ou CSV pré-rempli"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Véhicules', href: '/vehicles' },
          { label: 'Import Groupé' },
        ]}
        primaryAction={{
          label: 'Retour au Parc',
          href: '/vehicles',
          icon: ArrowLeft,
        }}
      />

      {/* Interactive Importer Client Component */}
      <div className="rounded-2xl border border-[#242432] bg-[#121217] p-6 shadow-xl">
        <VehicleBulkImporterClient parks={parkOptions} />
      </div>

      {/* Documentation / Specification of Excel file format */}
      <div className="rounded-2xl border border-[#22222c] bg-[#111116] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#202028] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Table className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Spécification Complète du Format de Fichier Excel (.xsl / .xlsx)
              </h3>
              <p className="text-xs text-zinc-400">
                Structure exacte des colonnes attendues pour une importation sans erreur
              </p>
            </div>
          </div>

          <a
            href="/api/vehicles/import/template"
            download
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger le Fichier Exemple (.xlsx)</span>
          </a>
        </div>

        {/* Column Definitions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#22222c] text-[11px] font-bold text-zinc-400 uppercase bg-[#14141c]">
                <th className="p-3">Colonne Excel</th>
                <th className="p-3 text-center">Obligatoire</th>
                <th className="p-3">Format / Valeurs Acceptées</th>
                <th className="p-3">Exemple Concret</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e28]">
              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">VIN (Châssis)*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300">
                  Exactement 17 caractères alphanumériques (insensible à la casse, unique en base)
                </td>
                <td className="p-3 font-mono text-zinc-400">WVWZZZ3CZWE123456</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Marque*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Nom du constructeur automobile</td>
                <td className="p-3 text-zinc-400">Toyota, Volkswagen, Mercedes-Benz</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Modèle*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Modèle commercial du véhicule</td>
                <td className="p-3 text-zinc-400">Land Cruiser Prado, Golf 8, Duster</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono text-zinc-300">Version</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-semibold">
                    Non
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Finition ou motorisation spécifique</td>
                <td className="p-3 text-zinc-400">TX-L 4x4, 2.0 TDI R-Line</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono text-zinc-300">Immatriculation</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-semibold">
                    Non
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Plaque d&apos;immatriculation marocaine (unique si renseignée)</td>
                <td className="p-3 font-mono text-zinc-400">12345|A|6 ou 98765-B-1</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Année*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Année de mise en circulation (1990 à 2027)</td>
                <td className="p-3 font-mono text-zinc-400">2023</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Kilométrage (km)*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Nombre entier positif en kilomètres</td>
                <td className="p-3 font-mono text-zinc-400">35000</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Carburant*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300 font-mono text-[11px] text-emerald-400">
                  DIESEL, ESSENCE, HYBRIDE, HYBRIDE_RECHARGEABLE, ELECTRIQUE
                </td>
                <td className="p-3 font-mono text-zinc-400">DIESEL (ou Gasoil)</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Boîte de Vitesse*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300 font-mono text-[11px] text-emerald-400">
                  AUTOMATIQUE, MANUELLE, SEMI_AUTO, ROBOTISEE
                </td>
                <td className="p-3 font-mono text-zinc-400">AUTOMATIQUE (ou Auto)</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono text-zinc-300">Carrosserie</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-semibold">
                    Non
                  </span>
                </td>
                <td className="p-3 text-zinc-300 font-mono text-[11px]">
                  SUV, Berline, 4x4 & Pick-up, Citadine, Utilitaire, Coupé
                </td>
                <td className="p-3 text-zinc-400">SUV (défaut)</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Couleur Extérieure*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Couleur de la carrosserie</td>
                <td className="p-3 text-zinc-400">Gris Nardo, Blanc Nacré, Noir</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Prix d&apos;Achat (DH)*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Montant d&apos;acquisition en Dirhams Marocains (DH)</td>
                <td className="p-3 font-mono text-amber-400">280000</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono font-bold text-cyan-400">Prix de Vente Souhaité (DH)*</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                    OUI
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Prix cible d&apos;exposition en showroom (DH)</td>
                <td className="p-3 font-mono text-emerald-400">325000</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono text-zinc-300">Prix Minimum (DH)</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-semibold">
                    Non
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Seuil plancher de négociation commerciale</td>
                <td className="p-3 font-mono text-zinc-400">310000</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono text-zinc-300">Puissance Fiscale (CV)</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-semibold">
                    Non
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Puissance fiscale en chevaux vapeur (défaut : 8)</td>
                <td className="p-3 font-mono text-zinc-400">8</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono text-zinc-300">Parc / Site</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-semibold">
                    Non
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Nom ou ville du parc de rattachement</td>
                <td className="p-3 text-zinc-400">Casablanca Showroom, Fès</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono text-zinc-300">Options</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-semibold">
                    Non
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Équipements notables séparés par des virgules</td>
                <td className="p-3 text-zinc-400">Toit panoramique, Caméra 360, GPS</td>
              </tr>

              <tr className="hover:bg-[#161622] transition-colors">
                <td className="p-3 font-mono text-zinc-300">Description</td>
                <td className="p-3 text-center">
                  <span className="rounded bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-semibold">
                    Non
                  </span>
                </td>
                <td className="p-3 text-zinc-300">Notes d&apos;historique ou observations internes</td>
                <td className="p-3 text-zinc-400">Première main, carnet complet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
