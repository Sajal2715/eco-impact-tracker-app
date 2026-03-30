"use client"

import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
}

const ChangeIndicator = ({ change }: { change: number }) => {
  if (change > 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-primary">
        <TrendingUp className="h-3 w-3" /> +{change}
      </span>
    )
  }
  if (change < 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-destructive">
        <TrendingDown className="h-3 w-3" /> {change}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" /> 0
    </span>
  )
}

export function Leaderboard() {
  const { leaderboard, user, stats } = useApp()

  if (leaderboard.length === 0 || !stats) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Trophy className="h-5 w-5 text-eco-gold" />
            Leaderboard
          </CardTitle>
          <CardDescription>Upload transactions to see rankings</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const userRank = leaderboard.find(entry => entry.user.id === user.id)

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Trophy className="h-5 w-5 text-eco-gold" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top eco-friendly users this month</CardDescription>
      </CardHeader>
      <CardContent>
        {/* User's rank highlight */}
        {userRank && (
          <div className="mb-4 rounded-lg bg-primary/10 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center">
                  <RankIcon rank={userRank.rank} />
                </div>
                <div>
                  <p className="font-medium text-foreground">Your Rank</p>
                  <p className="text-sm text-muted-foreground">
                    Green Score: {userRank.greenScore.toFixed(0)}
                  </p>
                </div>
              </div>
              <ChangeIndicator change={userRank.change} />
            </div>
          </div>
        )}

        {/* Top users list */}
        <div className="space-y-3">
          {leaderboard.slice(0, 8).map((entry) => {
            const isCurrentUser = entry.user.id === user.id
            const initials = entry.user.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <div
                key={entry.user.id}
                className={`flex items-center justify-between rounded-lg p-3 transition-colors ${
                  isCurrentUser 
                    ? 'bg-primary/10 ring-1 ring-primary/30' 
                    : entry.rank <= 3 
                    ? 'bg-muted/50' 
                    : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center">
                    <RankIcon rank={entry.rank} />
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={`${
                      isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {entry.user.name}
                        {isCurrentUser && <span className="text-primary"> (You)</span>}
                      </p>
                      {entry.rank === 1 && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Top Eco
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatCO2(entry.co2Saved)} saved
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{entry.greenScore.toFixed(0)}</p>
                  <ChangeIndicator change={entry.change} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
