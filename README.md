# TradeSignal AI - Web Platform

AI-powered trading signal analysis platform with CoinGlass SMART engine integration.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Theme:** Dark/Light mode with next-themes
- **Icons:** Lucide React
- **Language:** TypeScript

## 📁 Project Structure

```
tradesignal-web/
├── src/
│   ├── app/              # App router pages
│   │   ├── layout.tsx    # Root layout with theme provider
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   └── lib/
│       └── utils.ts      # Utility functions
├── public/               # Static assets
└── package.json
```

## 🎯 Current Status

**Phase:** MVP Development (Week 1)  
**Version:** 0.1.0 (Initial Setup)

### ✅ Completed
- [x] Next.js project setup with TypeScript
- [x] Tailwind CSS v4 configuration
- [x] shadcn/ui initialization
- [x] Dark/light theme system
- [x] Basic navigation layout
- [x] Homepage with hero section
- [x] Feature cards (Instant Analysis, SMART Engine, Track Record)

### 🚧 In Progress
- [ ] Chart upload interface
- [ ] Analysis display page
- [ ] Backend integration

### 📋 Roadmap

**Week 1:**
- Chart upload UI (drag & drop)
- Analysis results page
- API route for backend integration
- Responsive design polish

**Week 2:**
- Authentication system
- Usage tracking (FREE 5/month vs PRO)
- Daily picks feed
- Pricing page

**Week 3-4:**
- Public track record page
- Position size calculator
- Performance tracking
- Deployment

## 🛠️ Development

### Prerequisites
- Node.js 18+ (using v22.22.0)
- npm or pnpm

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in browser.

### Build for Production
```bash
npm run build
npm start
```

## 🎨 Design System

**Theme:**
- Default: Dark mode (trader preference)
- Toggle: Light/Dark/System
- Smooth transitions between themes

**Colors:**
- Primary: Tailwind default (customizable)
- Background: Dynamic (dark/light)
- Foreground: High contrast text

**Typography:**
- Sans: Geist Sans (clean, modern)
- Mono: Geist Mono (code/numbers)

## 🔗 Integration Points

**Backend API:**
- TradeSignal Bot (existing): `/workspace/tradesignal-backend/`
- Chart analysis endpoint (to be created)
- Daily picks endpoint (to be created)

**External APIs:**
- CoinGlass API (via backend)
- Claude AI (via backend)

## 📝 Notes

- **Port:** 3000 (dev server)
- **Turbopack:** Enabled for faster builds
- **ESLint:** Configured for code quality
- **Git:** Not initialized yet (will add later)

## 🔐 Environment Variables

Create `.env.local`:
```env
# To be added when backend integration starts
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

**Created:** 2026-02-15  
**Status:** ✅ Initial setup complete, ready for feature development
