export interface CompletenessCheckItem {
  key: 'images' | 'supplier' | 'whoPaid' | 'commissioner' | 'documents'
  satisfied: boolean
  label: string
  shortLabel: string
  description: string
  details?: string | null
}

export interface DefFieldItem {
  key: string
  label: string
  currentValue: string
  isDefaulted: boolean
}

export interface VehicleCompletenessResult {
  isBulkImport: boolean
  needsUrgentUpdates: boolean
  isComplete: boolean
  completedCount: number
  totalRequired: number
  missingCount: number
  missingLabels: string[]
  items: {
    images: CompletenessCheckItem
    supplier: CompletenessCheckItem
    whoPaid: CompletenessCheckItem
    commissioner: CompletenessCheckItem
    documents: CompletenessCheckItem
  }
  defFields: DefFieldItem[]
  hasDefaultedFields: boolean
  defaultedCount: number
  defaultedFieldLabels: string[]
}

/**
 * Evaluates whether a vehicle was created via bulk import or contains def- defaulted fields,
 * and whether it is missing critical lifecycle information (images, supplier, payer, commissioner, documents).
 */
export function checkVehicleCompleteness(vehicle: {
  id: string
  vin?: string | null
  brand?: string | null
  model?: string | null
  colorExterior?: string | null
  fuelType?: string | null
  transmission?: string | null
  mileage?: number | null
  purchasePrice?: number | null
  isBulkImport?: boolean | null
  options?: string | null
  description?: string | null
  photos?: Array<{ id: string; url: string }> | null
  documents?: Array<{ id: string; name?: string | null; category?: string | null }> | null
  statusHistory?: Array<{ reason?: string | null }> | null
  purchases?: Array<{
    id: string
    supplierName?: string | null
    supplierPhone?: string | null
    supplierCin?: string | null
    handledById?: string | null
    handledBy?: { id: string; name: string } | null
    commissionerName?: string | null
    commissionAmount?: number | null
    commissionPaidById?: string | null
    commissionPaidBy?: { id: string; name: string } | null
    hasCommissioner?: boolean | null
    notes?: string | null
    documents?: Array<{ id: string }> | null
  }> | null
}): VehicleCompletenessResult {
  // 1. Identify if this vehicle was imported via bulk import
  const hasBulkFlag = vehicle.isBulkImport === true
  const hasBulkOption =
    typeof vehicle.options === 'string' &&
    (vehicle.options.includes('"isBulkImport":true') ||
      vehicle.options.includes('BULK_IMPORT') ||
      vehicle.options.includes('IMPORT_EXCEL'))
  const hasBulkHistory =
    Array.isArray(vehicle.statusHistory) &&
    vehicle.statusHistory.some(
      (h) => typeof h.reason === 'string' && h.reason.toLowerCase().includes('import groupé')
    )

  // Parse missingFields from options JSON if available
  let missingImportFields: string[] = []
  if (typeof vehicle.options === 'string') {
    try {
      const parsed = JSON.parse(vehicle.options)
      if (Array.isArray(parsed.missingFields)) {
        missingImportFields = parsed.missingFields
      }
    } catch {
      // ignore
    }
  }

  // 2. Evaluate def- fields (defaulted fields that require user attention)
  const isVinDefaulted = Boolean(vehicle.vin && vehicle.vin.startsWith('def-')) || missingImportFields.includes('vin')
  const isBrandDefaulted = Boolean(vehicle.brand && vehicle.brand.startsWith('def-')) || missingImportFields.includes('brand')
  const isModelDefaulted = Boolean(vehicle.model && vehicle.model.startsWith('def-')) || missingImportFields.includes('model')
  const isColorDefaulted = Boolean(vehicle.colorExterior && vehicle.colorExterior.startsWith('def-')) || missingImportFields.includes('colorExterior')
  const isPriceDefaulted =
    (vehicle.purchasePrice !== undefined && vehicle.purchasePrice !== null && vehicle.purchasePrice <= 0) ||
    missingImportFields.includes('purchasePrice')
  const isMileageDefaulted = missingImportFields.includes('mileage')
  const isFuelDefaulted = missingImportFields.includes('fuelType')
  const isTransmissionDefaulted = missingImportFields.includes('transmission')

  const defFields: DefFieldItem[] = [
    { key: 'vin', label: 'Code VIN (Châssis)', currentValue: vehicle.vin || '', isDefaulted: isVinDefaulted },
    { key: 'brand', label: 'Marque', currentValue: vehicle.brand || '', isDefaulted: isBrandDefaulted },
    { key: 'model', label: 'Modèle', currentValue: vehicle.model || '', isDefaulted: isModelDefaulted },
    { key: 'colorExterior', label: 'Couleur', currentValue: vehicle.colorExterior || '', isDefaulted: isColorDefaulted },
  ]

  if (isPriceDefaulted) {
    defFields.push({
      key: 'purchasePrice',
      label: 'Prix d\'achat',
      currentValue: `${vehicle.purchasePrice ?? 0} DH`,
      isDefaulted: true,
    })
  }
  if (isFuelDefaulted) {
    defFields.push({
      key: 'fuelType',
      label: 'Carburant',
      currentValue: vehicle.fuelType || 'DIESEL',
      isDefaulted: true,
    })
  }
  if (isTransmissionDefaulted) {
    defFields.push({
      key: 'transmission',
      label: 'Boîte',
      currentValue: vehicle.transmission || 'AUTOMATIQUE',
      isDefaulted: true,
    })
  }
  if (isMileageDefaulted) {
    defFields.push({
      key: 'mileage',
      label: 'Kilométrage',
      currentValue: `${vehicle.mileage ?? 0} km`,
      isDefaulted: true,
    })
  }

  const activeDefFields = defFields.filter((f) => f.isDefaulted)
  const hasDefaultedFields = activeDefFields.length > 0
  const defaultedCount = activeDefFields.length
  const defaultedFieldLabels = activeDefFields.map((f) => f.label)

  const isBulkImport = Boolean(hasBulkFlag || hasBulkOption || hasBulkHistory || hasDefaultedFields)

  // 3. Evaluate lifecycle completeness items
  const photosCount = vehicle.photos?.length || 0
  const imagesSatisfied = photosCount > 0

  const purchase = vehicle.purchases?.[0] || null

  // Fournisseur (Supplier)
  const supplierName = purchase?.supplierName?.trim() || null
  const supplierSatisfied = Boolean(supplierName && supplierName.length > 1)

  // Qui a payé le fournisseur (Who paid)
  const whoPaidName = purchase?.handledBy?.name || null
  const whoPaidSatisfied = Boolean(purchase?.handledById || whoPaidName)

  // Commissionnaire / Semsar (if exist)
  const rawCommName = purchase?.commissionerName?.trim() || ''
  const isNoCommDeclared =
    purchase?.hasCommissioner === false ||
    rawCommName.toUpperCase() === 'SANS' ||
    rawCommName.toLowerCase().includes('sans courtier') ||
    rawCommName.toLowerCase().includes('sans commissionnaire') ||
    rawCommName.toLowerCase().includes('achat direct') ||
    (purchase?.notes && purchase.notes.includes('[SANS_COMMISSIONNAIRE]'))

  const isWithCommDeclared =
    purchase?.hasCommissioner === true ||
    (rawCommName.length > 1 && !isNoCommDeclared)

  let commissionerSatisfied = false
  let commissionerDetails: string | null = null

  if (isNoCommDeclared) {
    commissionerSatisfied = true
    commissionerDetails = 'Achat direct sans intermédiaire'
  } else if (isWithCommDeclared) {
    const commAmount = purchase?.commissionAmount || 0
    if (commAmount > 0) {
      const commPaidByName = purchase?.commissionPaidBy?.name || null
      commissionerSatisfied = Boolean(purchase?.commissionPaidById || commPaidByName)
      commissionerDetails = `${rawCommName} (${commAmount} DH — Payé par ${commPaidByName || 'Non spécifié'})`
    } else {
      commissionerSatisfied = rawCommName.length > 1
      commissionerDetails = `${rawCommName} (Sans commission financière)`
    }
  } else {
    commissionerSatisfied = false
    commissionerDetails = 'À confirmer (Direct ou Semsar)'
  }

  // Documents du véhicule
  const vehicleDocsCount = vehicle.documents?.length || 0
  const purchaseDocsCount = purchase?.documents?.length || 0
  const totalDocsCount = vehicleDocsCount + purchaseDocsCount
  const documentsSatisfied = totalDocsCount > 0

  const items: VehicleCompletenessResult['items'] = {
    images: {
      key: 'images',
      satisfied: imagesSatisfied,
      label: 'Photos du véhicule',
      shortLabel: 'Photos',
      description: 'Au moins 1 photo haute qualité',
      details: imagesSatisfied ? `${photosCount} photo(s)` : '0 photo',
    },
    supplier: {
      key: 'supplier',
      satisfied: supplierSatisfied,
      label: 'Fournisseur / Vendeur d\'origine',
      shortLabel: 'Fournisseur',
      description: 'Identité et coordonnées du vendeur',
      details: supplierName || 'Non renseigné',
    },
    whoPaid: {
      key: 'whoPaid',
      satisfied: whoPaidSatisfied,
      label: 'Fournisseur payé par (Collaborateur)',
      shortLabel: 'Payé par',
      description: 'Collaborateur ayant réglé l\'achat',
      details: whoPaidName || (purchase?.handledById ? 'Collaborateur assigné' : 'Non spécifié'),
    },
    commissioner: {
      key: 'commissioner',
      satisfied: commissionerSatisfied,
      label: 'Intermédiaire / Semsar (si existant)',
      shortLabel: 'Courtier',
      description: 'Déclaration du semsar et collaborateur payeur',
      details: commissionerDetails,
    },
    documents: {
      key: 'documents',
      satisfied: documentsSatisfied,
      label: 'Documents du véhicule',
      shortLabel: 'Documents',
      description: 'Carte grise, certificat de cession ou reçu',
      details: documentsSatisfied ? `${totalDocsCount} document(s)` : '0 document',
    },
  }

  const checklistValues = Object.values(items)
  const totalRequired = checklistValues.length
  const completedCount = checklistValues.filter((i) => i.satisfied).length
  const lifecycleMissingCount = totalRequired - completedCount

  // Total missing includes missing lifecycle items + any def- fields
  const missingCount = lifecycleMissingCount + defaultedCount
  const isComplete = lifecycleMissingCount === 0 && !hasDefaultedFields

  const missingLabels = [
    ...checklistValues.filter((i) => !i.satisfied).map((i) => i.shortLabel),
    ...activeDefFields.map((i) => i.label),
  ]

  // Needs urgent updates if this car was added via bulk import and is not yet complete, OR has def- fields
  const needsUrgentUpdates = (isBulkImport && !isComplete) || hasDefaultedFields

  return {
    isBulkImport,
    needsUrgentUpdates,
    isComplete,
    completedCount,
    totalRequired,
    missingCount,
    missingLabels,
    items,
    defFields,
    hasDefaultedFields,
    defaultedCount,
    defaultedFieldLabels,
  }
}
