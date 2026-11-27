# Git Branching, Sync Rules & PR Workflow

> **This project uses a linear, branch-isolated `main`-based workflow.**  
> Direct commits or pushes to `main` or `master` are strictly forbidden for both AI agents and human developers. Each member works exclusively in their own dedicated feature branch and PRs directly to `main`. Only Member 1 (Lead Integrator) merges.

---

## 🏛️ LAW 1 — MANDATORY BRANCH CHECKOUT (NEVER TOUCH `main` OR `master`)

1. **Mandatory Check at Session Start:**  
   Before creating, editing, reading with intent to write, or deleting ANY file, every agent **MUST** run:
   ```bash
   git branch --show-current
   ```
2. **Immediate Halt on Main/Master:**  
   If the active branch is `main` or `master`:
   - **STOP IMMEDIATELY.** Do not modify, create, or delete any files.
   - Run `git checkout -b feat/<track-or-feature-name>` (or request the developer to confirm their track branch).
   - Only proceed with file edits once confirmed to be on an isolated `feat/*` branch.
3. **Strictly Forbidden Agent Git Operations:**
   - ❌ `git commit` on `main` or `master`
   - ❌ `git push` on `main` or `master`
   - ❌ `git merge` on `main` or `master`
   - ❌ `git reset --hard` on `main` or `master`
   - ❌ Auto-committing or auto-pushing without explicit developer instruction on a feature branch (`feat/*`).

---

## 🌿 Dedicated Feature Branch Names

| Member / Track | Branch Name | Scope & Owned Directories |
|:---|:---|:---|
| **Track 01 (Lead Integrator)** | `feat/shared-shell` | Types, Supabase clients, engine, shared components, root layout, schema.sql |
| **Track 02 (Landing, Auth & Dashboard)** | `feat/landing-dashboard` | Landing page, login, dashboard, landing & dashboard components |
| **Track 03 (Portal, Ledger & PDF)** | `feat/portal-ledger` | Approval portal, audit ledger, PDF export, portal & ledger components |
| **Track 04 (Scanner, Simulator & AI)** | `feat/scanner-simulator` | SOW scanner, drift simulator, API routes, fallbacks |
| **Track 05 (Demo Seed & QA)** | `feat/demo-fixtures` | Seed SQL, TypeScript fixtures, demo script, QA testing |

### Initial Branch Creation (Run Once per Member)

```bash
git checkout main
git pull origin main
git checkout -b feat/<your-branch-name>
# Example: git checkout -b feat/landing-dashboard
```

---

## ✅ LAW 5 — Pre-PR Verification Checklist

**All checks must pass before opening a PR. No exceptions.**

```bash
# 1. Static TypeScript Check — MUST EXIT WITH 0 ERRORS
npx tsc --noEmit

# 2. ESLint Check — No blocking errors
npx eslint src --ext .ts,.tsx --max-warnings 0

# 3. Next.js Build Smoke Check — Catches import and routing errors
npx next build
```

> [!IMPORTANT]
> If `npx tsc --noEmit` fails due to a missing or altered type in a **🔒 shared-core file**, do NOT edit `src/types/csc.ts` directly. Follow the [Shared-Core Change Request Protocol](folder-ownership-locks.md#request-protocol-for-shared-core-changes) and coordinate with Member 1.

---

## 📬 Pull Request Rules

### Format & Submission

| Field | Rule |
|:---|:---|
| **Target branch** | Always `main` — never target another teammate's feature branch |
| **PR title format** | `feat(m[1-5]): <short imperative description>` |
| **Example titles** | `feat(m2): landing page, demo login bypass, and dashboard KPIs` |
| | `feat(m3): client approval portal and audit ledger PDF generator` |
| | `feat(m4): SOW ambiguity scanner, drift simulator, and fallback APIs` |
| | `feat(m5): VastraKart idempotent seed SQL and demo script` |
| **Reviewer** | Always assign **Member 1** (Lead Integrator) |
| **Merge Authority** | Only Member 1 merges PRs into `main` |

### Required PR Description Template

```markdown
## Summary
<!-- One clear sentence explaining the changes -->

## Affected Routes & Screens
- `/dashboard` — Scope Health Dashboard
- `/login` — Demo bypass login

## Modified Files
<!-- Must be strictly within your track folder lock -->
- src/app/dashboard/page.tsx
- src/components/dashboard/KpiCards.tsx

## Verification Proof
- `npx tsc --noEmit` exited 0 (zero errors)
- [Attach screenshot or visual proof]

## Checklist
- [ ] Active branch is `feat/*` (never committed to `main`)
- [ ] All changes are within my assigned track ownership boundary
- [ ] TypeScript static check passes (`npx tsc --noEmit`)
- [ ] No hardcoded secrets or environment variables committed
- [ ] VastraKart canonical numbers maintained (₹1,50,000 / 120 hrs / +14 hr drift)
```

---

## 🔄 Staying in Sync with `main`

Whenever Member 1 merges a shared-core update or another teammate's PR into `main`, rebase your feature branch before continuing:

```bash
# Fetch latest remote commits
git fetch origin

# Rebase active feature branch onto origin/main
git rebase origin/main
```

### Conflict Resolution Strategy

| Conflict Location | Resolution Procedure |
|:---|:---|
| **Inside your track's owned files** | Resolve manually. Keep your functional changes, verify `npx tsc --noEmit`, then `git rebase --continue`. |
| **Inside 🔒 shared-core files** | **STOP IMMEDIATELY.** Contact Member 1. Never resolve shared core conflicts unilaterally. |
| **Inside another teammate's files** | **STOP IMMEDIATELY.** You should not have modified files outside your track. Revert changes to those files. |
| **Inside `package-lock.json`** | Accept origin/main version: `git checkout origin/main -- package-lock.json`, then notify Member 1. |

---

## 🚨 Demo Day Emergency Protocol

If a teammate's feature is blocked or incomplete on demo day:
1. Member 1 creates a safe hotfix commit directly on `feat/shared-shell` or cherry-picks the working commit:
   ```bash
   git checkout main
   git cherry-pick <working-commit-hash>
   npx tsc --noEmit
   ```
2. If remote AI APIs or Supabase are unreachable during live presentation, all screens fall back smoothly to `src/lib/fallbacks/` static JSON and `vastrakart-demo.ts`. Zero live crashes.

---

## 📋 Copy-Paste Commands for Developer Hand-off

When an AI agent finishes code changes on a feature branch, it must output these exact commands for the developer to run manually:

```bash
# 1. Review status and modified files
git status

# 2. Stage modified files within your track boundary
git add <modified-files>

# 3. Commit with conventional commit message
git commit -m "feat(<track>): <description>"

# 4. Push to remote feature branch
git push -u origin feat/<your-branch-name>
```
