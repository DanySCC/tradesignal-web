import { NextRequest, NextResponse } from "next/server";
import { nowPayments } from "@/lib/nowpayments";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify IPN signature (security)
    const signature = request.headers.get("x-nowpayments-sig");
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

    if (ipnSecret && signature) {
      const calculatedSignature = crypto
        .createHmac("sha512", ipnSecret)
        .update(JSON.stringify(body))
        .digest("hex");

      if (signature !== calculatedSignature) {
        console.error("Invalid NOWPayments signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }
    }

    console.log("NOWPayments IPN received:", body);

    const {
      payment_id,
      payment_status,
      order_id,
      pay_amount,
      pay_currency,
      price_amount,
      price_currency,
    } = body;

    // Extract userId from order_id (format: sub_{userId}_{timestamp})
    const userIdMatch = order_id.match(/sub_([a-f0-9]+)_/);
    if (!userIdMatch) {
      console.error("Invalid order_id format:", order_id);
      return NextResponse.json({ received: true });
    }

    const userId = userIdMatch[1];
    const client = await clientPromise;
    const db = client.db("tradesignal");

    switch (payment_status) {
      case "finished": {
        // Payment completed successfully
        console.log(`Payment completed for user ${userId}`);

        // Upgrade user to PRO
        await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              tier: "PRO",
              cryptoPaymentId: payment_id,
              subscriptionStatus: "active",
              subscriptionMethod: "crypto",
              creditsRemaining: -1, // Unlimited
              lastPaymentDate: new Date(),
              lastPaymentAmount: price_amount,
              lastPaymentCurrency: price_currency,
              lastPaymentCrypto: pay_currency,
              lastPaymentCryptoAmount: pay_amount,
              updatedAt: new Date(),
            },
          }
        );

        console.log(`User ${userId} upgraded to PRO via crypto`);
        break;
      }

      case "confirmed": {
        // Payment confirmed but not yet finished (crypto tx confirmed on blockchain)
        console.log(`Payment confirmed for user ${userId}, waiting for finalization`);
        break;
      }

      case "sending": {
        // Payment is being processed
        console.log(`Payment sending for user ${userId}`);
        break;
      }

      case "partially_paid": {
        // User paid less than required amount
        console.log(`Partial payment for user ${userId}`);
        // Could send email notification
        break;
      }

      case "failed":
      case "expired": {
        // Payment failed or expired
        console.log(`Payment ${payment_status} for user ${userId}`);
        
        await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              lastPaymentStatus: payment_status,
              updatedAt: new Date(),
            },
          }
        );
        break;
      }

      case "refunded": {
        // Payment was refunded - downgrade user
        console.log(`Payment refunded for user ${userId}`);
        
        await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              tier: "FREE",
              creditsRemaining: 5,
              subscriptionStatus: "refunded",
              updatedAt: new Date(),
            },
          }
        );
        break;
      }

      default:
        console.log(`Unhandled payment status: ${payment_status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("NOWPayments webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
