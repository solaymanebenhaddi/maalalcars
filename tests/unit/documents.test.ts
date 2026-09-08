import { describe, it, expect } from 'vitest'
import {
  DOCUMENT_TYPES,
  getDocumentTypesByCategory,
  getDocumentTypeLabel,
  validateDocumentUpload,
  DocumentCategory,
} from '@/domain/document'

describe('Document Management Domain & Validation', () => {
  describe('Document Types Taxonomy & Categories', () => {
    it('should have document types defined for all major lifecycle stages', () => {
      expect(DOCUMENT_TYPES.length).toBeGreaterThan(15)
      const categories: DocumentCategory[] = ['Achats', 'Ventes', 'Réparations', 'Administratif']
      categories.forEach((cat) => {
        const types = getDocumentTypesByCategory(cat)
        expect(types.length).toBeGreaterThan(0)
        types.forEach((t) => expect(t.category).toBe(cat))
      })
    })

    it('should include essential purchase documents in Achats category', () => {
      const purchaseTypes = getDocumentTypesByCategory('Achats').map((t) => t.value)
      expect(purchaseTypes).toContain('CARTE_GRISE')
      expect(purchaseTypes).toContain('ACTE_CESSION')
      expect(purchaseTypes).toContain('FACTURE_ACHAT')
      expect(purchaseTypes).toContain('CIN_FOURNISSEUR')
      expect(purchaseTypes).toContain('CIN_SEMSAR_ACHAT')
      expect(purchaseTypes).toContain('DECHARGE_PAIEMENT')
    })

    it('should include essential sale documents in Ventes category', () => {
      const saleTypes = getDocumentTypesByCategory('Ventes').map((t) => t.value)
      expect(saleTypes).toContain('CONTRAT_VENTE')
      expect(saleTypes).toContain('FACTURE_VENTE')
      expect(saleTypes).toContain('CIN_ACHETEUR')
      expect(saleTypes).toContain('CIN_SEMSAR_VENTE')
      expect(saleTypes).toContain('CERTIFICAT_VENTE')
      expect(saleTypes).toContain('RECU_REGLEMENT')
      expect(saleTypes).toContain('BON_LIVRAISON')
    })

    it('should include essential repair documents in Réparations category', () => {
      const repairTypes = getDocumentTypesByCategory('Réparations').map((t) => t.value)
      expect(repairTypes).toContain('FACTURE_REPARATION')
      expect(repairTypes).toContain('DEVIS_REPARATION')
      expect(repairTypes).toContain('ORDRE_REPARATION')
      expect(repairTypes).toContain('BON_PIECES')
      expect(repairTypes).toContain('RAPPORT_DIAGNOSTIC')
    })

    it('should return human-readable French labels via getDocumentTypeLabel', () => {
      expect(getDocumentTypeLabel('CARTE_GRISE')).toContain('Carte Grise')
      expect(getDocumentTypeLabel('CONTRAT_VENTE')).toContain('Contrat de Vente')
      expect(getDocumentTypeLabel('FACTURE_REPARATION')).toContain('Facture Réparation')
      expect(getDocumentTypeLabel('CIN_SEMSAR_ACHAT')).toContain('Semsar')
      expect(getDocumentTypeLabel('UNKNOWN_TYPE')).toBe('UNKNOWN_TYPE')
    })
  })

  describe('File Validation Rules (MIME types & Size Limits)', () => {
    it('should accept valid PDF and image files within 25MB limit', () => {
      const validFiles = [
        { name: 'carte_grise.pdf', mimeType: 'application/pdf', size: 2 * 1024 * 1024 },
        { name: 'photo_cin.jpg', mimeType: 'image/jpeg', size: 1.5 * 1024 * 1024 },
        { name: 'facture.png', mimeType: 'image/png', size: 800 * 1024 },
        { name: 'scan_contrat.webp', mimeType: 'image/webp', size: 500 * 1024 },
      ]

      validFiles.forEach((f) => {
        const result = validateDocumentUpload(f)
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })
    })

    it('should reject files exceeding the 25 MB limit', () => {
      const oversizedFile = {
        name: 'huge_archive.pdf',
        mimeType: 'application/pdf',
        size: 26 * 1024 * 1024, // 26 MB
      }

      const result = validateDocumentUpload(oversizedFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('25 Mo')
    })

    it('should reject unsupported file extensions and MIME types', () => {
      const invalidFiles = [
        { name: 'script.exe', mimeType: 'application/x-msdownload', size: 1024 },
        { name: 'payload.sh', mimeType: 'text/x-shellscript', size: 512 },
        { name: 'archive.zip', mimeType: 'application/zip', size: 1024 * 1024 },
      ]

      invalidFiles.forEach((f) => {
        const result = validateDocumentUpload(f)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Format de fichier non autorisé')
      })
    })
  })

  describe('Case Attachment & Multi-Case Association Rules', () => {
    interface MockDocument {
      id: string
      category: DocumentCategory
      type: string
      vehicleId?: string | null
      purchaseId?: string | null
      saleId?: string | null
      repairId?: string | null
    }

    const mockDocs: MockDocument[] = [
      { id: '1', category: 'Achats', type: 'CARTE_GRISE', vehicleId: 'veh-1', purchaseId: 'pur-1' },
      { id: '2', category: 'Achats', type: 'CIN_SEMSAR_ACHAT', vehicleId: 'veh-1', purchaseId: 'pur-1' },
      { id: '3', category: 'Réparations', type: 'FACTURE_REPARATION', vehicleId: 'veh-1', repairId: 'rep-1' },
      { id: '4', category: 'Réparations', type: 'BON_PIECES', vehicleId: 'veh-1', repairId: 'rep-2' },
      { id: '5', category: 'Ventes', type: 'CONTRAT_VENTE', vehicleId: 'veh-1', saleId: 'sale-1' },
      { id: '6', category: 'Ventes', type: 'CIN_ACHETEUR', vehicleId: 'veh-1', saleId: 'sale-1' },
    ]

    it('should correctly isolate purchase documents for the Acquisition dossier', () => {
      const purchaseDocs = mockDocs.filter(
        (d) => d.category === 'Achats' || d.purchaseId === 'pur-1'
      )
      expect(purchaseDocs.length).toBe(2)
      expect(purchaseDocs.map((d) => d.type)).toEqual(['CARTE_GRISE', 'CIN_SEMSAR_ACHAT'])
    })

    it('should correctly isolate repair documents for specific workshop interventions', () => {
      const rep1Docs = mockDocs.filter((d) => d.repairId === 'rep-1')
      expect(rep1Docs.length).toBe(1)
      expect(rep1Docs[0].type).toBe('FACTURE_REPARATION')

      const rep2Docs = mockDocs.filter((d) => d.repairId === 'rep-2')
      expect(rep2Docs.length).toBe(1)
      expect(rep2Docs[0].type).toBe('BON_PIECES')
    })

    it('should correctly isolate sales documents for the Sale dossier', () => {
      const saleDocs = mockDocs.filter(
        (d) => d.category === 'Ventes' || d.saleId === 'sale-1'
      )
      expect(saleDocs.length).toBe(2)
      expect(saleDocs.map((d) => d.type)).toEqual(['CONTRAT_VENTE', 'CIN_ACHETEUR'])
    })

    it('should consolidate all documents in the full vehicle portfolio', () => {
      const vehicleDocs = mockDocs.filter((d) => d.vehicleId === 'veh-1')
      expect(vehicleDocs.length).toBe(6)
    })
  })
})
