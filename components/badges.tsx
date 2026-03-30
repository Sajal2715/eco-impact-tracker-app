"use client"

import { Award, Lock, Leaf, TreeDeciduous, Globe, Flame, Users, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/lib/app-context'
import { BADGES } from '@/lib/types'

const BadgeIcon = ({ icon, unlocked }: { icon: string; unlocked: boolean }) => {
  const iconClass = `h-6 w-6 ${unlocked ? 'text-primary' : 'text-muted-foreground/50'}`
  
  // Map emoji icons to Lucide icons
  const iconMap: Record<string, React.ReactNode> = {
    '🌿': <Leaf className={iconClass} />,
    '🌳': <TreeDeciduous className={iconClass} />,
    '🌍': <Globe className={iconClass} />,
    '🔥': <Flame className={iconClass} />,
    '👥': <Users className={iconClass} />,
    '⭐': <Star className={iconClass} />,
  }
  
  return iconMap[icon] || <Award className={iconClass} />
}

export function Badges() {
  const { user, stats } = useApp()

  const getBadgeProgress = (badge: typeof BADGES[0]): number => {
    if (!stats) return 0
    
    switch (badge.type) {
      case 'co2_saved':
        return Math.min(100, (stats.co2Saved / badge.requirement) * 100)
      case 'green_score':
        return Math.min(100, (stats.greenScore / badge.requirement) * 100)
      case 'streak':
        return 0 // Would need actual streak tracking
      case 'referrals':
        return Math.min(100, (user.friends.length / badge.requirement) * 100)
      default:
        return 0
    }
  }

  const getProgressText = (badge: typeof BADGES[0]): string => {
    if (!stats) return '0 / ' + badge.requirement
    
    switch (badge.type) {
      case 'co2_saved':
        return `${stats.co2Saved.toFixed(0)}kg / ${badge.requirement}kg`
      case 'green_score':
        return `${stats.greenScore.toFixed(0)} / ${badge.requirement}`
      case 'streak':
        return `0 / ${badge.requirement} days`
      case 'referrals':
        return `${user.friends.length} / ${badge.requirement} friends`
      default:
        return '0 / ' + badge.requirement
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Award className="h-5 w-5 text-eco-gold" />
          Badges & Achievements
        </CardTitle>
        <CardDescription>
          {user.badges.length} of {BADGES.length} badges earned
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const userBadge = user.badges.find(b => b.id === badge.id)
            const unlocked = !!userBadge
            const progress = getBadgeProgress(badge)

            return (
              <div
                key={badge.id}
                className={`relative rounded-lg border p-4 transition-all ${
                  unlocked
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-muted bg-muted/20'
                }`}
              >
                {!unlocked && (
                  <div className="absolute right-2 top-2">
                    <Lock className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    unlocked ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    <BadgeIcon icon={badge.icon} unlocked={unlocked} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {badge.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={unlocked ? 'text-primary font-medium' : 'text-muted-foreground'}>
                      {unlocked ? 'Completed!' : getProgressText(badge)}
                    </span>
                  </div>
                  <Progress 
                    value={unlocked ? 100 : progress} 
                    className="h-1.5"
                  />
                </div>

                {userBadge?.unlockedAt && (
                  <p className="mt-2 text-xs text-primary">
                    Earned {new Date(userBadge.unlockedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
