# Track 04 — SOW Ambiguity Scanner, Drift Simulator & AI APIs

**Member:** 4  
**Branch:** `feat/scanner-simulator`  
**Role:** Builds the two core AI-powered screens (Day-0 SOW Scanner and Mid-Sprint Drift Simulator) plus all backend API routes with mandatory offline fallbacks. This is the most technically complex track.

---

## 📁 File Ownership

### ✅ ALLOW — Full Write Access

```
src/app/scanner/page.tsx             ← Screen 3: Pre-Kickoff SOW Ambiguity Scanner
src/app/simulator/page.tsx           ← Screen 5: Live Drift & Swap Simulator
src/app/api/scan-sow/route.ts        ← POST /api/scan-sow
src/app/api/parse-scope/route.ts     ← POST /api/parse-scope
src/components/scanner/              ← SOW textarea, ambiguity card list, resolved inputs
src/components/simulator/            ← Drift slider, message textarea, swap resolution panel
src/lib/fallbacks/                   ← JSON fallback files (Member 5 owns vastrakart-demo.ts here)
```

### ❌ FORBID — Do Not Read with Intent to Edit

```
src/types/csc.ts                     ← IMPORT ONLY (Member 1)
src/lib/supabase/**                  ← IMPORT ONLY (Member 1)
src/lib/engine/swap-math.ts          ← IMPORT calculateScopeSwap() ONLY (Member 1)
src/components/shared/**             ← USE AS-IS (Member 1)
src/app/layout.tsx                   ← READ ONLY (Member 1)
src/app/globals.css                  ← READ ONLY (Member 1)
supabase/schema.sql                  ← READ ONLY (Member 1)
package.json                         ← READ ONLY (Member 1)
src/app/page.tsx                     ← Member 2
src/app/login/**                     ← Member 2
src/app/dashboard/**                 ← Member 2
src/components/landing/**            ← Member 2
src/components/dashboard/**          ← Member 2
src/app/approve/**                   ← Member 3
src/app/ledger/**                    ← Member 3
src/components/portal/**             ← Member 3
src/components/ledger/**             ← Member 3
supabase/seed.sql                    ← Member 5
src/lib/fallbacks/vastrakart-demo.ts ← Member 5 (you may READ to import, never WRITE)
DEMO_SCRIPT.md                       ← Member 5
```

---

## 🔗 Dependencies on Shared Core

| Shared File | How Member 4 Uses It |
|:------------|:---------------------|
| `src/types/csc.ts` | Import `ScopeItem`, `SowAmbiguity`, `ChangeRequest`, `ScopeSwapResult`, `RequestedItem` |
| `src/lib/engine/swap-math.ts` | **Critical.** Call `calculateScopeSwap(swappableItems, driftHours, 1250)` in the Simulator UI |
| `src/lib/supabase/server.ts` | Fetch scope items + project data for API routes |
| `src/lib/supabase/client.ts` | Optionally save scan results or change requests from client components |
| `src/components/shared/AppSidebar.tsx` | Wrap `/scanner` and `/simulator` in `<AppSidebar />` |
| `src/app/globals.css` | Use `--status-warn-bg`, `--status-warn`, `--status-safe`, `--brand-primary` tokens |

> **Never copy the swap math logic.** Always import `calculateScopeSwap` from `src/lib/engine/swap-math.ts`. If you need a different output shape, open a request for Member 1.

---

## 📦 Key Deliverables

### 1. `POST /api/scan-sow` — SOW Ambiguity Scanner API

**Route:** `src/app/api/scan-sow/route.ts`

```typescript
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import type { SowAmbiguity } from '@/types/csc'

const InputSchema = z.object({
  sowText: z.string().min(10, 'SOW text must be at least 10 characters'),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = InputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    // Call AI (Gemini / OpenAI) to detect ambiguities
    // If AI fails → serve fallback:
    const fallback = await import('@/lib/fallbacks/scan-sow-fallback.json')
    return NextResponse.json(fallback)
  } catch {
    const fallback = await import('@/lib/fallbacks/scan-sow-fallback.json')
    return NextResponse.json(fallback)
  }
}
```

**Output shape** (must match ARCHITECTURE.md exactly):
```typescript
{
  ambiguities: Array<{
    clause_title: string
    vague_excerpt: string
    missing_details: string
    clarification_question: string
  }>
}
```

**Fallback file:** `src/lib/fallbacks/scan-sow-fallback.json`
```json
{
  "ambiguities": [
    {
      "clause_title": "User Authentication",
      "vague_excerpt": "Include user login and profile page.",
      "missing_details": "Login provider and security level not defined (Email/Password vs. Google OAuth vs. SMS/WhatsApp OTP).",
      "clarification_question": "Should Phase 1 include Email/Password login only, or social OAuth and 2FA?"
    },
    {
      "clause_title": "Order Reporting",
      "vague_excerpt": "Admin dashboard with order reports.",
      "missing_details": "Export formats (CSV, Excel, PDF) and custom date filters are not specified.",
      "clarification_question": "Is on-screen table view sufficient for Phase 1, or is downloadable Excel/CSV export required?"
    }
  ]
}
```

---

### 2. `POST /api/parse-scope` — Mid-Sprint Drift Detector API

**Route:** `src/app/api/parse-scope/route.ts`

```typescript
import { z } from 'zod'
import type { ScopeItem } from '@/types/csc'

const InputSchema = z.object({
  clientMessage: z.string().min(5),
  baselineItems: z.array(z.object({
    id: z.string(),
    title: z.string(),
    hours: z.number(),
    is_swappable: z.boolean(),
  })),
  hourlyRate: z.number().default(1250),  // Always 1250 for VastraKart
})
```

**Output shape** (must match ARCHITECTURE.md exactly):
```typescript
{
  in_scope: Array<{ title: string, matched_sow_item: string, hours: number, cost_inr: number }>
  out_of_scope: Array<{ title: string, hours: number, cost_inr: number }>
  total_drift_hours: number
  total_drift_cost_inr: number
}
```

**Fallback file:** `src/lib/fallbacks/parse-scope-fallback.json`
```json
{
  "in_scope": [
    { "title": "Standard Email Login", "matched_sow_item": "Auth & Email Login", "hours": 0, "cost_inr": 0 }
  ],
  "out_of_scope": [
    { "title": "WhatsApp / SMS 2FA OTP", "hours": 6, "cost_inr": 7500 },
    { "title": "Excel & CSV Order Export", "hours": 8, "cost_inr": 10000 }
  ],
  "total_drift_hours": 14,
  "total_drift_cost_inr": 17500
}
```

---

### 3. Screen 3 — SOW Ambiguity Scanner (`/scanner`)

**Layout:** App shell with `<AppSidebar />`.

**UI Flow:**
1. **SOW Text Input:** Large textarea (min 200px height) with placeholder:  
   `"Paste your Statement of Work here... e.g., 'Include user login and profile page. Admin dashboard with order reports.'"`
2. **Scan Button:** `"🔍 Scan for Ambiguities"` → calls `POST /api/scan-sow`
3. **Loading State:** Spinner with `"Analyzing SOW clauses..."`
4. **Results:** Grid of Amber ambiguity cards, one per detected ambiguity:

```
┌─────────────────────────────────────────────────────┐
│  ⚠️  User Authentication                 [Ambiguous] │
│  ─────────────────────────────────────────────────  │
│  SOW Says:                                          │
│  "Include user login and profile page."             │
│                                                     │
│  Missing Detail:                                    │
│  Login provider not defined (Email/Password vs.     │
│  Google OAuth vs. SMS/WhatsApp OTP).                │
│                                                     │
│  Clarification Needed:                              │
│  Should Phase 1 include Email/Password only,        │
│  or social OAuth and 2FA?                           │
│                                                     │
│  [Mark as Resolved ✓]                              │
└─────────────────────────────────────────────────────┘
```

**Demo Clause Examples to Catch:**
- `"Standard login system for customers"` → Flag: Google OAuth / WhatsApp OTP / 2FA method unspecified
- `"Admin dashboard with order reports"` → Flag: CSV / Excel / PDF export format unspecified
- `"Product search"` → Flag: Fuzzy search vs exact match, filters, Algolia vs built-in DB

---

### 4. Screen 5 — Live Drift & Swap Simulator (`/simulator`)

**Layout:** App shell with `<AppSidebar />`.

**UI Flow:**

1. **Client Message Input:**
   ```
   Paste client's WhatsApp / email message:
   "Hi team! Can we also add WhatsApp OTP login and an Excel export
    for orders? The business team really needs both."
   ```

2. **Parse Button:** `"⚡ Detect Drift"` → calls `POST /api/parse-scope`

3. **Split Results Panel:**
   ```
   IN SCOPE (Covered by SOW)          OUT OF SCOPE (New Drift)
   ─────────────────────────          ──────────────────────────
   ✅ Standard Email Login  0 hrs     ⚠️ WhatsApp 2FA     +6 hrs  ₹7,500
                                      ⚠️ Excel CSV Export +8 hrs  ₹10,000
                                      ─────────────────────────────────
                                      Total:            +14 hrs  ₹17,500
   ```

4. **Swap Resolution Panel** (calls `calculateScopeSwap()` from `src/lib/engine/swap-math.ts`):
   ```
   ✅ Zero-Cost Scope Swap Available
   ──────────────────────────────────
   DEFER to Phase 2:   Mobile-Responsive Storefront   −14 hrs
   ADD to Phase 1:     WhatsApp 2FA + Excel Export    +14 hrs
   ──────────────────────────────────────────────────────────
   Net Budget Impact:  ₹0   |   Net Hour Impact: 0 hrs
   ──────────────────────────────────────────────────────────
   [Send to Client for Approval →]   (links to /approve/demo-csc-892a)
   ```

**Integration with `calculateScopeSwap()`:**
```typescript
import { calculateScopeSwap } from '@/lib/engine/swap-math'
import type { ScopeItem, ScopeSwapResult } from '@/types/csc'

const swappableItems: ScopeItem[] = scopeItems.filter(i => i.is_swappable)
const result: ScopeSwapResult = calculateScopeSwap(swappableItems, driftHours, 1250)
// result.net_delta_hours === 0  ← must always be true for the VastraKart demo
```

---

### 5. Fallback Files (Stage-Safe JSON)

Create these files in `src/lib/fallbacks/`:

```
src/lib/fallbacks/
├── scan-sow-fallback.json        ← Served when AI is unavailable for /api/scan-sow
└── parse-scope-fallback.json     ← Served when AI is unavailable for /api/parse-scope
```

> `src/lib/fallbacks/vastrakart-demo.ts` is **owned by Member 5**. Import it; never overwrite it.

---

## 🤖 Member 4 Agent Starter Block

```
You are working on the CSC Guardrail project as Member 4 (Scanner · Simulator · AI APIs).
READ docs/team-workflow/tracks/track-04-scanner-simulator-ai.md first.
READ docs/team-workflow/rules/folder-ownership-locks.md for the full boundary table.

Your folder lock (Member 4):
  ALLOW (full write access):
    src/app/scanner/**
    src/app/simulator/**
    src/app/api/scan-sow/**
    src/app/api/parse-scope/**
    src/components/scanner/**
    src/components/simulator/**
    src/lib/fallbacks/*.json        ← JSON fallbacks (you own .json files)

  IMPORT ONLY (never edit):
    src/types/csc.ts
      → import { ScopeItem, SowAmbiguity, ChangeRequest, ScopeSwapResult }
    src/lib/engine/swap-math.ts
      → import { calculateScopeSwap }  ← CRITICAL: use this, never copy the logic
    src/lib/supabase/server.ts
      → import { createServerClient }
    src/components/shared/**
      → <AppSidebar /> on /scanner and /simulator pages
    src/lib/fallbacks/vastrakart-demo.ts
      → import { VASTRAKART_SCOPE_ITEMS } for seeding simulator baseline

  FORBID (do not open with intent to edit):
    src/lib/engine/swap-math.ts    ← IMPORT ONLY, never rewrite
    src/app/layout.tsx             ← Member 1
    src/app/globals.css            ← Member 1
    supabase/**                    ← Member 1 & 5
    src/app/page.tsx               ← Member 2
    src/app/login/**               ← Member 2
    src/app/dashboard/**           ← Member 2
    src/components/landing/**      ← Member 2
    src/components/dashboard/**    ← Member 2
    src/app/approve/**             ← Member 3
    src/app/ledger/**              ← Member 3
    src/lib/fallbacks/vastrakart-demo.ts ← Member 5 (read/import only)

MANDATORY RULES:
  1. All API routes MUST use Zod validation. Return 400 on invalid input.
  2. All API routes MUST have a fallback JSON file. Never return 500 to the UI.
  3. Hourly rate is ALWAYS 1250 (₹1,250/hr) — hardcode this default.
  4. Use calculateScopeSwap() — never re-implement the swap logic.
  5. Fallback JSON shapes MUST match ARCHITECTURE.md API output shapes exactly.

BRANCH: feat/scanner-simulator
BEFORE FINISHING: npx tsc --noEmit → must exit 0
NEVER: git add, git commit, git push
```
