# Track 05 — Demo Fixtures, SQL Seed & End-to-End QA

**Member:** 5  
**Branch:** `feat/demo-fixtures`  
**Role:** Maintains the canonical VastraKart demo dataset, keeps seed SQL idempotent and in sync with the schema, provides TypeScript-typed fallback constants, writes the 2-minute demo script, and runs end-to-end QA across all 7 screens.

---

## 📁 File Ownership

### ✅ ALLOW — Full Write Access

```
supabase/seed.sql                         ← VastraKart demo data (idempotent DO $$ block)
src/lib/fallbacks/vastrakart-demo.ts      ← TypeScript mirror of seed for offline use
DEMO_SCRIPT.md                            ← 2-minute live hackathon demo script
```

### ✅ ALLOW — Read-Only QA Access (never edit)

```
src/app/page.tsx                     ← Read to verify landing renders correctly
src/app/login/page.tsx               ← Read to verify demo bypass works
src/app/dashboard/page.tsx           ← Read to verify KPI numbers match seed
src/app/scanner/page.tsx             ← Read to verify ambiguity cards appear
src/app/simulator/page.tsx           ← Read to verify swap resolution renders
src/app/approve/[token]/page.tsx     ← Read to verify approval portal renders
src/app/ledger/page.tsx              ← Read to verify audit timeline is correct
src/components/**                    ← Read to understand component props for QA
```

### ❌ FORBID — Do Not Read with Intent to Edit

```
src/types/csc.ts                     ← IMPORT ONLY (Member 1)
src/lib/supabase/**                  ← IMPORT ONLY (Member 1)
src/lib/engine/**                    ← READ ONLY (Member 1)
src/components/shared/**             ← READ ONLY (Member 1)
src/app/layout.tsx                   ← READ ONLY (Member 1)
src/app/globals.css                  ← READ ONLY (Member 1)
supabase/schema.sql                  ← READ ONLY (Member 1) — seed.sql must MATCH, not replace
package.json                         ← READ ONLY (Member 1)
src/app/page.tsx                     ← READ ONLY for QA (Member 2 owns edits)
src/app/login/**                     ← READ ONLY for QA (Member 2 owns edits)
src/app/dashboard/**                 ← READ ONLY for QA (Member 2 owns edits)
src/components/landing/**            ← READ ONLY for QA (Member 2 owns edits)
src/components/dashboard/**          ← READ ONLY for QA (Member 2 owns edits)
src/app/approve/**                   ← READ ONLY for QA (Member 3 owns edits)
src/app/ledger/**                    ← READ ONLY for QA (Member 3 owns edits)
src/components/portal/**             ← READ ONLY for QA (Member 3 owns edits)
src/components/ledger/**             ← READ ONLY for QA (Member 3 owns edits)
src/app/scanner/**                   ← READ ONLY for QA (Member 4 owns edits)
src/app/simulator/**                 ← READ ONLY for QA (Member 4 owns edits)
src/app/api/**                       ← READ ONLY for QA (Member 4 owns edits)
src/lib/fallbacks/*.json             ← Member 4 owns the JSON fallback files
DEMO_SCRIPT.md                       ← You own this, only you edit it
```

---

## 🔗 Dependencies on Shared Core

| Shared File | How Member 5 Uses It |
|:------------|:---------------------|
| `src/types/csc.ts` | Import all interfaces to type the constant exports in `vastrakart-demo.ts` |
| `supabase/schema.sql` | Read to ensure `seed.sql` matches table names, column types, and RLS policies |

> `seed.sql` **must never define tables** — it only inserts rows. Tables are defined exclusively in `schema.sql` (Member 1).

---

## 📦 Key Deliverables

### 1. `supabase/seed.sql` — Idempotent VastraKart Demo Dataset

**Critical requirement:** The seed must be wrapped in a `DO $$ ... $$` block that checks for the existence of the VastraKart project before inserting. It must be safe to run multiple times without duplicating data.

```sql
DO $$
DECLARE
  v_project_id UUID;
BEGIN
  SELECT id INTO v_project_id FROM projects
  WHERE client_name = 'VastraKart' LIMIT 1;

  IF v_project_id IS NULL THEN
    -- Insert all demo data here
  END IF;
END $$;
```

**Data to seed (canonical values — do not change):**

**`projects` table:**
```sql
INSERT INTO projects (id, agency_name, client_name, title, budget_cap_inr, total_hours, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'PixelCraft Studio',
  'VastraKart',
  'VastraKart E-commerce Platform — Phase 1',
  150000,   -- ₹1,50,000
  120,      -- 120 hrs
  'active'
);
```

**`scope_items` table (8 items, 3 swappable):**

| Title | Hours | Status | Swappable |
|:------|:------|:-------|:----------|
| Auth & Email Login | 16 | `completed` | false |
| Product Catalogue & Filters | 20 | `in_progress` | false |
| Shopping Cart & Checkout | 18 | `in_progress` | false |
| Admin Dashboard (Basic) | 16 | `not_started` | false |
| Mobile-Responsive Storefront | 14 | `not_started` | **true** |
| Push Notification Banners | 10 | `not_started` | **true** |
| Wishlist & Save for Later | 12 | `not_started` | **true** |
| Order History & Tracking | 14 | `not_started` | false |

Total: 120 hrs (matches `projects.total_hours`) ✓

**`sow_ambiguities` table (2 open ambiguities):**

| clause_title | vague_excerpt | missing_details | status |
|:-------------|:--------------|:----------------|:-------|
| User Authentication | "Include user login and profile page." | "Login provider not defined (Email/Password vs. Google OAuth vs. SMS/WhatsApp OTP)." | `open` |
| Order Reporting | "Admin dashboard with order reports." | "Export formats (CSV, Excel, PDF) not specified." | `open` |

**`change_requests` table (1 pending swap):**
```sql
INSERT INTO change_requests (
  project_id, raw_message, requested_items, drift_hours, drift_cost_inr,
  resolution_type, approval_token, approval_status
) VALUES (
  v_project_id,
  'Hi team! Can we also add WhatsApp OTP login and an Excel export for orders? The business team really needs both.',
  '[
    {"title": "WhatsApp / SMS 2FA OTP", "hours": 6, "cost_inr": 7500},
    {"title": "Excel & CSV Order Export", "hours": 8, "cost_inr": 10000}
  ]'::JSONB,
  14,       -- drift_hours:    6 + 8 = 14
  17500,    -- drift_cost_inr: 14 × ₹1,250
  'scope_swap',
  'demo-csc-892a',
  'pending'
);
```

**`audit_ledger` table (2 entries):**

| verification_hash | event_type | summary | delta_hours | delta_cost_inr | actor |
|:-----------------|:-----------|:--------|:------------|:---------------|:------|
| `#CSC-001A` | `sow_clarified` | "SOW Clarified: Auth & Email Login locked to Email/Password only. OAuth deferred to Phase 2." | 0 | 0 | `Agency Lead` |
| `#CSC-892A` | `scope_swap` | "Scope swap: added [WhatsApp 2FA, CSV Export] (+14 hrs); deferred [Mobile-Responsive Storefront] (−14 hrs). Net Δ: 0 hrs / ₹0." | 0 | 0 | `Client Approved` |

---

### 2. `src/lib/fallbacks/vastrakart-demo.ts` — TypeScript Constants

This file is the offline data source for all pages when Supabase is unavailable. Types **must** match `src/types/csc.ts` interfaces exactly.

```typescript
import type {
  Project,
  ScopeItem,
  SowAmbiguity,
  ChangeRequest,
  AuditLedger,
} from '@/types/csc'

export const VASTRAKART_PROJECT: Project = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  agency_name: 'PixelCraft Studio',
  client_name: 'VastraKart',
  title: 'VastraKart E-commerce Platform — Phase 1',
  budget_cap_inr: 150000,  // ₹1,50,000
  total_hours: 120,
  status: 'active',
  created_at: '2026-11-01T09:00:00.000Z',
}

export const VASTRAKART_SCOPE_ITEMS: ScopeItem[] = [
  { id: 'si-001', project_id: 'a1b2c3d4-...', title: 'Auth & Email Login',           hours: 16, status: 'completed',   is_swappable: false, created_at: '...' },
  { id: 'si-002', project_id: 'a1b2c3d4-...', title: 'Product Catalogue & Filters',  hours: 20, status: 'in_progress', is_swappable: false, created_at: '...' },
  { id: 'si-003', project_id: 'a1b2c3d4-...', title: 'Shopping Cart & Checkout',     hours: 18, status: 'in_progress', is_swappable: false, created_at: '...' },
  { id: 'si-004', project_id: 'a1b2c3d4-...', title: 'Admin Dashboard (Basic)',      hours: 16, status: 'not_started', is_swappable: false, created_at: '...' },
  { id: 'si-005', project_id: 'a1b2c3d4-...', title: 'Mobile-Responsive Storefront', hours: 14, status: 'not_started', is_swappable: true,  created_at: '...' },
  { id: 'si-006', project_id: 'a1b2c3d4-...', title: 'Push Notification Banners',   hours: 10, status: 'not_started', is_swappable: true,  created_at: '...' },
  { id: 'si-007', project_id: 'a1b2c3d4-...', title: 'Wishlist & Save for Later',   hours: 12, status: 'not_started', is_swappable: true,  created_at: '...' },
  { id: 'si-008', project_id: 'a1b2c3d4-...', title: 'Order History & Tracking',    hours: 14, status: 'not_started', is_swappable: false, created_at: '...' },
]

export const VASTRAKART_CHANGE_REQUEST: ChangeRequest = {
  id: 'cr-001',
  project_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  raw_message: 'Hi team! Can we also add WhatsApp OTP login and an Excel export for orders? The business team really needs both.',
  requested_items: [
    { title: 'WhatsApp / SMS 2FA OTP', hours: 6, cost_inr: 7500 },
    { title: 'Excel & CSV Order Export', hours: 8, cost_inr: 10000 },
  ],
  drift_hours: 14,
  drift_cost_inr: 17500,
  resolution_type: 'scope_swap',
  swapped_out_item_id: 'si-005',  // Mobile-Responsive Storefront
  approval_token: 'demo-csc-892a',
  approval_status: 'pending',
  created_at: '2026-11-15T14:30:00.000Z',
}

export const VASTRAKART_AUDIT_LEDGER: AuditLedger[] = [
  {
    id: 'al-001',
    project_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    verification_hash: '#CSC-001A',
    event_type: 'sow_clarified',
    summary: 'SOW Clarified: Auth & Email Login locked to Email/Password only. OAuth deferred to Phase 2.',
    delta_hours: 0,
    delta_cost_inr: 0,
    actor: 'Agency Lead',
    created_at: '2026-11-02T10:00:00.000Z',
  },
  {
    id: 'al-002',
    project_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    verification_hash: '#CSC-892A',
    event_type: 'scope_swap',
    summary: 'Scope swap: added [WhatsApp 2FA, CSV Export] (+14 hrs); deferred [Mobile-Responsive Storefront] (−14 hrs). Net Δ: 0 hrs / ₹0.',
    delta_hours: 0,
    delta_cost_inr: 0,
    actor: 'Client Approved',
    created_at: '2026-11-20T16:45:00.000Z',
  },
]
```

---

### 3. `DEMO_SCRIPT.md` — 2-Minute Hackathon Demo Script

Structure the script as 7 steps, each ~20 seconds:

| Step | Screen | Route | Key Action | Talking Point |
|:-----|:-------|:------|:-----------|:--------------|
| 1 | Landing Page | `/` | Show hero + 2-Layer Defense | "Before code, before kickoff — CSC Guardrail catches scope disasters at two layers." |
| 2 | Login | `/login` | Click "Try Live Demo →" | "One click — no credentials needed. Perfect for client handoffs." |
| 3 | SOW Scanner | `/scanner` | Paste SOW text, click Scan | "Layer 1: Day-0 scanner catches vague specs before the first line of code is written." |
| 4 | Dashboard | `/dashboard` | Show KPI cards + scope table | "₹1,50,000 cap. 120 hrs. The +14hr drift is absorbed — budget untouched." |
| 5 | Simulator | `/simulator` | Paste WhatsApp message, run | "Layer 2: Client asks for WhatsApp OTP. We detect the drift and propose a zero-cost swap — instantly." |
| 6 | Approval Portal | `/approve/demo-csc-892a` | Show portal, optionally approve | "Client gets a clean link, no login required. One tap to approve the scope swap." |
| 7 | Audit Ledger | `/ledger` | Show timeline, export PDF | "Every decision, hashed and time-stamped. Exportable to PDF for the client record." |

---

### 4. End-to-End QA Checklist

Before `feat/demo-fixtures` is ready for PR, verify all screens work in both **live Supabase** and **fallback** modes:

```bash
# 1. TypeScript check (must exit 0)
npx tsc --noEmit

# 2. Verify seed is idempotent (run twice — no duplicate rows)
# (run against local Supabase instance)

# 3. Check vastrakart-demo.ts types compile cleanly
# (covered by tsc --noEmit above)

# 4. Manual smoke test — each screen must load without console errors:
#    /                    ← Landing renders
#    /login               ← Demo bypass works (redirects to /dashboard)
#    /dashboard           ← KPIs show ₹1,50,000 / 120 hrs / +14 hrs
#    /scanner             ← Paste SOW, get 2 ambiguity cards
#    /simulator           ← Paste message, get drift split + swap resolution
#    /approve/demo-csc-892a ← Portal loads with correct change request
#    /ledger              ← Timeline shows #CSC-001A and #CSC-892A
```

**File a GitHub issue** (tagged `bug/m[2-4]`) for any screen that fails. Do not fix issues in other members' folders — only report them.

---

## 🤖 Member 5 Agent Starter Block

```
You are working on the CSC Guardrail project as Member 5 (Demo Fixtures · SQL Seed · QA).
READ docs/team-workflow/tracks/track-05-demo-seed-qa.md first.
READ docs/team-workflow/rules/folder-ownership-locks.md for the full boundary table.

Your folder lock (Member 5):
  ALLOW (full write access):
    supabase/seed.sql
    src/lib/fallbacks/vastrakart-demo.ts
    DEMO_SCRIPT.md

  READ-ONLY for QA (never edit):
    All src/app/**          ← verify screens load; never change route files
    All src/components/**   ← read props for QA; never change components

  IMPORT ONLY (never edit):
    src/types/csc.ts
      → import { Project, ScopeItem, SowAmbiguity, ChangeRequest, AuditLedger }
        to type the constant exports in vastrakart-demo.ts

  FORBID (do not open with intent to edit):
    supabase/schema.sql               ← Member 1 (seed must MATCH schema, not define it)
    src/lib/supabase/**               ← Member 1
    src/lib/engine/**                 ← Member 1
    src/components/shared/**          ← Member 1
    src/app/layout.tsx                ← Member 1
    src/app/globals.css               ← Member 1
    package.json                      ← Member 1
    src/lib/fallbacks/*.json          ← Member 4 (JSON fallback files)
    src/app/login/**                  ← Member 2 (read for QA only)
    src/app/dashboard/**              ← Member 2 (read for QA only)
    src/app/scanner/**                ← Member 4 (read for QA only)
    src/app/simulator/**              ← Member 4 (read for QA only)

CANONICAL DEMO NUMBERS (never change these in seed.sql or vastrakart-demo.ts):
  budget_cap_inr  = 150000   (₹1,50,000)
  total_hours     = 120
  drift_hours     = 14       (WhatsApp OTP 6hr + Excel Export 8hr)
  swapped_out     = Mobile-Responsive Storefront (14hr) → Phase 2
  net_delta_hours = 0        (always zero — the whole point of the demo)
  net_delta_cost  = 0 (₹0)
  approval_token  = 'demo-csc-892a'
  audit_hash_1    = '#CSC-001A'
  audit_hash_2    = '#CSC-892A'
  hourly_rate     = 1250

CRITICAL: seed.sql MUST be idempotent (DO $$ block checking for existing VastraKart row).
         vastrakart-demo.ts types MUST match src/types/csc.ts interfaces exactly.

QA ROLE: When you find bugs in other members' screens, file a GitHub issue.
         Do NOT edit other members' files — not even to fix a one-liner.

BRANCH: feat/demo-fixtures
BEFORE FINISHING: npx tsc --noEmit → must exit 0
NEVER: git add, git commit, git push
```
