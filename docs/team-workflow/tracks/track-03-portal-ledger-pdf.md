# Track 03 — Client Approval Portal, Audit Ledger & PDF Export

**Member:** 3  
**Branch:** `feat/portal-ledger`  
**Role:** Builds the public client-facing approval portal and the internal immutable audit ledger with jsPDF export. These two screens are the highest-trust outputs of the entire system.

---

## 📁 File Ownership

### ✅ ALLOW — Full Write Access

```
src/app/approve/[token]/page.tsx     ← Screen 6: Public Client Approval Portal
src/app/ledger/page.tsx              ← Screen 7: Immutable Audit Ledger + PDF
src/components/portal/               ← Approval contract sheet, summary cards, sign CTA
src/components/ledger/               ← PdfExportButton, ledger timeline, hash chips
```

### ❌ FORBID — Do Not Read with Intent to Edit

```
src/types/csc.ts                     ← IMPORT ONLY (Member 1)
src/lib/supabase/**                  ← IMPORT ONLY (Member 1)
src/lib/engine/**                    ← IMPORT ONLY (Member 1)
src/components/shared/**             ← USE AS-IS (Member 1)
src/app/layout.tsx                   ← READ ONLY (Member 1)
src/app/globals.css                  ← READ ONLY (Member 1)
supabase/schema.sql                  ← READ ONLY (Member 1)
package.json                         ← READ ONLY (Member 1)
src/app/page.tsx                     ← Member 2
src/app/login/**                     ← Member 2
src/app/dashboard/**                 ← Member 2
src/components/landing/**            ← Member 2
src/components/dashboard/**          ← Member 2
src/app/scanner/**                   ← Member 4
src/app/simulator/**                 ← Member 4
src/app/api/**                       ← Member 4
src/components/scanner/**            ← Member 4
src/components/simulator/**          ← Member 4
src/lib/fallbacks/**                 ← Member 4 & 5
supabase/seed.sql                    ← Member 5
src/lib/fallbacks/vastrakart-demo.ts ← Member 5
DEMO_SCRIPT.md                       ← Member 5
```

---

## 🔗 Dependencies on Shared Core

| Shared File | How Member 3 Uses It |
|:------------|:---------------------|
| `src/types/csc.ts` | Import `ChangeRequest`, `AuditLedger`, `ScopeItem`, `Project` |
| `src/lib/supabase/server.ts` | Fetch `change_requests` by `approval_token` on the portal page (server component) |
| `src/lib/supabase/client.ts` | Update `approval_status` on "Approve" / "Reject" button click (client action) |
| `src/components/shared/AppSidebar.tsx` | Wrap `/ledger` in `<AppSidebar />` (ledger is an app-shell screen) |
| `src/app/globals.css` | Use `--status-safe`, `--status-warn`, `--text-primary`, `--border-default` |

> **Portal page (`/approve/[token]`)** uses NO sidebar — it is a public-facing page with zero agency chrome.

> If you need a new field on `ChangeRequest` or `AuditLedger`, **stop and open a request for Member 1.**

---

## 📦 Key Deliverables

### Screen 6 — Client Approval Portal (`/approve/[token]`)

**Layout:** Public shell — NO sidebar. Centered 720px single-column contract sheet.  
**Access:** Anyone with the token URL can open this. No login required.

**Demo URL:** `/approve/demo-csc-892a`  
**Token value in DB:** `change_requests.approval_token = 'demo-csc-892a'`

**Page Sections (top to bottom):**

1. **Header:**
   - `PixelCraft Studio` → `VastraKart` (agency → client)
   - `Scope Change Approval Request` title
   - Approval reference: `Ref: #CSC-892A`

2. **Change Summary Card (amber border):**
   ```
   📋 Requested Changes
   ┌─────────────────────────────────────────────────────┐
   │  WhatsApp / SMS 2FA OTP          +6 hrs   ₹7,500   │
   │  Excel & CSV Order Export        +8 hrs   ₹10,000  │
   │  ─────────────────────────────────────────────────  │
   │  Total Drift                    +14 hrs   ₹17,500  │
   └─────────────────────────────────────────────────────┘
   ```

3. **Scope Swap Resolution Card (emerald border):**
   ```
   ✅ Zero-Cost Resolution
   Mobile-Responsive Storefront (14 hrs) → Deferred to Phase 2
   Net Budget Impact: ₹0  |  Net Hour Impact: 0 hrs
   ```

4. **Contract Statement:**
   - "By approving, you confirm the scope swap is acceptable for Phase 1."

5. **Action Buttons:**
   - `✅ Approve Scope Change` — green, calls Supabase to set `approval_status = 'approved'`
   - `❌ Reject` — red outlined, sets `approval_status = 'rejected'`

6. **Post-Approval State:**
   - Green banner: `Approved ✓ — Scope change confirmed at [timestamp]`
   - Text: `"A new entry has been added to the audit ledger (#CSC-892A)."`
   - Link: `View Audit Ledger →`

**Approval Action (client-side):**
```typescript
// On "Approve" click:
const { error } = await supabase
  .from('change_requests')
  .update({ approval_status: 'approved' })
  .eq('approval_token', token)

// Also insert into audit_ledger:
await supabase.from('audit_ledger').insert({
  project_id: changeRequest.project_id,
  verification_hash: '#CSC-892A',
  event_type: 'scope_swap',
  summary: 'Scope swap approved by client: WhatsApp 2FA + Excel Export added; Mobile-Responsive Storefront deferred.',
  delta_hours: 0,
  delta_cost_inr: 0,
  actor: 'Client Approved'
})
```

---

### Screen 7 — Immutable Audit Ledger (`/ledger`)

**Layout:** App shell — uses `<AppSidebar />`.

**Ledger Timeline (chronological, oldest first):**

| Hash | Event | Summary | Δ Hrs | Δ Cost | Actor | Timestamp |
|:-----|:------|:--------|:------|:-------|:------|:----------|
| `#CSC-001A` | SOW Clarified | Auth & Email Login locked to Email/Password only. OAuth deferred to Phase 2. | 0 | ₹0 | Agency Lead | ISO date |
| `#CSC-892A` | Scope Swap | +WhatsApp 2FA, +Excel Export; −Mobile-Responsive Storefront. Net Δ: 0 hrs / ₹0. | 0 | ₹0 | Client Approved | ISO date |

**Visual Requirements:**
- Verification hashes (`#CSC-001A`, `#CSC-892A`) in **Geist Mono / JetBrains Mono**
- Delta columns (`Δ Hrs`, `Δ Cost`) with `tabular-nums` font variant — columns must align vertically
- Each row has an expand toggle showing the full `summary` text
- Append-only visual treatment (no edit/delete buttons visible anywhere)
- `Client Approved` actor shown with emerald pill; `Agency Lead` with slate pill

---

### PDF Export Button

**Component:** `src/components/ledger/PdfExportButton.tsx`  
**Library:** `jspdf` (already in `package.json` — do not add it again)

**PDF Content Structure:**
```
─────────────────────────────────────────────
  CSC GUARDRAIL — AUDIT LEDGER EXPORT
  PixelCraft Studio → VastraKart
  Generated: 27 Nov 2026, 15:08 IST
─────────────────────────────────────────────
  CONTRACT BASELINE
  Budget Cap:   ₹1,50,000
  Total Hours:  120 hrs
  Hourly Rate:  ₹1,250/hr
─────────────────────────────────────────────
  AUDIT EVENTS

  #CSC-001A | SOW Clarified | 27 Nov 2026
  Auth & Email Login locked to Email/Password only.
  Actor: Agency Lead | Δ Hrs: 0 | Δ Cost: ₹0

  #CSC-892A | Scope Swap | 27 Nov 2026
  +WhatsApp 2FA, +Excel Export; −Mobile Storefront.
  Actor: Client Approved | Δ Hrs: 0 | Δ Cost: ₹0
─────────────────────────────────────────────
  Verification: All hashes are immutable ledger entries.
  CSC Guardrail © PixelCraft Studio 2026
─────────────────────────────────────────────
```

**Usage:**
```typescript
import jsPDF from 'jspdf'

export function PdfExportButton({ ledgerEntries }: { ledgerEntries: AuditLedger[] }) {
  const handleExport = () => {
    const doc = new jsPDF()
    // ... build PDF content
    doc.save('csc-audit-ledger.pdf')
  }
  return <button onClick={handleExport}>Export PDF</button>
}
```

---

## 🎨 Design Notes

- **Portal page:** No sidebar. Single-column, 720px max-width, centered. Trust-first design.
- **Ledger page:** App shell with sidebar. Full-width table. Monospaced hash column.
- Verification hashes must use `font-mono tabular-nums` class for alignment.
- "Approved" actor badge: `bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full`
- "Agency Lead" actor badge: `bg-slate-100 text-slate-700 rounded-full`

---

## 🤖 Member 3 Agent Starter Block

```
You are working on the CSC Guardrail project as Member 3 (Portal · Ledger · PDF).
READ docs/team-workflow/tracks/track-03-portal-ledger-pdf.md first.
READ docs/team-workflow/rules/folder-ownership-locks.md for the full boundary table.

Your folder lock (Member 3):
  ALLOW (full write access):
    src/app/approve/[token]/page.tsx
    src/app/ledger/page.tsx
    src/components/portal/**
    src/components/ledger/**

  IMPORT ONLY (never edit):
    src/types/csc.ts            → import { ChangeRequest, AuditLedger, ScopeItem, Project }
    src/lib/supabase/client.ts  → import { createBrowserClient } (for approve/reject action)
    src/lib/supabase/server.ts  → import { createServerClient } (for fetching data)
    src/components/shared/**    → <AppSidebar /> on /ledger page only (no sidebar on /approve)

  FORBID (do not open with intent to edit):
    src/lib/engine/**           ← Member 1
    src/app/layout.tsx          ← Member 1
    src/app/globals.css         ← Member 1
    supabase/**                 ← Member 1 & 5
    src/app/page.tsx            ← Member 2
    src/app/login/**            ← Member 2
    src/app/dashboard/**        ← Member 2
    src/components/landing/**   ← Member 2
    src/components/dashboard/** ← Member 2
    src/app/scanner/**          ← Member 4
    src/app/simulator/**        ← Member 4
    src/app/api/**              ← Member 4
    src/lib/fallbacks/**        ← Member 4 & 5

KEY FACTS:
  approval_token = 'demo-csc-892a'   (use this for demo URL: /approve/demo-csc-892a)
  audit hashes   = '#CSC-001A' (SOW Clarified), '#CSC-892A' (Scope Swap Approved)
  Portal layout  = NO sidebar, centered 720px column
  Ledger layout  = WITH <AppSidebar /> from src/components/shared/
  PDF library    = jspdf (already in package.json — do not reinstall)

BRANCH: feat/portal-ledger
BEFORE FINISHING: npx tsc --noEmit → must exit 0
NEVER: git add, git commit, git push
```
