"use client"

import { useState } from 'react'
import { Fuel, Zap, Plane, ShoppingBag, Utensils, Car, MoreHorizontal, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'
import type { TransactionCategory } from '@/lib/types'

const CategoryIcon = ({ category }: { category: TransactionCategory }) => {
  const iconClass = "h-4 w-4"
  switch (category) {
    case 'fuel': return <Fuel className={`${iconClass} text-amber-500`} />
    case 'electricity': return <Zap className={`${iconClass} text-yellow-500`} />
    case 'flights': return <Plane className={`${iconClass} text-blue-500`} />
    case 'shopping': return <ShoppingBag className={`${iconClass} text-purple-500`} />
    case 'food': return <Utensils className={`${iconClass} text-orange-500`} />
    case 'transport': return <Car className={`${iconClass} text-cyan-500`} />
    default: return <MoreHorizontal className={`${iconClass} text-gray-500`} />
  }
}

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  fuel: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  electricity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  flights: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shopping: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  food: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  transport: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

export function TransactionsTable() {
  const { transactions } = useApp()
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<'date' | 'amount' | 'co2Emissions'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showAll, setShowAll] = useState(false)

  if (transactions.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Transactions</CardTitle>
          <CardDescription>Upload transactions to view details</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">No transactions loaded</p>
        </CardContent>
      </Card>
    )
  }

  const filteredTransactions = transactions.filter(tx =>
    tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
    tx.category.toLowerCase().includes(search.toLowerCase()) ||
    tx.location.toLowerCase().includes(search.toLowerCase())
  )

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const modifier = sortDir === 'asc' ? 1 : -1
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * modifier
    }
    return String(aVal).localeCompare(String(bVal)) * modifier
  })

  const displayTransactions = showAll ? sortedTransactions : sortedTransactions.slice(0, 10)

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null
    return sortDir === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
            <CardDescription>{transactions.length} transactions analyzed</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date <SortIcon field="date" />
                  </div>
                </TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead 
                  className="cursor-pointer text-right hover:bg-muted/50"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount <SortIcon field="amount" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right hover:bg-muted/50"
                  onClick={() => handleSort('co2Emissions')}
                >
                  <div className="flex items-center justify-end gap-1">
                    CO2 <SortIcon field="co2Emissions" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short',
                      year: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{tx.merchant}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${CATEGORY_COLORS[tx.category]} gap-1`}>
                      <CategoryIcon category={tx.category} />
                      {tx.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={tx.co2Emissions > 10 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                      {formatCO2(tx.co2Emissions)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {sortedTransactions.length > 10 && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : `Show All ${sortedTransactions.length} Transactions`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
