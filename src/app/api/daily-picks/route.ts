import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("tradesignal");

    // Check user tier
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Daily picks are PRO-only feature
    if (user.tier !== "PRO") {
      return NextResponse.json(
        { error: "Daily picks are only available for PRO users" },
        { status: 403 }
      );
    }

    // Fetch today's daily picks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailySignals = await db
      .collection("dailysignals")
      .find({
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (!dailySignals || dailySignals.length === 0) {
      return NextResponse.json({
        picks: [],
        message: "No daily picks available yet",
      });
    }

    const latestSignal = dailySignals[0];
    const picks = latestSignal.signals.map((signal: any, index: number) => ({
      id: `${latestSignal._id}-${index}`,
      symbol: signal.symbol,
      timeframe: signal.timeframe || "1h",
      recommendation: signal.recommendation,
      confidence: signal.confidence,
      entry: signal.entry || "Market",
      stopLoss: signal.stopLoss || "N/A",
      takeProfit: signal.takeProfit || "N/A",
      reasoning: signal.reasoning || "Technical analysis + SMART engine validation",
      timestamp: latestSignal.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({
      picks,
      date: latestSignal.date,
      generatedAt: latestSignal.createdAt,
    });
  } catch (error) {
    console.error("Daily picks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
