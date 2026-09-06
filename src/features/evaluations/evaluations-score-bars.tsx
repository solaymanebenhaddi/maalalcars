'use client'

import React from 'react'

interface ScoreRangeItem {
  range: string
  count: number
  total: number
  color: string
}

const SCORE_RANGES: ScoreRangeItem[] = [
  { range: '90 - 100', count: 412, total: 1248, color: '#10b981' },
  { range: '75 - 89', count: 356, total: 1248, color: '#06b6d4' },
  { range: '50 - 74', count: 287, total: 1248, color: '#f59e0b' },
  { range: '25 - 49', count: 123, total: 1248, color: '#f97316' },
  { range: '0 - 24', count: 70, total: 1248, color: '#ef4444' },
]

export function EvaluationsScoreBars() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
      <div className="border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Scores par gamme
        </h3>
      </div>

      <div className="space-y-3 py-1 flex-1 flex flex-col justify-center">
        {SCORE_RANGES.map((item) => {
          const widthPct = Math.round((item.count / 450) * 100)
          return (
            <div key={item.range} className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-zinc-300 font-semibold">{item.range}</span>
                <span className="font-mono font-bold text-white">{item.count}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1e1e24] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${widthPct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
