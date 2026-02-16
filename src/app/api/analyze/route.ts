import { NextRequest, NextResponse } from "next/server";

// Backend API URL (TradeSignal bot)
const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Forward to TradeSignal backend
    const backendFormData = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    backendFormData.append("chart", blob, file.name);

    // TODO: Add authentication/user context when auth is implemented
    // backendFormData.append("userId", userId);
    // backendFormData.append("tier", "FREE"); // or "PRO"

    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Backend error:", error);
      return NextResponse.json(
        { error: "Analysis failed" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Return analysis result
    return NextResponse.json({
      technical: {
        bias: result.technical?.bias || "NEUTRAL",
        confidence: result.technical?.confidence || 0,
        entry: result.technical?.entry || "N/A",
        stopLoss: result.technical?.stopLoss || "N/A",
        takeProfit: result.technical?.takeProfit || "N/A",
      },
      smart: {
        recommendation: result.smart?.recommendation || "NEUTRAL",
        override: result.smart?.override || false,
        liquidationRisk: result.smart?.liquidationRisk || "Unknown",
        fundingRate: result.smart?.fundingRate || "N/A",
        longShortRatio: result.smart?.longShortRatio || "N/A",
      },
      reasoning: result.reasoning || "No reasoning provided",
      symbol: result.symbol || "Unknown",
      timestamp: new Date().toISOString(),
    });
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
