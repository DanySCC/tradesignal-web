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
        { error: "Daily picks are only available for PRO users. Upgrade to PRO to access 3 curated signals every day." },
        { status: 403 }
      );
    }

    // Get today's published daily signal
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let dailySignal = await db.collection("dailysignals").findOne({
      date: today,
      published: true,
    });

    // If no signal for today, get the most recent published signal
    if (!dailySignal) {
      const recentSignals = await db
        .collection("dailysignals")
        .find({ published: true })
        .sort({ date: -1 })
        .limit(1)
        .toArray();

      if (!recentSignals || recentSignals.length === 0) {
        return NextResponse.json({
          picks: [],
          date: today.toISOString().split("T")[0],
          message: "No daily picks available yet. Our AI is analyzing the markets. Check back soon!",
        });
      }

      dailySignal = recentSignals[0];
    }

    // Increment view count
    await db.collection("dailysignals").updateOne(
      { _id: dailySignal._id },
      { $inc: { viewCount: 1 } }
    );

    // Map signals to frontend format
    const picks = dailySignal.signals.map((signal: any) => ({
      id: signal._id?.toString() || Math.random().toString(36),
      symbol: signal.symbol,
      timeframe: signal.timeframe,
      direction: signal.recommendation,
      confidence: signal.confidence,
      technicalAnalysis: signal.technicalAnalysis,
      coinglassData: signal.coinglassData,
      timestamp: dailySignal.date,
    }));

    return NextResponse.json({
      picks,
      date: new Date(dailySignal.date).toISOString().split("T")[0],
      publishedAt: dailySignal.publishedAt,
      viewCount: dailySignal.viewCount || 0,
      isToday: dailySignal.date.getTime() === today.getTime(),
    });
  } catch (error) {
    console.error("Daily picks API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily picks" },
      { status: 500 }
    );
  }
}
