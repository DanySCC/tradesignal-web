# NOWPayments Integration Setup Guide

## What is NOWPayments?

NOWPayments is a crypto payment gateway that supports **150+ cryptocurrencies**. It's what **CoinGlass** uses for their $299/month subscriptions.

**Why NOWPayments:**
- ✅ 150+ cryptocurrencies (BTC, ETH, USDT, SOL, XRP, DOGE, and 144 more)
- ✅ **0.5% fee** (vs Stripe's 2.9% - you keep $2 more per $79 payment!)
- ✅ Non-custodial (crypto goes directly to your wallet)
- ✅ No KYC required (for most amounts)
- ✅ Subscriptions supported
- ✅ White-label solution

---

## Step 1: Create NOWPayments Account

1. Go to https://nowpayments.io
2. Click **"Sign Up"**
3. Enter email + password
4. Verify email
5. Complete account setup

**Free to sign up!** No monthly fees.

---

## Step 2: Get API Key

1. Login to https://account.nowpayments.io
2. Go to **"Settings"** → **"API Keys"**
3. Click **"Generate API Key"**
4. Copy the API key (starts with `YOUR_API_KEY...`)
5. Update `.env.local`:
   ```env
   NOWPAYMENTS_API_KEY=YOUR_API_KEY_HERE
   ```

---

## Step 3: Set Up IPN (Webhook)

IPN = Instant Payment Notification (like Stripe webhooks)

1. In NOWPayments dashboard → **"Settings"** → **"IPN"**
2. **IPN Callback URL:** `https://yourdomain.com/api/webhooks/nowpayments`
   - For local testing: Use ngrok (see below)
3. Click **"Generate IPN Secret"**
4. Copy the IPN secret
5. Update `.env.local`:
   ```env
   NOWPAYMENTS_IPN_SECRET=YOUR_IPN_SECRET_HERE
   ```

---

## Step 4: Configure Wallet Address

Where should crypto payments go?

1. In NOWPayments dashboard → **"Settings"** → **"Wallet Settings"**
2. Add wallet addresses for cryptocurrencies you want to accept:
   - **Bitcoin (BTC):** Your BTC wallet address
   - **Ethereum (ETH):** Your ETH wallet address
   - **USDT (TRC20):** Your USDT (Tron) address
   - **USDC (ERC20):** Your USDC (Ethereum) address
   - etc.

**Recommendation:** Start with these top 5:
1. **BTC** - Most popular
2. **ETH** - Second most popular
3. **USDT** - Stablecoin (no volatility)
4. **USDC** - Stablecoin (no volatility)
5. **SOL** - Popular with traders

**Pro tip:** Use stablecoins (USDT, USDC) if you want to avoid crypto volatility!

---

## Step 5: Test the Integration

### Local Testing with ngrok:

1. Install ngrok: https://ngrok.com/download
2. Start dev server:
   ```bash
   npm run dev
   ```
3. In another terminal, expose local server:
   ```bash
   ngrok http 3000
   ```
4. Copy ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Update NOWPayments IPN URL to:
   ```
   https://abc123.ngrok.io/api/webhooks/nowpayments
   ```

### Test Payment:

1. Go to http://localhost:3000/pricing
2. Click **"Pay with Crypto"**
3. Select cryptocurrency (e.g., BTC)
4. NOWPayments invoice page opens
5. **Sandbox mode:** Use test wallet to send crypto
6. Wait for confirmation
7. Webhook fires → User upgraded to PRO
8. Redirected to success page

---

## Step 6: Production Deployment

1. Deploy app to production (Vercel, Netlify, etc.)
2. Get production domain (e.g., `tradesignal.ai`)
3. Update NOWPayments IPN URL:
   ```
   https://tradesignal.ai/api/webhooks/nowpayments
   ```
4. Update `.env` on production with real API keys
5. Test with small amount first!

---

## Supported Cryptocurrencies (Top 20)

| Crypto | Symbol | Popular? | Stablecoin? |
|--------|--------|----------|-------------|
| Bitcoin | BTC | ⭐⭐⭐⭐⭐ | ❌ |
| Ethereum | ETH | ⭐⭐⭐⭐⭐ | ❌ |
| Tether | USDT | ⭐⭐⭐⭐⭐ | ✅ |
| USD Coin | USDC | ⭐⭐⭐⭐ | ✅ |
| Binance Coin | BNB | ⭐⭐⭐⭐ | ❌ |
| Solana | SOL | ⭐⭐⭐⭐ | ❌ |
| XRP | XRP | ⭐⭐⭐ | ❌ |
| Cardano | ADA | ⭐⭐⭐ | ❌ |
| Dogecoin | DOGE | ⭐⭐⭐ | ❌ |
| Polygon | MATIC | ⭐⭐⭐ | ❌ |
| Litecoin | LTC | ⭐⭐⭐ | ❌ |
| Tron | TRX | ⭐⭐ | ❌ |
| Avalanche | AVAX | ⭐⭐ | ❌ |
| Polkadot | DOT | ⭐⭐ | ❌ |
| Chainlink | LINK | ⭐⭐ | ❌ |

**150+ total cryptocurrencies available!**

---

## Payment Flow

### User Journey:

1. **Pricing page** → Click "Pay with Crypto (150+ coins)"
2. **Crypto selector** appears → Choose cryptocurrency (e.g., USDT)
3. **NOWPayments invoice** page opens
4. **Payment details** shown:
   - Amount: $79 USD = 79.25 USDT (example)
   - Wallet address to send to
   - QR code
   - Timer (usually 30 minutes to pay)
5. **User sends crypto** from their wallet
6. **Blockchain confirms** transaction
7. **Webhook fires** → User upgraded to PRO
8. **Redirect** to success page

**Time:** Usually 2-10 minutes (depending on blockchain)

---

## Fees Breakdown

| Item | NOWPayments | Stripe (for comparison) |
|------|-------------|-------------------------|
| Transaction Fee | 0.5% | 2.9% + $0.30 |
| Monthly Fee | $0 | $0 |
| Setup Fee | $0 | $0 |
| Payout | Instant | 2-7 days |

**For $79 payment:**
- NOWPayments: You receive **$78.60** (0.5% fee)
- Stripe: You receive **$76.41** (2.9% + $0.30)
- **You save $2.19 per payment!**

---

## Advanced Features

### Auto-Convert to Stablecoins:

1. In NOWPayments dashboard → **"Settings"** → **"Auto-conversion"**
2. Enable auto-conversion
3. Select: Convert all to **USDT** or **USDC**
4. Result: Users pay in any crypto, you receive stablecoin!

**Why:** No crypto volatility risk. $79 paid = $79 received (in stablecoin).

### Minimum Payment Amount:

Set minimum to $79 (subscription price) to avoid partial payments.

### Custom Branding:

1. Add your logo
2. Customize colors
3. White-label the payment page

---

## Security Best Practices

1. ✅ **Always verify IPN signature** (we do this in webhook handler)
2. ✅ **Use separate wallet** for business (not personal)
3. ✅ **Monitor webhook logs** (check for failed payments)
4. ✅ **Set up alerts** for large payments
5. ✅ **Use stablecoins** if you want to avoid volatility

---

## Troubleshooting

### "Payment pending forever"

**Cause:** Blockchain congestion or low gas fee

**Solution:**
- Bitcoin: Wait 10-60 minutes
- Ethereum: Wait 2-15 minutes
- Stablecoins: Usually fast (2-5 minutes)

### "Webhook not firing"

**Cause:** IPN URL not configured or unreachable

**Solution:**
1. Check NOWPayments dashboard → IPN settings
2. Verify URL is correct
3. Test webhook: `curl -X POST https://yourdomain.com/api/webhooks/nowpayments`
4. Check server logs

### "User paid but not upgraded"

**Cause:** Webhook signature verification failed or database error

**Solution:**
1. Check server logs for errors
2. Verify IPN secret in `.env`
3. Manual upgrade: Update user tier in MongoDB

---

## Monitoring & Analytics

1. **NOWPayments Dashboard:**
   - See all payments
   - Export reports
   - Track revenue

2. **MongoDB:**
   - Query users with `subscriptionMethod: "crypto"`
   - Track crypto revenue vs card revenue

3. **Webhook Logs:**
   - Monitor IPN events
   - Debug failed payments

---

## Subscription Renewals

**Important:** NOWPayments doesn't handle automatic recurring payments (like Stripe does).

**Options:**

1. **Manual renewal:**
   - User pays again each month
   - Send reminder email before expiry

2. **Hybrid approach:**
   - First month: Crypto payment (NOWPayments)
   - Recurring: Switch to Stripe for auto-renewal
   - (Or keep crypto users on monthly manual payments)

**Recommendation:** Crypto payments = one-time or manual monthly. Stripe = automatic recurring.

---

## Cost Savings Calculator

If 10% of your users pay with crypto:

| Users | Monthly Revenue | NOWPayments Fees | Stripe Fees | Savings |
|-------|-----------------|------------------|-------------|---------|
| 10 | $790 | $3.95 | $22.89 | **$18.94/mo** |
| 50 | $3,950 | $19.75 | $114.49 | **$94.74/mo** |
| 100 | $7,900 | $39.50 | $228.99 | **$189.49/mo** |

**Annual savings (100 users):** $2,273.88!

---

## Next Steps

### This Week:
1. ✅ Sign up at https://nowpayments.io
2. ✅ Get API key
3. ✅ Set up IPN callback
4. ✅ Add wallet addresses (start with BTC, ETH, USDT)
5. ✅ Test with ngrok + small amount

### Production:
6. Update IPN URL to production domain
7. Test with real payment (small amount)
8. Monitor for 1 week
9. Promote crypto option to users!

---

## Support

- **NOWPayments Docs:** https://documenter.getpostman.com/view/7907941/2s93JRVFUW
- **Support:** support@nowpayments.io
- **Live Chat:** Available in dashboard

---

## Summary

**TL;DR:**
1. Sign up at nowpayments.io (free)
2. Get API key + IPN secret
3. Add wallet addresses
4. Test locally with ngrok
5. Deploy to production
6. Users can pay with 150+ cryptocurrencies
7. You keep 99.5% (vs 97.1% with Stripe)

**Status:** ✅ Code ready! Just need your NOWPayments account!
