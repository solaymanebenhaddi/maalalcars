'use client'

import { Mail, Search as GoogleIcon, Award } from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '@/components/shared/brand-icons'

interface RoiCampaign {
  name: string
  roi: number
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  barGradient: string
}

const CAMPAIGNS_DATA: RoiCampaign[] = [
  {
    name: 'Offre Pro Spéciale',
    roi: 512,
    icon: Mail,
    iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    barGradient: 'bg-gradient-to-r from-cyan-600 via-cyan-400 to-sky-300',
  },
  {
    name: 'Promo Printemps 2025',
    roi: 412,
    icon: FacebookIcon,
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    barGradient: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300',
  },
  {
    name: 'Remarketing Mai',
    roi: 392,
    icon: GoogleIcon,
    iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    barGradient: 'bg-gradient-to-r from-teal-600 via-teal-400 to-emerald-300',
  },
  {
    name: 'SUV Weekend',
    roi: 365,
    icon: InstagramIcon,
    iconColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    barGradient: 'bg-gradient-to-r from-emerald-600 to-green-400',
  },
  {
    name: 'Salon Auto 2025',
    roi: 278,
    icon: Award,
    iconColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    barGradient: 'bg-gradient-to-r from-red-600 to-orange-500',
  },
]

export function CampaignsRoiChart({ data = CAMPAIGNS_DATA }: { data?: RoiCampaign[] }) {
  const maxRoi = 550

  return (
    <div className="space-y-4 w-full">
      {data.map((item) => {
        const Icon = item.icon
        const widthPercent = Math.round((item.roi / maxRoi) * 100)

        return (
          <div key={item.name} className="flex items-center gap-3">
            {/* Channel Icon */}
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border ${item.iconColor}`}>
              <Icon className="h-3 w-3" />
            </div>

            {/* Campaign Name & Bar */}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-zinc-300 block truncate mb-1">
                {item.name}
              </span>
              <div className="h-2.5 w-full rounded-full bg-[#181820] overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.barGradient} transition-all duration-700 shadow-sm`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>

            {/* Percentage on Right */}
            <div className="w-14 text-right shrink-0">
              <span className="font-mono text-xs font-black text-white">{item.roi}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
