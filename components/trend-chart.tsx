"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp } from '@/lib/app-context'
import { formatCO2, INDIA_AVG_CO2_MONTHLY } from '@/lib/eco-utils'

export function TrendChart() {
  const { stats } = useApp()

  if (!stats || stats.monthlyTrend.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly CO2 Trend</CardTitle>
          <CardDescription>Upload transactions to see trends</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = stats.monthlyTrend.map(item => ({
    ...item,
    monthLabel: new Date(item.month + '-01').toLocaleDateString('en-IN', { 
      month: 'short', 
      year: '2-digit' 
    }),
  }))

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Monthly CO2 Trend</CardTitle>
        <CardDescription>
          Your emissions over time vs India average ({formatCO2(INDIA_AVG_CO2_MONTHLY)}/month)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={{ stroke: 'var(--muted)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={{ stroke: 'var(--muted)' }}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="font-medium text-foreground">{label}</p>
                        <p className="text-sm text-primary">
                          {formatCO2(payload[0].value as number)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <ReferenceLine 
                y={INDIA_AVG_CO2_MONTHLY} 
                stroke="var(--destructive)" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'India Avg', 
                  position: 'right',
                  fill: 'var(--destructive)',
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="co2"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'var(--primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
