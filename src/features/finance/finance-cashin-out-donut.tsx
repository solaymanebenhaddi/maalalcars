'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface CashInOutItem {
  name: string
  amount: number
  percentage: number
  color: string
}

const CASH_ITEMS: CashInOutItem[] = [
  { name: 'Cash In', amount: 458760, percentage: 62.4, color: '#06b6d4' },
  { name: 'Cash Out', amount: 276310, percentage: 37.6, color: '#ef4444' },
]

export function FinanceCashInOutDonut() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
      <div className="border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Cash In vs Cash Out
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 flex-1">
        <div className="relative h-[150px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as CashInOutItem
                    return (
                      <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl">
                        <div className="font-bold text-white">{data.name}</div>
                        <div className="font-mono text-zinc-300">
                          {data.amount.toLocaleString('fr-FR')} DH ({data.percentage}%)
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={CASH_ITEMS}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                dataKey="amount"
              >
                {CASH_ITEMS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs font-black text-emerald-400">+182 450 DH</span>
            <span className="text-[8px] font-bold text-zinc-400 uppercase">Solde net</span>
          </div>
        </div>

        <div className="space-y-2 text-[10px]">
          {CASH_ITEMS.map((item) => (
            <div key={item.name} className="space-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 font-semibold">{item.name}</span>
                </div>
                <span className="font-mono text-zinc-400">({item.percentage}%)</span>
              </div>
              <div className="font-mono font-bold text-white pl-3.5">
                {item.amount.toLocaleString('fr-FR')} DH
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
