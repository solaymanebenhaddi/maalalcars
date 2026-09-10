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

    it('auto-initializes provisional def-VIN- when VIN is missing or invalid length', async () => {
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
      expect(validation.validCount).toBe(1)
      expect(validation.invalidCount).toBe(0)
      expect(validation.validRows[0].vin.startsWith('def-VIN-')).toBe(true)
      expect(validation.validRows[0].vin.length).toBe(17)
      expect(validation.validRows[0].missingFields).toContain('vin')
    })

    it('auto-initializes missing fields with def- prefix (def-Marque, def-Modèle, def-Couleur)', async () => {
      const rawRows = [
        {
          VIN: '',
          Marque: '',
          Modèle: '',
          Couleur: '',
        },
      ]

      const validation = await vehicleImportService.validateRows(rawRows)
      expect(validation.validCount).toBe(1)
      expect(validation.validRows[0].vin.startsWith('def-VIN-')).toBe(true)
      expect(validation.validRows[0].brand).toBe('def-Marque')
      expect(validation.validRows[0].model).toBe('def-Modèle')
      expect(validation.validRows[0].colorExterior).toBe('def-Couleur')
      expect(validation.validRows[0].missingFields).toContain('vin')
      expect(validation.validRows[0].missingFields).toContain('brand')
      expect(validation.validRows[0].missingFields).toContain('model')
      expect(validation.validRows[0].missingFields).toContain('colorExterior')
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

    it('correctly maps headers with parenthetical units and extracts description metadata like BULL-ADD.xlsx', async () => {
      const rawRows = [
        {
          'VIN (Châssis)*': 'MAALAL26B00000099',
          Immatriculation: '',
          'Marque*': 'Autre',
          'Modèle*': 'Véhicule',
          Version: '',
          'Année*': 2021,
          'Kilométrage (km)*': 65000,
          'Carburant*': 'DIESEL',
          'Boîte de Vitesse*': 'AUTOMATIQUE',
          Carrosserie: 'SUV',
          'Couleur Extérieure*': 'Gris Métallisé',
          'Couleur Intérieure': 'Standard',
          "Prix d'Achat (DH)*": 120000,
          'Prix de Vente Souhaité (DH)*': 138000,
          'Prix Minimum (DH)': 125000,
          'Puissance Fiscale (CV)': 8,
          Portes: 5,
          Places: 5,
          'Parc / Site': 'Casablanca Showroom',
          Description: 'Vendeur: Particulier | Payé par: Direction | Semsar: Sans intermédiaire (Com: 0)',
        },
      ]

      const validation = await vehicleImportService.validateRows(rawRows)
      expect(validation.validCount).toBe(1)
      expect(validation.invalidCount).toBe(0)

      const row = validation.validRows[0]
      expect(row.vin).toBe('MAALAL26B00000099')
      expect(row.mileage).toBe(65000)
      expect(row.purchasePrice).toBe(120000)
      expect(row.targetSalePrice).toBe(138000)
      expect(row.minSalePrice).toBe(125000)
      expect(row.fiscalPower).toBe(8)
      expect(row.supplierName).toBe('Particulier')
      expect(row.handledByName).toBe('Direction')
      expect(row.commissionerName).toBe('Sans intermédiaire')
      expect(row.commissionAmount).toBe(0)
      expect(row.missingFields).toHaveLength(0)
    })
  })
})
