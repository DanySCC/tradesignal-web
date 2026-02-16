import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { nowPayments, NOWPAYMENTS_CONFIG } from "@/lib/nowpayments";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { cryptocurrency } = await request.json();

    if (!cryptocurrency) {
      return NextResponse.json(
        { error: "Cryptocurrency is required" },
        { status: 400 }
      );
    }

    // Create NOWPayments invoice for $79 subscription
    const invoice = await nowPayments.createInvoice({
      price_amount: 79,
      price_currency: "USD",
      order_id: `sub_${session.user.id}_${Date.now()}`,
      order_description: "TradeSignal AI PRO Monthly Subscription",
      ipn_callback_url: NOWPAYMENTS_CONFIG.ipnCallbackUrl,
      success_url: NOWPAYMENTS_CONFIG.successUrl,
      cancel_url: NOWPAYMENTS_CONFIG.cancelUrl,
    });

    return NextResponse.json({
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoice_url,
      payAddress: invoice.pay_address,
      payAmount: invoice.pay_amount,
      payCurrency: invoice.pay_currency,
    });
  } catch (error: any) {
    console.error("Crypto checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create crypto payment" },
      { status: 500 }
    );
  }
}

// Get payment status or supported cryptocurrencies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('payment_id');

    // If payment_id is provided, return payment status
    if (paymentId) {
      const session = await getServerSession(authOptions);
      
      if (!session || !session.user) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const status = await nowPayments.getPaymentStatus(paymentId);
      return NextResponse.json(status);
    }

    // Otherwise, return available currencies
    const currencies = await nowPayments.getAvailableCurrencies();
    
    // Filter to popular ones for better UX
    const popularCryptos = [
      "btc", "eth", "usdt", "usdc", "bnb", "sol", "ada", "xrp",
      "ltc", "doge", "matic", "trx", "dot", "avax", "link", "atom"
    ];

    const filtered = currencies.currencies.filter((c: string) =>
      popularCryptos.includes(c.toLowerCase())
    );

    return NextResponse.json({
      currencies: filtered,
      allCurrencies: currencies.currencies.length,
    });
  } catch (error: any) {
    console.error("Get currencies/status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
