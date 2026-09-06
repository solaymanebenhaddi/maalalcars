'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const CATEGORIES = [
  { name: 'Transport', pct: '32%', amount: '7 900 DH', value: 7900, color: '#ef4444' },
  { name: 'Préparation', pct: '24%', amount: '5 930 DH', value: 5930, color: '#06b6d4' },
  { name: 'Atelier', pct: '18%', amount: '4 450 DH', value: 4450, color: '#f59e0b' },
  { name: 'Marketing', pct: '12%', amount: '2 960 DH', value: 2960, color: '#a855f7' },
  { name: 'Administratif', pct: '8%', amount: '1 460 DH', value: 1460, color: '#22c55e' },
  { name: 'Autres', pct: '6%', amount: '1 480 DH', value: 1480, color: '#64748b' },
]

export function ExpenseCategoryDonut() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Donut Chart with Center Text */}
      <div className="relative h-[190px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CATEGORIES}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {CATEGORIES.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border border-[#282834] bg-[#18181f] p-2 text-xs shadow-xl">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full inline-block"
                          style={{ backgroundColor: data.color }}
                        />
                        <span>{data.name}</span>
                      </div>
                      <div className="text-zinc-300 font-mono mt-0.5">
                        {data.amount} ({data.pct})
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-black font-mono text-white">24 700 DH</span>
          <span className="text-[10px] text-zinc-400 font-medium">Total</span>
        </div>
      </div>

      {/* Categories Breakdown Legend */}
      <div className="flex-1 w-full space-y-1.5 text-xs">
        {CATEGORIES.map((c) => (
          <div key={c.name} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-zinc-300">{c.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-zinc-400 font-mono text-[10px]">{c.pct}</span>
              <span className="text-white font-mono font-semibold">{c.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
