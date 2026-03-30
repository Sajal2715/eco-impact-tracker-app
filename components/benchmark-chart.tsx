"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp } from '@/lib/app-context'
import { formatCO2, INDIA_AVG_CO2_MONTHLY } from '@/lib/eco-utils'

export function BenchmarkChart() {
  const { stats, user } = useApp()

  if (!stats) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Benchmark Comparison</CardTitle>
          <CardDescription>Upload transactions to compare</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = [
    { name: 'You', value: stats.totalCO2, fill: 'var(--primary)' },
    { name: 'India Avg', value: INDIA_AVG_CO2_MONTHLY, fill: 'var(--muted-foreground)' },
    { name: 'Eco Target', value: INDIA_AVG_CO2_MONTHLY * 0.7, fill: 'var(--eco-green-light)' },
  ]

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Benchmark Comparison</CardTitle>
        <CardDescription>
          Your monthly emissions vs benchmarks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={{ stroke: 'var(--muted)' }}
                tickFormatter={(value) => `${value}kg`}
              />
              <YAxis 
                type="category"
                dataKey="name"
                tick={{ fill: 'var(--foreground)', fontSize: 13, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="font-medium text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCO2(data.value)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-foreground">
            {stats.totalCO2 < INDIA_AVG_CO2_MONTHLY ? (
              <>
                Great job! You&apos;re <span className="font-semibold text-primary">{Math.abs(stats.benchmarkComparison).toFixed(0)}% below</span> the India average.
              </>
            ) : (
              <>
                You&apos;re <span className="font-semibold text-destructive">{stats.benchmarkComparison.toFixed(0)}% above</span> the India average. Check our suggestions to reduce your footprint!
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
