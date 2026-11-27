# CSC (Client Scope & Change Guardrail) — Five-Member Team Playbook

Built for **PU Digital Hackathon 2.0** using **Antigravity IDE** as the primary end-to-end agent, alongside **Claude Code** and **Codex**.

## Ground Rules for Every Teammate & AI Agent

* **Never work on `main` or `master`:** Always run `git checkout -b feat/<your-branch>` before writing or editing code. Never auto-commit or push to `main`.
* **Respect folder boundaries:** Only edit files inside your assigned folders. Do not edit another teammate's routes/components or Lead Integrator shared files (`src/types/*`, `src/lib/supabase/*`, `src/lib/engine/*`, `src/components/shared/*`, `src/app/layout.tsx`, `src/app/globals.css`, `supabase/schema.sql`, `package.json`).
* **Request shared changes instead of forcing them:** If you need a new type in `src/types/csc.ts`, a change in `src/lib/engine/swap-math.ts`, or a shared layout/nav element, ask **Member 1 (Lead Integrator)** so shared contracts stay in one place.
* **Keep VastraKart demo metrics consistent:** Fixed cap `₹1,50,000`, total budget `120 hrs`, rate `₹1,250/hr`, and a `+14 hr` scope creep (`+6h` WhatsApp OTP + `+8h` Excel export) resolved via a zero-cost swap with `14 hr` Blog & Content CMS.
* **Keep the UI in Ledger Slate & Trust Indigo:** Light mode (`#F8FAFC` canvas, `#FFFFFF` cards, `#E2E8F0` borders, `#4F46E5` primary indigo, `#059669` safe/approved, `#D97706` drift/ambiguity, `#DC2626` over-cap/breach) with `.tabular-nums` on hours, rupee amounts, percentages, and verification codes.

---

## Member 1 — Lead Integrator & Shared Shell (You)

### What You Own & Build
* **Allowed paths:** `src/types/*`, `src/lib/supabase/*`, `src/lib/engine/*`, `src/components/shared/*`, `src/app/layout.tsx`, `src/app/globals.css`, `supabase/schema.sql`, `package.json`, `.env.example`, and workflow/rule docs.
* **Forbidden paths:** Teammate-owned screen/component folders unless resolving an integration conflict or reviewing/merging PRs.
* **Your work:**
  1. Maintain `src/types/csc.ts`, `src/lib/engine/swap-math.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, and `supabase/schema.sql` while keeping offline `DEMO_MODE` functional when environment variables are absent.
  2. Build shared shell components in `src/components/shared/` (sidebar, top bar, demo-mode indicator, navigation links across all 7 screens) and wire typography/tokens in `src/app/layout.tsx` and `src/app/globals.css`.
  3. Review pull requests from Members 2–5, resolve any merge conflicts, run `npx tsc --noEmit` and `npm run build`, and keep `main` green.

### Prompt for Your Agent (Antigravity IDE)
> Read `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `ARCHITECTURE.md`, and all files in `.agent/rules/` and `docs/team-workflow/`. Check `git branch --show-current` first and make sure I am on a `feat/*` branch (never `main`). Working within Lead Integrator shared paths (`src/components/shared/*`, `src/app/layout.tsx`, `src/app/globals.css`, `src/types/*`, `src/lib/supabase/*`, `src/lib/engine/*`, `supabase/schema.sql`), build the shared navigation shell and verify shared types/swap math support all 7 screens cleanly. Run `npx tsc --noEmit` before finishing, do not run git commit/push, and give me the manual git commands to run.

---

## Member 2 — Landing Page, Agency Auth & Scope Health Dashboard

### What You Own & Build
* **Allowed paths:** `src/app/page.tsx`, `src/app/login/**`, `src/app/dashboard/**`, `src/components/landing/**`, `src/components/dashboard/**`.
* **Forbidden paths:** `src/types/*`, `src/lib/*`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/shared/*`, and other members' routes/components.
* **Your work:**
  1. **Landing Page (`/`):** Build a clear light-mode landing page explaining the Two-Layer Defense (Day-0 SOW Ambiguity Scanner + Mid-Sprint Drift & Swap Guardrail) with navigation to `/login`, `/dashboard`, `/scanner`, `/simulator`, and `/ledger`.
  2. **Agency Login (`/login`):** Create a clean workspace sign-in flow plus a one-click `"Enter Demo Workspace (PixelCraft Studio)"` button so live demos never block on credentials.
  3. **Scope Health Dashboard (`/dashboard`):** Build KPI cards (Contract Cap `₹1,50,000`, Allocated/Remaining Hours out of `120 hrs`, Pending Change Requests, Margin Protected), a SOW deliverables table (hours, status, swap eligibility), and a drift alert feed using types from `@/types/csc`.

### Prompt for Your Agent (Antigravity IDE)
> Read `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `ARCHITECTURE.md`, `.agent/rules/`, and `docs/team-workflow/tracks/track-02-landing-auth-dashboard.md`. First check `git branch --show-current`; if on `main` or `master`, switch to `git checkout -b feat/landing-auth-dashboard` before editing anything. Only create or edit files inside `src/app/page.tsx`, `src/app/login/**`, `src/app/dashboard/**`, `src/components/landing/**`, and `src/components/dashboard/**`—never touch `src/types/*`, `src/lib/*`, `src/app/globals.css`, `src/app/layout.tsx`, or other routes. Build `/`, `/login` (with one-click demo workspace entry), and `/dashboard` using Ledger Slate & Trust Indigo styling, `.tabular-nums`, and VastraKart demo metrics (`₹1,50,000` cap, `120 hrs`). Run `npx tsc --noEmit` when done, do not commit/push, and provide manual git commands for me to run.

---

## Member 3 — Client Approval Portal, Immutable Audit Ledger & PDF Export

### What You Own & Build
* **Allowed paths:** `src/app/approve/[token]/**`, `src/app/ledger/**`, `src/components/portal/**`, `src/components/ledger/**`.
* **Forbidden paths:** `src/types/*`, `src/lib/*`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/shared/*`, and other members' routes/components.
* **Your work:**
  1. **Client Approval Portal (`/approve/[token]`):** Build a focused client-facing review view comparing requested scope additions against a proposed trade-off (such as `+6h` WhatsApp OTP + `+8h` Excel export offset by deferring `14h` Blog & Content CMS at `₹0` net extra cost), with clear hour/rupee impact, an acknowledgment checkbox, and `"Approve Scope Swap"` / `"Request Call"` actions.
  2. **Immutable Audit Ledger (`/ledger`):** Build a filterable decision log (`All`, `Swapped ₹0`, `Paid Add-Ons`, `Deferred`) showing timestamps, change summaries, decision badges, net hour and `₹` deltas, and verification codes/hashes (such as `#CSC-892A`).
  3. **Client Handoff PDF Export:** Add a download button on `/ledger` using `jspdf` that generates a clean summary PDF of baseline scope and recorded decisions.

### Prompt for Your Agent (Antigravity IDE)
> Read `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `ARCHITECTURE.md`, `.agent/rules/`, and `docs/team-workflow/tracks/track-03-portal-ledger-pdf.md`. First check `git branch --show-current`; if on `main` or `master`, run `git checkout -b feat/portal-ledger-pdf` before making changes. Only create or edit files inside `src/app/approve/[token]/**`, `src/app/ledger/**`, `src/components/portal/**`, and `src/components/ledger/**`—never modify `src/types/*`, `src/lib/*`, `src/app/globals.css`, `src/app/layout.tsx`, or other routes. Build `/approve/[token]`, `/ledger` with filters and `jspdf` handoff export, using types from `@/types/csc`, Ledger Slate & Trust Indigo styling, and `.tabular-nums`. Run `npx tsc --noEmit` when done, do not commit/push, and give me manual git commands to run.

---

## Member 4 — Pre-Kickoff SOW Ambiguity Scanner, Drift Simulator & AI APIs

### What You Own & Build
* **Allowed paths:** `src/app/scanner/**`, `src/app/simulator/**`, `src/app/api/scan-sow/**`, `src/app/api/parse-scope/**`, `src/components/scanner/**`, `src/components/simulator/**`, `src/lib/fallbacks/**` (except `src/lib/fallbacks/vastrakart-demo.ts`, owned by Member 5).
* **Forbidden paths:** `src/types/*`, `src/lib/supabase/*`, `src/lib/engine/*`, `src/lib/fallbacks/vastrakart-demo.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/shared/*`, and other members' routes/components.
* **Your work:**
  1. **Stage-Safe AI Fallbacks (`src/lib/fallbacks/`):** Create deterministic JSON fallback responses for SOW ambiguity detection (flagging vague terms like `"login"` missing Google OAuth/OTP/2FA specs) and client creep parsing so endpoints work reliably even without API keys or live network access.
  2. **API Routes (`/api/scan-sow` & `/api/parse-scope`):** Validate request payloads with `zod`, call configured LLM providers when keys are present with automatic fallback to stage-safe JSON, and return typed `SowAmbiguity[]` and `ParsedMessageResult` responses.
  3. **SOW Ambiguity Scanner (`/scanner`):** Let users paste/load SOW text, inspect flagged ambiguities by severity, choose or enter clarifying specs before kickoff, and mark items resolved.
  4. **Guardrail & Swap Simulator (`/simulator`):** Let users test incoming client messages, inspect in-scope vs. out-of-scope drift (`+hrs` / `+₹`), and compare Scope Swap (using `calculateScopeSwap()` from `@/lib/engine/swap-math`), Paid Add-On, and Defer to Phase 2 options.

### Prompt for Your Agent (Antigravity IDE)
> Read `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `ARCHITECTURE.md`, `.agent/rules/`, and `docs/team-workflow/tracks/track-04-scanner-simulator-ai.md`. First check `git branch --show-current`; if on `main` or `master`, run `git checkout -b feat/scanner-simulator-ai` before writing code. Only create or edit files inside `src/app/scanner/**`, `src/app/simulator/**`, `src/app/api/scan-sow/**`, `src/app/api/parse-scope/**`, `src/components/scanner/**`, `src/components/simulator/**`, and `src/lib/fallbacks/` (do not touch `src/lib/fallbacks/vastrakart-demo.ts`, `src/types/*`, `src/lib/engine/*`, `src/lib/supabase/*`, `src/app/globals.css`, `src/app/layout.tsx`, or other routes). Reuse `calculateScopeSwap()` from `@/lib/engine/swap-math` and types from `@/types/csc`. Run `npx tsc --noEmit` when done, do not commit/push, and provide manual git commands for me to run.

---

## Member 5 — Demo Fixtures, SQL Seed & End-to-End QA

### What You Own & Build
* **Allowed paths:** `supabase/seed.sql`, `src/lib/fallbacks/vastrakart-demo.ts`, `DEMO_SCRIPT.md`.
* **Forbidden paths:** `src/types/*`, `src/lib/engine/*`, `src/lib/supabase/*`, `src/app/**`, `src/components/**`, and other members' files.
* **Your work:**
  1. **Idempotent SQL Seed (`supabase/seed.sql`):** Author repeatable seed data for *"VastraKart Store Redesign"* (`VastraKart Retail Pvt. Ltd.`, agency *"PixelCraft Studio"*, `₹1,50,000` fixed cap, `120 hrs` total budget, `₹1,250/hr` rate), baseline `scope_items` (including swappable items such as `14 hr` Blog & Content CMS), initial `sow_ambiguities` (such as unspecified login authentication—Google OAuth vs. OTP vs. 2FA), sample `change_requests`, and `audit_ledger` records.
  2. **Demo Fixture Module (`src/lib/fallbacks/vastrakart-demo.ts`):** Export strongly typed VastraKart demo fixtures, sample creep messages (`+6h` WhatsApp OTP + `+8h` Excel export = `+14h` drift), and SOW scan samples aligned with `@/types/csc`.
  3. **Demo Script & QA Checklist (`DEMO_SCRIPT.md`):** Write a concise live presentation runbook and end-to-end verification checklist across all 7 screens.

### Prompt for Your Agent (Antigravity IDE)
> Read `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `ARCHITECTURE.md`, `.agent/rules/`, and `docs/team-workflow/tracks/track-05-demo-seed-qa.md`. First check `git branch --show-current`; if on `main` or `master`, run `git checkout -b feat/demo-seed-qa` before editing anything. Only create or edit `supabase/seed.sql`, `src/lib/fallbacks/vastrakart-demo.ts`, and `DEMO_SCRIPT.md`—never touch `src/types/*`, `src/lib/engine/*`, `src/lib/supabase/*`, `src/app/**`, or `src/components/**`. Keep all numbers (`₹1,50,000` cap, `120 hrs`, `₹1,250/hr`, `+14 hr` creep swapped against `14 hr` Blog & Content CMS) consistent with `src/types/csc.ts` and `supabase/schema.sql`. Run `npx tsc --noEmit` when done, do not commit/push, and give me manual git commands for me to run.

---

## How Each Teammate Ships a Feature Branch

1. Sync latest `main` and create your feature branch:
   ```powershell
   git checkout main
   git pull origin main
   git checkout -b feat/<your-track-name>
   ```
2. Run your agent prompt in **Antigravity IDE** (or **Claude Code** / **Codex**) and verify `npx tsc --noEmit` passes with zero errors.
3. Stage, commit, and push **only your feature branch** (never `main`):
   ```powershell
   git status
   git add <only-your-owned-files>
   git commit -m "feat(<scope>): <concise summary of your change>"
   git push -u origin feat/<your-track-name>
   ```
4. Open a Pull Request into `main` on GitHub so **Member 1 (Lead Integrator)** can review and merge it cleanly.