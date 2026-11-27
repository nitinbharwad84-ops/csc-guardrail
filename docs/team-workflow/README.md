# CSC Guardrail — Team Workflow Master Overview

> **Project:** CSC Guardrail · Client Scope & Change Management SaaS  
> **Demo Client:** VastraKart (₹1,50,000 fixed cap · 120 hrs · ₹1,250/hr)  
> **Stack:** Next.js 15 App Router · TypeScript strict · Tailwind CSS · Supabase · Vercel  
> **Team:** 5 Members · Lead Integrator: Member 1  
> **Last Updated:** 2026-11-27

---

## 📂 Documentation Map

```
docs/team-workflow/
├── README.md                              ← You are here — master overview
├── rules/
│   ├── folder-ownership-locks.md          ← DO / DO NOT table & change-request protocol
│   └── git-and-pr-workflow.md             ← Branch naming, sync, conflict resolution
└── tracks/
    ├── track-01-lead-integrator.md        ← Member 1: Shared core + PR integration
    ├── track-02-landing-auth-dashboard.md ← Member 2: /, /login, /dashboard
    ├── track-03-portal-ledger-pdf.md      ← Member 3: /approve/[token], /ledger, PDF
    ├── track-04-scanner-simulator-ai.md   ← Member 4: /scanner, /simulator, /api/*
    └── track-05-demo-seed-qa.md           ← Member 5: seed.sql, fixtures, DEMO_SCRIPT
```

> **For AI agents:** Read your track file first, then `rules/folder-ownership-locks.md`. Never edit a file marked FORBID. Run `npx tsc --noEmit` before every PR.

---

## 🏗️ Repository & Folder Structure Map

```text
csc-guardrail/
│
│  ╔══════════════════════════════════════════════════════════════╗
│  ║  🔒  SHARED / PROTECTED CORE  —  MEMBER 1 (LEAD) ONLY       ║
│  ╚══════════════════════════════════════════════════════════════╝
│
├── src/types/
│   └── csc.ts                     🔒 Canonical domain interfaces
├── src/lib/
│   ├── supabase/
│   │   ├── client.ts              🔒 Browser Supabase client
│   │   └── server.ts              🔒 Server Supabase client
│   └── engine/
│       └── swap-math.ts           🔒 calculateScopeSwap() math
├── src/components/shared/
│   ├── AppSidebar.tsx             🔒 240px workspace sidebar
│   └── KpiBentoGrid.tsx           🔒 4-card KPI bento grid
├── src/app/
│   ├── layout.tsx                 🔒 Root layout & font loading
│   └── globals.css                🔒 CSS tokens & Tailwind base
├── supabase/schema.sql            🔒 Canonical DB schema + RLS
├── package.json                   🔒 Dependency manifest
└── .env.example                   🔒 Env variable template
│
│  ╔══════════════════════════════════════════════════════════════╗
│  ║  👤  ISOLATED TEAMMATE WORKSPACES                            ║
│  ╚══════════════════════════════════════════════════════════════╝
│
│  ── MEMBER 2 ──────────────────────────────────────────────────
├── src/app/page.tsx               👤 M2 — Landing Page (Screen 1)
├── src/app/login/page.tsx         👤 M2 — Agency Login + Demo Bypass (Screen 2)
├── src/app/dashboard/page.tsx     👤 M2 — Scope Health Dashboard (Screen 4)
├── src/components/landing/        👤 M2 — Hero, 2-Layer Defense, screen cards
└── src/components/dashboard/      👤 M2 — KPI callouts, scope table, gauge
│
│  ── MEMBER 3 ──────────────────────────────────────────────────
├── src/app/approve/[token]/page.tsx  👤 M3 — Client Approval Portal (Screen 6)
├── src/app/ledger/page.tsx           👤 M3 — Audit Ledger + PDF (Screen 7)
├── src/components/portal/            👤 M3 — Approval summary cards, sign CTA
└── src/components/ledger/            👤 M3 — PdfExportButton (jsPDF)
│
│  ── MEMBER 4 ──────────────────────────────────────────────────
├── src/app/scanner/page.tsx       👤 M4 — SOW Ambiguity Scanner (Screen 3)
├── src/app/simulator/page.tsx     👤 M4 — Drift & Swap Simulator (Screen 5)
├── src/app/api/scan-sow/          👤 M4 — POST /api/scan-sow
├── src/app/api/parse-scope/       👤 M4 — POST /api/parse-scope
├── src/components/scanner/        👤 M4 — SOW textarea, ambiguity cards
├── src/components/simulator/      👤 M4 — Drift slider, swap resolution UI
└── src/lib/fallbacks/             👤 M4 & M5 — Stage-safe static JSON fallbacks
│
│  ── MEMBER 5 ──────────────────────────────────────────────────
├── supabase/seed.sql              👤 M5 — VastraKart demo dataset (idempotent)
├── src/lib/fallbacks/vastrakart-demo.ts  👤 M5 — TS mirror of seed data
└── DEMO_SCRIPT.md                 👤 M5 — 2-minute live hackathon demo script
```

---

## 👥 Zone Ownership Summary

| Zone | Member | Branch |
|:-----|:-------|:-------|
| 🔒 Shared / Protected Core | **Member 1** (Lead Integrator) | `feat/shared-shell` |
| Landing · Auth · Dashboard | **Member 2** | `feat/landing-dashboard` |
| Portal · Ledger · PDF | **Member 3** | `feat/portal-ledger` |
| Scanner · Simulator · AI APIs | **Member 4** | `feat/scanner-simulator` |
| Demo Fixtures · SQL Seed · QA | **Member 5** | `feat/demo-fixtures` |

---

## 🌿 Git & PR Rules (Quick Reference)

> Full rules → [`rules/git-and-pr-workflow.md`](rules/git-and-pr-workflow.md)

1. **Branch off `main`** using the name in your track file.
2. **Pre-PR:** `npx tsc --noEmit` must exit 0. No PR if it fails.
3. **Target:** All PRs target `main`. Never PR into a teammate's branch.
4. **Reviewer:** Always request **Member 1** (Lead Integrator).
5. **Merge:** Only Member 1 merges into `main`.
6. **No git add / commit / push by AI agents.**

---

## 🔒 Shared-Core Change Protocol (Quick Reference)

> Full protocol → [`rules/folder-ownership-locks.md`](rules/folder-ownership-locks.md)

If you need to change `src/types/csc.ts`, `src/lib/engine/swap-math.ts`, or any other locked file:

1. **Stop.** Do not edit the file.
2. **Open a GitHub issue** (or message Member 1) describing: which interface/function, what change, which of your files will consume it.
3. **Member 1 applies the change** on `feat/shared-shell`, runs `tsc --noEmit`, merges to `main`.
4. All teammates run `git pull origin main` before resuming.

---

## 🤖 Universal Teammate Agent Starter Block

> This is a minimal block. Copy the **track-specific** starter block from your track file — it has your exact ALLOW/FORBID paths.

```
You are working on the CSC Guardrail project (Next.js 15, TypeScript strict, Supabase).

BEFORE writing any code:
  1. Read docs/team-workflow/README.md
  2. Read your track file at docs/team-workflow/tracks/track-0X-*.md
  3. Read docs/team-workflow/rules/folder-ownership-locks.md

UNIVERSAL RULES:
  - Never edit any file marked FORBID in your track file.
  - To change src/types/csc.ts or any shared-core file, STOP and
    ask the human to open an issue for Member 1. Never edit it yourself.
  - Run `npx tsc --noEmit` before marking any task complete.
  - Never run git add, git commit, or git push.
  - All VastraKart demo numbers are canonical — do not change them.

Canonical demo numbers:
  budget_cap_inr = 150000  (₹1,50,000)
  total_hours    = 120 hrs
  drift_hours    = +14 hrs (WhatsApp OTP 6hr + Excel Export 8hr)
  swapped_out    = Blog CMS 14hr → Phase 2
  approval_token = 'demo-csc-892a'
  hourly_rate    = ₹1,250/hr
```

---

## 📋 Canonical VastraKart Demo Numbers

| Field | Value | Source |
|:------|:------|:-------|
| Budget Cap | ₹1,50,000 | `projects.budget_cap_inr = 150000` |
| Total Hours | 120 hrs | `projects.total_hours = 120` |
| Hourly Rate | ₹1,250/hr | `POST /api/parse-scope` → `hourlyRate: 1250` |
| Drift In (+) | +14 hrs | WhatsApp OTP 6hr + Excel Export 8hr |
| Drift Cost | ₹17,500 | 14 × ₹1,250 |
| Swapped Out (−) | Blog CMS −14 hrs | Deferred to Phase 2 |
| Net Δ | 0 hrs / ₹0 | `calculateScopeSwap()` output |
| Approval Token | `demo-csc-892a` | `change_requests.approval_token` |
| Audit Hash 1 | `#CSC-001A` | SOW Clarified event |
| Audit Hash 2 | `#CSC-892A` | Scope Swap Approved event |

---

*Maintained by Member 1 (Lead Integrator). Changes to this file require Lead approval.*
