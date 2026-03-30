"use client"

import { useState } from 'react'
import { Leaf, Menu, X, Coins, User, BarChart3, Trophy, Lightbulb, Gift, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useApp } from '@/lib/app-context'

interface HeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'profile', label: 'Profile', icon: User },
]

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { user, reset, stats } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-foreground">Eco-Impact</h1>
            <p className="text-xs text-muted-foreground">Track your footprint</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className={activeTab === item.id ? 'bg-primary/10 text-primary' : ''}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Gold balance (desktop) */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-eco-gold/10 px-3 py-1.5">
            <Coins className="h-4 w-4 text-eco-gold" />
            <span className="text-sm font-medium text-foreground">
              {user.paytmGoldBalance.toFixed(3)}g
            </span>
          </div>

          {/* Reset button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={reset}
            title="Reset data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* User avatar (desktop) */}
          <Avatar className="hidden md:flex h-8 w-8 cursor-pointer" onClick={() => handleNavClick('profile')}>
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </SheetTitle>
              </SheetHeader>
              
              {/* Mobile gold balance */}
              <div className="my-4 flex items-center justify-between rounded-lg bg-eco-gold/10 p-3">
                <span className="text-sm text-muted-foreground">Paytm Gold</span>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-eco-gold" />
                  <span className="font-medium text-foreground">{user.paytmGoldBalance.toFixed(3)}g</span>
                </div>
              </div>

              {/* Mobile stats */}
              {stats && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-lg font-bold text-primary">{stats.greenScore.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Green Score</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-lg font-bold text-foreground">{user.badges.length}</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                </div>
              )}

              {/* Mobile navigation */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? 'secondary' : 'ghost'}
                      className={`justify-start ${activeTab === item.id ? 'bg-primary/10 text-primary' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
