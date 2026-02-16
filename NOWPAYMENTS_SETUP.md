# NOWPayments Setup Guide

This guide walks you through setting up NOWPayments cryptocurrency payment processing for TradeSignal AI.

---

## Why NOWPayments?

**Lower Fees**: 0.5% vs Stripe's 2.9% + $0.30  
**More Options**: 150+ cryptocurrencies vs Stripe's limited crypto support  
**Crypto-Native**: Direct crypto payments without conversion  

**Cost Comparison (per $79 transaction)**:
- Stripe: You receive **$76.41** (2.9% + $0.30 = $2.59 fee)
- NOWPayments: You receive **$78.60** (0.5% = $0.40 fee)
- **Savings**: $2.19 per transaction (85% lower fees!)

---

## Step 1: Create NOWPayments Account

1. Go to https://nowpayments.io
2. Click **"Sign Up"** (top right)
3. Fill in:
   - Email address
   - Strong password
   - Agree to Terms of Service
4. Click **"Create Account"**
5. **Verify your email** (check inbox/spam)
6. **Complete KYC** (may be required for higher limits):
   - Personal info
   - Business details (if applicable)
   - Upload ID documents

---

## Step 2: Get API Key

1. Log in to NOWPayments dashboard
2. Navigate to **Settings** → **API Keys**
3. Click **"Generate New API Key"**
4. **Copy the API key** (starts with something like `ABC123...`)
5. **Store it securely** — you won't see it again!

---

## Step 3: Configure IPN (Instant Payment Notification)

IPN is how NOWPayments notifies your server when a payment is completed.

### 3.1 Get IPN Secret

1. In NOWPayments dashboard, go to **Settings** → **IPN**
2. Click **"Generate IPN Secret"**
3. **Copy the IPN secret** (long string like `abc123def456...`)
4. Store it securely

### 3.2 Set IPN Callback URL

1. In the same IPN settings page, enter your callback URL:
   ```
   https://yourdomain.com/api/webhooks/nowpayments
   ```
   
   **For local testing**:
   ```
   http://localhost:3000/api/webhooks/nowpayments
   ```
   
   ⚠️ **Note**: NOWPayments requires HTTPS in production. Use ngrok for local testing:
   ```bash
   ngrok http 3000
   # Use the https URL provided: https://abc123.ngrok.io/api/webhooks/nowpayments
   ```

2. Click **"Save"**

---

## Step 4: Update Environment Variables

Add the following to your `.env.local` file:

```bash
# NOWPayments Configuration
NOWPAYMENTS_API_KEY=your_api_key_here
NOWPAYMENTS_IPN_SECRET=your_ipn_secret_here

# Your app URL (for IPN callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your domain in production
NEXTAUTH_URL=http://localhost:3000         # Same as above
```

**Replace**:
- `your_api_key_here` → Your actual API key from Step 2
- `your_ipn_secret_here` → Your actual IPN secret from Step 3
- `http://localhost:3000` → Your production domain (e.g., `https://tradesignalai.com`)

---

## Step 5: Test Crypto Payments

### 5.1 Use Sandbox Mode (Optional)

NOWPayments offers sandbox mode for testing without real crypto:

1. In dashboard, go to **Settings** → **Sandbox**
2. Enable **"Sandbox Mode"**
3. Get sandbox API key (different from production)
4. Update `.env.local`:
   ```bash
   NOWPAYMENTS_API_KEY=sandbox_key_here
   NOWPAYMENTS_API_URL=https://api-sandbox.nowpayments.io/v1
   ```

### 5.2 Test with Real Crypto (Small Amount)

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/upgrade`

3. Click **"Pay with Crypto"**

4. Select a cryptocurrency (e.g., USDT TRC20 for low fees)

5. Send a **small test amount** (e.g., $1 worth) to the provided address

6. Wait for confirmation (usually 1-10 minutes depending on blockchain)

7. Check your server logs for IPN webhook calls

---

## Step 6: Verify IPN Webhook

When a payment is successful, NOWPayments sends an IPN to your server.

### Check Webhook Logs

Your webhook handler logs events at `/api/webhooks/nowpayments`:

```bash
# Terminal output when payment succeeds:
[NOWPayments IPN] Payment finished for order: sub_123_1234567890
[NOWPayments IPN] User upgraded: user@example.com
```

### Manual IPN Testing

Use curl to simulate an IPN (replace with real data):

```bash
curl -X POST http://localhost:3000/api/webhooks/nowpayments \
  -H "Content-Type: application/json" \
  -H "x-nowpayments-sig: SIGNATURE_HERE" \
  -d '{
    "payment_id": "test_123",
    "payment_status": "finished",
    "order_id": "sub_user123_1234567890",
    "pay_address": "TRX_ADDRESS_HERE",
    "pay_amount": 79,
    "pay_currency": "usdttrc20",
    "price_amount": 79,
    "price_currency": "usd"
  }'
```

---

## Step 7: Production Deployment

### 7.1 Update Environment Variables

When deploying to production (Vercel, Netlify, etc.), update these:

```bash
NOWPAYMENTS_API_KEY=production_api_key_here
NOWPAYMENTS_IPN_SECRET=production_ipn_secret_here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

### 7.2 Update IPN URL in NOWPayments Dashboard

1. Go to NOWPayments dashboard → **Settings** → **IPN**
2. Update callback URL to:
   ```
   https://yourdomain.com/api/webhooks/nowpayments
   ```
3. Save

### 7.3 Enable Notifications (Optional)

1. In NOWPayments dashboard, go to **Settings** → **Notifications**
2. Enable email notifications for:
   - Successful payments
   - Failed payments
   - Refunds

---

## Supported Cryptocurrencies

The checkout UI currently shows these popular coins:

- Bitcoin (BTC)
- Ethereum (ETH)
- Tether USDT (TRC20) — **Recommended** (low fees, stable)
- Tether USDT (ERC20)
- Litecoin (LTC)
- Tron (TRX) — **Recommended** (very low fees)
- BNB (BSC)
- Solana (SOL)

**Total supported**: 150+ coins (full list in NOWPayments dashboard)

---

## Troubleshooting

### Issue: IPN Not Received

**Check**:
1. Is your server publicly accessible? (ngrok for local testing)
2. Is the IPN URL correct in NOWPayments dashboard?
3. Are you using HTTPS in production?
4. Check server logs for incoming requests

**Solution**: Test with ngrok:
```bash
ngrok http 3000
# Use https://abc123.ngrok.io/api/webhooks/nowpayments in NOWPayments dashboard
```

---

### Issue: Signature Verification Failed

**Check**:
1. Is `NOWPAYMENTS_IPN_SECRET` set correctly in `.env.local`?
2. Did you copy the IPN secret exactly (no extra spaces)?

**Solution**:
1. Regenerate IPN secret in NOWPayments dashboard
2. Update `.env.local` with new secret
3. Restart your dev server

---

### Issue: Payment Not Creating

**Check**:
1. Is `NOWPAYMENTS_API_KEY` set correctly?
2. Are you using the correct API URL (sandbox vs production)?
3. Check browser console for errors
4. Check server logs for API errors

**Solution**:
1. Verify API key in NOWPayments dashboard
2. Test API status:
   ```bash
   curl https://api.nowpayments.io/v1/status \
     -H "x-api-key: YOUR_API_KEY"
   ```

---

## Payment Flow Diagram

```
User clicks "Pay with Crypto"
    ↓
Frontend calls /api/crypto-checkout (POST)
    ↓
Backend creates invoice via NOWPayments API
    ↓
User sees payment address + amount
    ↓
User sends crypto to address
    ↓
NOWPayments detects payment
    ↓
IPN webhook fires → /api/webhooks/nowpayments
    ↓
Backend upgrades user to PRO
    ↓
User redirected to /payment/success
```

---

## Security Best Practices

1. **Always verify IPN signatures** (already implemented in webhook handler)
2. **Use HTTPS in production** (required by NOWPayments)
3. **Don't expose API keys** (use environment variables)
4. **Log all payments** (for audit trail)
5. **Handle refunds properly** (IPN webhook handles this)

---

## Additional Resources

- **NOWPayments Docs**: https://documenter.getpostman.com/view/7907941/2s93JRVFUW
- **API Status**: https://api.nowpayments.io/v1/status
- **Support**: https://nowpayments.io/contact-us
- **Dashboard**: https://account.nowpayments.io

---

## Cost Analysis

### Monthly Revenue: $7,900 (100 PRO subscriptions)

**Stripe Only**:
- Fees: $259 (2.9% + $0.30 per transaction)
- Net: $7,641

**50% Stripe + 50% NOWPayments**:
- Stripe fees: $129.50 (50 transactions)
- NOWPayments fees: $20 (50 transactions)
- **Total fees**: $149.50
- **Net**: $7,750.50
- **Savings**: $109.50/month ($1,314/year)

**25% Stripe + 75% NOWPayments**:
- Stripe fees: $64.75 (25 transactions)
- NOWPayments fees: $30 (75 transactions)
- **Total fees**: $94.75
- **Net**: $7,805.25
- **Savings**: $164.25/month ($1,971/year)

**Recommendation**: Promote crypto payments to save 60-85% on fees!

---

## Next Steps

1. ✅ Create NOWPayments account
2. ✅ Get API key and IPN secret
3. ✅ Update `.env.local`
4. ✅ Configure IPN callback URL
5. ✅ Test with small crypto payment
6. ✅ Deploy to production
7. ✅ Monitor payments in NOWPayments dashboard

**Ready to go live!** 🚀
