"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

const CATEGORY_LABELS: Record<string, string> = {
  fuel: 'Fuel',
  electricity: 'Electricity',
  flights: 'Flights',
  shopping: 'Shopping',
  food: 'Food',
  transport: 'Transport',
  other: 'Other',
}

const COLORS = [
  '#003527', // primary
  '#006a61', // secondary
  '#95d3ba', // primary-fixed-dim
  '#89f5e7', // secondary-fixed
  '#e0e3e5', // surface-variant
]

export function CategoryChart() {
  const { stats, suggestions } = useApp()

  if (!stats || stats.categoryBreakdown.length === 0) {
    return null
  }

  const chartData = stats.categoryBreakdown.map((item, index) => ({
    name: CATEGORY_LABELS[item.category] || item.category,
    value: item.co2,
    percentage: item.percentage,
    fill: COLORS[index % COLORS.length],
  }))

  const topSuggestion = suggestions?.[0]

  return (
    <>
      {/* Pie Chart Representation */}
      <div className="bg-white/70 backdrop-blur-xl border border-primary/10 p-6 rounded-xl flex-1 flex flex-col">
        <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-6">Emissions by Category</h3>
        
        <div className="flex items-center gap-8 flex-1">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border border-primary/10 bg-white p-2 shadow-lg">
                          <p className="text-xs font-bold text-primary">{data.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {formatCO2(data.value)} ({data.percentage.toFixed(1)}%)
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-sm font-bold text-primary">{(stats.totalCO2 / 1000).toFixed(1)}</span>
              <span className="text-[10px] uppercase text-on-surface-variant">Tons</span>
            </div>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto max-h-32 custom-scrollbar">
            {chartData.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs text-on-surface-variant truncate">{item.name} ({item.percentage.toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      {topSuggestion && (
        <div className="rounded-xl p-6 relative overflow-hidden bg-gradient-to-br from-secondary-container/20 to-surface-container-low border border-secondary-container/30 shrink-0">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary">auto_awesome</span>
            <div>
              <h4 className="text-sm font-bold text-primary mb-1">AI Recommendation</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {topSuggestion.description} Could save <strong className="text-secondary">{topSuggestion.co2Reduction}% CO2</strong> and earn <strong>₹{(topSuggestion.savings * 0.1).toFixed(0)} in Gold</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
