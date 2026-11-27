<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# CSC Guardrail — Master Agent Rules & Folder Ownership Locks

> **Read `docs/team-workflow/README.md` and `docs/team-workflow/rules/folder-ownership-locks.md`** for the complete collaboration guide, task breakdown, and PR rules. This file contains the machine-readable ownership lock summary for AI coding agents.

---

## 1. Project Identity

- **Project:** CSC Guardrail · Client Scope & Change Management SaaS
- **Demo Client:** VastraKart (₹1,50,000 fixed cap · 120 hrs total · ₹1,250/hr)
- **Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · Supabase · Vercel
- **Lead Integrator:** Member 1

---

## 2. Folder Ownership Locks (AI Agent Hard Boundaries)

### 🔒 SHARED / PROTECTED CORE — LEAD INTEGRATOR (Member 1) ONLY

The following files and folders are **read-only** for all agents except the Lead Integrator's agent. You may **import** from them but must **never write, overwrite, or extend** them directly.

```
src/types/csc.ts                  ← LOCKED — import types only
src/lib/supabase/client.ts        ← LOCKED — import createBrowserClient() only
src/lib/supabase/server.ts        ← LOCKED — import createServerClient() only
src/lib/engine/swap-math.ts       ← LOCKED — import calculateScopeSwap() only
src/components/shared/            ← LOCKED — use <AppSidebar />, <KpiBentoGrid /> as-is
src/app/layout.tsx                ← LOCKED — do not add providers or scripts
src/app/globals.css               ← LOCKED — do not add or override CSS tokens
supabase/schema.sql               ← LOCKED — do not alter tables or policies
package.json                      ← LOCKED — do not install packages without Lead approval
.env.example                      ← LOCKED — copy to .env.local only
```

**To request a change to any locked file:** Open a GitHub issue or contact Member 1 directly. Never edit locked files in a PR. See `docs/team-workflow/rules/folder-ownership-locks.md` for the full request protocol.

---

### 👤 Member 2 — Landing · Auth · Dashboard

```
OWNS (full write access):
  src/app/page.tsx
  src/app/login/**
  src/app/dashboard/**
  src/components/landing/**
  src/components/dashboard/**

FORBIDDEN (read-only or no access):
  All 🔒 Shared Core files above
  src/app/scanner/**         ← Member 4
  src/app/simulator/**       ← Member 4
  src/app/api/**             ← Member 4
  src/app/approve/**         ← Member 3
  src/app/ledger/**          ← Member 3
  supabase/seed.sql          ← Member 5
  src/lib/fallbacks/**       ← Member 4 & 5
```

---

### 👤 Member 3 — Portal · Ledger · PDF

```
OWNS (full write access):
  src/app/approve/[token]/**
  src/app/ledger/**
  src/components/portal/**
  src/components/ledger/**

FORBIDDEN (read-only or no access):
  All 🔒 Shared Core files above
  src/app/page.tsx           ← Member 2
  src/app/login/**           ← Member 2
  src/app/dashboard/**       ← Member 2
  src/components/landing/**  ← Member 2
  src/components/dashboard/** ← Member 2
  src/app/scanner/**         ← Member 4
  src/app/simulator/**       ← Member 4
  src/app/api/**             ← Member 4
  supabase/seed.sql          ← Member 5
  src/lib/fallbacks/**       ← Member 4 & 5
```

---

### 👤 Member 4 — Scanner · Simulator · AI APIs · Fallbacks

```
OWNS (full write access):
  src/app/scanner/**
  src/app/simulator/**
  src/app/api/scan-sow/**
  src/app/api/parse-scope/**
  src/components/scanner/**
  src/components/simulator/**
  src/lib/fallbacks/**

FORBIDDEN (read-only or no access):
  All 🔒 Shared Core files above
  src/app/page.tsx           ← Member 2
  src/app/login/**           ← Member 2
  src/app/dashboard/**       ← Member 2
  src/components/landing/**  ← Member 2
  src/components/dashboard/** ← Member 2
  src/app/approve/**         ← Member 3
  src/app/ledger/**          ← Member 3
  src/components/portal/**   ← Member 3
  src/components/ledger/**   ← Member 3
  supabase/seed.sql          ← Member 5
```

---

### 👤 Member 5 — Demo Fixtures · SQL Seed · QA

```
OWNS (full write access):
  supabase/seed.sql
  src/lib/fallbacks/vastrakart-demo.ts
  DEMO_SCRIPT.md

FORBIDDEN (read-only/QA-only, no edits):
  All 🔒 Shared Core files above
  All src/app/** pages        ← read for QA verification only
  All src/components/**       ← read for QA verification only
  src/lib/fallbacks/*.json    ← Member 4 owns JSON fallbacks
```

---

## 3. Universal Agent Rules (All Members)

1. **Read `docs/team-workflow/README.md` and your track specification in `docs/team-workflow/tracks/` first** — before writing any code in a new session.
2. **TypeScript is strict** — `src/tsconfig.json` has `"strict": true`. Run `npx tsc --noEmit` before every PR.
3. **Zod required on API routes** — All `src/app/api/*/route.ts` files must validate with Zod before touching Supabase.
4. **Demo numbers are canonical** — Never change VastraKart figures (`₹1,50,000`, `120 hrs`, `+14 hr drift`, token `demo-csc-892a`) without Member 1 & Member 5 sign-off.
5. **No hardcoded secrets** — Use `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never commit real keys.
6. **Fallbacks are mandatory** — Every AI API route must work offline. If Supabase/AI is unavailable, serve the JSON from `src/lib/fallbacks/`.
7. **No `git commit` or `git push` by agents** — Only humans commit and push.
