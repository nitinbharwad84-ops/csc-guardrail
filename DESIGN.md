# DESIGN.md — CSC Visual & UI Design System ("Ledger Slate & Trust Indigo")

> **Aesthetic Direction:** Light-first, high-trust B2B FinTech & Contract SaaS (modeled after Stripe, Ramp, and Linear). Optimized for crisp readability on both laptops and bright hackathon projector screens.

---

## 1. Color Tokens (Tailwind CSS / CSS Variables)

| Token Name | Hex Value | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#F8FAFC` | `slate-50` | Main application background canvas |
| `--bg-surface` | `#FFFFFF` | `white` | Cards, data tables, modals, sidebar |
| `--bg-subtle` | `#F1F5F9` | `slate-100` | Table headers, secondary badges, input fills |
| `--border-default` | `#E2E8F0` | `slate-200` | Crisp `1px solid` card and table borders |
| `--border-strong` | `#CBD5E1` | `slate-300` | Hover borders and active input outlines |
| `--text-primary` | `#0F172A` | `slate-900` | Headings, primary metrics, table values |
| `--text-secondary` | `#475569` | `slate-600` | Subtitles, descriptions, table labels |
| `--text-muted` | `#64748B` | `slate-500` | Timestamps, helper captions |
| `--brand-primary` | `#4F46E5` | `indigo-600` | Primary CTAs, active nav pills, Swap highlight |
| `--brand-hover` | `#4338CA` | `indigo-700` | Button hover states |
| `--brand-tint` | `#EEF2FF` | `indigo-50` | Active navigation background & focus rings |
| `--status-safe` | `#059669` | `emerald-600` | In-scope, Margin Saved, Swappable tags, Approved |
| `--status-safe-bg` | `#ECFDF5` | `emerald-50` | Safe/Approved pill & callout backgrounds |
| `--status-warn` | `#D97706` | `amber-600` | SOW Ambiguity flags & Out-of-Scope drift warnings |
| `--status-warn-bg` | `#FFFBEB` | `amber-50` | Ambiguity scanner & drift alert card backgrounds |
| `--status-danger` | `#DC2626` | `red-600` | Budget cap breach / high-risk unresolved conflict |

---

## 2. Typography & Numeric Precision

* **Display & Section Headings:** `Plus Jakarta Sans` (`600 SemiBold`, `700 Bold`, `800 ExtraBold`, tight tracking `-0.02em`)
* **UI Copy, Forms & Table Text:** `Inter` (`400 Regular`, `500 Medium`, `600 SemiBold`)
* **Financials, Hours & Verification Hashes:** `Geist Mono` or `JetBrains Mono` with mandatory `tabular-nums` (`font-variant-numeric: tabular-nums`) so columns of `₹1,50,000`, `+14 hrs`, and `#CSC-892A` align vertically.

### Type Scale
* **Hero / Landing H1:** `48px` (`3rem`) / `1.12` line-height / Bold
* **Page Header H1:** `24px` (`1.5rem`) / `1.25` line-height / SemiBold
* **Card Title H2:** `16px` (`1rem`) / `1.4` line-height / SemiBold
* **KPI Hero Number:** `28px` (`1.75rem`) / `1.1` line-height / Mono Bold `tabular-nums`
* **Body & Table Cells:** `14px` (`0.875rem`) / `1.5` line-height / Regular

---

## 3. Layout, Spacing & Component Rules

1. **App Shell (Screens 3, 4, 5, 7):**
   * Fixed `240px` left sidebar (`#FFFFFF` with `1px` right border `#E2E8F0`) containing:
     * Top Brand Header: `CSC Guardrail` + shield icon
     * Navigation Links:
       1. `SOW Scanner` (`/scanner`) — *Day-0 Spec Check*
       2. `Scope Dashboard` (`/dashboard`)
       3. `Guardrail Simulator` (`/simulator`)
       4. `Client Portal` (`/approve/demo-csc-892a`)
       5. `Audit Ledger` (`/ledger`)
     * Bottom Workspace Card: `PixelCraft Studio` + quick link back to `/` Landing Page.
2. **Public Shell (Screens 1 & 6):**
   * **Landing Page (`/`):** Clean top navbar (`Features`, `7-Screen Flow`, `Live Demo`, `Login`) + centered `1200px` max-width hero, interactive 2-Layer Defense comparison, and quick-launch screen cards.
   * **Client Approval Portal (`/approve/[token]`):** Centered `720px` single-column contract sheet with zero agency sidebar clutter.
3. **Card & Border Standard:**
   * `border-radius: 12px` (`rounded-xl`) on all cards and containers; `8px` (`rounded-lg`) on buttons and inputs; `9999px` (`rounded-full`) on status pills.
   * Rely on crisp `1px solid #E2E8F0` borders rather than heavy drop shadows (`shadow-xs` maximum).
4. **Status Pill Grammar:**
   * `Locked` $\rightarrow$ Slate pill (`bg-slate-100 text-slate-700`)
   * `Swappable (14 hrs)` $\rightarrow$ Emerald pill (`bg-emerald-50 text-emerald-700 border-emerald-200`)
   * `Ambiguous Spec` / `Drift +14 hrs` $\rightarrow$ Amber pill (`bg-amber-50 text-amber-700 border-amber-200`)
   * `Over Cap` $\rightarrow$ Red pill (`bg-red-50 text-red-700 border-red-200`)