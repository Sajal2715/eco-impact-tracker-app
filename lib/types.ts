// Transaction Types
export interface Transaction {
  id: string
  date: string
  amount: number
  merchant: string
  location: string
  category: TransactionCategory
  co2Emissions: number
}

export type TransactionCategory = 
  | 'fuel'
  | 'electricity'
  | 'flights'
  | 'shopping'
  | 'food'
  | 'transport'
  | 'other'

// CO2 Calculation Factors (India-specific)
export const CO2_FACTORS = {
  fuel: { factor: 0.25, unit: 'kg/km', conversion: (amount: number) => amount / 10 }, // INR to km
  electricity: { factor: 0.15, unit: 'kg/kWh', conversion: (amount: number) => amount / 7 }, // INR to kWh
  flights: { factor: 0.15, unit: 'kg/pax-km', conversion: (amount: number) => amount / 5 }, // INR to km
  shopping: { factor: 0.05, unit: 'kg/INR', conversion: (amount: number) => amount / 100 },
  food: { factor: 0.03, unit: 'kg/INR', conversion: (amount: number) => amount / 100 },
  transport: { factor: 0.1, unit: 'kg/km', conversion: (amount: number) => amount / 15 },
  other: { factor: 0.02, unit: 'kg/INR', conversion: (amount: number) => amount / 100 },
} as const

// India average CO2 per person per year: 2.5 tons
export const INDIA_AVG_CO2_YEARLY = 2500 // kg
export const INDIA_AVG_CO2_MONTHLY = INDIA_AVG_CO2_YEARLY / 12 // ~208 kg

// User Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedAt: string
  greenScore: number
  totalCO2Saved: number
  paytmGoldBalance: number
  badges: Badge[]
  friends: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  requirement: number
  type: 'co2_saved' | 'streak' | 'referrals' | 'green_score'
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number
  user: User
  greenScore: number
  co2Saved: number
  change: number // rank change from last period
}

// Suggestion Types
export interface GreenSuggestion {
  id: string
  category: TransactionCategory
  title: string
  description: string
  co2Reduction: number // percentage
  savings: number // INR
  promoCode?: string
  merchantName?: string
  evStation?: EVStation
}

export interface EVStation {
  name: string
  address: string
  distance: number // km
  coordinates: { lat: number; lng: number }
}

// Dashboard Stats
export interface DashboardStats {
  totalCO2: number
  monthlyTrend: { month: string; co2: number }[]
  categoryBreakdown: { category: TransactionCategory; co2: number; percentage: number }[]
  greenScore: number
  co2Saved: number
  benchmarkComparison: number // vs India average
  paytmGoldEarned: number
}

// Rewards
export interface Reward {
  id: string
  name: string
  description: string
  co2Required: number
  goldAmount: number
  claimed: boolean
  claimedAt?: string
}

// Category keywords for ML-like categorization
export const CATEGORY_KEYWORDS: Record<TransactionCategory, string[]> = {
  fuel: ['petrol', 'diesel', 'fuel', 'gas', 'reliance', 'hp', 'iocl', 'bpcl', 'shell', 'essar'],
  electricity: ['electricity', 'bses', 'tata power', 'adani', 'msedcl', 'bescom', 'power'],
  flights: ['indigo', 'spicejet', 'air india', 'vistara', 'akasa', 'goair', 'flight', 'airline', 'airport'],
  shopping: ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'nykaa', 'mall', 'store', 'mart'],
  food: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'pizza', 'burger', 'dominos', 'mcdonalds', 'kfc'],
  transport: ['uber', 'ola', 'rapido', 'metro', 'bus', 'train', 'irctc', 'cab', 'auto'],
  other: [],
}

// Badge definitions
export const BADGES: Badge[] = [
  { id: 'eco-hero', name: 'Eco Hero', description: 'Save 50kg+ CO2 in a month', icon: '🌿', requirement: 50, type: 'co2_saved' },
  { id: 'green-warrior', name: 'Green Warrior', description: 'Save 100kg+ CO2 in a month', icon: '🌳', requirement: 100, type: 'co2_saved' },
  { id: 'planet-saver', name: 'Planet Saver', description: 'Save 500kg+ CO2 total', icon: '🌍', requirement: 500, type: 'co2_saved' },
  { id: 'streak-master', name: 'Streak Master', description: '7-day eco streak', icon: '🔥', requirement: 7, type: 'streak' },
  { id: 'social-impact', name: 'Social Impact', description: 'Refer 5 friends', icon: '👥', requirement: 5, type: 'referrals' },
  { id: 'top-scorer', name: 'Top Scorer', description: 'Achieve 90%+ green score', icon: '⭐', requirement: 90, type: 'green_score' },
]
