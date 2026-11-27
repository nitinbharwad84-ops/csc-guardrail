/**
 * CSC Guardrail — Core TypeScript Interfaces
 *
 * Canonical domain types for the Client Scope & Change Guardrail system.
 * All interfaces match the Supabase schema (schema.sql) and the VastraKart
 * demo dataset (₹1,50,000 fixed cap, 120 hrs total budget).
 *
 * @module types/csc
 */

// ─────────────────────────────────────────────
// 1. Project (Fixed Contract Baseline)
// ─────────────────────────────────────────────

/** Status lifecycle of a contract project. */
export type ProjectStatus = "scanning" | "active" | "completed";

/**
 * Top-level contract between agency (PixelCraft Studio) and client.
 *
 * VastraKart demo values:
 *   budget_cap_inr = 150000  (₹1,50,000)
 *   total_hours    = 120     (120 hrs)
 */
export interface Project {
  id: string;
  agency_name: string;      // e.g. "PixelCraft Studio"
  client_name: string;      // e.g. "VastraKart"
  title: string;            // e.g. "VastraKart E-commerce Platform — Phase 1"
  budget_cap_inr: number;   // Fixed rupee cap: 150000
  total_hours: number;      // Total contracted hours: 120
  status: ProjectStatus;
  created_at: string;       // ISO-8601 timestamp
}

// ─────────────────────────────────────────────
// 2. ScopeItem (SOW Deliverable)
// ─────────────────────────────────────────────

/** Lifecycle status of a single SOW deliverable. */
export type ScopeItemStatus =
  | "completed"
  | "in_progress"
  | "not_started"
  | "deferred_phase_2";

/**
 * A single deliverable from the signed Statement of Work.
 *
 * Items with `is_swappable = true` can absorb incoming drift hours
 * by being deferred to Phase 2 — keeping the project within budget.
 */
export interface ScopeItem {
  id: string;
  project_id: string;
  title: string;            // e.g. "Mobile-Responsive Storefront"
  hours: number;            // Contracted hours for this item
  status: ScopeItemStatus;
  is_swappable: boolean;    // Can be deferred to absorb drift
  created_at: string;
}

// ─────────────────────────────────────────────
// 3. SowAmbiguity (Layer 1 — Pre-Kickoff Scanner)
// ─────────────────────────────────────────────

/** Resolution status of a pre-kickoff SOW ambiguity. */
export type SowAmbiguityStatus = "open" | "clarified";

/**
 * A vague or incomplete clause detected by the SOW Ambiguity Scanner
 * before the project kicks off (Layer 1 Defence).
 */
export interface SowAmbiguity {
  id: string;
  project_id: string;
  clause_title: string;             // e.g. "User Login & Account"
  vague_excerpt: string;            // e.g. "Standard login system for customers"
  missing_details: string;          // e.g. "Auth method unspecified (Email vs Google OAuth vs WhatsApp 2FA)"
  clarification_question: string;   // e.g. "Should Phase 1 include Email/Password only, or social OAuth?"
  resolved_spec: string | null;     // Filled once agency/client locks the spec
  status: SowAmbiguityStatus;
  created_at: string;
}

// ─────────────────────────────────────────────
// 4. ParsedMessageResult (AI Parse-Scope Output)
// ─────────────────────────────────────────────

/** A single item classified by the mid-sprint drift detector. */
export interface ParsedScopeLineItem {
  title: string;              // Human-readable deliverable name
  hours: number;              // Estimated hours (0 for in-scope matches)
  cost_inr: number;           // ₹ cost at ₹1,250/hr (0 for in-scope)
  matched_sow_item?: string;  // Present only for in_scope items
}

/**
 * Output from `POST /api/parse-scope`.
 *
 * Classifies a client's mid-sprint message into in-scope (already in SOW)
 * vs out-of-scope (new drift items) and calculates total drift cost.
 *
 * Example (VastraKart — WhatsApp 2FA message):
 *   total_drift_hours    = 14
 *   total_drift_cost_inr = 17500  (14 hrs × ₹1,250)
 */
export interface ParsedMessageResult {
  in_scope: ParsedScopeLineItem[];
  out_of_scope: ParsedScopeLineItem[];
  total_drift_hours: number;
  total_drift_cost_inr: number;
}

// ─────────────────────────────────────────────
// 5. ChangeRequest (Layer 2 — Guardrail Resolution)
// ─────────────────────────────────────────────

/** How the agency resolved the incoming scope drift. */
export type ResolutionType = "scope_swap" | "paid_addon" | "defer_phase_2";

/** Approval lifecycle for a client-facing change request. */
export type ApprovalStatus = "pending" | "approved" | "rejected";

/** An individual item requested in the change. */
export interface RequestedItem {
  title: string;
  hours: number;
  cost_inr: number;
}

/**
 * A scope change request raised when a client asks for out-of-scope work
 * (Layer 2 Guardrail).
 *
 * The agency resolves it via one of three strategies:
 *  - `scope_swap`     — defer a swappable SOW item, absorb drift at ₹0 cost
 *  - `paid_addon`     — bill the drift at ₹1,250/hr
 *  - `defer_phase_2`  — push to next phase, no cost now
 *
 * Client approves/rejects via the public portal at `/approve/[approval_token]`.
 */
export interface ChangeRequest {
  id: string;
  project_id: string;
  raw_message: string;                  // Client's original message verbatim
  requested_items: RequestedItem[];     // Parsed line-items from client message
  drift_hours: number;                  // Total new hours requested
  drift_cost_inr: number;               // Total ₹ impact at ₹1,250/hr
  resolution_type: ResolutionType;
  swapped_out_item_id: string | null;   // Set when resolution_type = 'scope_swap'
  approval_token: string;               // e.g. "demo-csc-892a" (URL-safe)
  approval_status: ApprovalStatus;
  created_at: string;
}

// ─────────────────────────────────────────────
// 6. AuditLedgerEntry (Immutable Event Log)
// ─────────────────────────────────────────────

/** Category of event recorded in the immutable audit ledger. */
export type AuditEventType =
  | "sow_clarified"
  | "scope_swap"
  | "paid_addon"
  | "deferred";

/**
 * A single immutable entry in the Audit Ledger.
 *
 * Every SOW clarification, swap, paid add-on, or deferral is appended here.
 * The `verification_hash` (e.g. `#CSC-892A`) is displayed in tabular-nums
 * monospace so columns align vertically in the Ledger view.
 *
 * `delta_hours` and `delta_cost_inr` are signed:
 *   - positive = budget consumed / hours added
 *   - negative = hours reclaimed (e.g. via a swap-out)
 */
export interface AuditLedgerEntry {
  id: string;
  project_id: string;
  verification_hash: string;    // e.g. "#CSC-892A"
  event_type: AuditEventType;
  summary: string;              // Human-readable one-liner for the ledger row
  delta_hours: number;          // Signed hour delta
  delta_cost_inr: number;       // Signed ₹ delta
  actor: string;                // e.g. "Agency Lead" | "Client Approved"
  created_at: string;
}

// ─────────────────────────────────────────────
// 7. VastraKart Demo Seed Constants
// ─────────────────────────────────────────────

/** Fixed hourly rate used throughout the system. */
export const HOURLY_RATE_INR = 1_250;

/** VastraKart demo project fixed budget cap (₹1,50,000). */
export const DEMO_BUDGET_CAP_INR = 1_50_000;

/** VastraKart demo project total contracted hours (120 hrs). */
export const DEMO_TOTAL_HOURS = 120;

/** Demo approval token used in `/approve/[token]` Portal. */
export const DEMO_APPROVAL_TOKEN = "demo-csc-892a";
