import React from 'react'

interface AgingBucket {
  label: string
  amount: string
  percentage: number
}

const BUCKETS: AgingBucket[] = [
  { label: '0 - 7 jours', amount: '74 800 DH (26%)', percentage: 26 },
  { label: '8 - 15 jours', amount: '92 600 DH (32%)', percentage: 32 },
  { label: '16 - 30 jours', amount: '78 350 DH (27%)', percentage: 27 },
  { label: '+ 30 jours', amount: '41 700 DH (15%)', percentage: 15 },
]

export function SellerPendingDebt() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[300px] shadow-sm">
      {/* Header */}
      <div className="border-b border-[#202028] pb-2.5">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Paiements en attente par tranche
        </h3>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3.5 py-2">
        {BUCKETS.map((b) => (
          <div key={b.label} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-300 font-medium">{b.label}</span>
              <span className="font-mono text-zinc-300 font-semibold">{b.amount}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#1c1c24]">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-500"
                style={{ width: `${b.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total Footer */}
      <div className="flex items-center justify-between border-t border-[#202028] pt-2.5 text-xs">
        <span className="font-bold text-zinc-400">Total</span>
        <span className="font-mono font-black text-white text-sm">287 450 DH</span>
      </div>
    </div>
  )
}
