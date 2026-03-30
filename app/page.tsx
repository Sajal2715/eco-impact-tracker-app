"use client"

import { useState } from 'react'
import { AppProvider, useApp } from '@/lib/app-context'
import { Header } from '@/components/header'
import { CSVUpload } from '@/components/csv-upload'
import { StatsCards } from '@/components/stats-cards'
import { CategoryChart } from '@/components/category-chart'
import { TrendChart } from '@/components/trend-chart'
import { BenchmarkChart } from '@/components/benchmark-chart'
import { TransactionsTable } from '@/components/transactions-table'
import { Leaderboard } from '@/components/leaderboard'
import { Badges } from '@/components/badges'
import { Suggestions } from '@/components/suggestions'
import { Rewards } from '@/components/rewards'
import { UserProfile } from '@/components/user-profile'

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { transactions, stats } = useApp()

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Upload Section */}
            {transactions.length === 0 && (
              <div className="mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    Track Your Carbon Footprint
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Upload your transaction data to analyze CO2 emissions and get personalized eco-friendly suggestions
                  </p>
                </div>
                <CSVUpload />
              </div>
            )}

            {/* Stats with data */}
            {stats && (
              <>
                <StatsCards />
                
                {/* Charts Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <CategoryChart />
                  <TrendChart />
                </div>
                
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <BenchmarkChart />
                  </div>
                  <CSVUpload />
                </div>
                
                <TransactionsTable />
              </>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
              <p className="text-muted-foreground">
                See how you rank among other eco-conscious users
              </p>
            </div>
            
            {transactions.length === 0 ? (
              <div className="mx-auto max-w-2xl">
                <CSVUpload />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <Leaderboard />
                <Badges />
              </div>
            )}
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Green Suggestions</h2>
              <p className="text-muted-foreground">
                Personalized tips to reduce your carbon footprint
              </p>
            </div>
            
            {transactions.length === 0 ? (
              <div className="mx-auto max-w-2xl">
                <CSVUpload />
              </div>
            ) : (
              <Suggestions />
            )}
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Rewards</h2>
              <p className="text-muted-foreground">
                Earn Paytm Gold by making eco-friendly choices
              </p>
            </div>
            
            {transactions.length === 0 ? (
              <div className="mx-auto max-w-2xl">
                <CSVUpload />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <Rewards />
                <Badges />
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>
              <p className="text-muted-foreground">
                Manage your account and view achievements
              </p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <UserProfile />
              <Badges />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Eco-Impact Tracker - Reduce your carbon footprint, earn rewards
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            CO2 calculations based on India-specific emission factors
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
