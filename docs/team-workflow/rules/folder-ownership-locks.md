# Folder Ownership Locks & Anti-Conflict Rules

> **Applies to:** All team members and all AI agents (Antigravity, Claude Code, Codex, Cursor, Copilot)  
> **Enforcement:** These rules are binding. No agent or human may bypass them.

---

## 🔒 Shared / Protected Core — Member 1 (Lead Integrator) Only

The files below are **read-only** for everyone except Member 1's agent. You may **import** from them freely but must **never write, overwrite, rename, or extend** them without following the Request Protocol below.

| File / Folder | Why Locked | Safe Usage |
|:---|:---|:---|
| `src/types/csc.ts` | Single source of truth for all domain types | `import type { Project, ScopeItem, ... } from '@/types/csc'` |
| `src/lib/supabase/client.ts` | Typed browser Supabase client config | `import { createBrowserClient } from '@/lib/supabase/client'` |
| `src/lib/supabase/server.ts` | Typed server Supabase client config | `import { createServerClient } from '@/lib/supabase/server'` |
| `src/lib/engine/swap-math.ts` | Deterministic rupee/hour swap math | `import { calculateScopeSwap } from '@/lib/engine/swap-math'` |
| `src/components/shared/AppSidebar.tsx` | Shared 240px workspace sidebar | Use `<AppSidebar />` as-is; never edit props or markup |
| `src/components/shared/KpiBentoGrid.tsx` | Shared 4-card KPI bento layout | Use `<KpiBentoGrid />` as-is |
| `src/app/layout.tsx` | Root layout (fonts, providers, metadata) | Rely on its presence; do not add scripts, providers, or meta |
| `src/app/globals.css` | All CSS design tokens & Tailwind base layer | Use defined variables; never add global rules or override tokens |
| `supabase/schema.sql` | Canonical DB schema + RLS policies | Read for reference; never ALTER, DROP, or ADD tables/columns |
| `package.json` | Dependency manifest & scripts | Never run `pnpm add` / `npm install` and commit changes without Lead approval |
| `.env.example` | Environment variable template | Copy to `.env.local` and fill values; never add or remove declared keys |

---

## 👤 Teammate File Boundaries

### Member 2 — Landing · Auth · Dashboard

| Status | Paths |
|:-------|:------|
| ✅ **ALLOW** | `src/app/page.tsx` |
| ✅ **ALLOW** | `src/app/login/**` |
| ✅ **ALLOW** | `src/app/dashboard/**` |
| ✅ **ALLOW** | `src/components/landing/**` |
| ✅ **ALLOW** | `src/components/dashboard/**` |
| ❌ **FORBID** | All 🔒 Shared Core paths above |
| ❌ **FORBID** | `src/app/approve/**` — Member 3 |
| ❌ **FORBID** | `src/app/ledger/**` — Member 3 |
| ❌ **FORBID** | `src/components/portal/**` — Member 3 |
| ❌ **FORBID** | `src/components/ledger/**` — Member 3 |
| ❌ **FORBID** | `src/app/scanner/**` — Member 4 |
| ❌ **FORBID** | `src/app/simulator/**` — Member 4 |
| ❌ **FORBID** | `src/app/api/**` — Member 4 |
| ❌ **FORBID** | `src/components/scanner/**` — Member 4 |
| ❌ **FORBID** | `src/components/simulator/**` — Member 4 |
| ❌ **FORBID** | `src/lib/fallbacks/**` — Member 4 & 5 |
| ❌ **FORBID** | `supabase/seed.sql` — Member 5 |
| ❌ **FORBID** | `DEMO_SCRIPT.md` — Member 5 |

---

### Member 3 — Portal · Ledger · PDF

| Status | Paths |
|:-------|:------|
| ✅ **ALLOW** | `src/app/approve/[token]/**` |
| ✅ **ALLOW** | `src/app/ledger/**` |
| ✅ **ALLOW** | `src/components/portal/**` |
| ✅ **ALLOW** | `src/components/ledger/**` |
| ❌ **FORBID** | All 🔒 Shared Core paths above |
| ❌ **FORBID** | `src/app/page.tsx` — Member 2 |
| ❌ **FORBID** | `src/app/login/**` — Member 2 |
| ❌ **FORBID** | `src/app/dashboard/**` — Member 2 |
| ❌ **FORBID** | `src/components/landing/**` — Member 2 |
| ❌ **FORBID** | `src/components/dashboard/**` — Member 2 |
| ❌ **FORBID** | `src/app/scanner/**` — Member 4 |
| ❌ **FORBID** | `src/app/simulator/**` — Member 4 |
| ❌ **FORBID** | `src/app/api/**` — Member 4 |
| ❌ **FORBID** | `src/lib/fallbacks/**` — Member 4 & 5 |
| ❌ **FORBID** | `supabase/seed.sql` — Member 5 |

---

### Member 4 — Scanner · Simulator · AI APIs · Fallbacks

| Status | Paths |
|:-------|:------|
| ✅ **ALLOW** | `src/app/scanner/**` |
| ✅ **ALLOW** | `src/app/simulator/**` |
| ✅ **ALLOW** | `src/app/api/scan-sow/**` |
| ✅ **ALLOW** | `src/app/api/parse-scope/**` |
| ✅ **ALLOW** | `src/components/scanner/**` |
| ✅ **ALLOW** | `src/components/simulator/**` |
| ✅ **ALLOW** | `src/lib/fallbacks/**` (JSON fallback files) |
| ❌ **FORBID** | All 🔒 Shared Core paths above |
| ❌ **FORBID** | `src/app/page.tsx` — Member 2 |
| ❌ **FORBID** | `src/app/login/**` — Member 2 |
| ❌ **FORBID** | `src/app/dashboard/**` — Member 2 |
| ❌ **FORBID** | `src/components/landing/**` — Member 2 |
| ❌ **FORBID** | `src/components/dashboard/**` — Member 2 |
| ❌ **FORBID** | `src/app/approve/**` — Member 3 |
| ❌ **FORBID** | `src/app/ledger/**` — Member 3 |
| ❌ **FORBID** | `src/components/portal/**` — Member 3 |
| ❌ **FORBID** | `src/components/ledger/**` — Member 3 |
| ❌ **FORBID** | `supabase/seed.sql` — Member 5 |
| ❌ **FORBID** | `src/lib/fallbacks/vastrakart-demo.ts` — Member 5 owns this specific file |

---

### Member 5 — Demo Fixtures · SQL Seed · QA

| Status | Paths |
|:-------|:------|
| ✅ **ALLOW** | `supabase/seed.sql` |
| ✅ **ALLOW** | `src/lib/fallbacks/vastrakart-demo.ts` |
| ✅ **ALLOW** | `DEMO_SCRIPT.md` |
| ✅ **ALLOW (read-only QA)** | All `src/app/**` pages (read to verify, never edit) |
| ✅ **ALLOW (read-only QA)** | All `src/components/**` (read to verify, never edit) |
| ❌ **FORBID** | All 🔒 Shared Core paths above |
| ❌ **FORBID** | `src/lib/fallbacks/*.json` — Member 4 owns the JSON files |
| ❌ **FORBID** | Any `src/app/**` route files (edit rights belong to M2/M3/M4) |
| ❌ **FORBID** | Any `src/components/**` component files (edit rights belong to M2/M3/M4) |

---

## 📋 Request Protocol for Shared-Core Changes

If you — human or AI agent — need a change to any 🔒 file (especially `src/types/csc.ts` or `src/lib/engine/swap-math.ts`):

### Step 1 — STOP. Do not edit the file.

An AI agent must tell the human:  
> *"This change requires editing a shared-core file (`src/types/csc.ts`). I cannot make this edit. Please follow the shared-core request protocol."*

### Step 2 — Open a GitHub issue (or message Member 1) with:

```
Title: [Shared Core Request] Add `resolvedAt: string` to SowAmbiguity

Body:
  File:    src/types/csc.ts
  Change:  Add field `resolvedAt: string | null` to interface SowAmbiguity
  Reason:  Track when ambiguity was resolved for the audit timeline
  Consumers:
    - src/app/scanner/page.tsx (Member 4)
    - src/lib/fallbacks/scan-sow-fallback.json (Member 4)
```

### Step 3 — Member 1 applies the change

On branch `feat/shared-shell`, Member 1:
1. Edits the locked file
2. Runs `npx tsc --noEmit` — must exit 0
3. Merges to `main` with a conventional commit

### Step 4 — All teammates sync

```bash
git fetch origin
git rebase origin/main
# Then resume your work
```

> [!WARNING]
> **Never cherry-pick or stash-pop around a shared-core change.** Always rebase on the full merge commit.

---

## ⚙️ Universal Anti-Conflict Rules for AI Agents

These apply regardless of which member's agent you are:

1. **Read your track file** (`docs/team-workflow/tracks/track-0X-*.md`) before writing any code.
2. **Never open a FORBID file with intent to write** — not even to "just fix a small bug."
3. **Never install packages** without Lead Integrator approval. No silent `pnpm add`.
4. **Never hardcode secrets.** Use `process.env.NEXT_PUBLIC_SUPABASE_URL` etc.
5. **Never alter VastraKart canonical numbers** (`₹1,50,000`, `120 hrs`, `+14 hr drift`, token `demo-csc-892a`) without M1 + M5 sign-off.
6. **Never run `git add`, `git commit`, or `git push`.** Humans commit.
7. **Always run `npx tsc --noEmit`** before marking any task done. Zero errors required.
