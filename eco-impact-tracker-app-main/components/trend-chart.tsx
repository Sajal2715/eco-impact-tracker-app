"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

export function TrendChart() {
  const { stats } = useApp()

  if (!stats || stats.monthlyTrend.length === 0) {
    return null
  }

  const chartData = stats.monthlyTrend.map(item => {
    const d = new Date(item.month + '-01')
    return {
      ...item,
      monthLabel: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    }
  })

  // Mock taking the last 6 months
  const displayData = chartData.slice(-6)

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-primary/10 p-8 rounded-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-h2 font-h2 text-primary">Footprint Trends</h3>
          <p className="text-sm text-on-surface-variant">Monthly CO2 emission performance</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-bold rounded">1M</button>
          <button className="px-3 py-1 bg-primary text-white text-xs font-bold rounded shadow-lg">6M</button>
          <button className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-bold rounded">1Y</button>
        </div>
      </div>
      
      <div className="h-64 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="monthLabel" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-space-grotesk)' }}
              dy={10}
            />
            <YAxis 
              hide={true} 
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 106, 97, 0.1)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-primary/10 bg-white p-3 shadow-lg">
                      <p className="font-medium text-primary">{label}</p>
                      <p className="text-sm font-bold text-secondary">
                        {formatCO2(payload[0].value as number)}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="co2" radius={[4, 4, 0, 0]} background={{ fill: 'rgba(0, 106, 97, 0.2)', radius: [4, 4, 0, 0] }}>
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--secondary)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
