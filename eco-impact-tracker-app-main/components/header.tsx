"use client"

import { useApp } from '@/lib/app-context'

export function Header() {
  const { user } = useApp()

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-emerald-500/10 dark:border-emerald-500/20 shadow-[0_20px_50px_rgba(6,78,59,0.04)] flex items-center justify-between px-8">
      <h1 className="text-xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50 font-inter antialiased">Restorative Intelligence</h1>
      
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-emerald-50/50 rounded-full border border-emerald-100">
          <span className="material-symbols-outlined text-emerald-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
          <span className="text-sm font-mono-data text-emerald-900 font-semibold">Gold Balance: ₹{(user.paytmGoldBalance * 1000).toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase">Institutional User</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm overflow-hidden">
            <div className="w-full h-full bg-primary flex items-center justify-center text-on-primary text-[10px]">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
