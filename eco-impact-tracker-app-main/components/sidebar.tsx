"use client"

import { useApp } from '@/lib/app-context'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { reset } = useApp()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
    { id: 'suggestions', label: 'Suggestions', icon: 'tips_and_updates' },
    { id: 'rewards', label: 'Rewards', icon: 'military_tech' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col py-6 px-4 gap-2 z-50">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">nature_people</span>
        </div>
        <div>
          <h2 className="text-lg font-black text-emerald-900 dark:text-emerald-50 leading-tight">Sustainability AI</h2>
          <p className="text-xs text-slate-500 font-medium">Institutional ESG</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all rounded-lg font-medium text-sm active:scale-95 ${
              activeTab === item.id
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: activeTab === item.id ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
        <button 
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-error hover:bg-error/5 rounded-lg transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Reset Session
        </button>
      </div>
    </aside>
  )
}
