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

  const fetchDashboardData = async (payload: any) => {
    try {
      // 1. Process Transactions
      const processRes = await fetch('/api/process-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const processData = await processRes.json();
      
      if (processData.status !== 'success') throw new Error(processData.message);
      
      const { transactions, stats, newBadges, meta: processMeta } = processData.data;
      
      const updatedUser: User = {
        ...state.user,
        greenScore: stats.greenScore,
        totalCO2Saved: state.user.totalCO2Saved + stats.co2Saved,
        paytmGoldBalance: state.user.paytmGoldBalance + stats.paytmGoldEarned,
        badges: [...state.user.badges, ...newBadges],
      }

      // 2. Fetch Leaderboard
      const lbRes = await fetch('/api/get-leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: updatedUser })
      });
      const lbData = await lbRes.json();
      const leaderboard = lbData.data.leaderboard;

      // 3. Fetch Suggestions
      const suggRes = await fetch('/api/get-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions })
      });
      const suggData = await suggRes.json();
      const suggestions = suggData.data.suggestions;

      console.log('AI Processing Meta:', { processMeta, lbMeta: lbData.data.meta, suggMeta: suggData.data.meta });

      setState({
        user: updatedUser,
        transactions,
        stats,
        suggestions,
        leaderboard,
        isLoading: false,
      });
    } catch (error) {
      console.error('API Error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const uploadCSV = useCallback(async (content: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await fetchDashboardData({ csvContent: content, user: state.user, isSample: false });
  }, [state.user]);

  const loadSampleData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await fetchDashboardData({ csvContent: "", user: state.user, isSample: true });
  }, [state.user]);

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
