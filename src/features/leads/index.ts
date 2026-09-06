export interface LeadKanbanColumn {
  id: string
  title: string
  color: string
}

export const LEAD_KANBAN_COLUMNS: LeadKanbanColumn[] = [
  { id: 'NEW', title: 'Nouveau', color: 'blue' },
  { id: 'CONTACTED', title: 'Contacté', color: 'yellow' },
  { id: 'QUALIFIED', title: 'Qualifié', color: 'purple' },
  { id: 'PROPOSAL', title: 'Proposition', color: 'orange' },
  { id: 'NEGOTIATION', title: 'Négociation', color: 'amber' },
  { id: 'CONVERTED', title: 'Converti', color: 'emerald' },
  { id: 'LOST', title: 'Perdu', color: 'rose' },
]
