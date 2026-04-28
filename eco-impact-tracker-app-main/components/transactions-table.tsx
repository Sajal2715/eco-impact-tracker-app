"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'
import type { TransactionCategory } from '@/lib/types'

const CATEGORY_STYLES: Record<TransactionCategory, string> = {
  fuel: 'bg-primary text-on-primary',
  electricity: 'bg-yellow-500 text-white',
  flights: 'bg-primary text-on-primary',
  shopping: 'bg-purple-500 text-white',
  food: 'bg-secondary text-on-secondary',
  transport: 'bg-tertiary-container text-on-tertiary-container',
  other: 'bg-slate-500 text-white',
}

const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  fuel: 'local_gas_station',
  electricity: 'bolt',
  flights: 'flight',
  shopping: 'shopping_bag',
  food: 'restaurant',
  transport: 'directions_subway',
  other: 'more_horiz',
}

export function TransactionsTable() {
  const { transactions } = useApp()
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<'date' | 'amount' | 'co2Emissions'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  if (transactions.length === 0) return null

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

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const displayTransactions = sortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-primary/10 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-h2 font-h2 text-primary">Environmental Ledger</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-surface-container-low focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all w-64" 
              placeholder="Search transactions..." 
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low/50 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">
                  Date 
                  {sortField === 'date' && <span className="material-symbols-outlined text-[10px]">{sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
                </div>
              </th>
              <th className="px-6 py-4 font-semibold">Merchant</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-1">
                  Amount (INR)
                  {sortField === 'amount' && <span className="material-symbols-outlined text-[10px]">{sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
                </div>
              </th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('co2Emissions')}>
                <div className="flex items-center gap-1">
                  CO2 Impact
                  {sortField === 'co2Emissions' && <span className="material-symbols-outlined text-[10px]">{sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
                </div>
              </th>
              <th className="px-6 py-4 font-semibold text-right">Reward</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayTransactions.map((tx) => {
              const goldReward = tx.co2Emissions < 5 ? (tx.co2Emissions > 1 ? 2.5 : 5.0) : 0;
              const isHighImpact = tx.co2Emissions > 50;
              
              return (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono-data text-xs">
                    {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">{tx.merchant}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 ${CATEGORY_STYLES[tx.category]} text-[10px] font-bold rounded-full uppercase`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono-data">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 ${isHighImpact ? 'text-error' : (tx.co2Emissions < 5 ? 'text-secondary' : 'text-emerald-600')}`}>
                      <span className="material-symbols-outlined text-xs">
                        {isHighImpact ? 'warning' : (tx.co2Emissions < 5 ? 'check_circle' : 'thumb_up')}
                      </span>
                      <span className="font-bold">{formatCO2(tx.co2Emissions)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {goldReward > 0 ? (
                      <span className="text-secondary font-bold text-xs">₹{goldReward.toFixed(2)} Gold</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 bg-surface-container-low/30 border-t border-slate-200/60 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant font-medium">
          Showing {Math.min(sortedTransactions.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(sortedTransactions.length, currentPage * itemsPerPage)} of {sortedTransactions.length} transactions
        </span>
        <div className="flex gap-2">
          <button 
            className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button 
            className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
