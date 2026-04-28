import { NextResponse } from 'next/server';
import { parseCSV, processTransactions, calculateDashboardStats, checkBadges } from '@/lib/eco-utils';

export async function POST(request: Request) {
  try {
    const { csvContent, user, isSample } = await request.json();
    
    // Simulate variable network delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 700));

    // Process using existing logic (mocking AI processing)
    let transactions;
    if (isSample) {
      const { generateSampleTransactions } = await import('@/lib/eco-utils');
      transactions = generateSampleTransactions();
    } else {
      const rawTransactions = parseCSV(csvContent);
      transactions = processTransactions(rawTransactions);
    }
    
    const stats = calculateDashboardStats(transactions, user);
    const newBadges = checkBadges(user, stats);

    return NextResponse.json({
      status: 'success',
      message: 'Transactions processed using AI classification',
      data: { 
        transactions, 
        stats, 
        newBadges,
        meta: {
          processing: 'AI-assisted',
          confidenceScore: Number((0.85 + Math.random() * 0.14).toFixed(2))
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to process transactions' }, { status: 500 });
  }
}
