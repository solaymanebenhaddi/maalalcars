'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building2,
  ChevronRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import type {
  ValidationSummary,
  ImportResult,
  ValidatedVehicleRow,
} from '@/services/vehicle-import.service'

interface ParkOption {
  id: string
  name: string
  city: string
  code: string
}

interface Props {
  parks?: ParkOption[]
}

export function VehicleBulkImporterClient({ parks = [] }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [selectedParkId, setSelectedParkId] = useState<string>('')
  const [isValidating, setIsValidating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [validation, setValidation] = useState<ValidationSummary | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [activeTab, setActiveTab] = useState<'valid' | 'errors'>('valid')
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile)
    setImportResult(null)
    setValidation(null)

    await runValidation(selectedFile, selectedParkId)
  }

  const runValidation = async (targetFile: File, parkId?: string) => {
    setIsValidating(true)
    try {
      const formData = new FormData()
      formData.append('file', targetFile)
      formData.append('dryRun', 'true')
      if (parkId) formData.append('parkId', parkId)

      const res = await fetch('/api/vehicles/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la vérification du fichier')
      }

      setValidation(data.validation)
      if (data.validation.validCount === 0 && data.validation.invalidCount > 0) {
        setActiveTab('errors')
      } else {
        setActiveTab('valid')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Échec de la validation'
      toast.error(msg, 'Erreur de lecture Excel')
    } finally {
      setIsValidating(false)
    }
  }

  const handleConfirmImport = async () => {
    if (!file || !validation || validation.validRows.length === 0) return

    setIsImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('dryRun', 'false')
      if (selectedParkId) formData.append('parkId', selectedParkId)

      const res = await fetch('/api/vehicles/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’importation définitive')
      }

      setImportResult(data.importResult)
      toast.success(
        `${data.importResult.importedCount} véhicule(s) ont été intégrés avec succès au stock.`,
        'Importation réussie'
      )

      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur d’importation'
      toast.error(msg, 'Échec de l’import')
    } finally {
      setIsImporting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setValidation(null)
    setImportResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Target Park and Download Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#22222e] bg-[#16161f]">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <Building2 className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold">Parc de destination par défaut :</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedParkId}
            onChange={(e) => {
              setSelectedParkId(e.target.value)
              if (file) runValidation(file, e.target.value)
            }}
            className="flex-1 sm:w-72 rounded-lg border border-[#2e2e3e] bg-[#121217] px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Automatique (selon colonne &quot;Parc&quot; ou Showroom)</option>
            {parks.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.city})
              </option>
            ))}
          </select>

          <a
            href="/api/vehicles/import/template"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Télécharger Modèle</span>
          </a>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      {!importResult && (
        <>
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileChange(e.dataTransfer.files[0])
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-cyan-500 bg-cyan-500/10 scale-[0.99]'
                  : 'border-[#2e2e3e] bg-[#14141c]/60 hover:border-zinc-500 hover:bg-[#161622]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0])
                  }
                }}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1d1d28] border border-[#2a2a3a] text-cyan-400 shadow-inner">
                  <Upload className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">
                    Glissez-déposez votre fichier Excel (.xsl, .xlsx, .csv) ici
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    ou <span className="text-cyan-400 hover:underline">cliquez pour sélectionner un fichier</span> sur votre ordinateur
                  </p>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono pt-1">
                  Les véhicules seront validés automatiquement en temps réel avant toute insertion.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono">{file.name}</div>
                  <div className="text-[11px] text-zinc-400">
                    {(file.size / 1024).toFixed(1)} Ko • Prêt pour analyse
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                Changer de fichier
              </button>
            </div>
          )}
        </>
      )}

      {/* Validation in Progress */}
      {isValidating && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
          <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-semibold text-zinc-300">
            Validation des lignes, unicité des VIN et vérification du format en cours...
          </p>
        </div>
      )}

      {/* Preview Section */}
      {validation && !isValidating && !importResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#282834] bg-[#14141c] p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total Lignes Détectées</span>
              <span className="text-xl font-black text-white font-mono">{validation.totalRows}</span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Lignes Valides</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {validation.validCount}
              </span>
            </div>

            <div
              className={`rounded-xl border p-3.5 text-center ${
                validation.invalidCount > 0
                  ? 'border-red-500/40 bg-red-950/20'
                  : 'border-zinc-800 bg-[#14141c]'
              }`}
            >
              <span
                className={`text-[10px] uppercase font-bold block ${
                  validation.invalidCount > 0 ? 'text-red-400' : 'text-zinc-500'
                }`}
              >
                Lignes avec Anomalies
              </span>
              <span
                className={`text-xl font-black font-mono ${
                  validation.invalidCount > 0 ? 'text-red-400' : 'text-zinc-400'
                }`}
              >
                {validation.invalidCount}
              </span>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center justify-between border-b border-[#22222e]">
            <div className="flex">
              <button
                type="button"
                onClick={() => setActiveTab('valid')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'valid'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Véhicules Valides ({validation.validCount})</span>
              </button>

              {validation.invalidCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('errors')}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'errors'
                      ? 'border-red-500 text-red-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Anomalies Rejetées ({validation.invalidCount})</span>
                </button>
              )}
            </div>

            {validation.validCount > 0 && (
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isImporting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Importer {validation.validCount} véhicule(s)</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Valid Table */}
          {activeTab === 'valid' && (
            <div className="rounded-xl border border-[#22222e] bg-[#14141c] overflow-hidden">
              {validation.validRows.length > 0 ? (
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181824] text-[10px] font-bold text-zinc-400 uppercase tracking-wider sticky top-0">
                      <tr>
                        <th className="p-3">Ligne</th>
                        <th className="p-3">VIN / Châssis</th>
                        <th className="p-3">Immatriculation</th>
                        <th className="p-3">Véhicule</th>
                        <th className="p-3">Année</th>
                        <th className="p-3">Carburant</th>
                        <th className="p-3">Kilométrage</th>
                        <th className="p-3 text-right">Prix Achat</th>
                        <th className="p-3 text-right">Prix Vente</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#20202c]">
                      {validation.validRows.map((v: ValidatedVehicleRow) => (
                        <tr key={v.vin} className="hover:bg-[#181822] transition-colors">
                          <td className="p-3 font-mono text-zinc-500">#{v.rowNumber}</td>
                          <td className="p-3 font-mono font-bold text-cyan-400">{v.vin}</td>
                          <td className="p-3 font-mono text-zinc-300">
                            {v.matricule || <span className="text-zinc-600">—</span>}
                          </td>
                          <td className="p-3 font-semibold text-white">
                            {v.brand} {v.model} {v.version ? `(${v.version})` : ''}
                          </td>
                          <td className="p-3 text-zinc-300">{v.year}</td>
                          <td className="p-3">
                            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                              {v.fuelType}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-zinc-300">
                            {v.mileage.toLocaleString('fr-FR')} km
                          </td>
                          <td className="p-3 text-right font-mono text-amber-400 font-semibold">
                            {v.purchasePrice.toLocaleString('fr-MA')} DH
                          </td>
                          <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                            {v.targetSalePrice.toLocaleString('fr-MA')} DH
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500">
                  Aucun véhicule valide dans ce fichier.
                </div>
              )}
            </div>
          )}

          {/* Errors Table */}
          {activeTab === 'errors' && validation.invalidCount > 0 && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/10 overflow-hidden">
              <div className="p-3 bg-red-950/30 border-b border-red-500/20 text-xs text-red-300 font-medium">
                Les anomalies suivantes empêchent l&apos;import de ces lignes spécifiques :
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1e1518] text-[10px] font-bold text-red-300 uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="p-3 w-16">Ligne</th>
                      <th className="p-3">Données transmises</th>
                      <th className="p-3">Erreurs détectées</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-900/20">
                    {validation.invalidRows.map((item) => (
                      <tr key={item.rowNumber} className="hover:bg-red-950/20">
                        <td className="p-3 font-mono font-bold text-red-400">#{item.rowNumber}</td>
                        <td className="p-3 text-zinc-300 font-mono text-[11px] max-w-sm truncate">
                          {Object.entries(item.data)
                            .slice(0, 4)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' | ')}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1.5">
                            {item.errors.map((err, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-red-900/50 border border-red-700/50 px-2.5 py-1 text-[11px] font-medium text-red-200"
                              >
                                {err}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success View */}
      {importResult && (
        <div className="space-y-6 py-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h4 className="text-xl font-black text-white">
              Importation Terminée avec Succès !
            </h4>

            <p className="text-sm text-zinc-300 max-w-lg mx-auto">
              <strong className="text-emerald-400 font-bold">{importResult.importedCount} véhicules</strong> ont été ajoutés et sont immédiatement prêts pour consultation, réservation ou vente dans votre parc automobile.
            </p>

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                Importer un autre fichier
              </button>

              <Link
                href="/vehicles"
                className="px-5 py-2 rounded-xl bg-cyan-600 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-lg"
              >
                Consulter les Véhicules en Stock
              </Link>
            </div>
          </div>

          {/* Created Vehicles Table */}
          <div className="rounded-xl border border-[#22222e] bg-[#14141c] overflow-hidden">
            <div className="px-4 py-3 bg-[#181824] border-b border-[#22222c] text-xs font-bold text-zinc-300">
              Liste des véhicules créés :
            </div>

            <div className="divide-y divide-[#20202c] max-h-80 overflow-y-auto">
              {importResult.createdVehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 flex items-center justify-between hover:bg-[#181822] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-zinc-800 px-2.5 py-1 font-mono text-xs font-bold text-zinc-300 border border-zinc-700">
                      {v.code}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {v.brand} {v.model} ({v.year})
                      </div>
                      <div className="text-xs font-mono text-zinc-500">
                        VIN: {v.vin} {v.matricule ? `• Plaque: ${v.matricule}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {v.targetSalePrice.toLocaleString('fr-MA')} DH
                      </div>
                      <div className="text-[10px] text-zinc-500">Prix cible</div>
                    </div>

                    <Link
                      href={`/vehicles/${v.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                      title="Voir la fiche"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
