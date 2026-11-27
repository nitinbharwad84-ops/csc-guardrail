# Folder Ownership Locks & Anti-Conflict Rules

> **Applies to:** All team members and all AI agents (Antigravity IDE, Claude Code, Codex, Cursor, Copilot).  
> **Enforcement Level:** **Zero Tolerance.** These rules are mathematically binding. No agent or human may bypass them.

---

## 🔒 Shared / Protected Core — Track 01 (Lead Integrator) Only

The files below constitute the structural backbone of the project and are **read-only** for all team members except Member 1. Other teammates may **import** from them freely but must **never write, overwrite, rename, or alter** them directly.

| File / Folder | Structural Role | Safe Usage for Teammates |
|:---|:---|:---|
| `src/types/csc.ts` | Canonical TypeScript interfaces for all domain models | `import type { Project, ScopeItem, ... } from '@/types/csc'` |
| `src/lib/supabase/client.ts` | Typed browser Supabase client | `import { createBrowserClient } from '@/lib/supabase/client'` |
| `src/lib/supabase/server.ts` | Typed server Supabase client | `import { createServerClient } from '@/lib/supabase/server'` |
| `src/lib/engine/swap-math.ts` | Deterministic rupee/hour swap calculation | `import { calculateScopeSwap } from '@/lib/engine/swap-math'` |
| `src/components/shared/AppSidebar.tsx` | Fixed 240px workspace sidebar with 5 navigation links | Use `<AppSidebar />` as-is; do not edit props or styles |
| `src/components/shared/KpiBentoGrid.tsx` | Shared 4-card KPI grid layout | Use `<KpiBentoGrid />` as-is |
| `src/app/layout.tsx` | Root layout (fonts, providers, metadata) | Rely on its presence; do not inject providers or meta |
| `src/app/globals.css` | All CSS design tokens & Tailwind base layer | Use defined CSS variables; do not add global rules |
| `supabase/schema.sql` | Canonical database schema + RLS policies | Reference for table design; do not execute ALTER or DROP |
| `package.json` | Dependency manifest | Do not install packages without Track 01 Lead approval |
| `.env.example` | Environment variable template | Copy to `.env.local`; do not add or remove declared keys |

---

## 👤 Track-by-Track Ownership Boundaries

### Track 02 — Landing Page, Auth & Scope Health Dashboard
* **Assigned Member:** Member 2
* **Feature Branch:** `feat/landing-dashboard`

| Status | Paths |
|:---|:---|
| ✅ **ALLOW (Full Write)** | `src/app/page.tsx`<br>`src/app/login/**`<br>`src/app/dashboard/**`<br>`src/components/landing/**`<br>`src/components/dashboard/**` |
| ❌ **FORBID (Read-Only / No Access)** | All 🔒 Shared Core files<br>`src/app/approve/**` (Track 03)<br>`src/app/ledger/**` (Track 03)<br>`src/components/portal/**` (Track 03)<br>`src/components/ledger/**` (Track 03)<br>`src/app/scanner/**` (Track 04)<br>`src/app/simulator/**` (Track 04)<br>`src/app/api/**` (Track 04)<br>`src/components/scanner/**` (Track 04)<br>`src/components/simulator/**` (Track 04)<br>`src/lib/fallbacks/**` (Track 04 & 05)<br>`supabase/seed.sql` (Track 05)<br>`DEMO_SCRIPT.md` (Track 05) |

---

### Track 03 — Client Approval Portal, Audit Ledger & PDF Export
* **Assigned Member:** Member 3
* **Feature Branch:** `feat/portal-ledger`

| Status | Paths |
|:---|:---|
| ✅ **ALLOW (Full Write)** | `src/app/approve/[token]/**`<br>`src/app/ledger/**`<br>`src/components/portal/**`<br>`src/components/ledger/**` |
| ❌ **FORBID (Read-Only / No Access)** | All 🔒 Shared Core files<br>`src/app/page.tsx` (Track 02)<br>`src/app/login/**` (Track 02)<br>`src/app/dashboard/**` (Track 02)<br>`src/components/landing/**` (Track 02)<br>`src/components/dashboard/**` (Track 02)<br>`src/app/scanner/**` (Track 04)<br>`src/app/simulator/**` (Track 04)<br>`src/app/api/**` (Track 04)<br>`src/lib/fallbacks/**` (Track 04 & 05)<br>`supabase/seed.sql` (Track 05) |

---

### Track 04 — SOW Scanner, Drift Simulator & AI APIs
* **Assigned Member:** Member 4
* **Feature Branch:** `feat/scanner-simulator`

| Status | Paths |
|:---|:---|
| ✅ **ALLOW (Full Write)** | `src/app/scanner/**`<br>`src/app/simulator/**`<br>`src/app/api/scan-sow/**`<br>`src/app/api/parse-scope/**`<br>`src/components/scanner/**`<br>`src/components/simulator/**`<br>`src/lib/fallbacks/*.json` (JSON fallback files) |
| ❌ **FORBID (Read-Only / No Access)** | All 🔒 Shared Core files<br>`src/app/page.tsx` (Track 02)<br>`src/app/login/**` (Track 02)<br>`src/app/dashboard/**` (Track 02)<br>`src/app/approve/**` (Track 03)<br>`src/app/ledger/**` (Track 03)<br>`src/components/portal/**` (Track 03)<br>`src/components/ledger/**` (Track 03)<br>`src/lib/fallbacks/vastrakart-demo.ts` (Track 05 owns TypeScript mirror)<br>`supabase/seed.sql` (Track 05) |

---

### Track 05 — Demo Seed, Fixtures & End-to-End QA
* **Assigned Member:** Member 5
* **Feature Branch:** `feat/demo-fixtures`

| Status | Paths |
|:---|:---|
| ✅ **ALLOW (Full Write)** | `supabase/seed.sql`<br>`src/lib/fallbacks/vastrakart-demo.ts`<br>`DEMO_SCRIPT.md` |
| ✅ **ALLOW (Read-Only QA)** | All `src/app/**` routes (read to verify UI and data alignment)<br>All `src/components/**` (read to inspect props and state) |
| ❌ **FORBID (Read-Only / No Access)** | All 🔒 Shared Core files<br>Direct editing of any `src/app/**` or `src/components/**` files (file bugs for teammates to fix)<br>`src/lib/fallbacks/*.json` (Track 04 owns JSON files) |

---

## 📋 Protocol for Requesting Shared-Core Changes

If any teammate or AI agent discovers a missing interface property, new table requirement, or shared utility need:

```text
[Step 1: STOP]
Do NOT edit src/types/csc.ts, swap-math.ts, schema.sql, or any locked file.

[Step 2: REQUEST]
Notify the developer to open a GitHub Issue or send a request to Member 1 (Lead Integrator):
  • File to change: src/types/csc.ts
  • Proposed modification: Add field `resolved_at: string | null` to SowAmbiguity
  • Technical rationale: Required for audit timeline tracking on /scanner
  • Consuming track: Track 04

[Step 3: IMPLEMENT ON LEAD BRANCH]
Member 1 adds the change on `feat/shared-shell`, verifies `npx tsc --noEmit`,
and merges to `main`.

[Step 4: REBASE]
All teammates fetch and rebase onto origin/main before using the new type:
  git fetch origin
  git rebase origin/main
```

---

## ⚙️ Universal AI Agent Constraints

1. **Law 1 Enforcement:** Every agent must verify `git branch --show-current` before starting work. If on `main`, halt immediately and check out a `feat/*` branch.
2. **Never commit to `main`:** Auto-commits and direct pushes to `main` are strictly forbidden.
3. **No package installation:** Do not run `npm install <pkg>` or `pnpm add <pkg>` without Track 01 Lead approval.
4. **Preserve Demo Numbers:** Never change canonical VastraKart demo numbers (`₹1,50,000`, `120 hrs`, `₹1,250/hr`, `+14 hr drift`, `demo-csc-892a`).
5. **Always Verify:** Run `npx tsc --noEmit` before concluding any turn.
