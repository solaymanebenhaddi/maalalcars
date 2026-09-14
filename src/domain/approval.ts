/**
 * Domain definitions and business logic for the Approval & Audit System
 * MAALAL CARS
 */

export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'CONFLICTED'

export type ApprovalActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ARCHIVE'
  | 'RESTORE'
  | 'STATUS_CHANGE'
  | 'SALE'
  | 'RESERVATION'
  | 'REPAIR'
  | 'EXCHANGE'
  | 'PRICE_CHANGE'
  | 'COMMISSION_CHANGE'
  | 'DOCUMENT_CHANGE'
  | 'PAYMENT_CHANGE'

export type ApprovalEntityType =
  | 'Vehicle'
  | 'Sale'
  | 'Reservation'
  | 'Repair'
  | 'Contact'
  | 'Document'
  | 'Expense'
  | 'User'
  | 'Park'

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvée',
  REJECTED: 'Rejetée',
  CANCELLED: 'Annulée',
  EXPIRED: 'Expirée',
  CONFLICTED: 'Conflit',
}

export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  APPROVED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  REJECTED: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  CANCELLED: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/30' },
  EXPIRED: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/30' },
  CONFLICTED: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
}

export const APPROVAL_ACTION_LABELS: Record<ApprovalActionType, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  ARCHIVE: 'Archivage',
  RESTORE: 'Restauration',
  STATUS_CHANGE: 'Changement de statut',
  SALE: 'Vente',
  RESERVATION: 'Réservation',
  REPAIR: 'Réparation',
  EXCHANGE: 'Échange / Reprise',
  PRICE_CHANGE: 'Modification de prix',
  COMMISSION_CHANGE: 'Modification commission',
  DOCUMENT_CHANGE: 'Document légal',
  PAYMENT_CHANGE: 'Paiement / Encaissement',
}

/**
 * Generates an authoritative Moroccan request sequence code:
 * Format: REQ-YYYY-XXXXX (e.g. REQ-2026-00042)
 */
export function generateRequestNumber(sequenceNumber: number, year: number = new Date().getFullYear()): string {
  const padded = String(Math.max(1, sequenceNumber)).padStart(5, '0')
  return `REQ-${year}-${padded}`
}

export interface FieldDiff {
  key: string
  label: string
  before: unknown
  after: unknown
}

/**
 * Computes difference between two snapshots, ignoring technical metadata keys
 */
export function computeFieldDiff(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined
): FieldDiff[] {
  if (!before && !after) return []
  if (!before && after) {
    return Object.entries(after)
      .filter(([k]) => !isIgnoredDiffKey(k))
      .map(([key, value]) => ({
        key,
        label: formatFieldLabel(key),
        before: null,
        after: value,
      }))
  }
  if (before && !after) {
    return Object.entries(before)
      .filter(([k]) => !isIgnoredDiffKey(k))
      .map(([key, value]) => ({
        key,
        label: formatFieldLabel(key),
        before: value,
        after: null,
      }))
  }

  const b = before || {}
  const a = after || {}
  const allKeys = Array.from(new Set([...Object.keys(b), ...Object.keys(a)])).filter(
    (k) => !isIgnoredDiffKey(k)
  )

  const diffs: FieldDiff[] = []
  for (const key of allKeys) {
    const valBefore = b[key]
    const valAfter = a[key]

    // Simple value comparison or JSON serialization comparison for objects/arrays
    const isDifferent =
      typeof valBefore === 'object' || typeof valAfter === 'object'
        ? JSON.stringify(valBefore) !== JSON.stringify(valAfter)
        : valBefore !== valAfter

    if (isDifferent) {
      diffs.push({
        key,
        label: formatFieldLabel(key),
        before: valBefore ?? null,
        after: valAfter ?? null,
      })
    }
  }

  return diffs
}

function isIgnoredDiffKey(key: string): boolean {
  return [
    'id',
    'createdAt',
    'updatedAt',
    'archivedAt',
    'passwordHash',
    'sessionToken',
    'modelRelationId',
  ].includes(key)
}

export function formatFieldLabel(key: string): string {
  const map: Record<string, string> = {
    brand: 'Marque',
    model: 'Modèle',
    version: 'Finition / Version',
    year: 'Année',
    vin: 'Châssis (VIN)',
    matricule: 'Matricule',
    mileage: 'Kilométrage',
    purchasePrice: "Prix d'achat",
    targetSalePrice: 'Prix de vente cible',
    minSalePrice: 'Prix de vente minimum',
    actualSalePrice: 'Prix de vente final',
    status: 'Statut',
    colorExterior: 'Couleur extérieure',
    colorInterior: 'Couleur intérieure',
    transmission: 'Boîte de vitesse',
    fuelType: 'Carburant',
    location: 'Emplacement / Parc',
    description: 'Description',
    customsStatus: 'Dédouanement',
    customsYear: 'Année de dédouanement',
    doors: 'Nombre de portes',
    seats: 'Nombre de places',
    fiscalPower: 'Puissance fiscale (CV)',
    rejectionReason: 'Motif du rejet',
    notes: 'Remarques',
  }
  return map[key] || key
}

export interface ConflictDetectionResult {
  hasConflict: boolean
  conflictFields: Array<{
    field: string
    initialValue: unknown
    currentValue: unknown
    requestedValue: unknown
  }>
}

/**
 * Checks for concurrent modification conflict between initial request snapshot,
 * current live entity in DB, and the requested changes.
 */
export function detectEntityConflict(params: {
  beforeSnapshot: Record<string, unknown> | null | undefined
  currentEntity: Record<string, unknown> | null | undefined
  requestedChanges: Record<string, unknown>
}): ConflictDetectionResult {
  if (!params.currentEntity || !params.beforeSnapshot) {
    return { hasConflict: false, conflictFields: [] }
  }

  const conflicts: ConflictDetectionResult['conflictFields'] = []

  // Check each requested field: if currentEntity[field] differs from beforeSnapshot[field],
  // that means someone else changed it while this request was pending!
  for (const [key, requestedVal] of Object.entries(params.requestedChanges)) {
    if (isIgnoredDiffKey(key)) continue

    const initialVal = params.beforeSnapshot[key]
    const currentVal = params.currentEntity[key]

    const hasChangedSinceRequest =
      typeof initialVal === 'object' || typeof currentVal === 'object'
        ? JSON.stringify(initialVal) !== JSON.stringify(currentVal)
        : initialVal !== currentVal

    if (hasChangedSinceRequest) {
      conflicts.push({
        field: key,
        initialValue: initialVal ?? null,
        currentValue: currentVal ?? null,
        requestedValue: requestedVal,
      })
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflictFields: conflicts,
  }
}
