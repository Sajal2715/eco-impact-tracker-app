"use client"

import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

export function Leaderboard() {
  const { leaderboard, user, stats } = useApp()

  if (leaderboard.length === 0) return null

  // Calculate some fake institutional stats based on the user's performance
  const globalScore = 84.2 + (stats?.greenScore ? (stats.greenScore - 842) / 100 : 0)
  const totalMitigated = 1248 + (user.totalCO2Saved / 1000)

  return (
    <div className="w-full">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-fixed-variant text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">Institutional Ranking</span>
          <h2 className="font-h1 text-h1 text-primary">Eco Impact Leaderboard</h2>
          <p className="text-surface-variant font-body-md mt-1">Real-time sustainability performance across the organization.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/70 backdrop-blur-xl border border-primary/10 rounded-lg flex items-center gap-2 text-sm font-semibold text-secondary transition-all hover:shadow-lg active:scale-95">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filter View
          </button>
          <button className="px-6 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 text-sm font-semibold transition-all hover:bg-primary-container active:scale-95">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Bento Stats Summary */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-xl border border-primary/10 rounded-xl p-6 border-l-4 border-l-secondary">
          <p className="text-sm font-medium text-surface-variant mb-1">Global Average Score</p>
          <div className="flex items-end gap-3">
            <h3 className="font-display text-4xl text-primary">{globalScore.toFixed(1)}</h3>
            <span className="text-emerald-600 flex items-center text-sm font-bold mb-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +2.4%
            </span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-xl border border-primary/10 rounded-xl p-6 border-l-4 border-l-primary">
          <p className="text-sm font-medium text-surface-variant mb-1">Total Carbon Mitigated</p>
          <div className="flex items-end gap-3">
            <h3 className="font-display text-4xl text-primary">{totalMitigated.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-lg font-bold ml-1">Tons</span></h3>
            <span className="text-emerald-600 flex items-center text-sm font-bold mb-1">
              <span className="material-symbols-outlined text-sm">eco</span>
              Active
            </span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-xl border border-primary/10 rounded-xl p-6 border-l-4 border-l-tertiary">
          <p className="text-sm font-medium text-surface-variant mb-1">Top Performer Growth</p>
          <div className="flex items-end gap-3">
            <h3 className="font-display text-4xl text-primary">A+</h3>
            <span className="text-secondary flex items-center text-sm font-bold mb-1">
              Platinum Tier
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-white/70 backdrop-blur-xl border border-primary/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(6,78,59,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider w-20 text-center">Rank</th>
                <th className="px-6 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Entity</th>
                <th className="px-6 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Green Score</th>
                <th className="px-6 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">CO2 Saved</th>
                <th className="px-6 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map((entry) => {
                const isUser = entry.user.id === user.id
                // Render rank UI
                let rankUI = null
                if (entry.rank === 1) {
                  rankUI = <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm mx-auto ring-2 ring-yellow-200">1</div>
                } else if (entry.rank === 2) {
                  rankUI = <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm mx-auto">2</div>
                } else if (entry.rank === 3) {
                  rankUI = <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm mx-auto">3</div>
                } else {
                  rankUI = <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mx-auto ${isUser ? 'bg-primary text-on-primary' : 'bg-slate-50 text-slate-400'}`}>{entry.rank}</div>
                }

                // Render badge UI based on score
                let scoreBadge = null
                if (entry.greenScore >= 950) scoreBadge = <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded uppercase">A+</span>
                else if (entry.greenScore >= 900) scoreBadge = <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded uppercase">A</span>
                else if (entry.greenScore >= 850) scoreBadge = <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] rounded uppercase">B+</span>
                else if (entry.greenScore >= 800) scoreBadge = <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] rounded uppercase">B</span>
                else scoreBadge = <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant text-[10px] rounded uppercase">C</span>

                return (
                  <tr key={entry.user.id} className={isUser ? "bg-emerald-50/50 hover:bg-emerald-50 transition-colors group border-y-2 border-emerald-500/20" : "hover:bg-emerald-50/30 transition-colors group"}>
                    <td className="px-6 py-5 text-center">
                      {rankUI}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono-data ${isUser ? 'bg-primary text-on-primary' : 'bg-primary-container text-white'}`}>
                          {entry.user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-bold transition-colors ${isUser ? 'text-primary' : 'text-primary group-hover:text-emerald-800'}`}>
                              {entry.user.name}
                            </p>
                            {isUser && <span className="text-[9px] bg-primary-container text-on-primary-container px-1.5 rounded uppercase font-black">You</span>}
                          </div>
                          <p className="text-xs text-surface-variant">{isUser ? 'Eco Impact Tracker User' : 'Participant'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-mono-data font-bold text-primary">
                      <div className="inline-flex items-center gap-2">
                        {(entry.greenScore / 10).toFixed(1)}
                        {scoreBadge}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-mono-data text-surface-variant">
                      {formatCO2(entry.co2Saved)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {entry.rank === 1 ? (
                        <div className="flex flex-col items-center">
                          <span className="material-symbols-outlined text-emerald-500">keyboard_double_arrow_up</span>
                          <span className="text-[10px] font-bold text-emerald-600">+2</span>
                        </div>
                      ) : entry.rank % 3 === 0 ? (
                        <span className="material-symbols-outlined text-lg text-surface-variant">horizontal_rule</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="material-symbols-outlined text-emerald-500">keyboard_arrow_up</span>
                          <span className="text-[10px] font-bold text-emerald-600">+1</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer/Pagination */}
        <div className="px-6 py-4 bg-surface-container-low/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-medium text-surface-variant">Showing 1-{leaderboard.length} of 124 organizations</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="p-2 rounded-lg border border-slate-200 text-primary hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Promotion / AI Banner */}
      <div className="mt-12 p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-primary-container to-emerald-950 text-on-primary">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary-container">auto_awesome</span>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary-container">AI Insight</span>
            </div>
            <h4 className="text-2xl font-h2 mb-4">You're 2.4% away from the next Tier</h4>
            <p className="opacity-80 font-body-md">Based on current trends, optimizing your transport emissions this month could catapult you into the top 3 global entities.</p>
          </div>
          <button className="px-8 py-4 bg-secondary-container text-on-secondary-fixed-variant font-bold rounded-xl whitespace-nowrap shadow-xl hover:shadow-2xl transition-all">
            View Optimization Plan
          </button>
        </div>
        
        {/* Abstract Deco */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  )
}
