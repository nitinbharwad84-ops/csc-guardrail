# Track 01 — Lead Integrator & Shared Shell

**Member:** 1 (Lead Integrator)  
**Branch:** `feat/shared-shell`  
**Role:** Owns all shared-core files, builds the app shell, maintains type contracts and swap math, reviews and merges all PRs into `main`.

---

## 📁 File Ownership

### ✅ ALLOW — Full Write Access

```
src/types/csc.ts                     ← Canonical TypeScript interfaces
src/lib/supabase/client.ts           ← Browser Supabase client
src/lib/supabase/server.ts           ← Server Supabase client
src/lib/engine/swap-math.ts          ← calculateScopeSwap() math
src/components/shared/AppSidebar.tsx ← 240px workspace sidebar
src/components/shared/KpiBentoGrid.tsx ← 4-card KPI bento grid
src/app/layout.tsx                   ← Root layout & fonts
src/app/globals.css                  ← CSS design tokens
supabase/schema.sql                  ← DB schema + RLS policies
package.json                         ← Dependency manifest
.env.example                         ← Env template
docs/team-workflow/**                ← Workflow documentation
.agent/rules/**                      ← AI agent rules
CLAUDE.md                            ← Claude Code instructions
AGENTS.md                            ← General agent instructions
TEAM_WORKFLOW.md                     ← Legacy workflow overview
```

### ❌ FORBID — Do Not Edit

```
src/app/page.tsx                     ← Member 2
src/app/login/**                     ← Member 2
src/app/dashboard/**                 ← Member 2
src/components/landing/**            ← Member 2
src/components/dashboard/**          ← Member 2
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
DEMO_SCRIPT.md                       ← Member 5
```

---

## 📦 Key Deliverables

### 1. `src/types/csc.ts` — Canonical Domain Interfaces

All interfaces are the single source of truth. Every teammate imports from here — never duplicates types.

```typescript
// Core interfaces (already implemented):
export interface Project { id, agency_name, client_name, title, budget_cap_inr, total_hours, status, created_at }
export interface ScopeItem { id, project_id, title, hours, status, is_swappable, created_at }
export interface SowAmbiguity { id, project_id, clause_title, vague_excerpt, missing_details, clarification_question, resolved_spec, status, created_at }
export interface ChangeRequest { id, project_id, raw_message, requested_items, drift_hours, drift_cost_inr, resolution_type, swapped_out_item_id, approval_token, approval_status, created_at }
export interface AuditLedger { id, project_id, verification_hash, event_type, summary, delta_hours, delta_cost_inr, actor, created_at }
export interface ScopeSwapResult { swapped_out: ScopeItem, incoming_items: RequestedItem[], net_delta_hours: number, net_delta_cost_inr: number }
```

**Type change requests:** Any teammate who needs a type addition must follow the [Request Protocol](../rules/folder-ownership-locks.md#request-protocol-for-shared-core-changes). Member 1 applies the change, runs `tsc --noEmit`, and merges.

---

### 2. `src/lib/engine/swap-math.ts` — `calculateScopeSwap()`

The deterministic rupee/hour swap math function. Member 4 (Simulator) depends on this.

```typescript
// Function signature (canonical — do not alter without PR):
export function calculateScopeSwap(
  swappableItems: ScopeItem[],
  driftHours: number,
  hourlyRate: number      // Always 1250 (₹1,250/hr) for VastraKart
): ScopeSwapResult

// VastraKart demo result:
// Input:  driftHours = 14, swappableItems includes Blog CMS (14 hrs)
// Output: { swapped_out: BlogCMS, net_delta_hours: 0, net_delta_cost_inr: 0 }
```

---

### 3. `src/components/shared/AppSidebar.tsx` — Shared Navigation

Fixed 240px sidebar used by all app-shell screens (Screens 3, 4, 5, 7). Members 2, 3, 4 use `<AppSidebar />` as-is.

**Navigation links (in order):**
1. `SOW Scanner` → `/scanner` *(Day-0 Spec Check)*
2. `Scope Dashboard` → `/dashboard`
3. `Guardrail Simulator` → `/simulator`
4. `Client Portal` → `/approve/demo-csc-892a`
5. `Audit Ledger` → `/ledger`

Bottom workspace card: `PixelCraft Studio` + link back to `/`

---

### 4. `src/app/layout.tsx` + `src/app/globals.css` — Root Shell

**Fonts loaded in layout.tsx:**
- `Plus Jakarta Sans` (headings) — weights 600, 700, 800
- `Inter` (body/UI) — weights 400, 500, 600
- `Geist Mono` or `JetBrains Mono` (financials) — with `tabular-nums`

**Key CSS tokens in globals.css** (do not alter; teammates must use these):
```css
--bg-canvas: #F8FAFC;      /* slate-50  */
--bg-surface: #FFFFFF;
--brand-primary: #4F46E5;  /* indigo-600 */
--brand-hover: #4338CA;    /* indigo-700 */
--brand-tint: #EEF2FF;     /* indigo-50  */
--status-safe: #059669;    /* emerald-600 */
--status-warn: #D97706;    /* amber-600  */
--status-danger: #DC2626;  /* red-600    */
--text-primary: #0F172A;   /* slate-900  */
--text-secondary: #475569; /* slate-600  */
--text-muted: #64748B;     /* slate-500  */
--border-default: #E2E8F0; /* slate-200  */
```

---

### 5. `supabase/schema.sql` — Database Schema + RLS

5 tables with full RLS policies:
- `projects` — Fixed contract baseline
- `sow_ambiguities` — Layer 1 scanner results
- `scope_items` — SOW deliverables + swappable pool
- `change_requests` — Incoming drift + resolution type
- `audit_ledger` — Append-only event log

After any schema change, Member 1 must notify all teammates so they can re-run Supabase locally.

---

### 6. PR Review & Merge Responsibilities

| Task | Procedure |
|:-----|:----------|
| Receive PR | Member 1 is the sole reviewer and merger |
| Pre-merge check | Run `npx tsc --noEmit` on the merged branch |
| Reject criteria | TypeScript errors, edits outside folder lock, missing Zod validation on API routes, broken fallback files |
| Merge strategy | Squash merge preferred for clean `main` history |
| Post-merge | Notify all teammates to run `git rebase origin/main` |

---

## 🔗 Dependencies From Other Tracks

| Track | What Member 1 receives |
|:------|:----------------------|
| All | PR reviews — verify folder locks and TS compile |
| M4 | Fallback JSON shapes must match ARCHITECTURE.md API contracts |
| M5 | `seed.sql` must stay idempotent and match `schema.sql` exactly |

---

## 🤖 Lead Integrator Agent Starter Block

```
You are working on the CSC Guardrail project as the Lead Integrator agent (Member 1).
READ docs/team-workflow/tracks/track-01-lead-integrator.md first.

Your folder lock (Member 1 — Shared Core):
  ALLOW (full write access):
    src/types/csc.ts
    src/lib/supabase/**
    src/lib/engine/swap-math.ts
    src/components/shared/**
    src/app/layout.tsx
    src/app/globals.css
    supabase/schema.sql
    package.json
    .env.example
    docs/team-workflow/**
    .agent/rules/**
    CLAUDE.md, AGENTS.md, TEAM_WORKFLOW.md

  FORBID (read-only or no access):
    src/app/page.tsx, src/app/login/**, src/app/dashboard/** ← Member 2
    src/components/landing/**, src/components/dashboard/**   ← Member 2
    src/app/approve/**, src/app/ledger/**                    ← Member 3
    src/components/portal/**, src/components/ledger/**       ← Member 3
    src/app/scanner/**, src/app/simulator/**, src/app/api/** ← Member 4
    src/components/scanner/**, src/components/simulator/**   ← Member 4
    src/lib/fallbacks/**                                     ← Member 4 & 5
    supabase/seed.sql, DEMO_SCRIPT.md                        ← Member 5

RESPONSIBILITIES:
  1. Keep src/types/csc.ts as the canonical type source.
  2. Maintain calculateScopeSwap() — net_delta_hours must always equal 0 in the demo.
  3. Review all PRs: reject if tsc fails, folder locks violated, or Zod missing on API routes.
  4. Never run git add, git commit, or git push.

Verification before every task completion:
  npx tsc --noEmit   ← must exit 0
```
