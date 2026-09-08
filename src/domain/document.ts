export type DocumentCategory = 'Achats' | 'Ventes' | 'Réparations' | 'Administratif'

export interface DocumentTypeDefinition {
  value: string
  label: string
  category: DocumentCategory
  description?: string
  icon?: string
}

export const DOCUMENT_TYPES: DocumentTypeDefinition[] = [
  // --- ACHATS & APPROVISIONNEMENT ---
  {
    value: 'CARTE_GRISE',
    label: 'Carte Grise (Barrée / Initiale)',
    category: 'Achats',
    description: 'Certificat d\'immatriculation original ou barré du véhicule',
  },
  {
    value: 'ACTE_CESSION',
    label: 'Acte de Cession / Contrat d\'Achat',
    category: 'Achats',
    description: 'Contrat d\'achat ou acte de cession signé avec le fournisseur/vendeur',
  },
  {
    value: 'FACTURE_ACHAT',
    label: 'Facture d\'Achat Fournisseur',
    category: 'Achats',
    description: 'Facture commerciale ou justificatif de règlement du fournisseur',
  },
  {
    value: 'CIN_FOURNISSEUR',
    label: 'CIN / ICE Fournisseur',
    category: 'Achats',
    description: 'Copie de la carte d\'identité nationale ou ICE du vendeur/fournisseur',
  },
  {
    value: 'CIN_SEMSAR_ACHAT',
    label: 'CIN Intermédiaire / Semsar d\'Achat',
    category: 'Achats',
    description: 'Copie de la pièce d\'identité du courtier ayant facilité l\'achat',
  },
  {
    value: 'QUITUS_FISCAL',
    label: 'Quitus Fiscal / Dédouanement',
    category: 'Achats',
    description: 'Certificat de dédouanement (D16 ter) ou quitus fiscal',
  },
  {
    value: 'CONTROLE_TECHNIQUE',
    label: 'Contrôle Technique d\'Entrée',
    category: 'Achats',
    description: 'Rapport de visite technique lors de la réception en stock',
  },
  {
    value: 'DECHARGE_PAIEMENT',
    label: 'Décharge / Reçu Paiement Fournisseur',
    category: 'Achats',
    description: 'Reçu d\'encaissement signé par le vendeur ou bordereau de virement',
  },
  {
    value: 'AUTRE_ACHAT',
    label: 'Autre Document d\'Achat',
    category: 'Achats',
    description: 'Tout autre document lié au dossier d\'achat du véhicule',
  },

  // --- VENTES & CLIENTS ---
  {
    value: 'CONTRAT_VENTE',
    label: 'Contrat de Vente / Bon de Commande',
    category: 'Ventes',
    description: 'Bon de commande ou contrat de vente officiel signé par le client',
  },
  {
    value: 'FACTURE_VENTE',
    label: 'Facture de Vente Définitive',
    category: 'Ventes',
    description: 'Facture client émise par la concession Maalal Cars',
  },
  {
    value: 'CIN_ACHETEUR',
    label: 'CIN / ICE Client Acheteur',
    category: 'Ventes',
    description: 'Copie de la pièce d\'identité de l\'acquéreur ou ICE de l\'entreprise',
  },
  {
    value: 'RECU_REGLEMENT',
    label: 'Reçu d\'Acompte / Preuve Encaissement',
    category: 'Ventes',
    description: 'Reçu de versement d\'acompte ou justificatif de paiement total',
  },
  {
    value: 'CERTIFICAT_VENTE',
    label: 'Certificat de Cession / Vente',
    category: 'Ventes',
    description: 'Déclaration de vente automobile légalisée pour immatriculation',
  },
  {
    value: 'CIN_SEMSAR_VENTE',
    label: 'CIN Intermédiaire / Semsar de Vente',
    category: 'Ventes',
    description: 'Copie de la pièce d\'identité de l\'intermédiaire commercial',
  },
  {
    value: 'BON_LIVRAISON',
    label: 'Bon de Livraison Signé',
    category: 'Ventes',
    description: 'Décharge de remise des clés et livraison signée par le client',
  },
  {
    value: 'DOSSIER_IMMATRICULATION',
    label: 'Procuration / Dossier Carte Grise',
    category: 'Ventes',
    description: 'Documents de mutation carte grise et procurations',
  },
  {
    value: 'AUTRE_VENTE',
    label: 'Autre Document de Vente',
    category: 'Ventes',
    description: 'Tout autre document lié au dossier commercial de vente',
  },

  // --- RÉPARATIONS & ATELIER ---
  {
    value: 'DEVIS_REPARATION',
    label: 'Devis Atelier / Réparation',
    category: 'Réparations',
    description: 'Devis estimatif chiffré des travaux avant intervention',
  },
  {
    value: 'FACTURE_REPARATION',
    label: 'Facture Réparation / Garage',
    category: 'Réparations',
    description: 'Facture définitive acquittée des réparations ou prestataire externe',
  },
  {
    value: 'ORDRE_REPARATION',
    label: 'Ordre de Réparation / Travaux',
    category: 'Réparations',
    description: 'Ordre d\'intervention atelier interne décrivant les tâches',
  },
  {
    value: 'RAPPORT_DIAGNOSTIC',
    label: 'Rapport Diagnostic (Valise / Banc)',
    category: 'Réparations',
    description: 'Rapport électronique ou relevé d\'erreurs valise de diagnostic',
  },
  {
    value: 'BON_PIECES',
    label: 'Bon de Commande Pièces Rechange',
    category: 'Réparations',
    description: 'Facturette ou bon d\'achat des pièces détachées neuves/occasion',
  },
  {
    value: 'PHOTO_CONSTAT',
    label: 'Photo / Constat Avant/Après Travaux',
    category: 'Réparations',
    description: 'Justificatif visuel de l\'état de la pièce ou carrosserie réparée',
  },
  {
    value: 'FICHE_RECEPTION',
    label: 'Fiche Contrôle & Réception Travaux',
    category: 'Réparations',
    description: 'Validation de fin de travaux et essai sur route avant restitution',
  },
  {
    value: 'AUTRE_REPARATION',
    label: 'Autre Document Réparation',
    category: 'Réparations',
    description: 'Tout autre justificatif ou document d\'atelier',
  },

  // --- ADMINISTRATIF & GÉNÉRAL ---
  {
    value: 'POLICE_ASSURANCE',
    label: 'Attestation d\'Assurance',
    category: 'Administratif',
    description: 'Police ou attestation d\'assurance en cours de validité',
  },
  {
    value: 'VIGNETTE_FISCALE',
    label: 'Quittance Vignette Fiscale',
    category: 'Administratif',
    description: 'Reçu de paiement de la taxe spéciale annuelle sur les véhicules (TSAV)',
  },
  {
    value: 'CERTIFICAT_NON_GAGE',
    label: 'Certificat de Non-Gage',
    category: 'Administratif',
    description: 'État d\'opposition et de non-gage délivré par l\'administration',
  },
  {
    value: 'AUTRE_ADMINISTRATIF',
    label: 'Autre Document Administratif',
    category: 'Administratif',
    description: 'Tout autre document légal ou administratif',
  },
]

export function getDocumentTypesByCategory(category?: DocumentCategory): DocumentTypeDefinition[] {
  if (!category) return DOCUMENT_TYPES
  return DOCUMENT_TYPES.filter((dt) => dt.category === category)
}

export function getDocumentTypeLabel(typeValue: string): string {
  const match = DOCUMENT_TYPES.find((dt) => dt.value === typeValue)
  return match ? match.label : typeValue
}

export const MAX_DOCUMENT_FILE_SIZE = 25 * 1024 * 1024 // 25 MB

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.avif', '.doc', '.docx']

export function validateDocumentUpload(file: { name: string; mimeType: string; size: number }): {
  valid: boolean
  error?: string
} {
  if (!file) {
    return { valid: false, error: 'Aucun fichier fourni' }
  }

  if (file.size > MAX_DOCUMENT_FILE_SIZE) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)} Mo). La taille maximale autorisée est de 25 Mo.`,
    }
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  const isMimeAllowed =
    ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimeType.toLowerCase()) ||
    file.mimeType.startsWith('image/')
  const isExtAllowed = ALLOWED_DOCUMENT_EXTENSIONS.includes(ext)

  if (!isMimeAllowed && !isExtAllowed) {
    return {
      valid: false,
      error: `Format de fichier non autorisé (${ext}). Formats acceptés : PDF, Images (JPG, PNG, WEBP), Word (DOC, DOCX).`,
    }
  }

  return { valid: true }
}
