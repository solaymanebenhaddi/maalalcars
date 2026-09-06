export interface ContactDisplayBadge {
  segment: string
  color: string
}

export function getSegmentBadgeProps(segment: string): { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' } {
  switch (segment) {
    case 'VIP':
      return { label: 'VIP', variant: 'success' }
    case 'FIDELE':
      return { label: 'Client Fidèle', variant: 'default' }
    case 'PROSPECT_CHAUD':
      return { label: 'Prospect Chaud', variant: 'warning' }
    case 'FOURNISSEUR':
      return { label: 'Fournisseur', variant: 'default' }
    default:
      return { label: segment || 'Standard', variant: 'default' }
  }
}
