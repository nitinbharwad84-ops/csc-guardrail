<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# CSC Guardrail — Claude Code Agent Instructions

> **This file is read by Claude Code (and compatible agents) at session start.**  
> Always read `docs/team-workflow/README.md` and your track guide in `docs/team-workflow/tracks/` **before writing any code**.  
> Always read `docs/team-workflow/rules/folder-ownership-locks.md` and `.agent/rules/01-master-rules.md` for the machine-readable ownership lock table.

---

## Project Overview

**CSC Guardrail** is a Client Scope & Change Management SaaS built for hackathon demo.

- **Demo Client:** VastraKart (₹1,50,000 fixed cap · 120 hrs · ₹1,250/hr)
- **Stack:** Next.js 15 App Router · TypeScript strict · Tailwind CSS · Supabase · Vercel
- **7 Screens:** Landing → Login → SOW Scanner → Dashboard → Simulator → Client Approval → Audit Ledger

---

## Folder Ownership Locks

### 🔒 SHARED CORE — LOCKED (Member 1 / Lead Integrator Only)

```
src/types/csc.ts                  ← IMPORT ONLY — never edit directly
src/lib/supabase/client.ts        ← IMPORT ONLY
src/lib/supabase/server.ts        ← IMPORT ONLY
src/lib/engine/swap-math.ts       ← IMPORT calculateScopeSwap() ONLY
src/components/shared/            ← USE AS-IS — never modify
src/app/layout.tsx                ← READ ONLY
src/app/globals.css               ← READ ONLY
supabase/schema.sql               ← READ ONLY
package.json                      ← DO NOT install packages without Lead approval
.env.example                      ← COPY to .env.local only
```

### 👤 Member Workspaces (Full Write Access)

| Member | Branch | Owns |
|:-------|:-------|:-----|
| M2 | `feat/landing-dashboard` | `src/app/page.tsx`, `src/app/login/**`, `src/app/dashboard/**`, `src/components/landing/**`, `src/components/dashboard/**` |
| M3 | `feat/portal-ledger` | `src/app/approve/[token]/**`, `src/app/ledger/**`, `src/components/portal/**`, `src/components/ledger/**` |
| M4 | `feat/scanner-simulator` | `src/app/scanner/**`, `src/app/simulator/**`, `src/app/api/**`, `src/components/scanner/**`, `src/components/simulator/**`, `src/lib/fallbacks/**` |
| M5 | `feat/demo-fixtures` | `supabase/seed.sql`, `src/lib/fallbacks/vastrakart-demo.ts`, `DEMO_SCRIPT.md` |

---

## Requesting Shared-Core Changes (src/types/csc.ts etc.)

**Never edit locked files directly.** If you need a type change:

1. Stop and tell the human: *"This requires a shared-core change. Please open an issue for Member 1 (Lead Integrator) with: [field name], [why it's needed], [which files will use it]."*
2. Wait for Member 1 to merge the change into `main`.
3. Human runs `git pull origin main` before you resume.

---

## Key Conventions

### TypeScript
- `"strict": true` in `tsconfig.json` — zero implicit `any`
- Run `npx tsc --noEmit` before marking any task complete
- All types live in `src/types/csc.ts` — import don't duplicate

### API Routes (Member 4)
```typescript
// All routes must follow this pattern:
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const InputSchema = z.object({ /* ... */ })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = InputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  // ... logic, then fallback if AI unavailable
}
```

### Supabase Clients
```typescript
// Server Components / Route Handlers:
import { createServerClient } from '@/lib/supabase/server'

// Client Components:
import { createBrowserClient } from '@/lib/supabase/client'
```

### Swap Math (Member 4 — Simulator)
```typescript
import { calculateScopeSwap } from '@/lib/engine/swap-math'
// Do NOT copy this logic — always import the canonical function
```

### Fallbacks (Member 4 & 5)
```typescript
// If Supabase / AI unavailable, serve static data:
import { VASTRAKART_PROJECT, VASTRAKART_SCOPE_ITEMS } from '@/lib/fallbacks/vastrakart-demo'
```

---

## Canonical VastraKart Demo Numbers

| Field | Value |
|:------|:------|
| Budget Cap | ₹1,50,000 (`budget_cap_inr: 150000`) |
| Total Hours | 120 hrs (`total_hours: 120`) |
| Drift Addition | +14 hrs (WhatsApp OTP 6hr + Excel Export 8hr) |
| Swapped Out | Blog CMS 14hr → Phase 2 |
| Net Delta | 0 hrs / ₹0 |
| Approval Token | `demo-csc-892a` |
| Audit Hash 1 | `#CSC-001A` |
| Audit Hash 2 | `#CSC-892A` |
| Hourly Rate | ₹1,250/hr |

---

## Design System Tokens (from globals.css)

```css
/* Use these CSS variables — never hardcode hex colors */
--bg-canvas: #F8FAFC;      /* slate-50  — page background */
--bg-surface: #FFFFFF;     /* white     — cards, sidebar */
--brand-primary: #4F46E5;  /* indigo-600 — CTAs, active nav */
--status-safe: #059669;    /* emerald-600 — in-scope, approved */
--status-warn: #D97706;    /* amber-600  — ambiguity, drift */
--status-danger: #DC2626;  /* red-600   — over cap, unresolved */
--text-primary: #0F172A;   /* slate-900 — headings */
--text-secondary: #475569; /* slate-600 — subtitles */
```

---

## Git Rules

- **No `git commit` or `git push` commands** — agents must not commit or push
- Branch off `main`, name: `feat/landing-dashboard`, `feat/portal-ledger`, `feat/scanner-simulator`, `feat/demo-fixtures`
- Run `npx tsc --noEmit` before every PR
- PRs always target `main`, reviewed by Member 1

---

## Pre-Task Checklist (Run at Every Session Start)

```bash
# 1. Confirm you are on the right branch
git branch --show-current

# 2. Pull latest main (if starting fresh)
git fetch origin main

# 3. Confirm TypeScript compiles clean
npx tsc --noEmit
```

---

*Maintained by Member 1 (Lead Integrator). Last updated: 2026-11-27.*
