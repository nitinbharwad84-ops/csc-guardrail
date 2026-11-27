# Track 02 — Landing Page, Auth & Scope Health Dashboard

**Member:** 2  
**Branch:** `feat/landing-dashboard`  
**Role:** Builds the public-facing entry point (Landing, Login) and the main agency workspace screen (Dashboard). First point of contact for judges and demo viewers.

---

## 📁 File Ownership

### ✅ ALLOW — Full Write Access

```
src/app/page.tsx                     ← Screen 1: Landing Page
src/app/login/page.tsx               ← Screen 2: Agency Login + Demo Bypass
src/app/dashboard/page.tsx           ← Screen 4: Scope Health Dashboard
src/components/landing/              ← Hero, 2-Layer Defense, screen cards, navbar
src/components/dashboard/            ← KPI callout cards, scope table, budget gauge
```

### ❌ FORBID — Do Not Read with Intent to Edit

```
src/types/csc.ts                     ← IMPORT ONLY (Member 1)
src/lib/supabase/**                  ← IMPORT ONLY (Member 1)
src/lib/engine/swap-math.ts          ← IMPORT ONLY (Member 1)
src/components/shared/**             ← USE AS-IS (Member 1)
src/app/layout.tsx                   ← READ ONLY (Member 1)
src/app/globals.css                  ← READ ONLY (Member 1)
supabase/schema.sql                  ← READ ONLY (Member 1)
package.json                         ← READ ONLY (Member 1)
src/app/approve/**                   ← Member 3
src/app/ledger/**                    ← Member 3
src/components/portal/**             ← Member 3
src/components/ledger/**             ← Member 3
src/app/scanner/**                   ← Member 4
src/app/simulator/**                 ← Member 4
src/app/api/**                       ← Member 4
src/components/scanner/**            ← Member 4
src/components/simulator/**          ← Member 4
src/lib/fallbacks/**                 ← Member 4 & 5
supabase/seed.sql                    ← Member 5
src/lib/fallbacks/vastrakart-demo.ts ← Member 5
DEMO_SCRIPT.md                       ← Member 5
```

---

## 🔗 Dependencies on Shared Core

| Shared File | How Member 2 Uses It |
|:------------|:---------------------|
| `src/types/csc.ts` | Import `Project`, `ScopeItem`, `ScopeItemStatus` for dashboard table typing |
| `src/lib/supabase/client.ts` | Fetch VastraKart project data in dashboard (client-side) |
| `src/lib/supabase/server.ts` | Fetch scope items server-side in `dashboard/page.tsx` |
| `src/components/shared/AppSidebar.tsx` | Wrap dashboard in `<AppSidebar />` layout |
| `src/components/shared/KpiBentoGrid.tsx` | Optionally compose KPI cards using this shared grid |
| `src/app/globals.css` | Use `--brand-primary`, `--status-safe`, `--status-warn`, `--status-danger` CSS tokens |

> If you need a new field on `Project` or `ScopeItem`, **stop and open a request for Member 1.** Do not edit `src/types/csc.ts` directly.

---

## 📦 Key Deliverables

### Screen 1 — Landing Page (`/`)

**Layout:** Public shell — no sidebar. Centered 1200px max-width.

**Sections:**
1. **Top Navbar:** `Features` · `7-Screen Flow` · `Live Demo` · `Login` links + CSC Guardrail logo
2. **Hero:** Bold headline, sub-headline explaining the 2-Layer scope defense, two CTAs: `"Try Live Demo →"` (→ `/dashboard` with demo bypass) and `"Login"`
3. **2-Layer Defense Comparison:** Visual side-by-side card — Layer 1 (SOW Scanner) vs Layer 2 (Guardrail Simulator)
4. **7 Screen Quick-Launch Cards:** Grid of 7 cards, each linking to its screen route
5. **Footer:** PixelCraft Studio + VastraKart branding

**Typography:** Hero H1 at 48px (`3rem`) / `800` ExtraBold / Plus Jakarta Sans, tight `-0.02em` tracking.

---

### Screen 2 — Agency Login (`/login`)

**Layout:** Public shell — centered 480px login card, no sidebar.

**Features:**
1. **Standard Login Form:** Email + Password → Supabase Auth
2. **"Try Live Demo →" Button:** Sets a `demo-bypass` cookie, skips authentication, and redirects directly to `/dashboard`. Must work without any Supabase credentials on stage/demo day.
3. **Error state:** `"Invalid credentials"` shown as an amber alert below the form

**Demo Bypass Implementation:**
```typescript
// On "Try Live Demo" button click:
// Set a session cookie that the dashboard reads to load fallback data
document.cookie = 'csc-demo-bypass=true; path=/'
router.push('/dashboard')
```

---

### Screen 4 — Scope Health Dashboard (`/dashboard`)

**Layout:** App shell — uses `<AppSidebar />` from `src/components/shared/`.

**KPI Hero Cards (4 cards at top — VastraKart values):**

| Card | Value | Color |
|:-----|:------|:------|
| Budget Cap | ₹1,50,000 | `--text-primary` / white card |
| Total Hours | 120 hrs | `--text-primary` / white card |
| Active Drift | +14 hrs | `--status-warn` / amber tinted card |
| Swappable Pool | 3 items · 36 hrs | `--status-safe` / emerald tinted card |

**Scope Items Table (8 rows for VastraKart):**

| Deliverable | Hours | Status | Swappable |
|:------------|:------|:-------|:----------|
| Auth & Email Login | 16 hrs | ✅ Completed | — |
| Product Catalogue & Filters | 20 hrs | 🔵 In Progress | — |
| Shopping Cart & Checkout | 18 hrs | 🔵 In Progress | — |
| Admin Dashboard (Basic) | 16 hrs | ⬜ Not Started | — |
| Mobile-Responsive Storefront | 14 hrs | 🟡 Deferred P2 | Swappable |
| Push Notification Banners | 10 hrs | ⬜ Not Started | Swappable |
| Wishlist & Save for Later | 12 hrs | ⬜ Not Started | Swappable |
| Order History & Tracking | 14 hrs | ⬜ Not Started | — |

**Scope Swap Callout (amber banner):**
```
⚠️ Active Scope Swap — #CSC-892A
WhatsApp 2FA (+6 hrs) + Excel Export (+8 hrs) added.
Mobile-Responsive Storefront (−14 hrs) deferred to Phase 2.
Net Δ: 0 hrs / ₹0  ← Budget maintained.
[View in Audit Ledger →]  [Open Simulator →]
```

**Budget Bar Gauge:**  
Horizontal bar: `₹1,07,500 spent` out of `₹1,50,000 cap`. Show remaining `₹42,500` in emerald.

---

## 🎨 Design Tokens to Use

```css
/* From src/app/globals.css — use these, never hardcode hex */
--bg-canvas: #F8FAFC;      /* Page background */
--bg-surface: #FFFFFF;     /* Cards */
--bg-subtle: #F1F5F9;      /* Table headers */
--brand-primary: #4F46E5;  /* Active nav, CTAs */
--status-safe: #059669;    /* In-scope, Approved */
--status-safe-bg: #ECFDF5; /* Approved pill background */
--status-warn: #D97706;    /* Drift alerts */
--status-warn-bg: #FFFBEB; /* Amber card background */
--border-default: #E2E8F0; /* Card borders */
```

**Status Pill Grammar:**
- `Completed` → `bg-emerald-50 text-emerald-700 border-emerald-200`
- `In Progress` → `bg-blue-50 text-blue-700 border-blue-200`
- `Deferred P2` → `bg-amber-50 text-amber-700 border-amber-200`
- `Not Started` → `bg-slate-100 text-slate-700`
- `Swappable` → Emerald pill on a Swappable badge column

---

## 🤖 Member 2 Agent Starter Block

```
You are working on the CSC Guardrail project as Member 2 (Landing · Auth · Dashboard).
READ docs/team-workflow/tracks/track-02-landing-auth-dashboard.md first.
READ docs/team-workflow/rules/folder-ownership-locks.md for the full boundary table.

Your folder lock (Member 2):
  ALLOW (full write access):
    src/app/page.tsx
    src/app/login/page.tsx
    src/app/dashboard/page.tsx
    src/components/landing/**
    src/components/dashboard/**

  IMPORT ONLY (never edit):
    src/types/csc.ts            → import { Project, ScopeItem, ScopeItemStatus }
    src/lib/supabase/client.ts  → import { createBrowserClient }
    src/lib/supabase/server.ts  → import { createServerClient }
    src/components/shared/**    → <AppSidebar />, <KpiBentoGrid /> as-is

  FORBID (do not open with intent to edit):
    src/lib/engine/**           ← Member 1
    src/app/layout.tsx          ← Member 1
    src/app/globals.css         ← Member 1
    supabase/**                 ← Member 1 & 5
    src/app/approve/**          ← Member 3
    src/app/ledger/**           ← Member 3
    src/app/scanner/**          ← Member 4
    src/app/simulator/**        ← Member 4
    src/app/api/**              ← Member 4
    src/lib/fallbacks/**        ← Member 4 & 5

CANONICAL DEMO NUMBERS (never change these):
  budget_cap_inr = 150000  (₹1,50,000)
  total_hours    = 120 hrs
  drift_hours    = +14 hrs (WhatsApp OTP 6hr + Excel Export 8hr)
  swapped_out    = Mobile-Responsive Storefront 14hr → Phase 2
  approval_token = 'demo-csc-892a'
  audit_hash     = '#CSC-892A'

BRANCH: feat/landing-dashboard
BEFORE FINISHING: npx tsc --noEmit → must exit 0
NEVER: git add, git commit, git push
```
