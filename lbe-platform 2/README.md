# Lynda Badmus Education — Platform

> **Academic excellence with purpose.**

Full-stack platform prototype with real Supabase authentication and database, plus a mock demo mode that works without any setup.

---

## Quick start (demo mode — no setup needed)

```bash
npm install
npm run dev
```

Opens at **http://localhost:3000**. Use the demo logins below — everything works with mock data, no accounts required.

| Role | Email | Password |
|---|---|---|
| Student | student@demo.com | demo |
| Parent | parent@demo.com | demo |
| Tutor | tutor@demo.com | demo |
| Admin | admin@lbe.com | admin |

---

## Connecting real Supabase backend (Option 1)

### Step 1 — Create a Supabase project

Go to [supabase.com](https://supabase.com) → **New project** → choose a name and region:
- **UK users:** choose `West EU (London)`
- **US users:** choose `East US (N. Virginia)`

Wait ~2 minutes for the project to spin up.

### Step 2 — Run the database schema

In your Supabase dashboard:
1. Click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open `supabase/schema.sql` from this project
4. Copy the entire contents → paste into the editor → click **Run**

You should see "Success. No rows returned." All your tables are now created with the right columns and security policies.

### Step 3 — Get your API keys

In Supabase: **Settings → API**

Copy two values:
- **Project URL** — looks like `https://abcdefghijkl.supabase.co`
- **anon public key** — a long `eyJ...` string

### Step 4 — Add keys to your environment

```bash
cp .env.example .env
```

Open `.env` and fill it in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional — only needed for the AI Course Guide chat widget
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Step 5 — Create demo accounts in Supabase Auth

In Supabase: **Authentication → Users → Add user → Create new user**

Create these four accounts:

| Email | Password | Role (metadata) |
|---|---|---|
| student@demo.com | DemoPass123! | student |
| parent@demo.com | DemoPass123! | parent |
| tutor@demo.com | DemoPass123! | tutor |
| admin@lbe.com | AdminPass123! | admin |

> The database trigger in `schema.sql` automatically creates a `profiles` row for each new user. The role defaults to `student` — read Step 6 to set the correct roles.

### Step 6 — Set user roles in the profiles table

In Supabase: **Table Editor → profiles**

Find each user row and set the `role` column:

| email | role |
|---|---|
| student@demo.com | student |
| parent@demo.com | parent |
| tutor@demo.com | tutor |
| admin@lbe.com | admin |

### Step 7 — (Optional) Add demo enrollment data

Open `supabase/seed.sql`:
1. Find each user's UUID from **Authentication → Users** in the Supabase dashboard
2. Replace the four placeholder UUIDs at the top of the file
3. Run the SQL in SQL Editor

This creates a demo IB Math AA HL enrollment for the student account, a parent↔student link, an upcoming booking with a Zoom link, and a billing record.

### Step 8 — Run the app

```bash
npm run dev
```

Now when you log in with `student@demo.com / DemoPass123!` it hits real Supabase — your session persists across refreshes, data is real and saved to the database.

---

## How the auth works

The app runs in two modes automatically:

**Demo mode** (no `.env` / missing Supabase keys)
- All data comes from the hardcoded `USERS` array in `App.jsx`
- Sessions stored in `localStorage`
- Nothing is saved between full page refreshes (login is remembered, but booking/enrollments reset)
- Perfect for demos and showing clients

**Live mode** (Supabase keys in `.env`)
- Login and signup use Supabase Auth (real JWT sessions)
- Student enrollments, bookings, and assessment results load from the database
- Sessions persist properly across browser refreshes and reopens
- New users who sign up get a real `profiles` row automatically via the database trigger
- Logout calls `supabase.auth.signOut()` and clears the session properly

The two modes are fully transparent — the UI looks and works identically in both.

---

## Project structure

```
lbe-platform/
├── src/
│   ├── App.jsx            ← Entire platform — all portals, all pages
│   ├── main.jsx           ← React entry point
│   └── lib/
│       └── supabase.js    ← Supabase client + auth helpers
├── supabase/
│   ├── schema.sql         ← Complete database schema (run in SQL Editor)
│   └── seed.sql           ← Demo data (run after schema.sql)
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js         ← Dev server + Anthropic API proxy
├── package.json
├── .env.example           ← Copy to .env and fill in your keys
├── .gitignore
└── README.md
```

---

## What Supabase is handling

| Feature | How it's stored |
|---|---|
| User accounts | Supabase Auth (JWT sessions) |
| Student profiles | `profiles` table |
| Parent↔student links | `parent_student_links` table |
| Course enrollments | `enrollments` table |
| Session bookings | `bookings` table |
| Lesson progress | `student_progress` table |
| Assessment results | `assessment_results` table |
| Tutor profiles | `tutor_profiles` table |
| Payout invoices | `tutor_invoices` table |
| Payment history | `billing_records` table |
| PPT file uploads | Supabase Storage (`lesson-slides` bucket) |

---

## Adding Stripe payments

When you're ready for real payments, Stripe needs a server-side component (Vite alone can't safely handle secret keys). The options are:

1. **Supabase Edge Functions** — serverless functions that run inside Supabase, ideal for the Stripe webhook
2. **Netlify / Vercel Functions** — if you deploy there
3. **A small Express server** — simplest if you're comfortable with Node.js

The Stripe integration plan is documented in detail in `LBE_Implementation_Reference.jsx` (Section 13).

---

## Deploying to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "initial"
gh repo create lbe-platform --private --push

# 2. Import at vercel.com → New Project → select repo
# 3. Add environment variables in Vercel project Settings → Environment Variables:
#    VITE_SUPABASE_URL
#    VITE_SUPABASE_ANON_KEY
#    VITE_ANTHROPIC_API_KEY (optional)
# 4. Deploy → add custom domain in Settings → Domains
```

---

## Courses (20 total — IB properly split)

**IB** — 6 separate courses (AA≠AI, SL≠HL)
IB Math AA SL · AA HL · AI SL · AI HL · Chemistry SL · Chemistry HL

**UK** — A-Level Math · A-Level Chem · GCSE Math · GCSE Chem · Pre-GCSE Math · Pre-GCSE Chem

**US** — AP Chemistry · Honors Math · Honors Chem · HS Math · HS Chem · MS Math · MS Science

**Prep** — Pre-IB Maths

---

*Lynda Badmus Education · Academic excellence with purpose.*

