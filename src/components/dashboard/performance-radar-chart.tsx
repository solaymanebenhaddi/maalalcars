'use client'

import React from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts'
import { Target } from 'lucide-react'

export interface RadarMetric {
  subject: string
  score: number
  target: number
  fullMark: number
}

interface PerformanceRadarProps {
  data: RadarMetric[]
}

export function PerformanceRadarChart({ data }: PerformanceRadarProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#1e2029] bg-[#121318] p-5 shadow-lg shadow-black/40 min-h-[420px]">
      {/* 1. Header */}
      <div className="flex items-center gap-2.5 border-b border-[#1c1e28] pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.25)]">
          <Target className="h-4 w-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase font-sans">
          Radar Performance par Axes
        </h3>
      </div>

      {/* 2. Radar Canvas */}
      <div className="h-[250px] w-full py-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <defs>
              <filter id="radarRedGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.8" />
              </filter>
            </defs>

            <PolarGrid stroke="#222436" strokeDasharray="2 2" />

            <PolarAngleAxis
              dataKey="subject"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              tick={(props) => {
                const { x, y, payload } = props
                const item = data.find((d) => d.subject === payload.value)
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={payload.value === 'Rentabilité' ? -4 : (payload.value.includes('Satisfaction') || payload.value.includes('Coûts')) ? 12 : 2}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize={10}
                      fontWeight={500}
                    >
                      {payload.value}
                    </text>
                    <text
                      x={0}
                      y={12}
                      dy={payload.value === 'Rentabilité' ? -4 : (payload.value.includes('Satisfaction') || payload.value.includes('Coûts')) ? 12 : 2}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={10}
                      fontWeight={700}
                      fontFamily="monospace"
                    >
                      {item ? `${item.score}%` : ''}
                    </text>
                  </g>
                )
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke="#2e3146"
              fontSize={9}
              tick={false}
              axisLine={false}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as RadarMetric
                  return (
                    <div className="rounded-lg border border-red-500/40 bg-[#0d0e14]/95 p-2.5 text-xs shadow-xl backdrop-blur-md space-y-1 min-w-[140px]">
                      <div className="font-bold text-white border-b border-[#222436] pb-1">
                        {d.subject}
                      </div>
                      <div className="flex items-center justify-between text-red-400 font-mono">
                        <span>Actuelle :</span>
                        <span className="font-bold">{d.score}%</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400 font-mono">
                        <span>Objectif :</span>
                        <span>{d.target}%</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            {/* Objectif: Dashed Outline */}
            <Radar
              name="Objectif"
              dataKey="target"
              stroke="#71717a"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill="transparent"
            />

            {/* Performance Actuelle: Glowing Red Polygon */}
            <Radar
              name="Performance actuelle"
              dataKey="score"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="#ef4444"
              fillOpacity={0.25}
              filter="url(#radarRedGlow)"
              dot={{ r: 3.5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 1.5 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Legend */}
      <div className="flex items-center justify-center gap-6 border-t border-[#1c1e28] pt-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
          <span className="text-zinc-300 font-medium">Performance actuelle</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 border-t-2 border-dashed border-zinc-400 inline-block" />
          <span className="text-zinc-400 font-medium">Objectif</span>
        </div>
      </div>
    </div>
  )
}
