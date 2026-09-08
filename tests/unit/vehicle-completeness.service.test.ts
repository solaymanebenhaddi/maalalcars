import { describe, it, expect } from 'vitest'
import { checkVehicleCompleteness } from '@/services/vehicle-completeness.service'

describe('Vehicle Completeness Service — Bulk Import Urgent Updates', () => {
  it('does not flag normal manually added vehicles for urgent updates', () => {
    const result = checkVehicleCompleteness({
      id: 'veh-normal-1',
      isBulkImport: false,
      options: null,
      photos: [],
      documents: [],
      purchases: [],
    })

    expect(result.isBulkImport).toBe(false)
    expect(result.needsUrgentUpdates).toBe(false)
  })

  it('flags bulk imported vehicles with missing info as urgent updates (red card)', () => {
    const result = checkVehicleCompleteness({
      id: 'veh-bulk-1',
      isBulkImport: true,
      options: null,
      photos: [],
      documents: [],
      purchases: [
        {
          id: 'purch-1',
          supplierName: null,
          handledById: null,
          commissionerName: null,
          hasCommissioner: null,
          documents: [],
        },
      ],
    })

    expect(result.isBulkImport).toBe(true)
    expect(result.needsUrgentUpdates).toBe(true)
    expect(result.isComplete).toBe(false)
    expect(result.completedCount).toBe(0)
    expect(result.missingCount).toBe(5)
    expect(result.items.images.satisfied).toBe(false)
    expect(result.items.supplier.satisfied).toBe(false)
    expect(result.items.whoPaid.satisfied).toBe(false)
    expect(result.items.commissioner.satisfied).toBe(false)
    expect(result.items.documents.satisfied).toBe(false)
  })

  it('detects partial completion progress', () => {
    const result = checkVehicleCompleteness({
      id: 'veh-bulk-2',
      isBulkImport: true,
      photos: [{ id: 'p-1', url: '/photos/golf8.jpg' }],
      documents: [{ id: 'd-1', name: 'Carte Grise' }],
      purchases: [
        {
          id: 'purch-2',
          supplierName: 'Auto Nejma Casablanca',
          handledById: null,
          commissionerName: null,
          hasCommissioner: null,
        },
      ],
    })

    expect(result.isBulkImport).toBe(true)
    expect(result.needsUrgentUpdates).toBe(true)
    expect(result.completedCount).toBe(3) // Photos + Supplier + Documents
    expect(result.items.images.satisfied).toBe(true)
    expect(result.items.supplier.satisfied).toBe(true)
    expect(result.items.documents.satisfied).toBe(true)
    expect(result.items.whoPaid.satisfied).toBe(false)
    expect(result.items.commissioner.satisfied).toBe(false)
  })

  it('clears urgent update alert when all 5 requirements are satisfied (direct purchase)', () => {
    const result = checkVehicleCompleteness({
      id: 'veh-bulk-complete-1',
      isBulkImport: true,
      photos: [{ id: 'p-1', url: '/photos/duster.jpg' }],
      documents: [{ id: 'd-1', name: 'Carte Grise' }],
      purchases: [
        {
          id: 'purch-3',
          supplierName: 'Dacia Maroc Particulier',
          handledById: 'user-admin-1',
          handledBy: { id: 'user-admin-1', name: 'Yassine Benali' },
          hasCommissioner: false,
          commissionerName: 'SANS',
        },
      ],
    })

    expect(result.isBulkImport).toBe(true)
    expect(result.needsUrgentUpdates).toBe(false)
    expect(result.isComplete).toBe(true)
    expect(result.completedCount).toBe(5)
    expect(result.missingCount).toBe(0)
  })

  it('clears urgent update alert when commissioner is declared and commissioner paidBy is set', () => {
    const result = checkVehicleCompleteness({
      id: 'veh-bulk-complete-2',
      isBulkImport: true,
      photos: [{ id: 'p-1', url: '/photos/clio.jpg' }],
      documents: [{ id: 'd-1', name: 'Certificat de cession' }],
      purchases: [
        {
          id: 'purch-4',
          supplierName: 'Renault Commerce Maroc',
          handledById: 'user-admin-1',
          handledBy: { id: 'user-admin-1', name: 'Yassine Benali' },
          hasCommissioner: true,
          commissionerName: 'Hassan Courtier',
          commissionAmount: 3000,
          commissionPaidById: 'user-admin-2',
          commissionPaidBy: { id: 'user-admin-2', name: 'Karim Tazi' },
        },
      ],
    })

    expect(result.isBulkImport).toBe(true)
    expect(result.needsUrgentUpdates).toBe(false)
    expect(result.isComplete).toBe(true)
    expect(result.items.commissioner.satisfied).toBe(true)
  })

  it('detects bulk import via history or options tags even if isBulkImport boolean is missing', () => {
    const result = checkVehicleCompleteness({
      id: 'veh-bulk-legacy',
      options: '{"isBulkImport":true,"tags":["IMPORT_EXCEL"]}',
      statusHistory: [{ reason: 'Import groupé via fichier Excel (.xsl / .xlsx)' }],
      photos: [],
      documents: [],
      purchases: [],
    })

    expect(result.isBulkImport).toBe(true)
    expect(result.needsUrgentUpdates).toBe(true)
  })

  it('flags vehicle with def-VIN, def-Modèle, def-Marque as urgent updates (red card)', () => {
    const result = checkVehicleCompleteness({
      id: 'veh-def-fields',
      vin: 'def-VIN-00000001',
      brand: 'def-Marque',
      model: 'def-Modèle',
      colorExterior: 'def-Couleur',
      isBulkImport: true,
      photos: [{ id: 'p-1', url: '/photos/car.jpg' }],
      documents: [{ id: 'd-1', name: 'Carte Grise' }],
      purchases: [
        {
          id: 'purch-def',
          supplierName: 'Auto Maroc',
          handledById: 'user-1',
          hasCommissioner: false,
          commissionerName: 'SANS',
        },
      ],
    })

    expect(result.needsUrgentUpdates).toBe(true)
    expect(result.hasDefaultedFields).toBe(true)
    expect(result.defaultedCount).toBe(4) // VIN, Marque, Modèle, Couleur
    expect(result.isComplete).toBe(false)
    expect(result.defaultedFieldLabels).toContain('Code VIN (Châssis)')
    expect(result.defaultedFieldLabels).toContain('Modèle')
    expect(result.defaultedFieldLabels).toContain('Marque')
    expect(result.defaultedFieldLabels).toContain('Couleur')
  })

  it('clears urgent update alert once def- fields and lifecycle items are replaced with real data', () => {
    const result = checkVehicleCompleteness({
      id: 'veh-def-completed',
      vin: 'VF1BB0A0F12345678',
      brand: 'Renault',
      model: 'Clio 5',
      colorExterior: 'Noir Intense',
      isBulkImport: true,
      options: '{"isBulkImport":true,"missingFields":[]}',
      photos: [{ id: 'p-1', url: '/photos/car.jpg' }],
      documents: [{ id: 'd-1', name: 'Carte Grise' }],
      purchases: [
        {
          id: 'purch-def-comp',
          supplierName: 'Renault Commerce',
          handledById: 'user-1',
          hasCommissioner: false,
          commissionerName: 'SANS',
        },
      ],
    })

    expect(result.needsUrgentUpdates).toBe(false)
    expect(result.hasDefaultedFields).toBe(false)
    expect(result.defaultedCount).toBe(0)
    expect(result.isComplete).toBe(true)
  })
})

