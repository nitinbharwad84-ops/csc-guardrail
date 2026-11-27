<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# CSC Guardrail — Master Developer & AI Agent Operational Laws

> **Target Systems:** Antigravity IDE, Claude Code, Codex, and all autonomous AI coding agents.  
> **Repository:** `csc-guardrail` · Next.js 15 App Router · TypeScript strict · Tailwind CSS · Supabase · Vercel  
> **Master Workflow:** See `docs/team-workflow/README.md` and `docs/team-workflow/tracks/`  
> **Enforcement Level:** **Zero Tolerance.** Every rule herein is mandatory and non-negotiable.

---

## 🏛️ THE 5 MANDATORY OPERATIONAL LAWS

### LAW 1 — MANDATORY BRANCH CHECKOUT (NEVER TOUCH `main` OR `master`)
1. **Branch Verification Gate:** Before creating, editing, reading with intent to write, or deleting ANY file, the agent **MUST** run:
   ```bash
   git branch --show-current
   ```
2. **Immediate Halt on Main/Master:** If the active branch is `main` or `master`:
   - The agent **MUST STOP IMMEDIATELY**.
   - Do **NOT** edit, write, or touch any workspace files on `main`.
   - Run `git checkout -b feat/<track-or-feature-name>` (or ask the developer to confirm their track branch: `feat/shared-shell`, `feat/landing-dashboard`, `feat/portal-ledger`, `feat/scanner-simulator`, or `feat/demo-fixtures`) before writing a single line of code.
3. **Strictly Forbidden Git Commands for Agents:**
   - ❌ **NEVER run:** `git commit`, `git push`, `git merge`, `git rebase` (with force), or `git reset --hard` on `main` or `master`.
   - ❌ **NEVER run auto-commit or auto-push** commands unless explicitly and unambiguously requested by the human developer for a feature branch (`feat/*`).
   - Humans retain sole ownership over pushing code to remote and merging PRs.

---

### LAW 2 — STRICT MODULE & FOLDER OWNERSHIP LOCKS
Every AI agent must identify which track (`track-01` through `track-05` in `docs/team-workflow/tracks/`) it is working under before opening or editing files:

| Track | Owner | Allowed Write Paths | Forbidden Paths |
|:---|:---|:---|:---|
| **Track 01** | Lead Integrator | `src/types/*`<br>`src/lib/supabase/*`<br>`src/lib/engine/*`<br>`src/components/shared/*`<br>`src/app/layout.tsx`<br>`src/app/globals.css`<br>`supabase/schema.sql`<br>`package.json`<br>`.env.example` | All teammate routes (`src/app/page.tsx`, `src/app/login/**`, `src/app/dashboard/**`, `src/app/approve/**`, `src/app/ledger/**`, `src/app/scanner/**`, `src/app/simulator/**`, `src/app/api/**`) |
| **Track 02** | Landing, Auth & Dashboard | `src/app/page.tsx`<br>`src/app/login/**`<br>`src/app/dashboard/**`<br>`src/components/landing/**`<br>`src/components/dashboard/**` | All 🔒 Shared Core files; Track 03/04/05 routes and components |
| **Track 03** | Portal, Ledger & PDF | `src/app/approve/[token]/**`<br>`src/app/ledger/**`<br>`src/components/portal/**`<br>`src/components/ledger/**` | All 🔒 Shared Core files; Track 02/04/05 routes and components |
| **Track 04** | Scanner, Simulator & AI APIs | `src/app/scanner/**`<br>`src/app/simulator/**`<br>`src/app/api/scan-sow/**`<br>`src/app/api/parse-scope/**`<br>`src/components/scanner/**`<br>`src/components/simulator/**`<br>`src/lib/fallbacks/*.json` | All 🔒 Shared Core files; Track 02/03 routes; `vastrakart-demo.ts` (M5) |
| **Track 05** | Demo Seed, Fixtures & QA | `supabase/seed.sql`<br>`src/lib/fallbacks/vastrakart-demo.ts`<br>`DEMO_SCRIPT.md`<br>*(Read-only across all pages for QA verification)* | All 🔒 Shared Core files; writing/editing any page or component files |

**Shared-Core Change Request Protocol:**
- If an agent working on Tracks 02–05 needs an additional type in `src/types/csc.ts` or helper in `src/lib/engine/`:
  1. **DO NOT edit the file directly.**
  2. Inform the developer: *"This requires an update to shared core (`src/types/csc.ts`). Please request Track 01 (Lead Integrator) to add `<field/helper>` on `feat/shared-shell` and merge to `main`."*
  3. Wait until the change is merged and pulled before importing it.

---

### LAW 3 — TYPE SAFETY, NEXT.JS APP ROUTER & DEMO DATA INTEGRITY
1. **Single Source of Truth:**
   - Always import domain models from `@/types/csc` (`Project`, `ScopeItem`, `SowAmbiguity`, `ChangeRequest`, `AuditLedger`, `ScopeSwapResult`). Never declare ad-hoc duplicate types.
   - Always import deterministic swap calculation from `@/lib/engine/swap-math` via `calculateScopeSwap()`. Never re-implement ₹/hr swap math inside UI components.
2. **Next.js 15 App Router Discipline:**
   - Dynamic route params in Next.js 15 are Promises. In `src/app/approve/[token]/page.tsx`, resolve params asynchronously:
     ```typescript
     export default async function Page({ params }: { params: Promise<{ token: string }> }) {
       const { token } = await params;
       // ...
     }
     ```
   - Server Components by default. Use `'use client'` only at interactive leaves (forms, buttons, sliders, hooks).
3. **Resilience & Fallbacks:**
   - Never throw an unhandled exception if `.env.local` Supabase credentials are missing or remote AI endpoints fail.
   - All API routes and client screens must seamlessly serve `DEMO_MODE` static data from `src/lib/fallbacks/` (`scan-sow-fallback.json`, `parse-scope-fallback.json`, `vastrakart-demo.ts`).
4. **Canonical VastraKart Demo Parameters (Never Alter):**
   - **Client:** `VastraKart` · **Agency:** `PixelCraft Studio`
   - **Contract Baseline:** Fixed Cap `₹1,50,000` (`budget_cap_inr: 150000`) · Total Hours `120 hrs` (`total_hours: 120`) · Rate `₹1,250/hr`
   - **Active Drift Request:** `+14 hrs` (`₹17,500`) composed of:
     - `+6 hrs` (`₹7,500`): WhatsApp / SMS 2FA OTP
     - `+8 hrs` (`₹10,000`): Excel & CSV Order Export
   - **Zero-Cost Resolution:** Swapped out `14 hr` Blog & Content CMS (or Mobile-Responsive Storefront) deferred to Phase 2.
   - **Net Impact:** `0 hrs` / `₹0` net delta.
   - **Approval Reference:** Token `demo-csc-892a` · Audit Hashes `#CSC-001A` & `#CSC-892A`.

---

### LAW 4 — DESIGN SYSTEM ENFORCEMENT ("Ledger Slate & Trust Indigo")
1. **Light-First B2B Ledger Aesthetic:**
   - Strictly light-mode high-trust FinTech aesthetic modeled on Stripe, Ramp, and Linear.
   - Base canvas: `#F8FAFC` (`slate-50`) · Cards & Surfaces: `#FFFFFF` (`white`) · Table Header Fills: `#F1F5F9` (`slate-100`).
   - Borders: Crisp `1px solid #E2E8F0` (`slate-200`) with `rounded-xl` (`12px`) for cards and `rounded-lg` (`8px`) for inputs.
   - Shadows: Subtle `shadow-xs` or `shadow-sm` maximum. Never use heavy, dark, or glowing drop shadows.
2. **Semantic Color Tokens (from `globals.css`):**
   - Brand Primary: `#4F46E5` (`indigo-600`) · Hover: `#4338CA` (`indigo-700`) · Tint: `#EEF2FF` (`indigo-50`)
   - Safe / Approved: `#059669` (`emerald-600`) · BG: `#ECFDF5` (`emerald-50`)
   - Warning / Drift: `#D97706` (`amber-600`) · BG: `#FFFBEB` (`amber-50`)
   - Danger / Breach: `#DC2626` (`red-600`) · BG: `#FEF2F2` (`red-50`)
3. **Mandatory `.tabular-nums` Formatting:**
   - Every financial rupee value (`₹1,50,000`), hour count (`120 hrs`, `+14 hrs`), delta counter, percentage, and verification hash (`#CSC-892A`) **MUST** use `font-mono tabular-nums` (`font-variant-numeric: tabular-nums`) to ensure strict vertical tabular alignment.

---

### LAW 5 — PRE-COMPLETION VERIFICATION CHECKLIST
Before marking ANY task complete or handing back the prompt, the agent must:
1. **Run Static Verification:**
   ```bash
   npx tsc --noEmit
   ```
   Must exit with **0 errors**. Fix all TypeScript issues before reporting.
2. **Confirm File Boundaries:** Verify every modified file is strictly inside the assigned track ownership boundary.
3. **Confirm Active Branch:** Re-verify `git branch --show-current` is a `feat/*` branch (not `main` or `master`).
4. **Deliver Hand-Off Instructions:** Present the human developer with the exact copy-paste manual Git commands:
   ```bash
   git status
   git add <modified-files>
   git commit -m "feat(<track>): <description>"
   git push -u origin feat/<branch-name>
   ```
   *(The AI agent must never execute these write commands itself unless explicitly instructed).*
