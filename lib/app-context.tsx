"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { 
  Transaction, 
  User, 
  DashboardStats, 
  GreenSuggestion, 
  LeaderboardEntry,
  Badge 
} from './types'
import { 
  processTransactions, 
  parseCSV, 
  calculateDashboardStats, 
  generateSuggestions, 
  checkBadges,
  generateLeaderboard,
  generateSampleTransactions
} from './eco-utils'

interface AppState {
  user: User
  transactions: Transaction[]
  stats: DashboardStats | null
  suggestions: GreenSuggestion[]
  leaderboard: LeaderboardEntry[]
  isLoading: boolean
}

interface AppContextType extends AppState {
  uploadCSV: (content: string) => void
  loadSampleData: () => void
  updateUser: (updates: Partial<User>) => void
  claimReward: (co2Amount: number) => void
  addFriend: (friendId: string) => void
  reset: () => void
}

const defaultUser: User = {
  id: 'user-1',
  name: 'Guest User',
  email: 'guest@ecotracker.com',
  joinedAt: new Date().toISOString(),
  greenScore: 0,
  totalCO2Saved: 0,
  paytmGoldBalance: 0,
  badges: [],
  friends: [],
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: defaultUser,
    transactions: [],
    stats: null,
    suggestions: [],
    leaderboard: [],
    isLoading: false,
  })

  const uploadCSV = useCallback((content: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const rawTransactions = parseCSV(content)
      const transactions = processTransactions(rawTransactions)
      const stats = calculateDashboardStats(transactions, state.user)
      const suggestions = generateSuggestions(transactions)
      const newBadges = checkBadges(state.user, stats)
      
      const updatedUser: User = {
        ...state.user,
        greenScore: stats.greenScore,
        totalCO2Saved: state.user.totalCO2Saved + stats.co2Saved,
        paytmGoldBalance: state.user.paytmGoldBalance + stats.paytmGoldEarned,
        badges: [...state.user.badges, ...newBadges],
      }
      
      const leaderboard = generateLeaderboard(updatedUser)
      
      setState({
        user: updatedUser,
        transactions,
        stats,
        suggestions,
        leaderboard,
        isLoading: false,
      })
    } catch (error) {
      console.error('Error processing CSV:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.user])

  const loadSampleData = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    const transactions = generateSampleTransactions()
    const stats = calculateDashboardStats(transactions, state.user)
    const suggestions = generateSuggestions(transactions)
    const newBadges = checkBadges(state.user, stats)
    
    const updatedUser: User = {
      ...state.user,
      greenScore: stats.greenScore,
      totalCO2Saved: state.user.totalCO2Saved + stats.co2Saved,
      paytmGoldBalance: state.user.paytmGoldBalance + stats.paytmGoldEarned,
      badges: [...state.user.badges, ...newBadges],
    }
    
    const leaderboard = generateLeaderboard(updatedUser)
    
    setState({
      user: updatedUser,
      transactions,
      stats,
      suggestions,
      leaderboard,
      isLoading: false,
    })
  }, [state.user])

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...updates },
    }))
  }, [])

  const claimReward = useCallback((co2Amount: number) => {
    const goldEarned = co2Amount / 100
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        paytmGoldBalance: prev.user.paytmGoldBalance + goldEarned,
        totalCO2Saved: prev.user.totalCO2Saved + co2Amount,
      },
    }))
  }, [])

  const addFriend = useCallback((friendId: string) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        friends: [...prev.user.friends, friendId],
      },
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      user: defaultUser,
      transactions: [],
      stats: null,
      suggestions: [],
      leaderboard: [],
      isLoading: false,
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        uploadCSV,
        loadSampleData,
        updateUser,
        claimReward,
        addFriend,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
