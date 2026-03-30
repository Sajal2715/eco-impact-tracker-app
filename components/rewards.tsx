"use client"

import { useState } from 'react'
import { Coins, Gift, Check, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

interface RewardTier {
  id: string
  name: string
  co2Required: number
  goldAmount: number
  description: string
}

const REWARD_TIERS: RewardTier[] = [
  { id: 'bronze', name: 'Bronze', co2Required: 25, goldAmount: 0.25, description: 'Save 25kg CO2' },
  { id: 'silver', name: 'Silver', co2Required: 50, goldAmount: 0.5, description: 'Save 50kg CO2' },
  { id: 'gold', name: 'Gold', co2Required: 100, goldAmount: 1.0, description: 'Save 100kg CO2' },
  { id: 'platinum', name: 'Platinum', co2Required: 250, goldAmount: 2.5, description: 'Save 250kg CO2' },
  { id: 'diamond', name: 'Diamond', co2Required: 500, goldAmount: 5.0, description: 'Save 500kg CO2' },
]

export function Rewards() {
  const { user, stats, claimReward } = useApp()
  const [claimedRewards, setClaimedRewards] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastClaimed, setLastClaimed] = useState<RewardTier | null>(null)

  const co2Saved = stats?.co2Saved || 0

  const handleClaim = (reward: RewardTier) => {
    if (claimedRewards.includes(reward.id) || co2Saved < reward.co2Required) return
    
    setClaimedRewards([...claimedRewards, reward.id])
    claimReward(reward.co2Required)
    setLastClaimed(reward)
    setShowSuccess(true)
  }

  const getRewardStatus = (reward: RewardTier) => {
    if (claimedRewards.includes(reward.id)) return 'claimed'
    if (co2Saved >= reward.co2Required) return 'available'
    return 'locked'
  }

  const nextReward = REWARD_TIERS.find(r => !claimedRewards.includes(r.id) && co2Saved < r.co2Required)
  const progressToNext = nextReward ? (co2Saved / nextReward.co2Required) * 100 : 100

  return (
    <>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Gift className="h-5 w-5 text-eco-gold" />
            Paytm Gold Rewards
          </CardTitle>
          <CardDescription>
            Earn Paytm Gold by saving CO2 emissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Gold Balance */}
          <div className="mb-6 rounded-lg bg-gradient-to-br from-eco-gold/20 to-eco-gold/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Paytm Gold Balance</p>
                <p className="text-3xl font-bold text-foreground">
                  {user.paytmGoldBalance.toFixed(3)}g
                </p>
              </div>
              <Coins className="h-12 w-12 text-eco-gold" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              1g Paytm Gold per 100kg CO2 saved
            </p>
          </div>

          {/* Progress to next reward */}
          {nextReward && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress to {nextReward.name}</span>
                <span className="text-sm font-medium text-foreground">
                  {formatCO2(co2Saved)} / {formatCO2(nextReward.co2Required)}
                </span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCO2(nextReward.co2Required - co2Saved)} more to unlock {nextReward.goldAmount}g gold
              </p>
            </div>
          )}

          {/* Reward tiers */}
          <div className="space-y-3">
            {REWARD_TIERS.map((reward) => {
              const status = getRewardStatus(reward)
              const progress = Math.min(100, (co2Saved / reward.co2Required) * 100)

              return (
                <div
                  key={reward.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                    status === 'claimed'
                      ? 'border-primary/50 bg-primary/5'
                      : status === 'available'
                      ? 'border-eco-gold/50 bg-eco-gold/5'
                      : 'border-muted bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      status === 'claimed'
                        ? 'bg-primary text-primary-foreground'
                        : status === 'available'
                        ? 'bg-eco-gold text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {status === 'claimed' ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Coins className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{reward.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {reward.goldAmount}g Gold
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      {status === 'locked' && (
                        <Progress value={progress} className="mt-1 h-1 w-24" />
                      )}
                    </div>
                  </div>
                  
                  {status === 'claimed' ? (
                    <Badge className="bg-primary text-primary-foreground">
                      <Check className="mr-1 h-3 w-3" /> Claimed
                    </Badge>
                  ) : status === 'available' ? (
                    <Button
                      size="sm"
                      onClick={() => handleClaim(reward)}
                      className="bg-eco-gold hover:bg-eco-gold/90 text-white"
                    >
                      Claim <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Locked
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>

          {/* How it works */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <h4 className="font-medium text-foreground">How Paytm Gold Works</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>- Save CO2 by making eco-friendly choices</li>
              <li>- Earn 1g Paytm Gold for every 100kg CO2 saved</li>
              <li>- Redeem gold for real gold or cashback</li>
              <li>- Gold is automatically added to your Paytm wallet</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-eco-gold" />
              Reward Claimed!
            </DialogTitle>
            <DialogDescription>
              Congratulations! You&apos;ve earned Paytm Gold
            </DialogDescription>
          </DialogHeader>
          
          {lastClaimed && (
            <div className="my-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-eco-gold/20">
                <Coins className="h-10 w-10 text-eco-gold" />
              </div>
              <p className="mt-4 text-3xl font-bold text-foreground">
                +{lastClaimed.goldAmount}g
              </p>
              <p className="text-sm text-muted-foreground">
                {lastClaimed.name} Reward
              </p>
            </div>
          )}
          
          <Button onClick={() => setShowSuccess(false)} className="w-full">
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
