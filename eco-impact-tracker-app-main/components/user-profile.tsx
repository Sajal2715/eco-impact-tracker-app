"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { formatCO2 } from '@/lib/eco-utils'

export function UserProfile() {
  const { user, stats } = useApp()
  const [copied, setCopied] = useState(false)

  const referralLink = `restorative.ai/ref/${user.name.toLowerCase().replace(/\s+/g, '-')}-${user.id.slice(0, 4)}`

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
      <div className="max-w-7xl mx-auto space-y-12">
        {/* User Header Profile Section */}
        <section className="bg-white/70 backdrop-blur-xl border border-primary/10 p-10 rounded-3xl flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-secondary-container/20 to-transparent -mr-32 -mt-32 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-primary rotate-3 flex items-center justify-center overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container text-4xl font-black -rotate-3 scale-110">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="font-h1 text-h1 text-primary">{user.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1.5 text-on-surface-variant font-label-sm">
                <span className="material-symbols-outlined text-sm">mail</span>
                {user.email}
              </span>
              <span className="h-1 w-1 bg-outline-variant rounded-full hidden md:block"></span>
              <span className="flex items-center gap-1.5 text-on-surface-variant font-label-sm">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Joined {new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">
              Edit Profile
            </button>
            <button className="px-6 py-3 bg-white/70 backdrop-blur-xl border border-secondary/10 text-secondary rounded-xl font-bold text-sm hover:bg-surface-container-low active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">share</span>
              Share Profile
            </button>
          </div>
        </section>

        {/* 4-Grid Stats Block */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-xl border border-primary/10 p-8 rounded-3xl group hover:border-emerald-500/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              </div>
              <span className="font-mono-data text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">+12%</span>
            </div>
            <p className="text-on-surface-variant font-label-sm mb-1">Impact Score</p>
            <h3 className="font-display text-h1 text-primary">{(stats?.greenScore || 0).toFixed(0)}</h3>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl border border-primary/10 p-8 rounded-3xl group hover:border-emerald-500/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
              </div>
            </div>
            <p className="text-on-surface-variant font-label-sm mb-1">CO2 Saved</p>
            <h3 className="font-display text-h1 text-primary">{formatCO2(user.totalCO2Saved)}</h3>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-primary/10 p-8 rounded-3xl group hover:border-emerald-500/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              </div>
            </div>
            <p className="text-on-surface-variant font-label-sm mb-1">Paytm Gold</p>
            <h3 className="font-display text-h1 text-primary">{user.paytmGoldBalance.toFixed(3)}g</h3>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-primary/10 p-8 rounded-3xl group hover:border-emerald-500/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>award_star</span>
              </div>
            </div>
            <p className="text-on-surface-variant font-label-sm mb-1">Total Badges</p>
            <h3 className="font-display text-h1 text-primary">{user.badges.length}</h3>
          </div>
        </section>

        {/* Recent Badges Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-h2 text-h2 text-primary">Recent Achievements</h2>
            <button className="text-emerald-700 font-bold text-sm hover:underline">View All Gallery</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {user.badges.length > 0 ? (
              user.badges.slice(0, 4).map((badge, idx) => (
                <div 
                  key={badge.id} 
                  className={`${idx === 0 ? 'md:col-span-2' : ''} bg-white/70 backdrop-blur-xl border border-primary/10 rounded-3xl p-8 flex ${idx === 0 ? 'items-center gap-8' : 'flex-col items-center text-center justify-center space-y-4'} relative overflow-hidden group transition-all hover:border-primary/30 shadow-sm`}
                >
                  <div className={`${idx === 0 ? 'w-32 h-32 flex-shrink-0' : 'w-20 h-20'} bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full flex items-center justify-center border-2 border-white shadow-inner transition-transform group-hover:scale-110`}>
                    <span className={`material-symbols-outlined ${idx === 0 ? 'text-5xl' : 'text-3xl'} text-emerald-800`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {getMaterialIcon(badge.icon)}
                    </span>
                  </div>
                  <div className={idx === 0 ? 'space-y-2' : ''}>
                    {idx === 0 && <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Featured Achievement</span>}
                    <h4 className="font-h2 text-h2 text-primary">{badge.name}</h4>
                    <p className="text-on-surface-variant font-body-md leading-tight">{badge.description}</p>
                    {idx === 0 && (
                      <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <span className="material-symbols-outlined text-sm">history</span>
                        Awarded Recently
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white/70 backdrop-blur-xl border border-dashed border-primary/20 rounded-3xl">
                <p className="text-on-surface-variant">No achievements yet. Start saving CO2 to earn badges!</p>
              </div>
            )}
            
            {/* Next Goal Placeholder */}
            <div className="md:col-span-2 bg-emerald-50/20 border-dashed border-2 border-emerald-500/20 rounded-3xl p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-h2 text-h2 text-primary">Next Goal: Solar Master</h4>
                  <p className="text-on-surface-variant font-body-md">Install residential PV and export 100kWh to the local grid.</p>
                </div>
                <div className="text-right">
                  <span className="font-mono-data text-2xl font-bold text-emerald-700">75%</span>
                </div>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden mt-6 shadow-inner">
                <div className="bg-emerald-600 h-full w-3/4 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Referral Link Section */}
        <section className="bg-emerald-50/30 border border-emerald-500/5 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-h2 text-h2 text-primary">Empower others to restore.</h3>
            <p className="text-on-surface-variant font-body-md">
              Share your unique referral link with your network. For every institutional sign-up, you earn Carbon Gold and a "Network Builder" badge tier upgrade.
            </p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-outline-variant w-full md:w-auto shadow-inner">
            <code className="px-4 py-2 font-mono-data text-emerald-800 select-all truncate max-w-[200px] md:max-w-none">
              {referralLink}
            </code>
            <button 
              onClick={copyReferralLink}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-primary text-on-primary hover:bg-primary-container'}`}
            >
              <span className="material-symbols-outlined">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
