# Stripe Payment Integration Setup

## Prerequisites
1. Stripe account (https://stripe.com)
2. Test mode API keys (for development)
3. Production API keys (for live deployment)

## Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** and **Secret key**
3. Update `.env.local`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

## Step 2: Create PRO Subscription Product

1. Go to https://dashboard.stripe.com/products
2. Click **"Add product"**
3. Fill in:
   - **Name:** TradeSignal AI PRO
   - **Description:** Unlimited chart analyses + daily picks + SMART engine
   - **Pricing:** Recurring
   - **Price:** $79.00 USD
   - **Billing period:** Monthly
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_...`)
6. Update `.env.local`:
   ```env
   STRIPE_PRO_PRICE_ID=price_...
   ```

## Step 3: Set Up Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://yourdomain.com/api/webhooks/stripe`
   - For local testing: Use Stripe CLI (see below)
4. **Events to listen to:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Click **"Reveal"** next to "Signing secret"
7. Copy the webhook secret (starts with `whsec_...`)
8. Update `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Step 4: Local Testing with Stripe CLI (Optional)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe:
   ```bash
   stripe login
   ```
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret and update `.env.local`
5. Test payment:
   ```bash
   stripe trigger checkout.session.completed
   ```

## Step 5: Test the Integration

1. Start dev server:
   ```bash
   npm run dev
   ```
2. Go to http://localhost:3000/pricing
3. Click **"Start PRO Trial"**
4. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code
5. Complete checkout
6. Verify user upgraded to PRO in MongoDB

## Production Deployment

1. Switch to **Live mode** in Stripe Dashboard
2. Get production API keys
3. Create production product + price
4. Update webhook endpoint URL to production domain
5. Update environment variables in production:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_PRO_PRICE_ID=price_live_...
   STRIPE_WEBHOOK_SECRET=whsec_live_...
   ```

## Webhook Events Handled

- **checkout.session.completed**: User successfully paid → Upgrade to PRO
- **customer.subscription.updated**: Subscription status changed
- **customer.subscription.deleted**: User canceled → Downgrade to FREE

## Security Notes

- ⚠️ **Never commit real API keys to git**
- ✅ Always use environment variables
- ✅ Verify webhook signatures (already implemented)
- ✅ Use HTTPS in production (required by Stripe)

## Troubleshooting

**"No stripe-signature header"**
- Webhook secret not configured
- Make sure Stripe CLI is forwarding events

**"Webhook signature verification failed"**
- Wrong webhook secret
- Check `.env.local` and Stripe dashboard match

**User not upgrading after payment**
- Check webhook logs in Stripe dashboard
- Verify MongoDB connection
- Check server logs for errors

## Support

- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
