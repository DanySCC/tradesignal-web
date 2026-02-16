import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("tradesignal");

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (!userId) {
          console.error("No userId found in session metadata");
          break;
        }

        // Upgrade user to PRO
        await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              tier: "PRO",
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: "active",
              creditsRemaining: -1, // Unlimited
              updatedAt: new Date(),
            },
          }
        );

        console.log(`User ${userId} upgraded to PRO`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Update subscription status
        await db.collection("users").updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              subscriptionStatus: subscription.status,
              updatedAt: new Date(),
            },
          }
        );

        console.log(`Subscription updated for customer ${customerId}: ${subscription.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Downgrade to FREE tier
        await db.collection("users").updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              tier: "FREE",
              creditsRemaining: 5,
              subscriptionStatus: "canceled",
              updatedAt: new Date(),
            },
          }
        );

        console.log(`User downgraded to FREE (subscription canceled)`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
