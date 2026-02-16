# Apple Pay & Google Pay Setup Guide

## Quick Setup (Dashboard Only - RECOMMENDED)

The **EASIEST** way to enable Apple Pay and Google Pay is through Stripe's automatic Payment Element, which we already use!

### Step 1: Enable in Stripe Dashboard

1. Go to https://dashboard.stripe.com/settings/payment_methods
2. Find **"Wallets"** section
3. Toggle ON:
   - ✅ Apple Pay
   - ✅ Google Pay
4. Click **"Save"**

That's it! Stripe's Payment Element automatically shows Apple Pay / Google Pay buttons when available.

### Step 2: Test It Works

1. Start dev server: `npm run dev`
2. Go to `/pricing` → Click "Start PRO Trial"
3. On **Safari (Mac/iOS)**: Apple Pay button appears
4. On **Chrome (Android)**: Google Pay button appears
5. On **desktop Chrome with saved cards**: Google Pay appears

**No code changes needed!** Stripe handles everything.

---

## How It Works

Stripe's Payment Element (which we use in checkout) **automatically detects**:
- Device type (iOS/Android/Desktop)
- Browser (Safari/Chrome/etc.)
- Saved payment methods (Apple Wallet, Google Wallet)

When conditions are met, it shows the appropriate button!

---

## Domain Verification (Production Only)

### For Apple Pay (Production):

1. Go to https://dashboard.stripe.com/settings/payment_methods/apple_pay
2. Click **"Add domain"**
3. Enter your domain: `tradesignal.ai`
4. Download verification file: `apple-developer-merchantid-domain-association`
5. Place it at: `public/.well-known/apple-developer-merchantid-domain-association`
6. Verify domain in Stripe dashboard

### For Google Pay:

No domain verification needed! Works automatically once enabled.

---

## Testing

### Test Apple Pay:

**Requirements:**
- Safari browser (Mac, iPhone, iPad)
- Apple device with Touch ID or Face ID
- At least one card added to Apple Wallet

**Test card (Stripe test mode):**
- Open Safari on iPhone/Mac
- Add test card to Apple Wallet: 4242 4242 4242 4242
- Try checkout → Apple Pay button appears

### Test Google Pay:

**Requirements:**
- Chrome browser (Android, Desktop with saved cards)
- Google account with saved payment method

**Test card:**
- Open Chrome
- Save test card: 4242 4242 4242 4242
- Try checkout → Google Pay button appears

---

## Current Implementation Status

✅ **Stripe Checkout is ready** - We use Stripe's hosted checkout page
✅ **Payment Element configured** - Supports all payment methods
✅ **Webhooks configured** - Auto-upgrade works regardless of payment method

**What happens:**
1. User clicks "Start PRO Trial"
2. Redirected to Stripe Checkout
3. Stripe shows available payment methods:
   - 💳 Card entry
   - 🍎 Apple Pay (if available)
   - 🅖 Google Pay (if available)
   - 🌐 Link (Stripe's one-click)
4. User pays
5. Webhook upgrades user to PRO
6. Redirect to success page

**It just works!** No code changes required.

---

## Advanced: Custom Payment Request Button (Optional)

If you want a **custom button on the pricing page** (before redirecting to Stripe):

1. Use `PaymentRequestButton` component (already created in `src/components/payment-request-button.tsx`)
2. Add to pricing page
3. More complex, requires API route for payment intent creation

**Recommendation:** Start with dashboard-only approach (simpler, works great).

---

## Pricing Page Updates (Optional Enhancement)

### Current Flow:
```
Pricing Page → "Start PRO Trial" button → Stripe Checkout → Apple/Google Pay available
```

### Enhanced Flow (Optional):
```
Pricing Page → Multiple buttons:
  - "Continue to Checkout" (redirects to Stripe)
  - Apple Pay button (direct, uses PaymentRequestButton)
  - Google Pay button (direct, uses PaymentRequestButton)
```

**For MVP:** Current flow is perfect. Enhanced flow can come later.

---

## Fees

Apple Pay and Google Pay have **NO EXTRA FEES** with Stripe!

- **Card payment:** 2.9% + $0.30
- **Apple Pay:** 2.9% + $0.30 (same!)
- **Google Pay:** 2.9% + $0.30 (same!)

You don't pay extra for digital wallets. Win-win!

---

## Security Notes

- ✅ Apple Pay uses device biometrics (Touch ID / Face ID)
- ✅ Google Pay uses PIN or biometrics
- ✅ No card details stored on device
- ✅ Tokenized payments (more secure than regular cards)
- ✅ Stripe handles all compliance

---

## Troubleshooting

**"Apple Pay button doesn't appear"**
- Check: Safari browser? (Chrome on Mac won't show it)
- Check: Apple Wallet has at least one card?
- Check: Testing in HTTPS? (required in production)

**"Google Pay button doesn't appear"**
- Check: Chrome browser?
- Check: Saved payment method in Google account?
- Check: Stripe dashboard has Google Pay enabled?

**"Button appears but payment fails"**
- Check: Webhook is configured? (required for subscriptions)
- Check: Test mode keys in use?
- Check server logs for errors

---

## Next Steps

### Immediate (5 minutes):
1. ✅ Go to Stripe Dashboard
2. ✅ Enable Apple Pay & Google Pay
3. ✅ Test on Safari (Apple Pay) and Chrome (Google Pay)

### Production (when deploying):
1. Verify domain for Apple Pay
2. Test on real devices
3. Monitor webhook logs

---

## Summary

**TL;DR:**
1. Enable in Stripe Dashboard (5 minutes)
2. Apple Pay & Google Pay work automatically in Stripe Checkout
3. No code changes needed
4. Same fees as card payments
5. More secure, better UX

**Status:** ✅ Ready to enable! Just toggle in dashboard!
