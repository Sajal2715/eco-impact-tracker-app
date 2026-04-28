"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'
import { BADGES } from '@/lib/types'

export function Rewards() {
  const { user, stats, claimReward } = useApp()
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const co2Saved = stats?.co2Saved || 0
  const paytmGoldBalance = user.paytmGoldBalance || 0

  // Mock Rewards list based on Stitch design
  const REWARDS = [
    {
      id: 'reward-1',
      name: 'Carbon Neutral Travel',
      type: 'Premium Flight Offsets',
      rarity: 'RARE',
      rarityClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      requirement: 5.0, // tons
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'reward-2',
      name: 'Eco-Retreat Voucher',
      type: 'Restorative Getaway',
      rarity: 'LEGENDARY',
      rarityClass: 'bg-amber-50 text-amber-700 border-amber-100',
      requirement: 12.0, // tons
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'reward-3',
      name: 'Smart Energy Monitor',
      type: 'IoT Home Hardware',
      rarity: 'COMMON',
      rarityClass: 'bg-slate-100 text-slate-700 border-slate-200',
      requirement: 2.5, // tons
      image: 'https://images.unsplash.com/photo-1558002038-103792e17730?auto=format&fit=crop&q=80&w=800'
    }
  ]

  const handleClaim = (id: string) => {
    setClaimingId(id)
    setTimeout(() => {
      setClaimingId(null)
      // Actual claim logic would go here
    }, 1500)
  }

  const getMaterialIcon = (emoji: string) => {
    switch (emoji) {
      case '🌿': return 'forest'
      case '🌳': return 'nature_people'
      case '🌍': return 'public'
      case '🔥': return 'local_fire_department'
      case '👥': return 'group'
      case '⭐': return 'star'
      default: return 'verified'
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Impact Header Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/70 backdrop-blur-xl border border-primary/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <h2 className="font-h1 text-h1 text-primary mb-2">Your Impact Journey</h2>
              <p className="text-body-md text-on-surface-variant max-w-lg">
                You've mitigated <span className="font-bold text-emerald-700">{formatCO2(user.totalCO2Saved)}</span> so far. 
                You are in the top 5% of restorative investors.
              </p>
            </div>
            <div className="mt-8 flex items-end gap-8 relative z-10">
              <div className="flex flex-col">
                <span className="font-mono-data text-emerald-800 font-bold text-2xl">
                  {stats?.greenScore && stats.greenScore > 850 ? 'A+' : stats?.greenScore && stats.greenScore > 750 ? 'A' : 'B'}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">ESG Score</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600">Progress to Net Zero Hero</span>
                  <span className="text-xs font-mono-data text-emerald-700">85%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -z-0"></div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl border border-primary/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2">
            <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <div>
              <h3 className="font-h2 text-h2 text-primary">Paytm Gold</h3>
              <p className="font-mono-data text-3xl font-bold text-secondary">{paytmGoldBalance.toFixed(3)}g</p>
            </div>
            <button className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-md">
              Redeem Assets
            </button>
          </div>
        </section>

        {/* Verified Achievements Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <h3 className="font-h2 text-h2 text-primary">Verified Achievements</h3>
            </div>
            <button className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {BADGES.map((badge) => {
              const isUnlocked = user.badges.some(ub => ub.id === badge.id)
              return (
                <div 
                  key={badge.id} 
                  className={`bg-white/70 backdrop-blur-xl border border-primary/10 rounded-2xl p-4 flex flex-col items-center group cursor-help relative transition-all hover:border-primary/30 ${!isUnlocked ? 'opacity-40 grayscale' : ''}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${isUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {getMaterialIcon(badge.icon)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-800 text-center">{badge.name}</p>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white rounded-xl text-[11px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    <p className="font-bold mb-1">{isUnlocked ? badge.name : 'Locked Achievement'}</p>
                    {badge.description}
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Rewards Bento Grid */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>card_giftcard</span>
            <h3 className="font-h2 text-h2 text-primary">Unlockable Rewards</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REWARDS.map((reward) => {
              // Calculate progress in tons (mocking totalCO2Saved as kg for now, so divide by 1000)
              const savedTons = user.totalCO2Saved / 1000
              const progress = Math.min(100, (savedTons / reward.requirement) * 100)
              const isUnlocked = progress >= 100

              return (
                <div key={reward.id} className={`bg-white/70 backdrop-blur-xl border rounded-3xl overflow-hidden flex flex-col group transition-all hover:shadow-lg ${isUnlocked ? 'border-emerald-500/20' : 'border-emerald-500/10'}`}>
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={reward.image} 
                      alt={reward.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{reward.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{reward.type}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${reward.rarityClass}`}>
                        {reward.rarity}
                      </div>
                    </div>
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>Requirement: {reward.requirement}t CO2</span>
                        <span className={isUnlocked ? 'text-emerald-700 font-black' : 'text-emerald-700'}>
                          {isUnlocked ? 'Unlocked!' : `${progress.toFixed(0)}% Complete`}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-mono-data text-sm font-bold text-slate-400">
                          {savedTons.toFixed(2)} / {reward.requirement} tCO2
                        </span>
                        <button 
                          disabled={!isUnlocked || claimingId === reward.id}
                          onClick={() => handleClaim(reward.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            isUnlocked 
                              ? 'bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-md' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {claimingId === reward.id ? 'Claiming...' : isUnlocked ? 'Claim Now' : 'Locked'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* AI Insights Banner */}
        <section className="rounded-3xl p-8 bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-inner flex-shrink-0">
            <span className="material-symbols-outlined text-emerald-600 text-3xl">auto_awesome</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-emerald-900 mb-1">AI Recommendation</h4>
            <p className="text-sm text-emerald-800/80 leading-relaxed max-w-2xl">
              Based on your current investment trajectory, you are expected to unlock the <span className="font-bold">"Circular Pioneer"</span> badge in 14 days. Boosting your allocation in sustainable waste management could accelerate this by 5 days.
            </p>
          </div>
          <button className="w-full md:w-auto px-6 py-3 bg-white border border-emerald-200 text-emerald-700 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors shadow-sm">
            Optimize Portfolio
          </button>
        </section>
      </div>
    </div>
  )
}
