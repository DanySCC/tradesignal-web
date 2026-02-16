# TODO List — TradeSignal AI Web Platform

**Created**: 2026-02-16 16:01 GMT+1  
**Status**: Ready for final setup & testing  
**Progress**: 98% complete

---

## 🔑 Step 1: Get API Keys

### Stripe (Cards + Apple Pay + Google Pay)

1. **Go to**: https://dashboard.stripe.com
2. **Sign in** (or create account if new)
3. **Switch to Test Mode** (toggle in top right)
4. **Get API Keys**:
   - Click **"Developers"** → **"API keys"**
   - Copy **"Secret key"** (starts with `sk_test_...`)
   - Copy **"Publishable key"** (starts with `pk_test_...`)
5. **Create Product**:
   - Click **"Products"** → **"Add product"**
   - Name: `TradeSignal AI PRO`
   - Description: `Monthly PRO subscription with unlimited analyses`
   - Price: `$79/month` (recurring)
   - Click **"Save product"**
   - Copy **"Price ID"** (starts with `price_...`)
6. **Set up Webhook**:
   - Click **"Developers"** → **"Webhooks"**
   - Click **"Add endpoint"**
   - URL: `https://yourdomain.com/api/webhooks/stripe` (or use `http://localhost:3000/api/webhooks/stripe` for local)
   - Events to listen: `checkout.session.completed`
   - Click **"Add endpoint"**
   - Copy **"Signing secret"** (starts with `whsec_...`)
7. **Enable Wallets**:
   - Click **"Settings"** → **"Payment methods"**
   - Enable **"Apple Pay"**
   - Enable **"Google Pay"**
   - Click **"Save"**

### NOWPayments (Crypto)

1. **Go to**: https://nowpayments.io
2. **Sign up** (if new) or **Sign in**
3. **Complete KYC** (if required):
   - Personal info
   - Upload ID documents
   - Business details (optional)
4. **Get API Key**:
   - Go to **"Settings"** → **"API Keys"**
   - Click **"Generate New API Key"**
   - Copy the key (save it securely!)
5. **Get IPN Secret**:
   - Go to **"Settings"** → **"IPN"**
   - Click **"Generate IPN Secret"**
   - Copy the secret (save it securely!)
6. **Set IPN Callback URL**:
   - In **"Settings"** → **"IPN"**
   - Enter: `https://yourdomain.com/api/webhooks/nowpayments`
   - For local testing, use **ngrok**: `ngrok http 3000` → use the https URL
   - Click **"Save"**

---

## ⚙️ Step 2: Update Environment Variables

**Edit**: `/home/kaff/.openclaw/workspace/tradesignal-web/.env.local`

Add these keys (replace placeholders with real values):

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_PRO_PRICE_ID=price_YOUR_PRICE_ID_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# NOWPayments Keys
NOWPAYMENTS_API_KEY=your_api_key_here
NOWPAYMENTS_IPN_SECRET=your_ipn_secret_here

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_nextauth_secret_here

# MongoDB (already set)
MONGODB_URI=mongodb+srv://daniel_db_user:ulwsdNq70Ifunsxx@tradesignal0.ncb5q52.mongodb.net/tradesignal?retryWrites=true&w=majority
```

**Generate NextAuth Secret**:
```bash
openssl rand -base64 32
```
Copy output and paste into `NEXTAUTH_SECRET=...`

---

## 🧪 Step 3: Test Locally

### Start Dev Server

```bash
cd /home/kaff/.openclaw/workspace/tradesignal-web
npm run dev
```

**Open**: http://localhost:3000

### Test Flow

1. **Sign Up**:
   - Go to `/auth/signup`
   - Create new account
   - Verify you can sign in

2. **Test FREE Tier**:
   - Upload a chart at `/analyze`
   - Verify analysis works
   - Upload 5 charts total
   - Verify usage limit kicks in

3. **Test Daily Picks** (needs data):
   - Go to `/daily-picks`
   - Should show "PRO required" for FREE user
   - Manually upgrade user to PRO in MongoDB (or test payment)

4. **Test Track Record**:
   - Go to `/track-record`
   - Should show stats (even if empty)

### Test Stripe Payments

1. **Go to** `/upgrade`
2. **Click** "Checkout with Stripe"
3. **Use test card**: `4242 4242 4242 4242`
4. **Expiry**: Any future date (e.g., `12/34`)
5. **CVC**: Any 3 digits (e.g., `123`)
6. **ZIP**: Any 5 digits (e.g., `12345`)
7. **Complete payment**
8. **Verify**:
   - Redirected to `/payment/success`
   - User tier updated to PRO in MongoDB
   - Can now access `/daily-picks`

### Test Crypto Payments (Optional)

1. **Set up ngrok** (for local webhook):
   ```bash
   ngrok http 3000
   ```
   Copy the `https://...ngrok.io` URL

2. **Update IPN URL** in NOWPayments dashboard:
   ```
   https://abc123.ngrok.io/api/webhooks/nowpayments
   ```

3. **Go to** `/upgrade`
4. **Click** "Pay with Crypto"
5. **Select cryptocurrency** (USDT TRC20 recommended)
6. **Send small amount** ($1-5 worth)
7. **Wait for confirmation** (1-10 minutes)
8. **Verify** user upgraded to PRO

---

## 🚀 Step 4: Deploy to Production

### Option A: Vercel (Recommended)

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd /home/kaff/.openclaw/workspace/tradesignal-web
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_PUBLISHABLE_KEY
   vercel env add STRIPE_PRO_PRICE_ID
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   vercel env add NOWPAYMENTS_API_KEY
   vercel env add NOWPAYMENTS_IPN_SECRET
   vercel env add NEXTAUTH_SECRET
   vercel env add MONGODB_URI
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add NEXTAUTH_URL
   ```

5. **Deploy again** (to apply env vars):
   ```bash
   vercel --prod
   ```

6. **Get deployment URL** (e.g., `https://tradesignal-ai.vercel.app`)

### Option B: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   cd /home/kaff/.openclaw/workspace/tradesignal-web
   netlify deploy --prod
   ```

4. **Set Environment Variables** in Netlify dashboard

### Update Webhooks After Deploy

1. **Stripe**: Update webhook URL to `https://yourdomain.com/api/webhooks/stripe`
2. **NOWPayments**: Update IPN URL to `https://yourdomain.com/api/webhooks/nowpayments`
3. **Update `.env.local`** (or production env vars):
   ```bash
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXTAUTH_URL=https://yourdomain.com
   ```

---

## 📊 Step 5: Add Test Data (Optional)

If you want to test **Daily Picks** and **Track Record** with real data:

### Add Daily Signal (MongoDB)

Connect to MongoDB and insert:

```javascript
db.dailysignals.insertOne({
  date: new Date(new Date().setUTCHours(0, 0, 0, 0)),
  published: true,
  publishedAt: new Date(),
  viewCount: 0,
  signals: [
    {
      symbol: "BTC/USDT",
      timeframe: "4h",
      technicalAnalysis: "Strong bullish momentum above $43k support. RSI showing strength at 62. MACD golden cross confirmed on 4H.",
      coinglassData: "Long liquidations cleared at $42.8k. Short liquidation wall at $45k. Funding rate neutral at 0.01%.",
      recommendation: "LONG",
      confidence: 82
    },
    {
      symbol: "ETH/USDT",
      timeframe: "1h",
      technicalAnalysis: "Consolidating in tight range. Breakout above $2,300 could trigger move to $2,400.",
      coinglassData: "High open interest increase (+15% in 24h). Long/short ratio 52/48 balanced.",
      recommendation: "LONG",
      confidence: 74
    },
    {
      symbol: "SOL/USDT",
      timeframe: "1d",
      technicalAnalysis: "Testing key resistance at $100. Volume declining, need confirmation.",
      coinglassData: "Major liquidation cluster at $95. Shorts overextended at -0.03% funding.",
      recommendation: "NEUTRAL",
      confidence: 68
    }
  ]
})
```

### Add Trade Signal (MongoDB)

```javascript
db.tradesignals.insertOne({
  userId: ObjectId("your_user_id"),
  symbol: "BTC/USDT",
  timeframe: "4h",
  recommendation: "strong_buy",
  confidence: 85,
  status: "completed",
  technicalAnalysis: {
    trend: "bullish",
    support: 43000,
    resistance: 45000
  },
  createdAt: new Date()
})
```

---

## ✅ Step 6: Final Checklist

Before launching:

- [ ] Stripe API keys added
- [ ] NOWPayments API keys added
- [ ] NextAuth secret generated
- [ ] Test payment with Stripe (test card)
- [ ] Test crypto payment (optional, small amount)
- [ ] Verify user upgrade works
- [ ] Test daily picks page (PRO user)
- [ ] Test track record page (public)
- [ ] Deploy to production (Vercel/Netlify)
- [ ] Update webhook URLs (Stripe + NOWPayments)
- [ ] Test in production environment
- [ ] Set up custom domain (optional)

---

## 📚 Documentation Reference

All guides are in `/home/kaff/.openclaw/workspace/tradesignal-web/`:

- `STRIPE_SETUP.md` — Stripe configuration guide
- `NOWPAYMENTS_SETUP.md` — Crypto payment setup
- `APPLE_GOOGLE_PAY_SETUP.md` — Wallet payment guide
- `BUILD_STATUS.md` — Current build status
- `README.md` — Project overview

---

## 🐛 Troubleshooting

### Payment Not Working

1. Check webhook endpoints are set correctly
2. Check API keys are correct in `.env.local`
3. Check server logs for errors: `npm run dev` (watch terminal)
4. Test webhook with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Daily Picks Not Showing

1. Check MongoDB has data in `dailysignals` collection
2. Check user tier is "PRO" in database
3. Check date format is correct (midnight UTC)
4. Check `published: true` flag is set

### Track Record Empty

1. Check MongoDB has data in `tradesignals` collection
2. Check signals have `status: "completed"`
3. Check API route logs for errors

---

## 🚀 Ready to Launch!

**When everything is tested and working**:

1. Announce on Twitter
2. Post in trading communities (Reddit, Discord)
3. Share Telegram bot link: @TradeAIGlobe_bot
4. Share web platform link
5. Monitor first users + payments

---

**Need help?** Check documentation files or ask me! 💪

**Version**: v0.10.0  
**Build Complete**: 2026-02-16  
**Progress**: 98% ✅
