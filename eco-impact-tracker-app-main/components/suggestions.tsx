"use client"

import { useApp } from '@/lib/app-context'

export function Suggestions() {
  const { suggestions, stats } = useApp()

  if (!stats || suggestions.length === 0) return null

  // We split the suggestions to mimic the Stitch layout
  // 1st suggestion gets the large card with EV/maps
  // 2nd suggestion is promo card
  // Remaining suggestions get smaller cards
  const topSuggestion = suggestions[0]
  const promoSuggestion = suggestions.find(s => s.promoCode) || suggestions[1]
  const otherSuggestions = suggestions.filter(s => s.id !== topSuggestion?.id && s.id !== promoSuggestion?.id).slice(0, 2)

  return (
    <div className="w-full">
      {/* AI Insights Header */}
      <section className="mb-10">
        <div className="bg-gradient-to-br from-emerald-50 to-white border-l-4 border-l-secondary p-6 rounded-xl flex items-start gap-4 mb-8 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-3xl">auto_awesome</span>
          <div>
            <h2 className="font-h1 text-h1 text-primary mb-1">Impact Suggestions</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl">
              Based on your recent patterns, our AI has identified {suggestions.length} key opportunities to reduce your carbon footprint and save institutional costs.
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Advisory Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Suggestion */}
        {topSuggestion && (
          <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl border border-primary/10 rounded-xl p-8 flex flex-col transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    {topSuggestion.category} Optimization
                  </span>
                  <span className="bg-primary-container text-white px-3 py-1 rounded-full text-[10px] font-bold">
                    HIGH IMPACT
                  </span>
                </div>
                <h3 className="font-h2 text-h2 text-primary">{topSuggestion.title}</h3>
                <p className="font-body-md text-on-surface-variant mt-2">{topSuggestion.description}</p>
              </div>
              <div className="text-right">
                <div className="font-mono-data text-2xl text-secondary font-bold">-{topSuggestion.co2Reduction}%</div>
                <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">CO2 REDUCTION</div>
              </div>
            </div>

            {topSuggestion.evStation && (
              <div className="bg-surface-container-low rounded-lg p-4 mt-auto mb-6">
                <h4 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Nearby Infrastructure</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded bg-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-secondary">ev_station</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{topSuggestion.evStation.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{topSuggestion.evStation.address}</p>
                      <p className="text-xs text-secondary mt-1 font-mono-data">{topSuggestion.evStation.distance} km away</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 mt-auto">
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Estimated Annual Savings</p>
                <p className="font-mono-data text-xl font-bold text-primary">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(topSuggestion.savings)}
                </p>
              </div>
              <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply Plan
              </button>
            </div>
          </div>
        )}

        {/* Promo/Partner Card */}
        {promoSuggestion && (
          <div className="lg:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
            <div className="mb-6">
              <span className="material-symbols-outlined text-primary-fixed-dim text-4xl">energy_savings_leaf</span>
              <h3 className="font-h2 text-h2 text-white mt-4">{promoSuggestion.title}</h3>
              <p className="text-on-primary-container font-body-md mt-2 opacity-90">{promoSuggestion.description}</p>
            </div>
            
            {promoSuggestion.promoCode && (
              <div className="bg-primary-container/30 border border-on-primary-container/20 rounded-lg p-4 mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed-dim mb-1">PROMO CODE</p>
                <div className="flex justify-between items-center">
                  <span className="font-mono-data text-lg font-bold tracking-widest">{promoSuggestion.promoCode}</span>
                  <button className="material-symbols-outlined text-primary-fixed-dim hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(promoSuggestion.promoCode || '')}>
                    content_copy
                  </button>
                </div>
              </div>
            )}

            <div className="mt-auto space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium">CO2 Impact</span>
                <span className="font-mono-data font-bold text-primary-fixed">-{promoSuggestion.co2Reduction}%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium">Est. Savings</span>
                <span className="font-mono-data font-bold text-primary-fixed">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(promoSuggestion.savings)}
                </span>
              </div>
              <button className="w-full bg-secondary-container text-on-secondary-fixed-variant py-3 rounded-lg font-bold text-sm uppercase tracking-wider mt-4 hover:brightness-105 transition-all">
                Redeem Offer
              </button>
            </div>
          </div>
        )}

        {/* Other Categories */}
        {otherSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="lg:col-span-6 bg-white/70 backdrop-blur-xl border border-primary/10 rounded-xl p-8 flex flex-col transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">
                  {suggestion.category === 'electricity' ? 'thermostat' : suggestion.category === 'food' ? 'restaurant' : 'recycling'}
                </span>
              </div>
              <div>
                <h4 className="font-h2 text-h2 text-primary">{suggestion.title}</h4>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{suggestion.category}</p>
              </div>
            </div>
            <p className="font-body-md text-on-surface-variant mb-8">{suggestion.description}</p>
            
            <div className="flex gap-4 mb-8 mt-auto">
              <div className="flex-1 bg-surface-container-low p-4 rounded-lg">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Reduction</p>
                <p className="font-mono-data text-xl font-bold text-primary">-{suggestion.co2Reduction}%</p>
              </div>
              <div className="flex-1 bg-surface-container-low p-4 rounded-lg">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">INR Savings</p>
                <p className="font-mono-data text-xl font-bold text-primary">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(suggestion.savings)}
                </p>
              </div>
            </div>
            <button className="w-full border border-secondary text-secondary py-2.5 rounded-lg text-sm font-bold hover:bg-secondary/5 transition-colors">
              Automate Plan
            </button>
          </div>
        ))}
      </div>

      {/* Secondary CTA/Banner */}
      <section className="mt-12">
        <div className="relative overflow-hidden rounded-2xl h-48 group">
          <img 
            alt="sustainable future city" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=2000" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 flex flex-col justify-center px-12">
            <h3 className="text-white font-h1 text-h1 max-w-lg leading-tight">Ready to verify your impact?</h3>
            <p className="text-primary-fixed font-body-md mt-2">Generate your quarterly ESG compliance report in one click.</p>
            <div className="mt-6">
              <button className="bg-secondary-fixed text-on-secondary-fixed px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
