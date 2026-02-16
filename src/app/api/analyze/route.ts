import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Check and consume usage credit directly from DB (avoid SSL issue)
    const client = await clientPromise;
    const db = client.db("tradesignal");
    
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check usage limits
    if (user.tier !== "PRO") {
      // Reset counter if new month
      const now = new Date();
      const resetDate = new Date(user.analysesResetDate);
      
      if (now.getMonth() !== resetDate.getMonth() || 
          now.getFullYear() !== resetDate.getFullYear()) {
        // New month - reset counter
        await db.collection("users").updateOne(
          { _id: user._id },
          {
            $set: {
              monthlyAnalyses: 0,
              analysesResetDate: new Date(now.getFullYear(), now.getMonth(), 1),
            },
          }
        );
        user.monthlyAnalyses = 0;
      }

      // Check if limit reached
      if (user.monthlyAnalyses >= 5) {
        return NextResponse.json(
          { 
            error: "Monthly limit reached. Upgrade to PRO for unlimited analyses.",
            tier: "FREE",
            limit: 5,
            used: user.monthlyAnalyses,
          },
          { status: 403 }
        );
      }

      // Increment usage
      await db.collection("users").updateOne(
        { _id: user._id },
        { $inc: { monthlyAnalyses: 1 } }
      );
    }

    const formData = await request.formData();
    const file = formData.get("chart") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image." },
        { status: 400 }
      );
    }

    // For now, return a mock analysis
    // TODO: Integrate with Claude API for real AI analysis
    const mockAnalysis = {
      technical: {
        bias: "LONG",
        confidence: 78,
        entry: "43250",
        stopLoss: "42800",
        takeProfit: "45500",
      },
      smart: {
        recommendation: "LONG",
        override: false,
        liquidationRisk: "Low",
        fundingRate: "0.01%",
        longShortRatio: "52/48",
      },
      reasoning: "Strong bullish momentum detected on the 4H timeframe. Price is holding above key support at $42,800. RSI showing strength at 62, not yet overbought. MACD showing bullish crossover. Volume increasing on upward moves. Recommended entry at current levels with tight stop loss below support.",
      symbol: "BTC/USDT",
      timestamp: new Date().toISOString(),
      usage: {
        tier: user.tier,
        creditsRemaining: user.tier === "PRO" ? "Unlimited" : (5 - (user.monthlyAnalyses || 0)),
      },
    };

    // Return mock analysis
    return NextResponse.json(mockAnalysis);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "TradeSignal Web API",
    timestamp: new Date().toISOString(),
  });
}
