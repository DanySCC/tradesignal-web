import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const STRIPE_CONFIG = {
  proPriceId: process.env.STRIPE_PRO_PRICE_ID || "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  currency: "usd",
  successUrl: `${process.env.NEXTAUTH_URL}/payment/success`,
  cancelUrl: `${process.env.NEXTAUTH_URL}/pricing`,
};
