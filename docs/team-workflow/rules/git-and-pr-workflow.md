# Git Branching, Sync Rules & PR Workflow

> **This project uses a linear `main`-based workflow.** No develop branch. Each member works in their own feature branch and PRs directly to `main`. Only Member 1 (Lead Integrator) merges.

---

## 🌿 Branch Naming Convention

| Member | Branch Name | Scope |
|:-------|:-----------|:------|
| Member 1 | `feat/shared-shell` | Types, Supabase clients, engine, shared components, root layout |
| Member 2 | `feat/landing-dashboard` | Landing page, login, dashboard |
| Member 3 | `feat/portal-ledger` | Approval portal, audit ledger, PDF export |
| Member 4 | `feat/scanner-simulator` | SOW scanner, drift simulator, API routes, fallbacks |
| Member 5 | `feat/demo-fixtures` | Seed SQL, TypeScript fixtures, demo script |

### Branch Creation (run once per member)

```bash
git checkout main
git pull origin main
git checkout -b feat/<your-branch-name>
# e.g.:  git checkout -b feat/landing-dashboard
```

---

## ✅ Pre-PR Verification Checklist

**All three checks must pass before opening a PR. No exceptions.**

```bash
# 1. TypeScript — zero errors required (most important)
npx tsc --noEmit

# 2. ESLint — no blocking errors
npx eslint src --ext .ts,.tsx --max-warnings 0

# 3. Next.js build smoke check — catches import and routing errors
npx next build
```

> [!IMPORTANT]
> If `npx tsc --noEmit` fails with an error in a **🔒 shared-core file**, do not attempt to fix it yourself. Follow the [shared-core change request protocol](folder-ownership-locks.md#request-protocol-for-shared-core-changes) and wait for Member 1 to resolve it.

---

## 📬 Pull Request Rules

### Format

| Field | Rule |
|:------|:-----|
| **Target branch** | Always `main` — never target a teammate's feature branch |
| **PR title** | `feat(m[1-5]): <short imperative description>` |
| **Example titles** | `feat(m2): landing page, demo login, and dashboard` |
| | `feat(m3): client approval portal and audit ledger PDF` |
| | `feat(m4): SOW scanner, simulator, and AI API routes` |
| | `feat(m5): VastraKart seed SQL and demo fixtures` |
| **Reviewer** | Always request **Member 1** (Lead Integrator) |
| **Merge** | Only Member 1 merges PRs into `main` |

### Required PR Description Template

```markdown
## Summary
<!-- One sentence: what does this PR add or fix? -->

## Screens / Routes
<!-- List the routes this PR affects -->
- `/dashboard` — Scope Health Dashboard
- `/login` — Demo bypass login

## Files Changed
<!-- Must stay within your folder lock (see folder-ownership-locks.md) -->
- src/app/dashboard/page.tsx
- src/components/dashboard/KpiCards.tsx

## TypeScript Check
<!-- Paste the last line of `npx tsc --noEmit` output -->
✅ `npx tsc --noEmit` — exited 0, zero errors

## Screenshot / Proof
<!-- Puppeteer screenshot, screen grab, or terminal output -->
[attach screenshot]

## Checklist
- [ ] All changes are within my folder lock
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] No hardcoded secrets in any file
- [ ] No changes to package.json without Lead approval
- [ ] VastraKart demo numbers unchanged (₹1,50,000 / 120 hrs / +14 hr drift)
```

---

## 🔄 Staying in Sync with `main`

Whenever Member 1 merges a shared-core change (or any teammate's PR), **all other members must sync before continuing work:**

```bash
# Rebase your branch on the latest main
git fetch origin
git rebase origin/main

# If you hit conflicts:
# 1. Open the conflicted file
# 2. If it's in a 🔒 locked file — STOP. Contact Member 1.
# 3. If it's in YOUR folder — resolve it, then:
git add <resolved-file>
git rebase --continue
```

> [!WARNING]
> **Never force-push `main`.** If you accidentally pushed to `main`, contact Member 1 immediately.

---

## ⚠️ Conflict Resolution Rules

| Conflict Type | Rule |
|:---|:---|
| Conflict in **your own folder** | Resolve it yourself. Keep your changes; rebase on main. |
| Conflict in a **🔒 shared-core file** | STOP. Contact Member 1. Never resolve this yourself. |
| Conflict in a **teammate's folder** | STOP. Contact that teammate. Never merge their changes. |
| Conflict in `package-lock.json` | Accept `main`'s version (`git checkout origin/main -- package-lock.json`). Then report the conflict to Member 1. |

---

## 🚨 Demo Day Emergency Protocol

If a teammate's feature is broken and their branch isn't mergeable on demo day:

```bash
# Member 1 applies a targeted patch from the working commit:
git checkout main
git cherry-pick <specific-working-commit-hash>

# Verify before proceeding:
npx tsc --noEmit
npx next build

# Never cherry-pick an entire branch tip if it has broken commits.
```

If the broken feature belongs to Member 4 (AI APIs), Member 5's fallbacks guarantee the demo still works:
- `/api/scan-sow` → serves `src/lib/fallbacks/scan-sow-fallback.json`
- `/api/parse-scope` → serves `src/lib/fallbacks/parse-scope-fallback.json`
- All pages → consume `src/lib/fallbacks/vastrakart-demo.ts` constants

---

## 🤖 Git Rules for AI Agents

```
FORBIDDEN — AI agents must never run:
  git add
  git commit
  git commit --amend
  git push
  git push --force
  git merge
  git reset --hard

ALLOWED — AI agents may run:
  git status
  git diff
  git log --oneline -10
  git branch --show-current
  git fetch origin          (read-only)
  npx tsc --noEmit          (verification)
  npx next build            (verification, read-only build)
```

Humans own all commits and pushes. If you need to verify what will be committed, use `git diff` and show it to the human.
