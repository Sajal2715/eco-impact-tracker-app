"use client"

import { Leaf, TrendingDown, TrendingUp, Award, Coins } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/lib/app-context'
import { formatCO2, INDIA_AVG_CO2_MONTHLY } from '@/lib/eco-utils'

export function StatsCards() {
  const { stats, user } = useApp()

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse bg-card">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const isBelowAverage = stats.totalCO2 < INDIA_AVG_CO2_MONTHLY

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total CO2 */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total CO2 Emissions
          </CardTitle>
          <Leaf className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{formatCO2(stats.totalCO2)}</div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {isBelowAverage ? (
              <>
                <TrendingDown className="h-3 w-3 text-primary" />
                <span className="text-primary">
                  {Math.abs(stats.benchmarkComparison).toFixed(0)}% below India avg
                </span>
              </>
            ) : (
              <>
                <TrendingUp className="h-3 w-3 text-destructive" />
                <span className="text-destructive">
                  {stats.benchmarkComparison.toFixed(0)}% above India avg
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Green Score */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Green Score
          </CardTitle>
          <Award className="h-4 w-4 text-eco-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.greenScore.toFixed(0)}/100</div>
          <Progress value={stats.greenScore} className="mt-2 h-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.greenScore >= 80 ? 'Excellent!' : stats.greenScore >= 60 ? 'Good progress' : 'Room to improve'}
          </p>
        </CardContent>
      </Card>

      {/* CO2 Saved */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            CO2 Saved
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCO2(stats.co2Saved)}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            vs India monthly average
          </p>
        </CardContent>
      </Card>

      {/* Paytm Gold */}
      <Card className="bg-gradient-to-br from-eco-gold/20 to-eco-gold/5 border-eco-gold/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Paytm Gold Earned
          </CardTitle>
          <Coins className="h-4 w-4 text-eco-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{user.paytmGoldBalance.toFixed(3)}g</div>
          <p className="mt-2 text-xs text-muted-foreground">
            1g per 100kg CO2 saved
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
