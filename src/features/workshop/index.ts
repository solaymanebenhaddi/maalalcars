export interface WorkshopServiceCardProps {
  orderCode: string
  serviceType: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  totalTTC: number
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'URGENT':
      return 'text-red-500 bg-red-500/10 border-red-500/20'
    case 'HIGH':
      return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    case 'MEDIUM':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    default:
      return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
  }
}
