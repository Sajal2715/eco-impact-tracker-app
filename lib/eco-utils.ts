import { 
  Transaction, 
  TransactionCategory, 
  CO2_FACTORS, 
  CATEGORY_KEYWORDS,
  INDIA_AVG_CO2_MONTHLY,
  User,
  Badge,
  BADGES,
  DashboardStats,
  GreenSuggestion,
  LeaderboardEntry
} from './types'

// Categorize transaction based on merchant name
export function categorizeTransaction(merchant: string): TransactionCategory {
  const merchantLower = merchant.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => merchantLower.includes(keyword))) {
      return category as TransactionCategory
    }
  }
  
  return 'other'
}

// Calculate CO2 emissions for a transaction
export function calculateCO2(amount: number, category: TransactionCategory): number {
  const factor = CO2_FACTORS[category]
  const units = factor.conversion(amount)
  return Number((units * factor.factor).toFixed(2))
}

// Parse CSV data
export function parseCSV(csvContent: string): Omit<Transaction, 'id' | 'category' | 'co2Emissions'>[] {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
  
  const dateIndex = headers.findIndex(h => h.includes('date'))
  const amountIndex = headers.findIndex(h => h.includes('amount'))
  const merchantIndex = headers.findIndex(h => h.includes('merchant') || h.includes('description'))
  const locationIndex = headers.findIndex(h => h.includes('location') || h.includes('city'))
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(v => v.trim())
    return {
      date: values[dateIndex] || new Date().toISOString().split('T')[0],
      amount: Math.abs(parseFloat(values[amountIndex]?.replace(/[^0-9.-]/g, '') || '0')),
      merchant: values[merchantIndex] || 'Unknown',
      location: values[locationIndex] || 'Delhi',
    }
  })
}

// Process transactions with categorization and CO2 calculation
export function processTransactions(rawTransactions: Omit<Transaction, 'id' | 'category' | 'co2Emissions'>[]): Transaction[] {
  return rawTransactions.map((tx, index) => {
    const category = categorizeTransaction(tx.merchant)
    const co2Emissions = calculateCO2(tx.amount, category)
    
    return {
      ...tx,
      id: `tx-${index}-${Date.now()}`,
      category,
      co2Emissions,
    }
  })
}

// Calculate dashboard stats
export function calculateDashboardStats(transactions: Transaction[], user: User): DashboardStats {
  const totalCO2 = transactions.reduce((sum, tx) => sum + tx.co2Emissions, 0)
  
  // Category breakdown
  const categoryTotals: Record<TransactionCategory, number> = {
    fuel: 0,
    electricity: 0,
    flights: 0,
    shopping: 0,
    food: 0,
    transport: 0,
    other: 0,
  }
  
  transactions.forEach(tx => {
    categoryTotals[tx.category] += tx.co2Emissions
  })
  
  const categoryBreakdown = Object.entries(categoryTotals)
    .filter(([, co2]) => co2 > 0)
    .map(([category, co2]) => ({
      category: category as TransactionCategory,
      co2,
      percentage: totalCO2 > 0 ? (co2 / totalCO2) * 100 : 0,
    }))
    .sort((a, b) => b.co2 - a.co2)
  
  // Monthly trend
  const monthlyData: Record<string, number> = {}
  transactions.forEach(tx => {
    const month = tx.date.substring(0, 7) // YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + tx.co2Emissions
  })
  
  const monthlyTrend = Object.entries(monthlyData)
    .map(([month, co2]) => ({ month, co2 }))
    .sort((a, b) => a.month.localeCompare(b.month))
  
  // Green score calculation (higher is better - more savings potential realized)
  const potentialSavings = calculatePotentialSavings(transactions)
  const greenScore = Math.min(100, Math.max(0, 100 - (totalCO2 / INDIA_AVG_CO2_MONTHLY) * 50 + (potentialSavings / totalCO2) * 30))
  
  // Benchmark comparison
  const benchmarkComparison = INDIA_AVG_CO2_MONTHLY > 0 
    ? ((totalCO2 - INDIA_AVG_CO2_MONTHLY) / INDIA_AVG_CO2_MONTHLY) * 100 
    : 0
  
  // Paytm Gold earned (1g per 100kg saved)
  const co2Saved = Math.max(0, INDIA_AVG_CO2_MONTHLY - totalCO2)
  const paytmGoldEarned = co2Saved / 100
  
  return {
    totalCO2: Number(totalCO2.toFixed(2)),
    monthlyTrend,
    categoryBreakdown,
    greenScore: Number(greenScore.toFixed(1)),
    co2Saved: Number(co2Saved.toFixed(2)),
    benchmarkComparison: Number(benchmarkComparison.toFixed(1)),
    paytmGoldEarned: Number(paytmGoldEarned.toFixed(3)),
  }
}

// Calculate potential CO2 savings
function calculatePotentialSavings(transactions: Transaction[]): number {
  let savings = 0
  
  transactions.forEach(tx => {
    // Flights can be reduced by 70% with alternatives
    if (tx.category === 'flights') {
      savings += tx.co2Emissions * 0.7
    }
    // Fuel can be reduced by 50% with EV/public transport
    else if (tx.category === 'fuel') {
      savings += tx.co2Emissions * 0.5
    }
    // Electricity can be reduced by 30% with solar
    else if (tx.category === 'electricity') {
      savings += tx.co2Emissions * 0.3
    }
  })
  
  return savings
}

// Generate green suggestions based on transactions
export function generateSuggestions(transactions: Transaction[]): GreenSuggestion[] {
  const suggestions: GreenSuggestion[] = []
  
  // Group by category
  const categoryTotals: Record<TransactionCategory, { total: number; transactions: Transaction[] }> = {
    fuel: { total: 0, transactions: [] },
    electricity: { total: 0, transactions: [] },
    flights: { total: 0, transactions: [] },
    shopping: { total: 0, transactions: [] },
    food: { total: 0, transactions: [] },
    transport: { total: 0, transactions: [] },
    other: { total: 0, transactions: [] },
  }
  
  transactions.forEach(tx => {
    categoryTotals[tx.category].total += tx.amount
    categoryTotals[tx.category].transactions.push(tx)
  })
  
  // High-impact flight suggestion
  if (categoryTotals.flights.total > 5000) {
    suggestions.push({
      id: 'flight-alt',
      category: 'flights',
      title: 'Consider Train Travel',
      description: 'For trips under 500km, trains produce 70% less CO2 than flights. Use Paytm for IRCTC bookings.',
      co2Reduction: 70,
      savings: categoryTotals.flights.total * 0.3,
      promoCode: 'ECOTRAIN50',
    })
  }
  
  // Fuel suggestion with EV stations
  if (categoryTotals.fuel.total > 3000) {
    suggestions.push({
      id: 'ev-switch',
      category: 'fuel',
      title: 'Switch to Electric',
      description: 'Nearby EV charging stations can reduce your carbon footprint by 50%.',
      co2Reduction: 50,
      savings: categoryTotals.fuel.total * 0.4,
      evStation: {
        name: 'Tata Power EV Station',
        address: 'Connaught Place, Delhi',
        distance: 2.3,
        coordinates: { lat: 28.6315, lng: 77.2167 },
      },
    })
  }
  
  // Electricity suggestion
  if (categoryTotals.electricity.total > 2000) {
    suggestions.push({
      id: 'solar-switch',
      category: 'electricity',
      title: 'Go Solar',
      description: 'Install rooftop solar panels and reduce electricity bills by up to 40%.',
      co2Reduction: 30,
      savings: categoryTotals.electricity.total * 0.25,
      merchantName: 'Tata Solar',
      promoCode: 'ECOSOLAR20',
    })
  }
  
  // Shopping suggestion
  if (categoryTotals.shopping.total > 5000) {
    suggestions.push({
      id: 'eco-shopping',
      category: 'shopping',
      title: 'Shop Sustainable',
      description: 'Choose eco-friendly products and brands with sustainable packaging.',
      co2Reduction: 20,
      savings: categoryTotals.shopping.total * 0.1,
      merchantName: 'Amazon Climate Pledge',
      promoCode: 'ECOSHOP15',
    })
  }
  
  // Food suggestion
  if (categoryTotals.food.total > 3000) {
    suggestions.push({
      id: 'local-food',
      category: 'food',
      title: 'Eat Local',
      description: 'Choose restaurants that source locally. Reduce food miles and support local farmers.',
      co2Reduction: 25,
      savings: categoryTotals.food.total * 0.15,
      promoCode: 'ECOLOCAL10',
    })
  }
  
  // Transport suggestion
  if (categoryTotals.transport.total > 2000) {
    suggestions.push({
      id: 'public-transport',
      category: 'transport',
      title: 'Use Metro & Bus',
      description: 'Public transport produces 80% less emissions per passenger than private cars.',
      co2Reduction: 80,
      savings: categoryTotals.transport.total * 0.5,
      promoCode: 'ECOMETRO25',
    })
  }
  
  return suggestions
}

// Check and award badges
export function checkBadges(user: User, stats: DashboardStats): Badge[] {
  const newBadges: Badge[] = []
  const existingBadgeIds = user.badges.map(b => b.id)
  
  BADGES.forEach(badge => {
    if (existingBadgeIds.includes(badge.id)) return
    
    let earned = false
    switch (badge.type) {
      case 'co2_saved':
        earned = stats.co2Saved >= badge.requirement
        break
      case 'green_score':
        earned = stats.greenScore >= badge.requirement
        break
    }
    
    if (earned) {
      newBadges.push({
        ...badge,
        unlockedAt: new Date().toISOString(),
      })
    }
  })
  
  return newBadges
}

// Generate mock leaderboard
export function generateLeaderboard(currentUser: User): LeaderboardEntry[] {
  const mockUsers: Partial<User>[] = [
    { id: '1', name: 'Priya Sharma', greenScore: 92, totalCO2Saved: 450 },
    { id: '2', name: 'Rahul Verma', greenScore: 88, totalCO2Saved: 380 },
    { id: '3', name: 'Anita Patel', greenScore: 85, totalCO2Saved: 320 },
    { id: '4', name: 'Vikram Singh', greenScore: 82, totalCO2Saved: 290 },
    { id: '5', name: 'Neha Gupta', greenScore: 78, totalCO2Saved: 250 },
    { id: '6', name: 'Amit Kumar', greenScore: 75, totalCO2Saved: 220 },
    { id: '7', name: 'Sonia Reddy', greenScore: 72, totalCO2Saved: 190 },
    { id: '8', name: 'Karan Mehta', greenScore: 68, totalCO2Saved: 160 },
  ]
  
  // Add current user to list
  const allUsers = [
    ...mockUsers.map(u => ({
      ...u,
      id: u.id!,
      name: u.name!,
      email: `${u.name!.toLowerCase().replace(' ', '.')}@email.com`,
      avatar: undefined,
      joinedAt: new Date().toISOString(),
      greenScore: u.greenScore!,
      totalCO2Saved: u.totalCO2Saved!,
      paytmGoldBalance: u.totalCO2Saved! / 100,
      badges: [],
      friends: [],
    } as User)),
    currentUser,
  ]
  
  // Sort by green score
  allUsers.sort((a, b) => b.greenScore - a.greenScore)
  
  return allUsers.map((user, index) => ({
    rank: index + 1,
    user,
    greenScore: user.greenScore,
    co2Saved: user.totalCO2Saved,
    change: Math.floor(Math.random() * 5) - 2, // Random change -2 to +2
  }))
}

// Re-export constants for components
export { INDIA_AVG_CO2_MONTHLY } from './types'

// Format CO2 amount for display
export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} tons`
  }
  return `${kg.toFixed(2)} kg`
}

// Get category color
export function getCategoryColor(category: TransactionCategory): string {
  const colors: Record<TransactionCategory, string> = {
    fuel: 'hsl(var(--chart-4))',
    electricity: 'hsl(var(--chart-3))',
    flights: 'hsl(var(--chart-5))',
    shopping: 'hsl(var(--chart-2))',
    food: 'hsl(var(--chart-1))',
    transport: 'hsl(var(--chart-3))',
    other: 'hsl(var(--muted))',
  }
  return colors[category]
}

// Get category icon name
export function getCategoryIcon(category: TransactionCategory): string {
  const icons: Record<TransactionCategory, string> = {
    fuel: 'Fuel',
    electricity: 'Zap',
    flights: 'Plane',
    shopping: 'ShoppingBag',
    food: 'Utensils',
    transport: 'Car',
    other: 'MoreHorizontal',
  }
  return icons[category]
}

// Generate sample transactions for demo
export function generateSampleTransactions(): Transaction[] {
  const sampleData = [
    { date: '2024-01-15', amount: 2500, merchant: 'Reliance Petrol Pump', location: 'Delhi' },
    { date: '2024-01-18', amount: 8500, merchant: 'IndiGo Airlines', location: 'Delhi' },
    { date: '2024-01-20', amount: 3200, merchant: 'Amazon India', location: 'Delhi' },
    { date: '2024-01-22', amount: 1800, merchant: 'BSES Electricity', location: 'Delhi' },
    { date: '2024-01-25', amount: 450, merchant: 'Swiggy Food Delivery', location: 'Delhi' },
    { date: '2024-02-01', amount: 1200, merchant: 'Uber Cab', location: 'Delhi' },
    { date: '2024-02-05', amount: 3000, merchant: 'HP Petrol Station', location: 'Delhi' },
    { date: '2024-02-10', amount: 5600, merchant: 'Flipkart', location: 'Delhi' },
    { date: '2024-02-15', amount: 2200, merchant: 'Tata Power Bill', location: 'Delhi' },
    { date: '2024-02-18', amount: 680, merchant: 'Zomato', location: 'Delhi' },
    { date: '2024-02-22', amount: 12000, merchant: 'SpiceJet Flight', location: 'Delhi' },
    { date: '2024-02-28', amount: 950, merchant: 'Ola Auto', location: 'Delhi' },
    { date: '2024-03-01', amount: 2800, merchant: 'IOCL Fuel', location: 'Delhi' },
    { date: '2024-03-05', amount: 4200, merchant: 'Myntra Shopping', location: 'Delhi' },
    { date: '2024-03-10', amount: 1500, merchant: 'Metro Card Recharge', location: 'Delhi' },
    { date: '2024-03-15', amount: 890, merchant: 'McDonalds', location: 'Delhi' },
    { date: '2024-03-20', amount: 2100, merchant: 'Adani Electricity', location: 'Delhi' },
    { date: '2024-03-25', amount: 7500, merchant: 'Air India', location: 'Delhi' },
  ]
  
  return processTransactions(sampleData)
}
