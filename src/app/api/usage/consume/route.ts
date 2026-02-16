import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    // PRO users have unlimited analyses
    if (user.tier === "PRO") {
      return NextResponse.json({
        success: true,
        tier: "PRO",
        creditsRemaining: -1, // Unlimited
      });
    }

    // FREE users: check and consume credit
    const creditsRemaining = user.creditsRemaining || 0;

    if (creditsRemaining <= 0) {
      return NextResponse.json(
        { error: "No credits remaining. Upgrade to PRO for unlimited analyses." },
        { status: 403 }
      );
    }

    // Decrement credit
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $inc: { creditsRemaining: -1 },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      tier: "FREE",
      creditsRemaining: creditsRemaining - 1,
    });
  } catch (error) {
    console.error("Usage consume error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
