"use client"

import { useState } from 'react'
import { User, Mail, Calendar, Coins, Share2, UserPlus, Check, Copy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

export function UserProfile() {
  const { user, updateUser, stats } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [copied, setCopied] = useState(false)

  const handleSave = () => {
    updateUser({ name, email })
    setIsEditing(false)
  }

  const referralLink = `https://ecotracker.app/invite/${user.id}`

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="h-5 w-5 text-primary" />
          Profile
        </CardTitle>
        <CardDescription>Your eco-tracking account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
                <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
                <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
                  <Calendar className="h-3 w-3" /> Joined {new Date(user.joinedAt).toLocaleDateString('en-IN', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">{stats?.greenScore?.toFixed(0) || 0}</p>
            <p className="text-xs text-muted-foreground">Green Score</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{formatCO2(user.totalCO2Saved)}</p>
            <p className="text-xs text-muted-foreground">CO2 Saved</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-eco-gold">{user.paytmGoldBalance.toFixed(3)}g</p>
            <p className="text-xs text-muted-foreground">Paytm Gold</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{user.badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-foreground">Recent Badges</p>
            <div className="flex flex-wrap gap-2">
              {user.badges.slice(0, 4).map(badge => (
                <Badge 
                  key={badge.id}
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Referral */}
        <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Invite Friends</h4>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Earn badges and climb the leaderboard by inviting friends
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-3 w-full" variant="default">
                <Share2 className="mr-2 h-4 w-4" />
                Share Referral Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Friends to Eco-Impact Tracker</DialogTitle>
                <DialogDescription>
                  Share your unique referral link and earn rewards when friends join
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="flex gap-2">
                  <Input 
                    value={referralLink} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button onClick={copyReferralLink} variant="outline">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {copied ? 'Link copied to clipboard!' : 'Click to copy the link'}
                </p>
                
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium text-foreground">Referral Rewards:</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>- Earn 0.1g Paytm Gold per friend who joins</li>
                    <li>- Unlock the Social Impact badge with 5 referrals</li>
                    <li>- Bonus: Friends get 10% extra rewards for 1 month</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
