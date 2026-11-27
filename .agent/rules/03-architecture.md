# ARCHITECTURE.md — CSC Full-Stack Specification & Database Schema

## 1. Next.js 15 App Router Directory Structure

```text
csc-guardrail/
├── AGENTS.md                  # AI coding agent instructions (Synchronized Master)
├── DESIGN.md                  # Ledger Slate & Trust Indigo tokens
├── ARCHITECTURE.md            # DB schema, API specs & folder map
├── CLAUDE.md                  # Claude Code instructions (Synchronized Master)
├── docs/team-workflow/        # Multi-track team workflow & boundary locks
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Screen 1: Landing Page & Screen Directory
│   │   ├── login/page.tsx             # Screen 2: Agency Login + Demo Bypass
│   │   ├── scanner/page.tsx           # Screen 3: Pre-Kickoff SOW Ambiguity Scanner
│   │   ├── dashboard/page.tsx         # Screen 4: Scope Health Dashboard
│   │   ├── simulator/page.tsx         # Screen 5: Live Drift & Swap Simulator
│   │   ├── approve/[token]/page.tsx   # Screen 6: Public Client Approval Portal (async params)
│   │   ├── ledger/page.tsx            # Screen 7: Immutable Audit Ledger + PDF
│   │   └── api/
│   │       ├── scan-sow/route.ts      # POST: Detects half-complete SOW specs
│   │       └── parse-scope/route.ts   # POST: Splits client message vs SOW baseline
│   ├── components/
│   │   ├── shared/
│   │   │   ├── AppSidebar.tsx         # Shared 240px workspace sidebar
│   │   │   └── KpiBentoGrid.tsx       # 4 top dashboard cards
│   │   ├── landing/                   # Hero & feature comparison components
│   │   ├── dashboard/                 # Scope table, budget gauge & KPI cards
│   │   ├── portal/                    # Approval contract sheet & confirmation
│   │   ├── ledger/                    # Ledger table & PdfExportButton.tsx
│   │   ├── scanner/                   # SOW input textarea & ambiguity cards
│   │   └── simulator/                 # Message input, drift detector & swap panel
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Typed browser Supabase client
│   │   │   └── server.ts              # Typed server Supabase client
│   │   ├── engine/
│   │   │   └── swap-math.ts           # Deterministic rupee/hour swap math
│   │   └── fallbacks/
│   │       ├── scan-sow-fallback.json # SOW scanner offline fallback JSON
│   │       ├── parse-scope-fallback.json # Drift detector offline fallback JSON
│   │       └── vastrakart-demo.ts     # Offline typed VastraKart seed mirror
│   └── types/
│       └── csc.ts                     # Canonical domain interfaces
└── supabase/
    ├── schema.sql                     # Canonical DB schema + RLS policies
    └── seed.sql                       # Idempotent demo seed data
```

### Next.js 15 App Router Conventions
1. **Dynamic Route Params are Promises:**
   In Next.js 15, route parameters are asynchronous. Dynamic pages such as `src/app/approve/[token]/page.tsx` must await params:
   ```typescript
   export default async function ApprovePortalPage({
     params,
   }: {
     params: Promise<{ token: string }>;
   }) {
     const { token } = await params;
     // Fetch change request by token...
   }
   ```
2. **Server Components by Default:**
   Keep all page components server-rendered by default for optimal performance and SEO. Add `'use client'` strictly to interactive leaves (e.g. form inputs, buttons, sliders, modals).

---

## 2. Supabase PostgreSQL Schema (`schema.sql`)

```sql
-- 1. Projects (Fixed Contract Baseline)
create table projects (
  id uuid primary key default gen_random_uuid(),
  agency_name text not null default 'PixelCraft Studio',
  client_name text not null,
  title text not null,
  budget_cap_inr numeric not null,
  total_hours integer not null,
  status text not null default 'active', -- 'scanning' | 'active' | 'completed'
  created_at timestamptz default now()
);

-- 2. Pre-Kickoff SOW Ambiguities (Layer 1 Prevention)
create table sow_ambiguities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  clause_title text not null,          -- e.g. 'User Login & Account'
  vague_excerpt text not null,         -- e.g. 'Standard login system for customers'
  missing_details text not null,       -- e.g. 'Auth method unspecified (Email vs Google OAuth vs WhatsApp 2FA)'
  clarification_question text not null,
  resolved_spec text,                  -- Filled once client/agency locks spec
  status text not null default 'open', -- 'open' | 'clarified'
  created_at timestamptz default now()
);

-- 3. SOW Scope Deliverables (Baseline & Swappable Pool)
create table scope_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  hours integer not null,
  status text not null default 'not_started', -- 'completed' | 'in_progress' | 'not_started' | 'deferred_phase_2'
  is_swappable boolean not null default false,
  created_at timestamptz default now()
);

-- 4. Incoming Change Requests & Resolutions (Layer 2 Guardrail)
create table change_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  raw_message text not null,
  requested_items jsonb not null,      -- [{ "title": "WhatsApp 2FA", "hours": 6, "cost_inr": 7500 }]
  drift_hours integer not null,
  drift_cost_inr numeric not null,
  resolution_type text not null,       -- 'scope_swap' | 'paid_addon' | 'defer_phase_2'
  swapped_out_item_id uuid references scope_items(id),
  approval_token text unique not null,
  approval_status text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at timestamptz default now()
);

-- 5. Immutable Change & Audit Ledger
create table audit_ledger (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  verification_hash text not null,     -- e.g. '#CSC-892A'
  event_type text not null,            -- 'sow_clarified' | 'scope_swap' | 'paid_addon' | 'deferred'
  summary text not null,
  delta_hours integer not null default 0,
  delta_cost_inr numeric not null default 0,
  actor text not null,                 -- 'Agency Lead' | 'Client Approved'
  created_at timestamptz default now()
);
```

---

## 3. AI API Contracts (With Mandatory Offline Fallbacks)

### A. `POST /api/scan-sow` (Pre-Kickoff SOW Ambiguity Scanner)
* **Zod Input Schema:** `{ sowText: z.string().min(10) }`
* **Output JSON Contract:**
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

### B. `POST /api/parse-scope` (Mid-Sprint Client Drift Detector)
* **Zod Input Schema:** `{ clientMessage: z.string().min(5), baselineItems: z.array(...), hourlyRate: z.number().default(1250) }`
* **Output JSON Contract:**
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
