"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--muted)',
]

const CATEGORY_LABELS: Record<string, string> = {
  fuel: 'Fuel',
  electricity: 'Electricity',
  flights: 'Flights',
  shopping: 'Shopping',
  food: 'Food',
  transport: 'Transport',
  other: 'Other',
}

export function CategoryChart() {
  const { stats } = useApp()

  if (!stats || stats.categoryBreakdown.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Emissions by Category</CardTitle>
          <CardDescription>Upload transactions to see breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = stats.categoryBreakdown.map((item, index) => ({
    name: CATEGORY_LABELS[item.category] || item.category,
    value: item.co2,
    percentage: item.percentage,
    fill: `oklch(${COLORS[index % COLORS.length]})`,
  }))

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Emissions by Category</CardTitle>
        <CardDescription>CO2 distribution across spending categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
                labelLine={false}
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
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="font-medium text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCO2(data.value)} ({data.percentage.toFixed(1)}%)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
