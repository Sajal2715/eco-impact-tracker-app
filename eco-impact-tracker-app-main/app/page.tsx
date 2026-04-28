"use client"

import { useState } from 'react'
import { AppProvider, useApp } from '@/lib/app-context'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { CSVUpload } from '@/components/csv-upload'
import { StatsCards } from '@/components/stats-cards'
import { CategoryChart } from '@/components/category-chart'
import { TrendChart } from '@/components/trend-chart'
import { TransactionsTable } from '@/components/transactions-table'
import { Leaderboard } from '@/components/leaderboard'
import { Suggestions } from '@/components/suggestions'
import { Rewards } from '@/components/rewards'
import { UserProfile } from '@/components/user-profile'

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { transactions, stats } = useApp()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Header />
      
      <main className="ml-64 pt-24 px-8 pb-12">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Upload Section / Empty State */}
            {transactions.length === 0 ? (
              <CSVUpload />
            ) : (
              <>
                <StatsCards />
                
                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="col-span-1 md:col-span-8">
                    <TrendChart />
                  </div>
                  <div className="col-span-1 md:col-span-4">
                    <CategoryChart />
                  </div>
                </div>
                
                <TransactionsTable />
              </>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          transactions.length === 0 ? <CSVUpload /> : <Leaderboard />
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          transactions.length === 0 ? <CSVUpload /> : <Suggestions />
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          transactions.length === 0 ? <CSVUpload /> : <Rewards />
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <UserProfile />
        )}
      </main>

      {/* Footer */}
      <footer className="ml-64 border-t bg-card/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Eco-Impact Tracker - Restorative Intelligence Dashboard
          </p>
          <p className="mt-1 text-xs text-muted-foreground opacity-70">
            Institutional ESG Compliance & Carbon Mitigation Tracking
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  )
}
