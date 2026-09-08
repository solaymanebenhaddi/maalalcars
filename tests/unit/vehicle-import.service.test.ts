import { describe, it, expect } from 'vitest'
import * as XLSX from 'xlsx'
import { vehicleImportService } from '@/services/vehicle-import.service'

describe('Vehicle Import Service (.xsl / .xlsx / .csv)', () => {
  describe('generateTemplateWorkbook', () => {
    it('generates a valid Excel spreadsheet buffer with expected sheets and headers', () => {
      const buffer = vehicleImportService.generateTemplateWorkbook()
      expect(buffer).toBeDefined()
      expect(buffer.length).toBeGreaterThan(1000)

      const workbook = XLSX.read(buffer, { type: 'buffer' })
      expect(workbook.SheetNames).toContain('Véhicules à Importer')
      expect(workbook.SheetNames).toContain('Guide des Colonnes')

      const sheet = workbook.Sheets['Véhicules à Importer']
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
      expect(rows.length).toBeGreaterThanOrEqual(3)

      // Verify essential columns exist in template sample rows
      const firstRow = rows[0]
      expect(firstRow['VIN (Châssis)*']).toBeDefined()
      expect(firstRow['Marque*']).toBeDefined()
      expect(firstRow['Modèle*']).toBeDefined()
      expect(firstRow['Année*']).toBeDefined()
      expect(firstRow['Carburant*']).toBeDefined()
      expect(firstRow['Boîte de Vitesse*']).toBeDefined()
      expect(firstRow['Prix d\'Achat (DH)*']).toBeDefined()
      expect(firstRow['Prix de Vente Souhaité (DH)*']).toBeDefined()
    })
  })

  describe('parseSpreadsheet', () => {
    it('correctly parses an in-memory workbook', () => {
      const testData = [
        {
          VIN: '12345678901234567',
          Marque: 'Peugeot',
          Modèle: '208',
          Année: 2022,
          Kilométrage: 40000,
          Carburant: 'DIESEL',
          Boîte: 'MANUELLE',
          Couleur: 'Blanc',
          'Prix d\'achat': 120000,
          'Prix de vente': 145000,
        },
      ]

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(testData)
      XLSX.utils.book_append_sheet(wb, ws, 'Vehicules')
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

      const result = vehicleImportService.parseSpreadsheet(buffer)
      expect(result.rows.length).toBe(1)
      expect(result.rows[0].Marque).toBe('Peugeot')
    })
  })

  describe('validateRows', () => {
    it('accepts valid rows and normalizes French synonyms (Gasoil, Auto, BVA)', async () => {
      const uniqueVin = `TESTVIN${Date.now().toString().slice(-10)}`
      const rawRows = [
        {
          VIN: uniqueVin,
          Marque: 'Renault',
          Modèle: 'Clio 5',
          Année: '2023',
          Kilométrage: '25000',
          Carburant: 'Gasoil', // Should normalize to DIESEL
          Boîte: 'BVA', // Should normalize to AUTOMATIQUE
          Carrosserie: 'Citadine',
          Couleur: 'Bleu Iron',
          'Prix d\'achat': '135000',
          'Prix de vente': '160000',
        },
      ]

      const validation = await vehicleImportService.validateRows(rawRows)
      expect(validation.totalRows).toBe(1)
      expect(validation.validCount).toBe(1)
      expect(validation.invalidCount).toBe(0)

      const validItem = validation.validRows[0]
      expect(validItem.vin).toBe(uniqueVin)
      expect(validItem.brand).toBe('Renault')
      expect(validItem.fuelType).toBe('DIESEL')
      expect(validItem.transmission).toBe('AUTOMATIQUE')
      expect(validItem.bodyType).toBe('Citadine')
      expect(validItem.year).toBe(2023)
      expect(validItem.purchasePrice).toBe(135000)
      expect(validItem.targetSalePrice).toBe(160000)
    })

    it('rejects rows with invalid VIN length (< 17 or > 17)', async () => {
      const rawRows = [
        {
          VIN: 'SHORTVIN',
          Marque: 'Audi',
          Modèle: 'A3',
          Année: 2022,
          Carburant: 'DIESEL',
          Boîte: 'AUTOMATIQUE',
        },
      ]

      const validation = await vehicleImportService.validateRows(rawRows)
      expect(validation.invalidCount).toBe(1)
      expect(validation.invalidRows[0].errors.some((e) => e.includes('17 caractères'))).toBe(true)
    })

    it('rejects duplicate VINs within the same file', async () => {
      const dupVin = 'DUPLICATE12345678'
      const rawRows = [
        {
          VIN: dupVin,
          Marque: 'Audi',
          Modèle: 'A3',
          Année: 2022,
          Carburant: 'DIESEL',
          Boîte: 'AUTOMATIQUE',
        },
        {
          VIN: dupVin,
          Marque: 'Audi',
          Modèle: 'A4',
          Année: 2023,
          Carburant: 'DIESEL',
          Boîte: 'AUTOMATIQUE',
        },
      ]

      const validation = await vehicleImportService.validateRows(rawRows)
      expect(validation.invalidCount).toBeGreaterThanOrEqual(1)
      expect(validation.invalidRows.some((r) => r.errors.some((e) => e.includes('dupliqué')))).toBe(true)
    })
  })
})
