/**
 * CSC Guardrail — Deterministic Scope Swap Math Engine
 *
 * Pure, side-effect-free functions that calculate the financial and hour
 * impact of scope changes. All arithmetic is performed in integer hours
 * and integer paise (1 INR = 100 paise) to avoid floating-point drift,
 * then returned as rupee numbers rounded to 2 decimal places.
 *
 * @module lib/engine/swap-math
 */

import type { ScopeItem, RequestedItem } from "@/types/csc";
import { HOURLY_RATE_INR } from "@/types/csc";

// ─────────────────────────────────────────────
// Input / Output Types
// ─────────────────────────────────────────────

/** Describes a single deliverable being added as drift. */
export interface DriftItem {
  title: string;
  hours: number;    // Must be a non-negative integer
  cost_inr?: number; // Optional override; calculated from hours if omitted
}

/** Describes a deliverable being swapped out (deferred to Phase 2). */
export interface SwapOutItem {
  scope_item_id: string;
  title: string;
  hours: number;    // Hours reclaimed (freed) by the deferral
}

/** Full input payload for `calculateScopeSwap`. */
export interface ScopeSwapInput {
  /** Items the client is requesting to ADD (drift). */
  added_items: DriftItem[];
  /** Items being REMOVED from active scope (swapped out / deferred). */
  removed_items: SwapOutItem[];
  /** Swappable pool: all scope items with is_swappable = true. */
  swappable_pool: ScopeItem[];
  /** Project budget ceiling in INR. */
  budget_cap_inr: number;
  /** Project total contracted hours. */
  total_contracted_hours: number;
  /** Current hours already consumed/completed. */
  hours_consumed: number;
  /** Hourly billing rate (defaults to HOURLY_RATE_INR = ₹1,250). */
  hourly_rate_inr?: number;
}

/** Detailed result returned by `calculateScopeSwap`. */
export interface ScopeSwapResult {
  // ── Drift (what's being added) ──────────────
  /** Total new hours requested by the client. */
  drift_hours: number;
  /** Total ₹ cost of the drift at the hourly rate. */
  drift_cost_inr: number;

  // ── Reclaimed (what's being swapped out) ────
  /** Total hours freed by deferring removed items. */
  reclaimed_hours: number;
  /** ₹ value of the reclaimed hours. */
  reclaimed_cost_inr: number;

  // ── Net impact ───────────────────────────────
  /** drift_hours − reclaimed_hours.  Negative = net hours saved. */
  net_delta_hours: number;
  /** drift_cost_inr − reclaimed_cost_inr.  Negative = net saving. */
  net_delta_cost_inr: number;

  // ── Budget health ────────────────────────────
  /** Remaining hours before the swap: total_contracted − hours_consumed. */
  hours_remaining_before: number;
  /** Remaining hours after the swap. */
  hours_remaining_after: number;
  /** Is the project over its contracted hour budget after the swap? */
  is_over_hour_budget: boolean;
  /** Projected total spend (hours_consumed + drift) × hourly_rate. */
  projected_spend_inr: number;
  /** Is the projected spend over the fixed budget cap? */
  is_over_budget_cap: boolean;
  /** ₹ headroom remaining after the swap (negative = breach amount). */
  budget_headroom_inr: number;

  // ── Swap viability ───────────────────────────
  /** Items from the swappable pool that can cover the drift. */
  viable_swap_candidates: ScopeItem[];
  /**
   * Whether the drift can be fully absorbed within the existing hour
   * budget by swapping out the removed_items (net_delta_hours ≤ 0).
   */
  is_net_zero_swap: boolean;
  /** Human-readable one-liner for the audit ledger summary field. */
  audit_summary: string;
}

// ─────────────────────────────────────────────
// Core Pure Functions
// ─────────────────────────────────────────────

/**
 * Convert hours to INR at the given rate.
 * Uses integer arithmetic (round to nearest rupee) to avoid FP drift.
 */
export function hoursToInr(hours: number, rateInr: number = HOURLY_RATE_INR): number {
  return Math.round(hours * rateInr * 100) / 100;
}

/**
 * Calculate the total drift hours from a list of added items.
 * Each item's hours must be a non-negative integer; negatives are clamped to 0.
 */
export function sumDriftHours(items: DriftItem[]): number {
  return items.reduce((acc, item) => acc + Math.max(0, item.hours), 0);
}

/**
 * Calculate the total reclaimed hours from a list of removed (swapped-out) items.
 */
export function sumReclaimedHours(items: SwapOutItem[]): number {
  return items.reduce((acc, item) => acc + Math.max(0, item.hours), 0);
}

/**
 * Find scope items from the swappable pool that can collectively cover
 * the net drift hours. Returns the minimum viable set ordered by hours
 * descending (greedy cover), plus any additional swappable items.
 *
 * Returns the full swappable pool sorted by hours descending so the UI
 * can show all candidates, not just the minimum set.
 */
export function findViableSwapCandidates(
  swappablePool: ScopeItem[],
  netDriftHours: number
): ScopeItem[] {
  if (netDriftHours <= 0) return [];
  // Sort by hours descending for greedy selection
  return [...swappablePool]
    .filter((item) => item.status === "not_started" || item.status === "in_progress")
    .sort((a, b) => b.hours - a.hours);
}

/**
 * Generate a deterministic audit summary string.
 */
function buildAuditSummary(input: ScopeSwapInput, result: ScopeSwapResult): string {
  const addedTitles = input.added_items.map((i) => i.title).join(", ");
  const removedTitles = input.removed_items.map((i) => i.title).join(", ");

  if (result.is_net_zero_swap && input.removed_items.length > 0) {
    return `Scope swap: added [${addedTitles}] (+${result.drift_hours} hrs); deferred [${removedTitles}] (−${result.reclaimed_hours} hrs). Net Δ: ${result.net_delta_hours} hrs / ₹${result.net_delta_cost_inr.toLocaleString("en-IN")}.`;
  }
  if (input.added_items.length > 0 && input.removed_items.length === 0) {
    return `Paid add-on: [${addedTitles}] +${result.drift_hours} hrs (₹${result.drift_cost_inr.toLocaleString("en-IN")}).`;
  }
  if (input.added_items.length === 0 && input.removed_items.length > 0) {
    return `Deferred to Phase 2: [${removedTitles}] −${result.reclaimed_hours} hrs (₹${result.reclaimed_cost_inr.toLocaleString("en-IN")} saved).`;
  }
  return `Change request: Δ${result.net_delta_hours} hrs / ₹${result.net_delta_cost_inr.toLocaleString("en-IN")}.`;
}

// ─────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────

/**
 * `calculateScopeSwap` — the single deterministic function for all CSC math.
 *
 * Given a set of items being added (drift) and removed (swapped out), it
 * calculates the full financial and hour impact, determines whether the
 * project stays within cap, and returns viable swap candidates.
 *
 * All inputs must be validated by the caller (use Zod at the API layer).
 * This function never throws — it returns a complete, deterministic result.
 *
 * @example
 * // VastraKart: client asks for WhatsApp 2FA (6 hrs) + CSV Export (8 hrs)
 * // Agency defers "Mobile-Responsive Storefront" (14 hrs) to Phase 2
 * const result = calculateScopeSwap({
 *   added_items: [
 *     { title: "WhatsApp / SMS 2FA OTP", hours: 6 },
 *     { title: "Excel & CSV Order Export", hours: 8 },
 *   ],
 *   removed_items: [
 *     { scope_item_id: "...", title: "Mobile-Responsive Storefront", hours: 14 },
 *   ],
 *   swappable_pool: [...swappableItems],
 *   budget_cap_inr: 150000,
 *   total_contracted_hours: 120,
 *   hours_consumed: 60,
 * });
 * // result.net_delta_hours    === 0    (14 drift − 14 reclaimed)
 * // result.is_net_zero_swap   === true
 * // result.is_over_budget_cap === false
 */
export function calculateScopeSwap(input: ScopeSwapInput): ScopeSwapResult {
  const rate = input.hourly_rate_inr ?? HOURLY_RATE_INR;

  // ── 1. Drift totals ───────────────────────────
  const drift_hours = sumDriftHours(input.added_items);
  const drift_cost_inr = hoursToInr(drift_hours, rate);

  // ── 2. Reclaimed totals ───────────────────────
  const reclaimed_hours = sumReclaimedHours(input.removed_items);
  const reclaimed_cost_inr = hoursToInr(reclaimed_hours, rate);

  // ── 3. Net delta ──────────────────────────────
  const net_delta_hours = drift_hours - reclaimed_hours;
  const net_delta_cost_inr = Math.round((drift_cost_inr - reclaimed_cost_inr) * 100) / 100;

  // ── 4. Budget health ──────────────────────────
  const hours_remaining_before = input.total_contracted_hours - input.hours_consumed;
  const hours_remaining_after = hours_remaining_before - net_delta_hours;
  const is_over_hour_budget = hours_remaining_after < 0;

  // Projected spend: (consumed + drift) × rate
  const total_hours_after_swap = input.hours_consumed + drift_hours - reclaimed_hours;
  const projected_spend_inr = Math.round(hoursToInr(total_hours_after_swap, rate) * 100) / 100;
  const is_over_budget_cap = projected_spend_inr > input.budget_cap_inr;
  const budget_headroom_inr = Math.round((input.budget_cap_inr - projected_spend_inr) * 100) / 100;

  // ── 5. Swap viability ─────────────────────────
  const viable_swap_candidates = findViableSwapCandidates(
    input.swappable_pool,
    net_delta_hours
  );
  const is_net_zero_swap = net_delta_hours <= 0;

  // ── 6. Build result ───────────────────────────
  const partial: ScopeSwapResult = {
    drift_hours,
    drift_cost_inr,
    reclaimed_hours,
    reclaimed_cost_inr,
    net_delta_hours,
    net_delta_cost_inr,
    hours_remaining_before,
    hours_remaining_after,
    is_over_hour_budget,
    projected_spend_inr,
    is_over_budget_cap,
    budget_headroom_inr,
    viable_swap_candidates,
    is_net_zero_swap,
    audit_summary: "", // placeholder, filled below
  };

  partial.audit_summary = buildAuditSummary(input, partial);

  return partial;
}
