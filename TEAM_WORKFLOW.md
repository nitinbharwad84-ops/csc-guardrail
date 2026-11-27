# CSC Guardrail — Team Workflow & Collaboration Guide

> **Project:** CSC Guardrail · Client Scope & Change Management SaaS  
> **Demo Client:** VastraKart (₹1,50,000 fixed cap · 120 hrs total)  
> **Team Size:** 5 Members · **Lead Integrator:** Member 1  
> **Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · Supabase · Vercel  
> **Last Updated:** 2026-11-27

---

## 1. Repository & Folder Structure Map

### Complete Directory Tree

```text
csc-guardrail/
│
│  ┌─────────────────────────────────────────────────────────────┐
│  │  🔒  SHARED / PROTECTED CORE  —  LEAD INTEGRATOR ONLY       │
│  └─────────────────────────────────────────────────────────────┘
│
├── src/
│   ├── types/
│   │   └── csc.ts                     🔒 Canonical domain interfaces (Member 1)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              🔒 Browser Supabase client (Member 1)
│   │   │   └── server.ts              🔒 Server Supabase client (Member 1)
│   │   └── engine/
│   │       └── swap-math.ts           🔒 calculateScopeSwap() math (Member 1)
│   └── components/
│       └── shared/
│           ├── AppSidebar.tsx         🔒 240px workspace sidebar (Member 1)
│           └── KpiBentoGrid.tsx       🔒 Shared KPI card grid (Member 1)
├── src/app/
│   ├── layout.tsx                     🔒 Root layout & font loading (Member 1)
│   └── globals.css                    🔒 CSS tokens & Tailwind base (Member 1)
├── supabase/
│   └── schema.sql                     🔒 Canonical DB schema (Member 1)
├── package.json                       🔒 Dependency manifest (Member 1)
└── .env.example                       🔒 Env variable template (Member 1)
│
│  ┌─────────────────────────────────────────────────────────────┐
│  │  👤  ISOLATED TEAMMATE WORKSPACES                           │
│  └─────────────────────────────────────────────────────────────┘
│
│  ── MEMBER 2: Landing Page, Auth & Scope Health Dashboard ──
├── src/app/
│   ├── page.tsx                       👤 M2 — Screen 1: Landing Page
│   ├── login/
│   │   └── page.tsx                   👤 M2 — Screen 2: Agency Login + Demo Bypass
│   └── dashboard/
│       └── page.tsx                   👤 M2 — Screen 4: Scope Health Dashboard
└── src/components/
    ├── landing/                       👤 M2 — Landing page sections & hero
    └── dashboard/                     👤 M2 — KPI cards, scope table, gauge charts
│
│  ── MEMBER 3: Client Approval Portal, Audit Ledger & PDF ──
├── src/app/
│   ├── approve/
│   │   └── [token]/
│   │       └── page.tsx               👤 M3 — Screen 6: Public Client Approval Portal
│   └── ledger/
│       └── page.tsx                   👤 M3 — Screen 7: Immutable Audit Ledger + PDF
└── src/components/
    ├── portal/                        👤 M3 — Approval summary cards, sign CTA
    └── ledger/
        └── PdfExportButton.tsx        👤 M3 — jsPDF client handoff export
│
│  ── MEMBER 4: SOW Scanner, Drift Simulator & AI APIs ──
├── src/app/
│   ├── scanner/
│   │   └── page.tsx                   👤 M4 — Screen 3: Pre-Kickoff SOW Scanner
│   ├── simulator/
│   │   └── page.tsx                   👤 M4 — Screen 5: Live Drift & Swap Simulator
│   └── api/
│       ├── scan-sow/
│       │   └── route.ts               👤 M4 — POST /api/scan-sow (Zod validated)
│       └── parse-scope/
│           └── route.ts               👤 M4 — POST /api/parse-scope (Zod validated)
├── src/components/
│   ├── scanner/                       👤 M4 — SOW textarea, ambiguity cards
│   └── simulator/                     👤 M4 — Drift slider, swap resolution UI
└── src/lib/
    └── fallbacks/                     👤 M4 — Stage-safe static JSON fallbacks
│
│  ── MEMBER 5: Demo Fixtures, SQL Seed & End-to-End QA ──
├── supabase/
│   └── seed.sql                       👤 M5 — VastraKart demo data seed
├── src/lib/
│   └── fallbacks/
│       └── vastrakart-demo.ts         👤 M5 — TS mirror of seed for offline use
└── DEMO_SCRIPT.md                     👤 M5 — 2-minute live hackathon demo script
```

### Zone Summary

| Zone | Owner | Key Files |
|:-----|:------|:----------|
| 🔒 Shared / Protected Core | **Member 1 (Lead Integrator)** | `src/types/*`, `src/lib/supabase/*`, `src/lib/engine/*`, `src/components/shared/*`, `layout.tsx`, `globals.css`, `schema.sql`, `package.json`, `.env.example` |
| 👤 Landing · Auth · Dashboard | **Member 2** | `src/app/page.tsx`, `src/app/login/**`, `src/app/dashboard/**`, `src/components/landing/**`, `src/components/dashboard/**` |
| 👤 Portal · Ledger · PDF | **Member 3** | `src/app/approve/[token]/**`, `src/app/ledger/**`, `src/components/portal/**`, `src/components/ledger/**` |
| 👤 Scanner · Simulator · APIs | **Member 4** | `src/app/scanner/**`, `src/app/simulator/**`, `src/app/api/**`, `src/components/scanner/**`, `src/components/simulator/**`, `src/lib/fallbacks/**` |
| 👤 Demo Fixtures · QA | **Member 5** | `supabase/seed.sql`, `src/lib/fallbacks/vastrakart-demo.ts`, `DEMO_SCRIPT.md` |

---

## 2. Strict Module Ownership & Anti-Conflict Locks

> [!CAUTION]
> These rules apply equally to **human edits** and **AI agents** (Antigravity, Claude Code, Codex, Cursor, Copilot). No agent may bypass an ownership lock.

### File Boundary Table

| File / Folder | Owner | ✅ DO | ❌ DO NOT |
|:---|:---|:---|:---|
| `src/types/csc.ts` | 🔒 Member 1 | Import and use exported types freely | Edit, rename, extend, or add fields directly |
| `src/lib/supabase/client.ts` | 🔒 Member 1 | Import `createBrowserClient()` | Modify client config, add middleware, change cookies |
| `src/lib/supabase/server.ts` | 🔒 Member 1 | Import `createServerClient()` | Modify server config or cookie handlers |
| `src/lib/engine/swap-math.ts` | 🔒 Member 1 | Import and call `calculateScopeSwap()` | Change math logic, signatures, or return shape |
| `src/components/shared/*` | 🔒 Member 1 | Use `<AppSidebar />`, `<KpiBentoGrid />` as-is | Edit shared component markup, props, or styles |
| `src/app/layout.tsx` | 🔒 Member 1 | Rely on root layout being present | Add providers, scripts, or meta tags without PR |
| `src/app/globals.css` | 🔒 Member 1 | Use all defined CSS tokens/variables | Add global rules, change tokens, override Tailwind base |
| `supabase/schema.sql` | 🔒 Member 1 | Run against your local Supabase | Add, drop, or alter tables/columns/policies |
| `package.json` | 🔒 Member 1 | Install packages via PR request to M1 | Run `pnpm add` / `npm install` and commit changes |
| `.env.example` | 🔒 Member 1 | Copy to `.env.local` and fill values | Add or remove env key declarations |
| `src/app/page.tsx` | 👤 Member 2 | Full ownership | Other members must not edit without M2 approval |
| `src/app/login/**` | 👤 Member 2 | Full ownership | — |
| `src/app/dashboard/**` | 👤 Member 2 | Full ownership | — |
| `src/components/landing/**` | 👤 Member 2 | Full ownership | — |
| `src/components/dashboard/**` | 👤 Member 2 | Full ownership | — |
| `src/app/approve/[token]/**` | 👤 Member 3 | Full ownership | — |
| `src/app/ledger/**` | 👤 Member 3 | Full ownership | — |
| `src/components/portal/**` | 👤 Member 3 | Full ownership | — |
| `src/components/ledger/**` | 👤 Member 3 | Full ownership | — |
| `src/app/scanner/**` | 👤 Member 4 | Full ownership | — |
| `src/app/simulator/**` | 👤 Member 4 | Full ownership | — |
| `src/app/api/scan-sow/**` | 👤 Member 4 | Full ownership | — |
| `src/app/api/parse-scope/**` | 👤 Member 4 | Full ownership | — |
| `src/components/scanner/**` | 👤 Member 4 | Full ownership | — |
| `src/components/simulator/**` | 👤 Member 4 | Full ownership | — |
| `src/lib/fallbacks/**` | 👤 Member 4 & 5 | Shared write access | Member 1–3 must not edit |
| `supabase/seed.sql` | 👤 Member 5 | Full ownership | — |
| `src/lib/fallbacks/vastrakart-demo.ts` | 👤 Member 5 | Full ownership | — |
| `DEMO_SCRIPT.md` | 👤 Member 5 | Full ownership | — |

### Protocol for Requesting Shared-Core Changes

If you need a change to any 🔒 file — especially `src/types/csc.ts` — **you must never edit it directly**. Follow this protocol:

```
1. OPEN an issue on GitHub (or message Member 1 directly) describing:
   - Which interface/type needs changing
   - What field(s) to add/remove/rename and why
   - Which of your files will consume the new type

2. Member 1 makes the change on branch `feat/shared-shell`,
   runs `npx tsc --noEmit`, and merges to `main`.

3. All teammates pull `main` before resuming work:
      git pull origin main

4. Never cherry-pick or rebase around a shared-core change —
   always pull the full merge commit.
```

> [!WARNING]
> **AI Agent Rule:** If you are an AI agent (Antigravity, Claude Code, Codex, etc.) working on behalf of Member 2, 3, 4, or 5 — you are **explicitly prohibited** from opening, reading with intent to edit, or writing any file marked 🔒 above. If a task requires a shared-core change, stop and instruct the human to follow the request protocol above.

---

## 3. Task Division & Deliverables (All 5 Members)

### Member 1 — Lead Integrator & Shared Shell

**Branch:** `feat/shared-shell`

**Owns:**
- `src/types/csc.ts` — All TypeScript interfaces (`Project`, `ScopeItem`, `SowAmbiguity`, `ChangeRequest`, `AuditLedger`, `ScopeSwapResult`)
- `src/lib/supabase/client.ts` + `server.ts` — Typed Supabase browser & server clients
- `src/lib/engine/swap-math.ts` — `calculateScopeSwap()` deterministic rupee/hour swap math
- `src/components/shared/AppSidebar.tsx` — Fixed 240px workspace sidebar with 5 nav links
- `src/components/shared/KpiBentoGrid.tsx` — 4-card KPI bento layout
- `src/app/layout.tsx` — Root layout (Plus Jakarta Sans + Inter + Geist Mono fonts)
- `src/app/globals.css` — All CSS tokens (`--bg-canvas`, `--brand-primary`, `--status-warn`, etc.)
- `supabase/schema.sql` — Full PostgreSQL schema + RLS policies
- `package.json` — Dependency manifest
- `.env.example` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Key Deliverables:**

| # | Deliverable | Detail |
|:--|:------------|:-------|
| 1 | `calculateScopeSwap()` | Receives incoming drift hours, finds best swappable `ScopeItem`, returns `ScopeSwapResult` with net Δhrs = 0 |
| 2 | Shared `<AppSidebar />` | SOW Scanner → Dashboard → Simulator → Client Portal → Audit Ledger + PixelCraft Studio workspace card |
| 3 | CSS Token layer | All design tokens from DESIGN.md wired as CSS variables in `globals.css` |
| 4 | DB schema + RLS | 5 tables: `projects`, `sow_ambiguities`, `scope_items`, `change_requests`, `audit_ledger` with correct policies |
| 5 | PR review & merge | Reviews all 4 teammate PRs into `main`; runs `npx tsc --noEmit` before every merge |

---

### Member 2 — Landing Page, Auth & Scope Health Dashboard

**Branch:** `feat/landing-dashboard`

**Owns:**
- `src/app/page.tsx` — Landing page (Screen 1)
- `src/app/login/page.tsx` — Agency login + one-click demo bypass (Screen 2)
- `src/app/dashboard/page.tsx` — Scope Health Dashboard (Screen 4)
- `src/components/landing/**` — Hero, 2-Layer Defense comparison, screen card grid
- `src/components/dashboard/**` — KPI callout cards, scope item table, budget gauge

**Key Deliverables:**

| # | Screen | Route | Detail |
|:--|:-------|:------|:-------|
| 1 | Landing Page | `/` | Top navbar (Features · 7-Screen Flow · Live Demo · Login), 1200px hero, 2-Layer Defense visual, 7 screen quick-launch cards |
| 2 | Agency Login | `/login` | Supabase Auth form + **"Try Live Demo →"** button that sets `demo-bypass` cookie and redirects to `/dashboard` without credentials |
| 3 | Scope Dashboard | `/dashboard` | 4 KPI cards: `₹1,50,000 Budget` / `120 hrs` / `+14 hr Drift` / `Swappable Pool`; scope item table with status pills; budget bar gauge |

**VastraKart Demo Data to Display:**
- Budget Cap: **₹1,50,000** · Total Hours: **120 hrs**
- Active drift scenario: **+14 hrs** (WhatsApp OTP 6hr + Excel Export 8hr) swapped against **Blog CMS 14hr**
- Display swap as: `Swappable (14 hrs) → Deferred to Phase 2`

---

### Member 3 — Client Approval Portal, Audit Ledger & PDF Export

**Branch:** `feat/portal-ledger`

**Owns:**
- `src/app/approve/[token]/page.tsx` — Public Client Approval Portal (Screen 6)
- `src/app/ledger/page.tsx` — Immutable Audit Ledger (Screen 7)
- `src/components/portal/**` — Approval contract sheet, scope swap summary, approve/reject CTA
- `src/components/ledger/PdfExportButton.tsx` — `jsPDF` client handoff PDF generator

**Key Deliverables:**

| # | Screen | Route | Detail |
|:--|:-------|:------|:-------|
| 1 | Client Approval Portal | `/approve/demo-csc-892a` | Tokenized public page (no sidebar). 720px centered contract sheet showing: change request summary, `+14 hrs / ₹17,500 drift`, scope swap proposal, approve / reject buttons. `approval_token = 'demo-csc-892a'` |
| 2 | Audit Ledger | `/ledger` | Append-only timeline of all events (`#CSC-001A` SOW Clarified → `#CSC-892A` Scope Swap Approved). Verification hashes rendered in Geist Mono. Delta columns `tabular-nums` aligned. |
| 3 | PDF Export | Button on `/ledger` | `jsPDF` export of full audit ledger with VastraKart header, PixelCraft Studio footer, and all `#CSC-XXXX` hashes. |

**Approval Flow for Demo:**
- `demo-csc-892a` token resolves to the WhatsApp OTP + Excel Export change request
- Clicking "Approve" updates `approval_status = 'approved'` in Supabase + writes a new `audit_ledger` row
- Portal shows green "Approved ✓" state after submission

---

### Member 4 — Pre-Kickoff SOW Ambiguity Scanner, Drift Simulator & AI APIs

**Branch:** `feat/scanner-simulator`

**Owns:**
- `src/app/scanner/page.tsx` — SOW Ambiguity Scanner (Screen 3)
- `src/app/simulator/page.tsx` — Live Drift & Swap Simulator (Screen 5)
- `src/app/api/scan-sow/route.ts` — `POST /api/scan-sow`
- `src/app/api/parse-scope/route.ts` — `POST /api/parse-scope`
- `src/components/scanner/**` — SOW textarea, ambiguity card list, resolved spec inputs
- `src/components/simulator/**` — Drift slider, incoming request textarea, swap resolution panel
- `src/lib/fallbacks/**` — Stage-safe static JSON fallbacks for all AI routes

**Key Deliverables:**

| # | Deliverable | Detail |
|:--|:------------|:-------|
| 1 | SOW Scanner UI | `/scanner`: Paste SOW text → scan → renders amber ambiguity cards. Demo catches: `"Include user login"` → flags **Google OAuth/OTP/2FA unspecified**; `"Admin dashboard with order reports"` → flags **Excel/CSV export unspecified** |
| 2 | `POST /api/scan-sow` | Zod validates `{ sowText: string }`. Returns `{ ambiguities: SowAmbiguity[] }`. Falls back to `src/lib/fallbacks/scan-sow-fallback.json` when AI is unavailable |
| 3 | `POST /api/parse-scope` | Zod validates `{ clientMessage: string, baselineItems: ScopeItem[], hourlyRate: number }`. Returns `{ in_scope, out_of_scope, total_drift_hours, total_drift_cost_inr }`. Hourly rate = **₹1,250**. Fallback JSON pre-loaded with WhatsApp OTP + Excel Export demo response |
| 4 | Drift Simulator UI | `/simulator`: Paste client WhatsApp message → parse → show split (in-scope vs out-of-scope) → call `calculateScopeSwap()` from `src/lib/engine/swap-math.ts` → display swap resolution with net Δhrs = 0 |
| 5 | Zod schemas | All API routes must validate with Zod before touching Supabase or calling AI. Return `400` with structured error on invalid input. |
| 6 | Fallback files | `src/lib/fallbacks/scan-sow-fallback.json` + `src/lib/fallbacks/parse-scope-fallback.json` — must match the exact API output shapes in `ARCHITECTURE.md` |

**Half-Specified Clause Examples to Catch (Demo):**
- `"Standard login system for customers"` → Missing: Google OAuth / WhatsApp OTP / 2FA method
- `"Admin dashboard with order reports"` → Missing: CSV / Excel / PDF export format
- `"Product search"` → Missing: Fuzzy search vs exact match, filters, Algolia vs built-in DB

---

### Member 5 — Demo Fixtures, SQL Seed & End-to-End QA

**Branch:** `feat/demo-fixtures`

**Owns:**
- `supabase/seed.sql` — VastraKart demo dataset (idempotent `DO $$ ... $$` block)
- `src/lib/fallbacks/vastrakart-demo.ts` — TypeScript mirror of seed data for offline/stage use
- `DEMO_SCRIPT.md` — 2-minute live hackathon demo script

**Key Deliverables:**

| # | Deliverable | Detail |
|:--|:------------|:-------|
| 1 | `seed.sql` | Idempotent seed. Inserts VastraKart project (`₹1,50,000` / `120 hrs`), 2 SOW ambiguities, 8 scope items (3 swappable), 1 change request (`demo-csc-892a`), 2 audit ledger entries (`#CSC-001A`, `#CSC-892A`) |
| 2 | `vastrakart-demo.ts` | Exports `VASTRAKART_PROJECT`, `VASTRAKART_SCOPE_ITEMS`, `VASTRAKART_CHANGE_REQUEST`, `VASTRAKART_AUDIT_LEDGER` as typed constants matching `src/types/csc.ts` interfaces. Used by all fallback routes when Supabase is unavailable. |
| 3 | `DEMO_SCRIPT.md` | 2-minute script: (1) Landing → (2) Demo Login → (3) SOW Scanner paste & scan → (4) Dashboard KPIs → (5) Simulator WhatsApp message → (6) Client Approval Portal → (7) Audit Ledger PDF export. Each step timed to ~20 seconds. |
| 4 | End-to-End QA | Verify full 7-screen demo flow works with both live Supabase and fallback mode. File bugs as GitHub issues tagged `bug/m[2-4]`. Run `npx tsc --noEmit` and report any type errors to Member 1. |

**VastraKart Canonical Demo Numbers (must be consistent across all files):**

| Field | Value |
|:------|:------|
| Budget Cap | ₹1,50,000 |
| Total Hours | 120 hrs |
| Drift Addition | +14 hrs (WhatsApp OTP 6hr + Excel Export 8hr) |
| Swapped Out | Blog CMS — 14 hrs (deferred to Phase 2) |
| Net Δ | 0 hrs / ₹0 |
| Approval Token | `demo-csc-892a` |
| Audit Hash 1 | `#CSC-001A` (SOW Clarified) |
| Audit Hash 2 | `#CSC-892A` (Scope Swap Approved) |
| Hourly Rate | ₹1,250/hr |
| Drift Cost | ₹17,500 (14 hrs × ₹1,250) |

---

## 4. Git Branching & PR Rules

### Branch Names

| Member | Branch | Scope |
|:-------|:-------|:------|
| Member 1 | `feat/shared-shell` | Types, Supabase clients, engine, shared components, layout |
| Member 2 | `feat/landing-dashboard` | Landing page, login, dashboard |
| Member 3 | `feat/portal-ledger` | Approval portal, audit ledger, PDF export |
| Member 4 | `feat/scanner-simulator` | SOW scanner, drift simulator, API routes, fallbacks |
| Member 5 | `feat/demo-fixtures` | Seed SQL, TypeScript fixtures, demo script |

### Branch Creation

```bash
# Each member runs once from main:
git checkout main
git pull origin main
git checkout -b feat/<your-branch-name>
```

### Pre-PR Verification Checklist

Before opening a Pull Request, every member **must** run all three checks:

```bash
# 1. TypeScript — zero errors required
npx tsc --noEmit

# 2. ESLint — no blocking errors
npx eslint src --ext .ts,.tsx --max-warnings 0

# 3. Next.js build smoke check
npx next build
```

> [!IMPORTANT]
> **Do not open a PR if `npx tsc --noEmit` fails.** Fix all type errors first. If the error originates in a 🔒 shared file, follow the shared-core change request protocol in Section 2.

### PR Rules

1. **Target branch:** Always `main`. Never PR into another teammate's feature branch.
2. **PR title format:** `feat(m[1-5]): <short description>` — e.g., `feat(m2): landing page and demo login`
3. **PR description must include:**
   - Screenshot or Puppeteer output of the UI
   - Confirmation that `npx tsc --noEmit` passed (paste last line of output)
   - List of files changed (must stay within your folder lock)
4. **Reviewer:** Always request review from **Member 1** (Lead Integrator).
5. **Merge:** Only Member 1 merges PRs into `main`.
6. **Conflict resolution:** If `main` has moved ahead, rebase your branch:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
7. **Never force-push `main`.**

### Demo Day Emergency Protocol

If a teammate's feature is broken on demo day and their branch isn't merged:

```bash
# Member 1 applies a temporary patch on main:
git checkout main
git cherry-pick <commit-hash>  # Only the specific working commit
# Fix and re-verify: npx tsc --noEmit
```

---

## 5. Starter Instruction Block for Teammate AI Agents

> Copy the block for your member number and paste it at the **start of every AI agent session** (Antigravity, Claude Code, Codex, Cursor, Copilot, etc.).

---

### 🤖 Member 2 Agent Starter Block

```
You are working on the CSC Guardrail project (csc-guardrail/).
READ TEAM_WORKFLOW.md at the project root before writing any code.

Your folder lock (Member 2 — Landing · Auth · Dashboard):
  ALLOWED to edit:
    src/app/page.tsx
    src/app/login/**
    src/app/dashboard/**
    src/components/landing/**
    src/components/dashboard/**

  FORBIDDEN — do NOT open with intent to edit:
    src/types/csc.ts            ← import only
    src/lib/supabase/**         ← import only
    src/lib/engine/**           ← import only
    src/components/shared/**    ← use as-is
    src/app/layout.tsx          ← read only
    src/app/globals.css         ← read only
    supabase/schema.sql         ← read only
    package.json                ← do not install packages without Lead approval
    Any src/app/scanner/**      ← Member 4 owns
    Any src/app/simulator/**    ← Member 4 owns
    Any src/app/approve/**      ← Member 3 owns
    Any src/app/ledger/**       ← Member 3 owns

Before finishing any task: run `npx tsc --noEmit` and confirm zero errors.
Branch: feat/landing-dashboard
```

---

### 🤖 Member 3 Agent Starter Block

```
You are working on the CSC Guardrail project (csc-guardrail/).
READ TEAM_WORKFLOW.md at the project root before writing any code.

Your folder lock (Member 3 — Portal · Ledger · PDF):
  ALLOWED to edit:
    src/app/approve/[token]/**
    src/app/ledger/**
    src/components/portal/**
    src/components/ledger/**

  FORBIDDEN — do NOT open with intent to edit:
    src/types/csc.ts            ← import only
    src/lib/supabase/**         ← import only
    src/lib/engine/**           ← import only
    src/components/shared/**    ← use as-is
    src/app/layout.tsx          ← read only
    src/app/globals.css         ← read only
    supabase/schema.sql         ← read only
    package.json                ← do not install packages without Lead approval
    Any src/app/page.tsx        ← Member 2 owns
    Any src/app/login/**        ← Member 2 owns
    Any src/app/dashboard/**    ← Member 2 owns
    Any src/app/scanner/**      ← Member 4 owns
    Any src/app/simulator/**    ← Member 4 owns

Approval token for demo: demo-csc-892a
Audit hashes: #CSC-001A, #CSC-892A
Before finishing any task: run `npx tsc --noEmit` and confirm zero errors.
Branch: feat/portal-ledger
```

---

### 🤖 Member 4 Agent Starter Block

```
You are working on the CSC Guardrail project (csc-guardrail/).
READ TEAM_WORKFLOW.md at the project root before writing any code.

Your folder lock (Member 4 — Scanner · Simulator · AI APIs):
  ALLOWED to edit:
    src/app/scanner/**
    src/app/simulator/**
    src/app/api/scan-sow/**
    src/app/api/parse-scope/**
    src/components/scanner/**
    src/components/simulator/**
    src/lib/fallbacks/**

  FORBIDDEN — do NOT open with intent to edit:
    src/types/csc.ts            ← import only
    src/lib/supabase/**         ← import only
    src/lib/engine/swap-math.ts ← import calculateScopeSwap() only
    src/components/shared/**    ← use as-is
    src/app/layout.tsx          ← read only
    src/app/globals.css         ← read only
    supabase/schema.sql         ← read only
    package.json                ← do not install packages without Lead approval
    Any src/app/page.tsx        ← Member 2 owns
    Any src/app/dashboard/**    ← Member 2 owns
    Any src/app/approve/**      ← Member 3 owns
    Any src/app/ledger/**       ← Member 3 owns

Zod is required on all API routes. Hourly rate = 1250 (INR).
Fallbacks must match ARCHITECTURE.md API output shapes exactly.
Before finishing any task: run `npx tsc --noEmit` and confirm zero errors.
Branch: feat/scanner-simulator
```

---

### 🤖 Member 5 Agent Starter Block

```
You are working on the CSC Guardrail project (csc-guardrail/).
READ TEAM_WORKFLOW.md at the project root before writing any code.

Your folder lock (Member 5 — Demo Fixtures · QA):
  ALLOWED to edit:
    supabase/seed.sql
    src/lib/fallbacks/vastrakart-demo.ts
    DEMO_SCRIPT.md

  FORBIDDEN — do NOT open with intent to edit:
    src/types/csc.ts            ← import only
    src/lib/supabase/**         ← read only
    src/lib/engine/**           ← read only
    src/components/**           ← read only (QA, no edits)
    src/app/layout.tsx          ← read only
    supabase/schema.sql         ← read only (seed.sql must match schema)
    package.json                ← do not install packages without Lead approval
    Any src/app/**              ← read only for QA verification

Canonical demo numbers:
  budget_cap_inr = 150000  (₹1,50,000)
  total_hours    = 120
  drift_hours    = 14  (WhatsApp OTP 6hr + Excel Export 8hr)
  approval_token = 'demo-csc-892a'
  hourly_rate    = 1250

seed.sql MUST be idempotent (DO $$ block checking for existing VastraKart row).
vastrakart-demo.ts types must match src/types/csc.ts interfaces exactly.
Before finishing any task: run `npx tsc --noEmit` and confirm zero errors.
Branch: feat/demo-fixtures
```

---

*Maintained by Member 1 (Lead Integrator). All sections reflect the canonical project structure as of 2026-11-27. Changes to this document require Lead Integrator approval.*
