"use client"

import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

export function StatsCards() {
  const { stats, user } = useApp()
  if (!stats) return null

  const isBelowAverage = stats.totalCO2 < 12000 // 1000kg/month = 12000kg/year approx

  return (
    <>
      <div className="mb-10">
        <h1 className="font-h1 text-h1 text-primary mb-2">Impact Dashboard</h1>
        <p className="text-on-surface-variant font-body-md">Personal environmental transparency and institutional ESG tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Total CO2 Card */}
        <div className="col-span-1 md:col-span-3 bg-white/70 backdrop-blur-xl border border-primary/10 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl"></div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Total CO2 Footprint</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-h1 font-h1 text-primary">{(stats.totalCO2 / 1000).toFixed(1)}</h2>
              <span className="text-label-sm font-label-sm text-on-surface-variant">tons/yr</span>
            </div>
          </div>
          <div className={`mt-4 flex items-center gap-2 font-medium text-sm ${isBelowAverage ? 'text-secondary' : 'text-error'}`}>
            <span className="material-symbols-outlined text-sm">{isBelowAverage ? 'trending_down' : 'trending_up'}</span>
            <span>{isBelowAverage ? 'Below' : 'Above'} Benchmark</span>
          </div>
        </div>

        {/* Green Score Card */}
        <div className="col-span-1 md:col-span-4 bg-white/70 backdrop-blur-xl border border-primary/10 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Green Eco-Score</p>
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
                {stats.greenScore >= 800 ? 'A+ RATING' : stats.greenScore >= 600 ? 'A RATING' : 'B RATING'}
              </span>
            </div>
            <h2 className="text-h1 font-h1 text-secondary">{Math.round(stats.greenScore)}</h2>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-secondary to-secondary-fixed rounded-full" 
                style={{ width: `${Math.min(100, (stats.greenScore / 1000) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 font-medium italic">
              "Excellent progressive assessment. Based on recent transactions."
            </p>
          </div>
        </div>

        {/* CO2 Saved Card */}
        <div className="col-span-1 md:col-span-2 bg-white/70 backdrop-blur-xl border border-primary/10 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-secondary text-4xl mb-3">eco</span>
          <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">CO2 Saved</p>
          <h2 className="text-h2 font-h2 text-primary">{formatCO2(user.totalCO2Saved)}</h2>
        </div>

        {/* Paytm Gold Card */}
        <div className="col-span-1 md:col-span-3 bg-primary-container text-on-primary-container p-6 rounded-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <span className="material-symbols-outlined text-[120px]">savings</span>
          </div>
          <p className="text-label-sm font-label-sm text-on-primary-container/70 uppercase tracking-wider mb-2">Gold Rewards Earned</p>
          <h2 className="text-h1 font-h1 mb-4 text-white">₹{(user.paytmGoldBalance * 6000).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h2>
          <button className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all z-10 relative">
            REDEEM NOW
          </button>
        </div>
      </div>
    </>
  )
}
