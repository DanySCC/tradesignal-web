# TradeSignal AI — Production Deployment Guide

**Complete guide for deploying to production with Vercel or Netlify**

---

## 🎯 Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All API keys obtained (Stripe, NOWPayments, MongoDB)
- ✅ Local testing completed successfully
- ✅ Payment webhooks tested
- ✅ `.env.local` configured correctly
- ✅ Git repository clean (no sensitive data committed)
- ✅ Custom domain ready (optional)

---

## 🚀 Option 1: Deploy to Vercel (Recommended)

Vercel is built by the Next.js team and offers:
- ✅ Zero-config Next.js deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Free tier (generous limits)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate (email or GitHub).

### Step 3: Initial Deployment

```bash
cd /home/kaff/.openclaw/workspace/tradesignal-web
vercel
```

**Questions you'll be asked**:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account/org
- **Link to existing project?** → No (first time)
- **What's your project's name?** → `tradesignal-ai` (or your choice)
- **In which directory is your code located?** → `.` (current dir)
- **Want to modify settings?** → No

Vercel will build and deploy to a preview URL (e.g., `tradesignal-ai-abc123.vercel.app`).

### Step 4: Add Environment Variables

**Via CLI**:

```bash
# Stripe
vercel env add STRIPE_SECRET_KEY
# Paste your key when prompted, press Enter
# Select: Production, Preview, Development (select all)

vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_PRO_PRICE_ID
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# NOWPayments
vercel env add NOWPAYMENTS_API_KEY
vercel env add NOWPAYMENTS_IPN_SECRET

# NextAuth
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL  # Your production URL: https://yourdomain.com

# MongoDB
vercel env add MONGODB_URI

# App URL
vercel env add NEXT_PUBLIC_APP_URL  # Same as NEXTAUTH_URL
```

**Via Dashboard** (easier):

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `STRIPE_SECRET_KEY`)
   - **Value**: Your key
   - **Environments**: Check Production, Preview, Development
5. Click **Save**

### Step 5: Deploy to Production

```bash
vercel --prod
```

This deploys to your production URL (e.g., `tradesignal-ai.vercel.app`).

### Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `tradesignalai.com`)
5. Follow DNS setup instructions:
   - **A Record**: Point to Vercel's IP (`76.76.21.21`)
   - **CNAME**: Point `www` to `cname.vercel-dns.com`
6. Wait for DNS propagation (5-60 minutes)
7. Vercel auto-provisions SSL certificate

### Step 7: Update Webhooks

**Stripe**:
1. Go to https://dashboard.stripe.com/webhooks
2. Update endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
3. Save

**NOWPayments**:
1. Go to NOWPayments dashboard → Settings → IPN
2. Update callback URL: `https://yourdomain.com/api/webhooks/nowpayments`
3. Save

### Step 8: Update Environment Variables

Update these in Vercel dashboard (Settings → Environment Variables):

- `NEXTAUTH_URL` → `https://yourdomain.com`
- `NEXT_PUBLIC_APP_URL` → `https://yourdomain.com`

**Redeploy** to apply changes:
```bash
vercel --prod
```

---

## 🚀 Option 2: Deploy to Netlify

Netlify is another excellent option with similar features.

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login

```bash
netlify login
```

### Step 3: Initialize Project

```bash
cd /home/kaff/.openclaw/workspace/tradesignal-web
netlify init
```

**Questions**:
- **Create & configure a new site?** → Yes
- **Team** → Your account
- **Site name** → `tradesignal-ai` (or your choice)
- **Build command** → `npm run build`
- **Publish directory** → `.next`

### Step 4: Add Environment Variables

**Via CLI**:

```bash
netlify env:set STRIPE_SECRET_KEY "your_key_here"
netlify env:set STRIPE_PUBLISHABLE_KEY "your_key_here"
# ... repeat for all variables
```

**Via Dashboard** (easier):

1. Go to https://app.netlify.com
2. Select your site
3. Click **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add each key-value pair

### Step 5: Deploy

```bash
netlify deploy --prod
```

Netlify will build and deploy to production.

### Step 6: Custom Domain

1. In Netlify dashboard, go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain
4. Follow DNS setup instructions
5. Netlify auto-provisions SSL

### Step 7: Update Webhooks & Env Vars

Same as Vercel Step 7-8.

---

## 🔧 Post-Deployment Setup

### 1. Test Production Environment

**Test Flow**:
1. Visit your production URL
2. Sign up with a test account
3. Upload a chart → verify analysis works
4. Try upgrading to PRO:
   - Test Stripe payment (use test card)
   - Verify redirect to success page
   - Verify PRO features unlocked
5. Test daily picks (if data exists)
6. Test track record page

### 2. Monitor Logs

**Vercel**:
- Dashboard → Your project → Functions
- Real-time logs for API routes
- Error tracking

**Netlify**:
- Dashboard → Your site → Functions
- Real-time logs

### 3. Set Up Alerts (Optional)

**Vercel**:
- Integrations → Slack/Discord
- Get notified on deployment failures

**Netlify**:
- Notifications → Deploy notifications
- Email or Slack alerts

### 4. Enable Analytics (Optional)

**Vercel Analytics**:
```bash
npm install @vercel/analytics
```

Add to `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

- ✅ **Never commit** `.env.local` to git
- ✅ Use different keys for dev/staging/prod
- ✅ Rotate secrets periodically (every 6-12 months)
- ✅ Use secret management tools (Vercel/Netlify env vars)

### 2. API Keys

- ✅ Use **test mode** keys for development
- ✅ Use **production mode** keys for production
- ✅ Restrict Stripe API keys to specific domains
- ✅ Enable webhook signature verification (already implemented)

### 3. Rate Limiting

Add rate limiting to API routes (optional):

```bash
npm install rate-limiter-flexible
```

### 4. CORS & CSP

Next.js handles this automatically, but verify:
- CORS allows only your domain
- CSP restricts script sources

---

## 📊 Monitoring & Maintenance

### Daily Tasks

- ✅ Check error logs (Vercel/Netlify dashboard)
- ✅ Monitor payment success rate
- ✅ Check user signups

### Weekly Tasks

- ✅ Review track record performance
- ✅ Check MongoDB usage (Atlas dashboard)
- ✅ Review Stripe dashboard for chargebacks
- ✅ Check NOWPayments for pending/failed crypto payments

### Monthly Tasks

- ✅ Review costs (Vercel/Netlify, Stripe fees, MongoDB, APIs)
- ✅ Analyze user growth
- ✅ Update dependencies: `npm outdated` → `npm update`
- ✅ Security audit: `npm audit` → `npm audit fix`

---

## 💰 Cost Estimation

### Monthly Costs (100 PRO users @ $79/month = $7,900 revenue)

**Infrastructure**:
- Vercel/Netlify: **$0** (free tier covers most startups)
- MongoDB Atlas: **$0-$9** (free tier → M10 cluster)
- Domain: **$12/year** (≈$1/month)

**Payment Processing**:
- Stripe (50 users): **$129.50** (2.9% + $0.30)
- NOWPayments (50 users): **$20** (0.5%)
- **Total fees**: **$149.50**

**APIs**:
- CoinGlass API: **$299/month** (for SMART engine)
- Anthropic (Claude): **~$50-100/month** (chart analyses)

**Total Monthly Costs**: **~$500-550**  
**Net Revenue**: **$7,350** (93% profit margin!)

---

## 🚨 Troubleshooting

### "Build Failed"

**Check**:
1. All environment variables set?
2. MongoDB connection string correct?
3. Build logs for specific error

**Fix**:
```bash
# Test build locally first
npm run build

# If successful, redeploy
vercel --prod  # or netlify deploy --prod
```

### "Webhooks Not Working"

**Check**:
1. Webhook URL matches deployment URL?
2. Webhook secret correct in env vars?
3. HTTPS enabled (required for production)?

**Test**:
```bash
# Stripe CLI
stripe listen --forward-to https://yourdomain.com/api/webhooks/stripe

# Make a test payment, check if webhook fires
```

### "Database Connection Failed"

**Check**:
1. MongoDB IP whitelist (allow all: `0.0.0.0/0` for Vercel/Netlify)
2. Connection string correct?
3. Database user has read/write permissions?

**Fix**:
- MongoDB Atlas → Network Access → Add IP: `0.0.0.0/0`

### "Environment Variables Not Working"

**Check**:
1. Variables added to correct environment (Production)?
2. Redeployed after adding vars?
3. Variable names match exactly (case-sensitive)?

**Fix**:
```bash
# Redeploy to pick up new env vars
vercel --prod
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Vercel** (recommended):
1. Connect GitHub repository
2. Vercel auto-deploys on every push to `main`
3. Preview deployments for pull requests

**Netlify**:
1. Connect GitHub repository
2. Auto-deploy on push
3. Deploy previews for PRs

### Git Workflow

```bash
# Development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "Add new feature"
git push origin feature/new-feature

# Create PR on GitHub
# Vercel/Netlify creates preview deployment

# After review, merge to main
# Auto-deploys to production
```

---

## 📈 Scaling Considerations

### When to Upgrade

**Vercel**:
- Free tier: 100GB bandwidth, serverless functions
- Pro tier ($20/month): More bandwidth, faster builds
- Scale as needed

**Netlify**:
- Free tier: 100GB bandwidth
- Pro tier ($19/month): More bandwidth, analytics

**MongoDB**:
- Free tier (M0): 512MB storage, shared RAM
- Upgrade at ~10k users or 100k documents
- M10 cluster: $9/month (dedicated, 10GB storage)

### Load Balancing

Vercel/Netlify handle this automatically. No action needed.

### CDN

Both platforms include global CDN by default. Your site is fast worldwide.

---

## ✅ Launch Checklist

Before announcing:

- [ ] Production deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (HTTPS working)
- [ ] Payment flow tested end-to-end
- [ ] Webhooks receiving events correctly
- [ ] Daily picks page working (with test data)
- [ ] Track record page displaying correctly
- [ ] Mobile responsive (test on phone)
- [ ] Error tracking set up
- [ ] Analytics installed (optional)
- [ ] Social media accounts created
- [ ] Terms of Service + Privacy Policy added (optional but recommended)

---

## 🎉 Post-Launch

### Marketing

1. **Twitter**:
   - Announce launch
   - Share first user testimonials
   - Post daily picks highlights

2. **Reddit**:
   - r/cryptocurrency
   - r/CryptoMarkets
   - r/Trading (be careful of self-promo rules)

3. **Discord/Telegram**:
   - Trading communities
   - Crypto alpha groups

### Growth

- Offer launch discount (first 100 users)
- Referral program (10% commission)
- Content marketing (blog posts, tutorials)
- YouTube (demo videos, chart analysis)

---

**Deployment complete! 🚀 You're live!**

Need help? Check logs, test thoroughly, and monitor closely in the first 24-48 hours.
