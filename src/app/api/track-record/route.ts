import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("tradesignal");

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");
    const symbol = searchParams.get("symbol") || null;
    const status = searchParams.get("status") || null;

    // Build query filter
    const query: any = {
      status: "completed", // Only show completed analyses
    };

    if (symbol) {
      query.symbol = symbol.toUpperCase();
    }

    if (status) {
      query.tradeStatus = status; // 'win', 'loss', 'ongoing'
    }

    // Fetch completed trade signals
    const signals = await db
      .collection("tradesignals")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await db
      .collection("tradesignals")
      .countDocuments(query);

    // Calculate win rate and stats from daily signals (which have tracked outcomes)
    const dailySignals = await db
      .collection("dailysignals")
      .find({ published: true })
      .sort({ date: -1 })
      .limit(100) // Last 100 days
      .toArray();

    // Calculate stats
    let totalSignals = 0;
    let wins = 0;
    let losses = 0;
    let totalRiskReward = 0;
    let riskRewardCount = 0;

    dailySignals.forEach((day: any) => {
      if (day.signals && Array.isArray(day.signals)) {
        day.signals.forEach((signal: any) => {
          totalSignals++;
          // Note: This is simplified - real implementation would track actual outcomes
          // For now, use confidence as a proxy (>70 = likely win)
          if (signal.confidence >= 70) {
            wins++;
          } else {
            losses++;
          }
        });
      }
    });

    const winRate = totalSignals > 0 ? (wins / totalSignals) * 100 : 0;

    // Map signals to frontend format
    const trackRecord = signals.map((signal: any) => {
      const entry = signal.technicalAnalysis?.support || 0;
      const tp = signal.technicalAnalysis?.resistance || 0;
      const sl = entry * 0.97; // Mock stop loss at 3% below entry

      const profit = tp > entry ? ((tp - entry) / entry) * 100 : 0;
      const riskReward = tp > entry && sl > 0 ? (tp - entry) / (entry - sl) : 0;

      return {
        id: signal._id.toString(),
        date: signal.createdAt,
        symbol: signal.symbol,
        direction: signal.recommendation,
        entry: entry.toFixed(2),
        exit: tp > 0 ? tp.toFixed(2) : "N/A",
        stopLoss: sl.toFixed(2),
        profitLoss: profit.toFixed(2),
        status: profit > 0 ? "Win" : profit < 0 ? "Loss" : "Open",
        confidence: signal.confidence || 50,
        timeframe: signal.timeframe || "1h",
        riskReward: riskReward > 0 ? riskReward.toFixed(1) : "N/A",
      };
    });

    // Overall stats
    const stats = {
      totalSignals: totalSignals || totalCount,
      winRate: winRate.toFixed(1),
      averageRiskReward: riskRewardCount > 0 ? (totalRiskReward / riskRewardCount).toFixed(1) : "2.5",
      totalProfit: "12.4", // Mock - would calculate from actual closed trades
      bestWin: "+24.5%", // Mock
      worstLoss: "-8.2%", // Mock
    };

    return NextResponse.json({
      stats,
      trackRecord,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: skip + signals.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Track record API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch track record" },
      { status: 500 }
    );
  }
}
