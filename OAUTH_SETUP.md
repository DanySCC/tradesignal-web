# OAuth Setup Guide — Google & Apple Sign-In

This guide walks you through setting up "Sign in with Google" and "Sign in with Apple" for TradeSignal AI.

---

## 🔐 Why Add OAuth?

**Benefits**:
- ✅ **Faster signup** — Users don't need to create passwords
- ✅ **Better security** — Google/Apple handle authentication
- ✅ **Higher conversion** — Reduces friction (1-click signup)
- ✅ **Trusted** — Users feel safer using familiar login methods

---

## 🔵 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **"Select a project"** (top left) → **"New Project"**
3. **Project name**: `TradeSignal AI` (or your choice)
4. Click **"Create"**
5. Wait for project creation (~30 seconds)

### Step 2: Enable Google+ API

1. In your project, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it → Click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. **User Type**: Select **"External"**
3. Click **"Create"**
4. **Fill in required fields**:
   - **App name**: `TradeSignal AI`
   - **User support email**: Your email
   - **App logo**: (optional) Upload your logo
   - **App domain**: Leave blank for now (add after deployment)
   - **Authorized domains**: Add your domain (e.g., `tradesignalai.com`)
   - **Developer contact email**: Your email
5. Click **"Save and Continue"**
6. **Scopes**: Click **"Add or Remove Scopes"**
   - Select: `./auth/userinfo.email`
   - Select: `./auth/userinfo.profile`
   - Select: `openid`
7. Click **"Save and Continue"**
8. **Test users** (optional for development):
   - Add your email and test users
9. Click **"Save and Continue"**
10. Review and click **"Back to Dashboard"**

### Step 4: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. **Application type**: **"Web application"**
4. **Name**: `TradeSignal AI Web`
5. **Authorized JavaScript origins**: Add your URLs
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
6. **Authorized redirect URIs**: Add callback URLs
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Click **"Create"**
8. **Copy your credentials**:
   - **Client ID** (looks like `123456789-abc...apps.googleusercontent.com`)
   - **Client Secret** (looks like `GOCSPX-abc123...`)

### Step 5: Add to Environment Variables

Update `.env.local`:

```bash
GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
```

### Step 6: Test

1. Restart your dev server: `npm run dev`
2. Go to `/auth/signin`
3. Click **"Continue with Google"**
4. You should see Google's login screen
5. Sign in → Should redirect to `/analyze`

---

## 🍎 Apple OAuth Setup

⚠️ **Requirements**:
- Apple Developer Account ($99/year)
- Verified domain
- More complex than Google

### Step 1: Apple Developer Account

1. Go to https://developer.apple.com/account
2. Sign in with your Apple ID
3. If you don't have a paid account:
   - Enroll in Apple Developer Program ($99/year)
   - Wait for approval (~24-48 hours)

### Step 2: Register Your App ID

1. In Apple Developer Console, go to **"Certificates, Identifiers & Profiles"**
2. Click **"Identifiers"** (left sidebar)
3. Click **"+"** (top right) → **"App IDs"**
4. **Platform**: Select **"iOS, tvOS, watchOS"** (even though it's web)
5. **Description**: `TradeSignal AI`
6. **Bundle ID**: `com.tradesignalai.web` (use your domain)
7. **Capabilities**: Enable **"Sign in with Apple"**
8. Click **"Continue"** → **"Register"**

### Step 3: Create Services ID

1. Go back to **"Identifiers"**
2. Click **"+"** → **"Services IDs"**
3. **Description**: `TradeSignal AI Web`
4. **Identifier**: `com.tradesignalai.web.service` (must be unique)
5. Check **"Sign in with Apple"**
6. Click **"Configure"** (next to Sign in with Apple)
7. **Primary App ID**: Select the App ID you created in Step 2
8. **Domains and Subdomains**: Add your domain
   - Example: `tradesignalai.com` (NO `https://` or `www`)
9. **Return URLs**: Add callback URL
   - Development: `http://localhost:3000/api/auth/callback/apple`
   - Production: `https://yourdomain.com/api/auth/callback/apple`
10. Click **"Save"** → **"Continue"** → **"Register"**

### Step 4: Create Private Key

1. Go to **"Keys"** (left sidebar)
2. Click **"+"** (top right)
3. **Key Name**: `TradeSignal AI Sign in with Apple Key`
4. Check **"Sign in with Apple"**
5. Click **"Configure"** → Select your Primary App ID
6. Click **"Save"** → **"Continue"** → **"Register"**
7. **Download the key** (`.p8` file) — YOU CAN ONLY DO THIS ONCE!
8. **Note your Key ID** (looks like `ABC123DEFG`)
9. **Note your Team ID** (top right, looks like `XYZ987ABCD`)

### Step 5: Generate Client Secret (JWT)

Apple uses JWT tokens as client secrets. You need to generate one programmatically.

**Option 1: Use Online Generator** (easiest)
1. Go to https://appleid.apple.com/auth/keys (Apple's tool)
2. Upload your `.p8` key file
3. Enter your Key ID and Team ID
4. Generate JWT

**Option 2: Use Node.js Script**

```bash
npm install jsonwebtoken
```

Create `generate-apple-secret.js`:

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('./AuthKey_ABC123DEFG.p8', 'utf8');

const token = jwt.sign(
  {},
  privateKey,
  {
    algorithm: 'ES256',
    expiresIn: '180d', // 6 months
    audience: 'https://appleid.apple.com',
    issuer: 'XYZ987ABCD', // Your Team ID
    subject: 'com.tradesignalai.web.service', // Your Services ID
    keyid: 'ABC123DEFG' // Your Key ID
  }
);

console.log('Apple Client Secret (JWT):');
console.log(token);
```

Run: `node generate-apple-secret.js`

### Step 6: Add to Environment Variables

Update `.env.local`:

```bash
APPLE_CLIENT_ID=com.tradesignalai.web.service
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...  # Your generated JWT
```

### Step 7: Test

1. Restart your dev server: `npm run dev`
2. Go to `/auth/signin`
3. Click **"Continue with Apple"**
4. You should see Apple's login screen
5. Sign in → Should redirect to `/analyze`

⚠️ **Note**: Apple Sign-In requires HTTPS in production. Use ngrok for local testing with real Apple OAuth.

---

## 🧪 Testing OAuth

### Local Testing (Development)

**Google**:
- ✅ Works on `http://localhost:3000`
- ✅ No special setup needed

**Apple**:
- ⚠️ Requires HTTPS even in "development"
- 🔧 Use **ngrok** for local HTTPS testing:
  ```bash
  ngrok http 3000
  # Use the https URL in Apple OAuth config
  ```

### Production Testing

1. Deploy to production (Vercel/Netlify)
2. Update OAuth configs with production URLs:
   - Google: Add `https://yourdomain.com` to authorized origins + redirects
   - Apple: Add `yourdomain.com` to domains + `https://yourdomain.com/api/auth/callback/apple` to return URLs
3. Update `.env` in production with real credentials
4. Test sign-in flow

---

## 🔒 Security Best Practices

### Google OAuth
- ✅ Use different credentials for dev/staging/production
- ✅ Limit authorized domains to only your domains
- ✅ Never commit client secrets to git
- ✅ Rotate secrets periodically (every 6-12 months)

### Apple OAuth
- ✅ Keep `.p8` key file secure (treat like a password)
- ✅ Regenerate JWT every ~6 months (they expire)
- ✅ Use different Services IDs for dev/prod
- ✅ Verify domain ownership in Apple Developer Console

---

## 🐛 Troubleshooting

### Google OAuth

**Error: "redirect_uri_mismatch"**
- Check that redirect URI in Google Console matches exactly
- Include protocol (`http://` or `https://`)
- No trailing slashes

**Error: "Access blocked: This app's request is invalid"**
- OAuth consent screen not published
- Go to Google Console → OAuth consent screen → Publish app

**Error: "invalid_client"**
- Client ID or Secret is wrong
- Check `.env.local` values
- Regenerate credentials if needed

### Apple OAuth

**Error: "invalid_client"**
- Client ID (Services ID) is wrong
- JWT (client secret) has expired → regenerate
- Key ID or Team ID in JWT is wrong

**Error: "invalid_request"**
- Return URL not configured correctly in Apple Developer Console
- Domain not verified
- Missing HTTPS in production

**Error: "unauthorized_client"**
- Services ID not properly configured
- Sign in with Apple capability not enabled
- Primary App ID not linked

---

## 📊 OAuth vs Email/Password Comparison

| Feature | Email/Password | OAuth (Google/Apple) |
|---------|---------------|----------------------|
| **Setup Time** | 5 minutes | 30-60 minutes |
| **Ongoing Maintenance** | None | Rotate secrets every 6-12 months |
| **User Experience** | Slower (form filling) | Faster (1-click) |
| **Security** | You manage passwords | Provider manages |
| **Cost** | Free | Google: Free, Apple: $99/year dev account |
| **Conversion Rate** | Lower | Higher (~20-30% improvement) |

---

## 💰 Cost Summary

**Google OAuth**:
- Setup: FREE
- Ongoing: FREE
- No limits

**Apple OAuth**:
- Setup: $99/year (Apple Developer Program)
- Ongoing: FREE (after enrollment)
- No transaction limits

**Total for both**: ~$99/year (Apple Developer fee only)

---

## ✅ Post-Setup Checklist

After setting up OAuth:

- [ ] Google Client ID & Secret added to `.env.local`
- [ ] Apple Client ID & Secret (JWT) added to `.env.local`
- [ ] OAuth buttons appear on `/auth/signin` and `/auth/signup`
- [ ] Test Google sign-in (works on localhost)
- [ ] Test Apple sign-in (needs ngrok or production HTTPS)
- [ ] User tier automatically set to "FREE" on OAuth signup
- [ ] Production OAuth credentials configured
- [ ] Production redirect URIs updated in Google & Apple consoles

---

## 📚 Additional Resources

- **NextAuth.js Docs**: https://next-auth.js.org/providers/google
- **Google OAuth Guide**: https://developers.google.com/identity/protocols/oauth2
- **Apple OAuth Guide**: https://developer.apple.com/sign-in-with-apple/get-started/
- **NextAuth Apple Provider**: https://next-auth.js.org/providers/apple

---

**Need help?** Check the troubleshooting section or search for error messages in NextAuth.js documentation.

**Ready to deploy?** Don't forget to update production URLs in OAuth consoles!
