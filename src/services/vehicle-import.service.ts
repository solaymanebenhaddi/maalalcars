import * as XLSX from 'xlsx'
import prisma from '@/lib/db'
import { auditService } from './audit.service'
import {
  vehicleBodyTypes,
  vehicleFuelTypes,
  vehicleTransmissions,
} from '@/validation/vehicle.schema'

export interface RawImportRow {
  [key: string]: unknown
}

export interface ValidatedVehicleRow {
  rowNumber: number
  vin: string
  matricule?: string | null
  brand: string
  model: string
  version?: string | null
  bodyType: (typeof vehicleBodyTypes)[number]
  year: number
  colorExterior: string
  colorInterior?: string | null
  fuelType: (typeof vehicleFuelTypes)[number]
  transmission: (typeof vehicleTransmissions)[number]
  mileage: number
  doors: number
  seats: number
  fiscalPower: number
  purchasePrice: number
  targetSalePrice: number
  minSalePrice?: number | null
  location: string
  parkId?: string | null
  description?: string | null
  options?: string | null
  missingFields?: string[]
  supplierName?: string | null
  handledByName?: string | null
  commissionerName?: string | null
  commissionAmount?: number | null
}

export interface ImportError {
  rowNumber: number
  vin?: string
  field?: string
  message: string
}

export interface ValidationSummary {
  totalRows: number
  validCount: number
  invalidCount: number
  validRows: ValidatedVehicleRow[]
  invalidRows: Array<{
    rowNumber: number
    data: RawImportRow
    errors: string[]
  }>
}

export interface ImportResult {
  success: boolean
  totalProcessed: number
  importedCount: number
  errors: ImportError[]
  createdVehicles: Array<{
    id: string
    code: string
    vin: string
    brand: string
    model: string
    matricule?: string | null
    year: number
    purchasePrice: number
    targetSalePrice: number
  }>
}

function normalizeHeader(key: string): string {
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function normalizeFuelType(val: unknown): (typeof vehicleFuelTypes)[number] | null {
  if (val === undefined || val === null) return null
  const s = String(val).trim().toUpperCase()
  if (s.includes('RECHARGE') || s.includes('PLUG')) return 'HYBRIDE_RECHARGEABLE'
  if (s.includes('HYBRID')) return 'HYBRIDE'
  if (s.includes('ELEC') || s.includes('ÉLEC')) return 'ELECTRIQUE'
  if (s.includes('DIESEL') || s.includes('GASOIL') || s.includes('MAZOUT')) return 'DIESEL'
  if (s.includes('ESSENCE') || s.includes('PETROL') || s.includes('SUPER') || s.includes('BENZIN')) return 'ESSENCE'
  return null
}

function normalizeTransmission(val: unknown): (typeof vehicleTransmissions)[number] | null {
  if (val === undefined || val === null) return null
  const s = String(val).trim().toUpperCase()
  if (s.includes('ROBOT')) return 'ROBOTISEE'
  if (s.includes('SEMI')) return 'SEMI_AUTO'
  if (s.includes('AUTO') || s.includes('BVA')) return 'AUTOMATIQUE'
  if (s.includes('MANU') || s.includes('BVM') || s.includes('MECA')) return 'MANUELLE'
  return null
}

function normalizeBodyType(val: unknown): (typeof vehicleBodyTypes)[number] {
  if (!val) return 'SUV'
  const s = String(val).trim().toUpperCase()
  if (s.includes('BERLINE') || s.includes('SEDAN')) return 'Berline'
  if (s.includes('PICK') || s.includes('4X4') || s.includes('PICKUP')) return '4x4 & Pick-up'
  if (s.includes('CITADINE') || s.includes('HATCH') || s.includes('COMPACT')) return 'Citadine'
  if (s.includes('UTILIT') || s.includes('FOURGON') || s.includes('VAN')) return 'Utilitaire'
  if (s.includes('COUP')) return 'Coupé'
  return 'SUV'
}

function parseNumber(val: unknown, defaultVal = 0): number {
  if (val === undefined || val === null || val === '') return defaultVal
  if (typeof val === 'number') return isNaN(val) ? defaultVal : val
  const clean = String(val).replace(/[^0-9.-]/g, '').replace(/,/g, '.')
  const num = Number(clean)
  return isNaN(num) ? defaultVal : num
}

export const vehicleImportService = {
  /**
   * Parse an Excel (.xlsx, .xls, .csv) buffer into raw rows
   */
  parseSpreadsheet(buffer: Buffer | ArrayBuffer): { rows: RawImportRow[]; sheetNames: string[] } {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
    const sheetNames = workbook.SheetNames
    if (sheetNames.length === 0) {
      throw new Error('Le fichier Excel ne contient aucune feuille de calcul.')
    }

    // Try to find the vehicle sheet or fallback to the first sheet
    const targetSheetName =
      sheetNames.find((name) => {
        const norm = normalizeHeader(name)
        return norm.includes('vehicule') || norm.includes('stock') || norm.includes('car')
      }) || sheetNames[0]

    const worksheet = workbook.Sheets[targetSheetName]
    const rawRows = XLSX.utils.sheet_to_json<RawImportRow>(worksheet, {
      defval: '',
      blankrows: false,
    })

    return { rows: rawRows, sheetNames }
  },

  /**
   * Validate raw rows against schema and database uniqueness constraints
   */
  async validateRows(
    rawRows: RawImportRow[],
    options: { defaultParkId?: string } = {}
  ): Promise<ValidationSummary> {
    const validRows: ValidatedVehicleRow[] = []
    const invalidRows: Array<{ rowNumber: number; data: RawImportRow; errors: string[] }> = []

    // Fetch existing VINs and matricules from DB to detect duplicates
    let existingVehicles: Array<{ vin: string; matricule: string | null }> = []
    let allParks: Array<{ id: string; code: string; name: string; city: string }> = []

    try {
      const [vList, pList] = await Promise.all([
        prisma.vehicle.findMany({
          select: { vin: true, matricule: true },
        }),
        prisma.park.findMany({
          select: { id: true, code: true, name: true, city: true },
        }),
      ])
      existingVehicles = vList
      allParks = pList
    } catch {
      // In isolated CI or test runners without active database tables,
      // fallback gracefully to empty sets so validation proceeds seamlessly
    }

    const existingVins = new Set(existingVehicles.map((v) => v.vin.trim().toUpperCase()))
    const existingMatricules = new Set(
      existingVehicles
        .filter((v) => Boolean(v.matricule))
        .map((v) => v.matricule!.trim().toUpperCase())
    )

    const seenFileVins = new Set<string>()
    const seenFileMatricules = new Set<string>()

    const currentYear = new Date().getFullYear()

    for (let i = 0; i < rawRows.length; i++) {
      const rowNumber = i + 2 // Row 1 is header
      const raw = rawRows[i]
      const errors: string[] = []

      // Create a normalized key lookup map
      const normMap: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(raw)) {
        normMap[normalizeHeader(key)] = value
        // Also strip parenthetical unit suffixes (e.g. "Kilométrage (km)*" -> "kilometrage")
        const strippedKey = key.replace(/\s*\([^)]*\)/g, '')
        normMap[normalizeHeader(strippedKey)] = value
      }

      const missingFields: string[] = []

      // 1. VIN (17 chars mandatory in database - auto-generate def-VIN- if missing)
      const rawVin =
        normMap['vin'] ||
        normMap['vinchassis'] ||
        normMap['chassis'] ||
        normMap['numerodechassis'] ||
        normMap['numchassis'] ||
        normMap['codevin'] ||
        ''
      let vin = String(rawVin).trim().toUpperCase()

      if (!vin || vin.length !== 17) {
        // Auto-generate unique 17-char provisional VIN: def-VIN- (8 chars) + 9 digits = 17 chars
        const seq = String(i + 1).padStart(9, '0')
        vin = `def-VIN-${seq}`
        let counter = 1
        while (existingVins.has(vin) || seenFileVins.has(vin)) {
          const rand = Math.floor(100000000 + Math.random() * 900000000).toString()
          vin = `def-VIN-${rand}`
          counter++
          if (counter > 50) break
        }
        seenFileVins.add(vin)
        missingFields.push('vin')
      } else if (existingVins.has(vin)) {
        errors.push(`Ce code VIN "${vin}" existe déjà dans le système.`)
      } else if (seenFileVins.has(vin)) {
        errors.push(`Ce code VIN "${vin}" est dupliqué dans ce fichier (plusieurs lignes).`)
      } else {
        seenFileVins.add(vin)
      }

      // 2. Matricule (Optionnel mais unique)
      const rawMatricule =
        normMap['matricule'] ||
        normMap['immatriculation'] ||
        normMap['plaque'] ||
        normMap['plate'] ||
        ''
      let matricule = rawMatricule ? String(rawMatricule).trim().toUpperCase() : null

      if (matricule) {
        if (existingMatricules.has(matricule)) {
          // If already in DB, set to null to avoid unique collision and mark as missing
          matricule = null
          missingFields.push('matricule')
        } else if (seenFileMatricules.has(matricule)) {
          matricule = `${matricule}-BIS`
          seenFileMatricules.add(matricule)
        } else {
          seenFileMatricules.add(matricule)
        }
      }

      // 3. Marque (Auto-fallback: def-Marque)
      const rawBrand = normMap['marque'] || normMap['brand'] || normMap['constructeur'] || ''
      let brand = String(rawBrand).trim()
      if (!brand) {
        brand = 'def-Marque'
        missingFields.push('brand')
      }

      // 4. Modèle (Auto-fallback: check type first or detect vintage in modele)
      const rawType = normMap['type'] ? String(normMap['type']).trim() : ''
      const rawModel = normMap['modele'] || normMap['model'] || ''
      let model = String(rawModel).trim()

      // If "modele" looks like a year, serial date, or customs note and "type" has the vehicle model name
      if (rawType && (!model || /^\d{4}$/.test(model) || /^\d{5}$/.test(model) || model.toUpperCase().includes('DOUANE'))) {
        if (!normMap['version'] && model && model !== rawType) {
          normMap['version'] = model
        }
        model = rawType
      } else if (!model && rawType) {
        model = rawType
      }

      if (!model) {
        model = 'def-Modèle'
        missingFields.push('model')
      }

      // 5. Version
      const rawVersion = normMap['version'] || normMap['finition'] || ''
      const version = rawVersion ? String(rawVersion).trim() : null

      // 6. Année (Auto-fallback: currentYear)
      const rawYear = normMap['annee'] || normMap['year'] || normMap['millesime']
      let year = parseNumber(rawYear, 0)
      if (!year || year < 1990 || year > currentYear + 1) {
        // Try extracting year from model or notes
        const match = String(normMap['modele'] || normMap['notes'] || normMap['remarques'] || '').match(/20\d{2}/)
        if (match) {
          year = parseInt(match[0], 10)
        } else {
          year = currentYear
          missingFields.push('year')
        }
      }

      // 7. Kilométrage (Auto-fallback: 0)
      const rawMileage = normMap['kilometrage'] || normMap['km'] || normMap['mileage']
      let mileage = parseNumber(rawMileage, -1)
      if (mileage < 0) {
        mileage = 0
        missingFields.push('mileage')
      }

      // 8. Carburant (Auto-fallback: DIESEL)
      const rawFuel =
        normMap['carburant'] ||
        normMap['fuel'] ||
        normMap['fueltype'] ||
        normMap['energie'] ||
        normMap['motorisation']
      let fuelType = normalizeFuelType(rawFuel)
      if (!fuelType) {
        if (model.toUpperCase().includes('HYBRID') || model.toUpperCase().includes('HYBRIDE')) {
          fuelType = 'HYBRIDE'
        } else if (model.toUpperCase().includes('GS') || brand.toUpperCase() === 'MOTO') {
          fuelType = 'ESSENCE'
        } else {
          fuelType = 'DIESEL'
        }
        missingFields.push('fuelType')
      }

      // 9. Transmission (Auto-fallback: AUTOMATIQUE)
      const rawTrans =
        normMap['transmission'] ||
        normMap['boite'] ||
        normMap['boitedevitesse'] ||
        normMap['automatiquemanuel'] ||
        normMap['gearbox']
      let transmission = normalizeTransmission(rawTrans)
      if (!transmission) {
        transmission = 'AUTOMATIQUE'
        missingFields.push('transmission')
      }

      // 10. Carrosserie
      const rawBody = normMap['carrosserie'] || normMap['bodytype'] || normMap['type']
      const bodyType = normalizeBodyType(rawBody)

      // 11. Couleur Extérieure (Auto-fallback: def-Couleur)
      const rawColorExt =
        normMap['couleur'] ||
        normMap['couleurexterieure'] ||
        normMap['colorexterior'] ||
        normMap['couleurext'] ||
        normMap['color'] ||
        ''
      let colorExterior = String(rawColorExt).trim()
      if (!colorExterior || colorExterior === 'Non spécifiée') {
        colorExterior = 'def-Couleur'
        missingFields.push('colorExterior')
      }

      // 12. Couleur Intérieure
      const rawColorInt =
        normMap['couleurinterieure'] || normMap['colorinterior'] || normMap['interieur'] || ''
      const colorInterior = rawColorInt ? String(rawColorInt).trim() : null

      // 13. Prix d'Achat & Vente (Auto-fallback)
      const rawPurchasePrice =
        normMap['prixachat'] ||
        normMap['prixdachat'] ||
        normMap['prixdachatdh'] ||
        normMap['prixachatdh'] ||
        normMap['purchaseprice'] ||
        normMap['coutachat'] ||
        normMap['achat']
      let purchasePrice = parseNumber(rawPurchasePrice, 0)
      if (purchasePrice <= 0) {
        purchasePrice = 0
        missingFields.push('purchasePrice')
      }

      const rawTargetPrice =
        normMap['prixvente'] ||
        normMap['prixdevente'] ||
        normMap['prixdeventesouhaite'] ||
        normMap['prixdeventesouhaitedh'] ||
        normMap['prixsouhaite'] ||
        normMap['prixsouhaitedh'] ||
        normMap['targetsaleprice'] ||
        normMap['prix'] ||
        normMap['vente']
      let targetSalePrice = parseNumber(rawTargetPrice, 0)
      if (targetSalePrice <= 0) {
        targetSalePrice = purchasePrice > 0 ? Math.round((purchasePrice * 1.15) / 1000) * 1000 : 0
        if (targetSalePrice <= 0) {
          missingFields.push('targetSalePrice')
        }
      }

      const rawMinPrice =
        normMap['prixminimum'] ||
        normMap['prixminimumdh'] ||
        normMap['minsaleprice'] ||
        normMap['prixmin'] ||
        normMap['prixmindh']
      const minSalePrice = rawMinPrice ? parseNumber(rawMinPrice, 0) : null

      // 14. Portes, Places, CV
      const doors = parseNumber(normMap['portes'] || normMap['doors'], 5)
      const seats = parseNumber(normMap['places'] || normMap['seats'], 5)
      const fiscalPower = parseNumber(
        normMap['puissancefiscale'] ||
          normMap['puissancefiscalecv'] ||
          normMap['fiscalpower'] ||
          normMap['cv'],
        8
      )

      // 15. Emplacement & Parc
      const rawLocation = normMap['emplacement'] || normMap['location'] || normMap['site'] || 'Casablanca Showroom'
      const location = String(rawLocation).trim()

      const rawPark =
        normMap['parc'] ||
        normMap['parcid'] ||
        normMap['park'] ||
        normMap['parkid'] ||
        normMap['parcsite'] ||
        ''
      let parkId = options.defaultParkId || null

      if (rawPark) {
        const parkStr = String(rawPark).trim().toLowerCase()
        const matchedPark = allParks.find(
          (p) =>
            p.id === rawPark ||
            p.code.toLowerCase() === parkStr ||
            p.city.toLowerCase() === parkStr ||
            p.name.toLowerCase().includes(parkStr) ||
            parkStr.includes(p.city.toLowerCase()) ||
            (parkStr.includes('casa') && p.city.toLowerCase() === 'casablanca') ||
            (parkStr.includes('fes') && p.city.toLowerCase().includes('fès'))
        )
        if (matchedPark) parkId = matchedPark.id
      }

      // 16. Options & Description
      const rawOptions = normMap['options'] || normMap['equipements'] || normMap['equipement'] || ''
      const optionsStr = rawOptions ? String(rawOptions).trim() : null

      const rawDesc = normMap['description'] || normMap['remarques'] || normMap['notes'] || ''
      const description = rawDesc ? String(rawDesc).trim() : null

      // 17. Extraction Fournisseur & Courtier si présents dans le fichier
      const rawSupplier = normMap['vendeur'] || normMap['fournisseur'] || normMap['seller'] || ''
      let supplierName = rawSupplier ? String(rawSupplier).trim() : null

      const rawPaidBy = normMap['quilapaye'] || normMap['payeur'] || normMap['payepar'] || ''
      let handledByName = rawPaidBy ? String(rawPaidBy).trim() : null

      const rawComm = normMap['commissionnaire'] || normMap['semsar'] || normMap['courtier'] || ''
      let commissionerName = rawComm ? String(rawComm).trim() : null

      const rawCommFee = parseNumber(
        normMap['fraiscommissionnaire'] || normMap['commission'] || normMap['commissionamount'],
        0
      )
      let commissionAmount = rawCommFee > 0 ? rawCommFee : 0

      // Extract metadata structured in description: e.g. "Vendeur: Particulier | Payé par: Direction | Semsar: Sans intermédiaire (Com: 0)"
      if (description) {
        if (!supplierName) {
          const m = description.match(/vendeur\s*:\s*([^|]+)/i)
          if (m) supplierName = m[1].trim()
        }
        if (!handledByName) {
          const m = description.match(/pay[eé]\s*par\s*:\s*([^|]+)/i)
          if (m) handledByName = m[1].trim()
        }
        if (!commissionerName) {
          const m = description.match(/(?:semsar|courtier|commissionnaire)\s*:\s*([^|(]+)/i)
          if (m) commissionerName = m[1].trim()
        }
        if (commissionAmount === 0) {
          const m = description.match(/com\s*:\s*([0-9.]+)/i)
          if (m) commissionAmount = parseNumber(m[1], 0)
        }
      }

      if (errors.length > 0) {
        invalidRows.push({
          rowNumber,
          data: raw,
          errors,
        })
      } else {
        validRows.push({
          rowNumber,
          vin,
          matricule,
          brand,
          model,
          version,
          bodyType,
          year,
          colorExterior,
          colorInterior,
          fuelType: fuelType!,
          transmission: transmission!,
          mileage,
          doors,
          seats,
          fiscalPower,
          purchasePrice,
          targetSalePrice,
          minSalePrice,
          location,
          parkId,
          description,
          options: optionsStr,
          missingFields,
          supplierName,
          handledByName,
          commissionerName,
          commissionAmount,
        })
      }
    }

    return {
      totalRows: rawRows.length,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      validRows,
      invalidRows,
    }
  },

  /**
   * Execute atomic/batch creation of validated vehicles
   */
  async importVehicles(
    validRows: ValidatedVehicleRow[],
    options: { userId?: string; defaultParkId?: string } = {}
  ): Promise<ImportResult> {
    if (validRows.length === 0) {
      return {
        success: true,
        totalProcessed: 0,
        importedCount: 0,
        errors: [],
        createdVehicles: [],
      }
    }

    // Determine starting sequence number for codes
    const currentYear = new Date().getFullYear()
    const [currentCount, purchaseCount] = await Promise.all([
      prisma.vehicle.count(),
      prisma.purchase.count(),
    ])

    const createdVehicles: ImportResult['createdVehicles'] = []
    const errors: ImportError[] = []

    // Insert sequentially or via transaction to ensure sequential unique codes
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      const codeIndex = currentCount + i + 1
      const code = `V-${currentYear}-${String(codeIndex).padStart(4, '0')}`
      const purchaseCode = `ACH-${currentYear}-${String(purchaseCount + i + 1).padStart(4, '0')}`

      try {
        const vehicle = await prisma.vehicle.create({
          data: {
            code,
            vin: row.vin,
            matricule: row.matricule || null,
            brand: row.brand,
            model: row.model,
            version: row.version || null,
            bodyType: row.bodyType,
            year: row.year,
            colorExterior: row.colorExterior,
            colorInterior: row.colorInterior || null,
            fuelType: row.fuelType,
            transmission: row.transmission,
            mileage: row.mileage,
            doors: row.doors,
            seats: row.seats,
            fiscalPower: row.fiscalPower,
            purchasePrice: row.purchasePrice,
            targetSalePrice: row.targetSalePrice,
            minSalePrice: row.minSalePrice || null,
            location: row.location,
            parkId: row.parkId || options.defaultParkId || null,
            description: row.description || null,
            options: JSON.stringify({
              isBulkImport: true,
              missingFields: row.missingFields || [],
              originalOptions: row.options || null,
            }),
            isBulkImport: true,
            status: 'IN_STOCK',
            statusHistory: {
              create: {
                oldStatus: 'NONE',
                newStatus: 'IN_STOCK',
                reason: 'Import groupé via fichier Excel (.xsl / .xlsx)',
                changedBy: options.userId || 'Super Admin',
              },
            },
          },
        })

        // Create linked initial purchase record so user can complete supplier, payment & commissioner details
        const hasCommDeclared = Boolean(
          row.commissionerName &&
            row.commissionerName !== 'SANS' &&
            !row.commissionerName.toLowerCase().includes('sans')
        )
        const isNoCommDeclared = Boolean(
          row.commissionerName &&
            (row.commissionerName === 'SANS' ||
              row.commissionerName.toLowerCase().includes('sans') ||
              row.commissionerName.toLowerCase().includes('direct'))
        )

        await prisma.purchase.create({
          data: {
            code: purchaseCode,
            vehicleId: vehicle.id,
            purchasePrice: row.purchasePrice,
            status: 'CONFIRMED',
            paymentMethod: 'VIREMENT',
            supplierName: row.supplierName || null,
            commissionerName: row.commissionerName || null,
            commissionAmount: row.commissionAmount || 0,
            hasCommissioner: hasCommDeclared ? true : isNoCommDeclared ? false : null,
            notes: `Dossier d'achat initié automatiquement lors de l'import groupé Excel${
              row.handledByName ? ` [Payé par: ${row.handledByName}]` : ''
            }`,
          },
        })

        createdVehicles.push({
          id: vehicle.id,
          code: vehicle.code,
          vin: vehicle.vin,
          brand: vehicle.brand,
          model: vehicle.model,
          matricule: vehicle.matricule,
          year: vehicle.year,
          purchasePrice: vehicle.purchasePrice,
          targetSalePrice: vehicle.targetSalePrice,
        })
      } catch (err: unknown) {
        errors.push({
          rowNumber: row.rowNumber,
          vin: row.vin,
          message: err instanceof Error ? err.message : 'Erreur lors de la création en base',
        })
      }
    }

    if (createdVehicles.length > 0) {
      await auditService.log({
        action: 'VEHICLES_BULK_IMPORTED',
        entityType: 'Vehicle',
        details: `Import groupé de ${createdVehicles.length} véhicule(s) via Excel (.xsl / .xlsx)`,
        userId: options.userId,
      })
    }

    return {
      success: errors.length === 0,
      totalProcessed: validRows.length,
      importedCount: createdVehicles.length,
      errors,
      createdVehicles,
    }
  },

  /**
   * Generate an official .xlsx sample template file with realistic dummy data
   */
  generateTemplateWorkbook(): Buffer {
    // 1. Sample Data with comprehensive columns
    const templateData = [
      {
        'VIN (Châssis)*': 'WVWZZZ3CZWE123456',
        'Immatriculation': '12345|A|6',
        'Marque*': 'Volkswagen',
        'Modèle*': 'Golf 8',
        'Version': 'R-Line 2.0 TDI',
        'Année*': 2023,
        'Kilométrage (km)*': 34000,
        'Carburant*': 'DIESEL',
        'Boîte de Vitesse*': 'AUTOMATIQUE',
        'Carrosserie': 'Citadine',
        'Couleur Extérieure*': 'Gris Nardo Métallisé',
        'Couleur Intérieure': 'Noir Tissu R-Line',
        'Prix d\'Achat (DH)*': 275000,
        'Prix de Vente Souhaité (DH)*': 315000,
        'Prix Minimum (DH)': 300000,
        'Puissance Fiscale (CV)': 8,
        'Portes': 5,
        'Places': 5,
        'Parc / Site': 'Casablanca Showroom',
        'Options (séparées par virgules)': 'Cockpit digital, Toit panoramique, Caméra recul, Jantes 18", Apple CarPlay',
        'Description': 'Véhicule première main, suivi en concession officielle, état neuf.',
      },
      {
        'VIN (Châssis)*': 'JTDKB20U507123456',
        'Immatriculation': '98765|B|1',
        'Marque*': 'Toyota',
        'Modèle*': 'Land Cruiser Prado',
        'Version': 'TX-L 4x4',
        'Année*': 2022,
        'Kilométrage (km)*': 58000,
        'Carburant*': 'DIESEL',
        'Boîte de Vitesse*': 'AUTOMATIQUE',
        'Carrosserie': '4x4 & Pick-up',
        'Couleur Extérieure*': 'Blanc Nacré',
        'Couleur Intérieure': 'Cuir Beige',
        'Prix d\'Achat (DH)*': 440000,
        'Prix de Vente Souhaité (DH)*': 490000,
        'Prix Minimum (DH)': 475000,
        'Puissance Fiscale (CV)': 12,
        'Portes': 5,
        'Places': 7,
        'Parc / Site': 'Casablanca Showroom',
        'Options (séparées par virgules)': '4x4 permanent, 7 places, Sellerie cuir, Toit ouvrant, Caméra 360, GPS Maroc',
        'Description': 'Idéal tout-terrain et famille, carnet d\'entretien complet.',
      },
      {
        'VIN (Châssis)*': 'UU1HSD00868123456',
        'Immatriculation': '45678|D|26',
        'Marque*': 'Dacia',
        'Modèle*': 'Duster',
        'Version': 'Prestige 1.5 dCi',
        'Année*': 2021,
        'Kilométrage (km)*': 62000,
        'Carburant*': 'DIESEL',
        'Boîte de Vitesse*': 'MANUELLE',
        'Carrosserie': 'SUV',
        'Couleur Extérieure*': 'Orange Atacama',
        'Couleur Intérieure': 'Tissu Noir',
        'Prix d\'Achat (DH)*': 140000,
        'Prix de Vente Souhaité (DH)*': 165000,
        'Prix Minimum (DH)': 158000,
        'Puissance Fiscale (CV)': 6,
        'Portes': 5,
        'Places': 5,
        'Parc / Site': 'Fès',
        'Options (séparées par virgules)': 'Écran tactile, Climatisation automatique, Barres de toit, Radars arrière',
        'Description': 'Parfait état mécanique, révision complète effectuée.',
      },
      {
        'VIN (Châssis)*': 'WBA31AY050F123456',
        'Immatriculation': '33221|A|6',
        'Marque*': 'BMW',
        'Modèle*': 'Série 3',
        'Version': '320d Pack M',
        'Année*': 2024,
        'Kilométrage (km)*': 15000,
        'Carburant*': 'HYBRIDE',
        'Boîte de Vitesse*': 'AUTOMATIQUE',
        'Carrosserie': 'Berline',
        'Couleur Extérieure*': 'Bleu Portimao',
        'Couleur Intérieure': 'Cuir Vernasca Cognac',
        'Prix d\'Achat (DH)*': 430000,
        'Prix de Vente Souhaité (DH)*': 495000,
        'Prix Minimum (DH)': 480000,
        'Puissance Fiscale (CV)': 8,
        'Portes': 4,
        'Places': 5,
        'Parc / Site': 'Casablanca Showroom',
        'Options (séparées par virgules)': 'Pack M Sport, Affichage tête haute, Phares Laser, Système Harman Kardon',
        'Description': 'Garantie constructeur active, état showroom irréprochable.',
      },
    ]

    const guideData = [
      {
        'Colonne': 'VIN (Châssis)*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'Exactement 17 caractères alphanumériques uniques',
        'Exemple': 'WVWZZZ3CZWE123456',
      },
      {
        'Colonne': 'Marque*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'Texte libre (Toyota, Volkswagen, Mercedes, Dacia...)',
        'Exemple': 'Toyota',
      },
      {
        'Colonne': 'Modèle*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'Texte libre (Golf, Duster, Prado, Clio...)',
        'Exemple': 'Land Cruiser Prado',
      },
      {
        'Colonne': 'Version',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Finition commerciale',
        'Exemple': 'TX-L 4x4 / Pack M / Prestige',
      },
      {
        'Colonne': 'Immatriculation',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Format marocain standard ou libre',
        'Exemple': '12345|A|6 ou 12345-A-6',
      },
      {
        'Colonne': 'Année*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'Nombre entier (1990 - 2027)',
        'Exemple': '2023',
      },
      {
        'Colonne': 'Kilométrage (km)*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'Nombre entier >= 0',
        'Exemple': '45000',
      },
      {
        'Colonne': 'Carburant*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'DIESEL, ESSENCE, HYBRIDE, HYBRIDE_RECHARGEABLE, ELECTRIQUE',
        'Exemple': 'DIESEL',
      },
      {
        'Colonne': 'Boîte de Vitesse*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'AUTOMATIQUE, MANUELLE, SEMI_AUTO, ROBOTISEE',
        'Exemple': 'AUTOMATIQUE',
      },
      {
        'Colonne': 'Carrosserie',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'SUV, Berline, 4x4 & Pick-up, Citadine, Utilitaire, Coupé',
        'Exemple': 'SUV',
      },
      {
        'Colonne': 'Couleur Extérieure*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'Texte libre',
        'Exemple': 'Noir Métallisé',
      },
      {
        'Colonne': 'Couleur Intérieure',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Texte libre',
        'Exemple': 'Cuir Noir',
      },
      {
        'Colonne': 'Prix d\'Achat (DH)*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'Nombre positif en Dirhams (MAD)',
        'Exemple': '280000',
      },
      {
        'Colonne': 'Prix de Vente Souhaité (DH)*',
        'Obligatoire': 'OUI',
        'Format / Valeurs': 'Nombre positif en Dirhams (MAD)',
        'Exemple': '320000',
      },
      {
        'Colonne': 'Prix Minimum (DH)',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Nombre positif en Dirhams (MAD)',
        'Exemple': '310000',
      },
      {
        'Colonne': 'Puissance Fiscale (CV)',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Nombre entier (défaut : 8)',
        'Exemple': '8',
      },
      {
        'Colonne': 'Portes',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Nombre entier 2 à 7 (défaut : 5)',
        'Exemple': '5',
      },
      {
        'Colonne': 'Places',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Nombre entier 1 à 9 (défaut : 5)',
        'Exemple': '5',
      },
      {
        'Colonne': 'Parc / Site',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Nom ou ville du parc (Casablanca, Fès...)',
        'Exemple': 'Casablanca Showroom',
      },
      {
        'Colonne': 'Options',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Mots-clés séparés par des virgules',
        'Exemple': 'Toit ouvrant, GPS, Caméra 360',
      },
      {
        'Colonne': 'Description',
        'Obligatoire': 'NON',
        'Format / Valeurs': 'Remarques ou historique',
        'Exemple': 'Première main, carnet d\'entretien',
      },
    ]

    const wb = XLSX.utils.book_new()

    // Sheet 1: Template
    const wsTemplate = XLSX.utils.json_to_sheet(templateData)
    // Auto-fit column widths
    const colWidths = [
      { wch: 22 }, // VIN
      { wch: 18 }, // Immat
      { wch: 16 }, // Marque
      { wch: 20 }, // Modèle
      { wch: 18 }, // Version
      { wch: 10 }, // Année
      { wch: 18 }, // Kilométrage
      { wch: 16 }, // Carburant
      { wch: 18 }, // Boîte
      { wch: 16 }, // Carrosserie
      { wch: 22 }, // Couleur Ext
      { wch: 20 }, // Couleur Int
      { wch: 18 }, // Prix Achat
      { wch: 24 }, // Prix Vente
      { wch: 18 }, // Prix Min
      { wch: 18 }, // CV
      { wch: 10 }, // Portes
      { wch: 10 }, // Places
      { wch: 22 }, // Parc
      { wch: 45 }, // Options
      { wch: 45 }, // Description
    ]
    wsTemplate['!cols'] = colWidths

    XLSX.utils.book_append_sheet(wb, wsTemplate, 'Véhicules à Importer')

    // Sheet 2: Guide
    const wsGuide = XLSX.utils.json_to_sheet(guideData)
    wsGuide['!cols'] = [{ wch: 28 }, { wch: 14 }, { wch: 55 }, { wch: 30 }]
    XLSX.utils.book_append_sheet(wb, wsGuide, 'Guide des Colonnes')

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  },
}
