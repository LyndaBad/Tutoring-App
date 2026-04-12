# Lynda Badmus Education — Platform Prototype

> **Academic excellence with purpose.**

A fully interactive React prototype of the Lynda Badmus Education platform. All four portals (Student, Parent, Tutor, Admin) running locally with mock data.

---

## What's included

| Portal | Demo login | What you can do |
|---|---|---|
| **Student** | student@demo.com / demo | Dashboard, lesson viewer, booking calendar, assessments, progress |
| **Parent** | parent@demo.com / demo | Child progress, assessment results, session history, billing |
| **Tutor** | tutor@demo.com / demo | Schedule, post-session form, PPT upload, hours log, invoices |
| **Admin** | admin@lbe.com / admin | Overview, course manager, bookings, Zoom links, payout queue |

**Public site** — no login needed. Browse home, courses, pricing, about, FAQs.

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your environment

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key (only needed for the AI Course Guide chat widget — everything else works without it):

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get a free key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run the dev server

```bash
npm run dev
```

Opens at **http://localhost:3000** automatically.

---

## Project structure

```
lbe-platform/
├── src/
│   ├── App.jsx        ← entire platform (1,800+ lines, all portals)
│   └── main.jsx       ← React entry point
├── index.html         ← HTML shell
├── vite.config.js     ← Vite config + Anthropic proxy
├── package.json
├── .env.example       ← copy to .env
└── README.md
```

---

## How it works

### Portals
Use the **VIEW AS** bar at the top of the app to switch between portals without logging in, or use the demo credentials above on the login screen.

### AI Course Guide
The 💬 chat widget in the bottom-right corner is powered by Claude (Anthropic). It helps students choose the right course, understand IB AA vs AI, SL vs HL, and navigate toward booking.

The Vite dev server proxies `/api/chat` to `api.anthropic.com` so your API key is never exposed in the browser.

### Data
All data is mock (hardcoded in `App.jsx`). No database, no Stripe, no Zoom calls. This is a front-end prototype.

---

## Building for production

```bash
npm run build
```

Output goes to `dist/`. You can preview it with:

```bash
npm run preview
```

---

## Moving to production

The full production stack is documented in `LBE_Implementation_Reference.jsx` (open in the Claude artifact viewer). It covers:

- Next.js 14 App Router
- Supabase (database + auth + storage)
- Stripe (payments)
- Zoom (video sessions)
- Vercel (deployment)
- All 15 implementation sections with copy-paste code

---

## Courses included (20 total)

**IB** (6 separate courses — AA≠AI, SL≠HL)
- IB Math AA SL · IB Math AA HL
- IB Math AI SL · IB Math AI HL
- IB Chemistry SL · IB Chemistry HL

**UK**
- A-Level Math · A-Level Chemistry
- GCSE Math · GCSE Chemistry
- Pre-GCSE Math · Pre-GCSE Chemistry

**US**
- AP Chemistry · Honors Math · Honors Chemistry
- High School Math · High School Chemistry
- Middle School Math · Middle School Science

**Preparation**
- Pre-IB Math

---

## Tech stack (prototype)

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI |
| Vite | 5 | Dev server + build |
| lucide-react | 0.446 | Icons |
| recharts | 2.13 | Charts (score trends, sessions bar) |
| Google Fonts | CDN | Cormorant Garamond + Jost |

---

*Lynda Badmus Education · Academic excellence with purpose.*
