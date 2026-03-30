"use client"

import { useState } from 'react'
import { 
  Lightbulb, 
  Train, 
  Zap, 
  Sun, 
  ShoppingBag, 
  Utensils, 
  Bus, 
  MapPin, 
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Leaf
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import type { GreenSuggestion, TransactionCategory } from '@/lib/types'

const CategoryIcon = ({ category }: { category: TransactionCategory }) => {
  const iconClass = "h-5 w-5"
  switch (category) {
    case 'flights': return <Train className={iconClass} />
    case 'fuel': return <Zap className={iconClass} />
    case 'electricity': return <Sun className={iconClass} />
    case 'shopping': return <ShoppingBag className={iconClass} />
    case 'food': return <Utensils className={iconClass} />
    case 'transport': return <Bus className={iconClass} />
    default: return <Leaf className={iconClass} />
  }
}

function SuggestionCard({ suggestion }: { suggestion: GreenSuggestion }) {
  const [copied, setCopied] = useState(false)

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer bg-card transition-all hover:border-primary/50 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CategoryIcon category={suggestion.category} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    -{suggestion.co2Reduction}% CO2
                  </Badge>
                  {suggestion.promoCode && (
                    <Badge variant="outline" className="text-eco-gold border-eco-gold/50">
                      Promo Available
                    </Badge>
                  )}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CategoryIcon category={suggestion.category} />
            {suggestion.title}
          </DialogTitle>
          <DialogDescription>{suggestion.description}</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {/* Impact stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-2xl font-bold text-primary">-{suggestion.co2Reduction}%</p>
              <p className="text-xs text-muted-foreground">CO2 Reduction</p>
            </div>
            <div className="rounded-lg bg-eco-gold/10 p-3 text-center">
              <p className="text-2xl font-bold text-eco-gold">
                {new Intl.NumberFormat('en-IN', { 
                  style: 'currency', 
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(suggestion.savings)}
              </p>
              <p className="text-xs text-muted-foreground">Potential Savings</p>
            </div>
          </div>

          {/* Promo code */}
          {suggestion.promoCode && (
            <div className="rounded-lg border border-dashed border-eco-gold/50 bg-eco-gold/5 p-4">
              <p className="text-sm font-medium text-foreground">Promo Code</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm">
                  {suggestion.promoCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyPromoCode(suggestion.promoCode!)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {suggestion.merchantName && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Valid at {suggestion.merchantName}
                </p>
              )}
            </div>
          )}

          {/* EV Station info */}
          {suggestion.evStation && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{suggestion.evStation.name}</p>
                  <p className="text-sm text-muted-foreground">{suggestion.evStation.address}</p>
                  <p className="mt-1 text-sm text-primary">
                    {suggestion.evStation.distance} km away
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${suggestion.evStation!.coordinates.lat},${suggestion.evStation!.coordinates.lng}`,
                        '_blank'
                      )
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in Maps
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          <Button className="w-full">
            <Leaf className="mr-2 h-4 w-4" />
            Apply This Suggestion
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function Suggestions() {
  const { suggestions, stats } = useApp()

  if (!stats || suggestions.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lightbulb className="h-5 w-5 text-eco-gold" />
            Green Suggestions
          </CardTitle>
          <CardDescription>Upload transactions to get personalized tips</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">No suggestions yet</p>
        </CardContent>
      </Card>
    )
  }

  const totalPotentialSavings = suggestions.reduce((sum, s) => sum + s.savings, 0)
  const avgCO2Reduction = suggestions.reduce((sum, s) => sum + s.co2Reduction, 0) / suggestions.length

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="h-5 w-5 text-eco-gold" />
              Green Suggestions
            </CardTitle>
            <CardDescription>
              {suggestions.length} personalized recommendations based on your spending
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Avg -{avgCO2Reduction.toFixed(0)}% CO2
            </Badge>
            <Badge variant="secondary" className="bg-eco-gold/10 text-eco-gold">
              Save {new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(totalPotentialSavings)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {suggestions.map(suggestion => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
