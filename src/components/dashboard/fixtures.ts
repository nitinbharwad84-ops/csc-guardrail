import type {
  Project,
  ScopeItem,
  ChangeRequest,
  AuditLedgerEntry,
} from "@/types/csc";
import {
  DEMO_BUDGET_CAP_INR,
  DEMO_TOTAL_HOURS,
  DEMO_APPROVAL_TOKEN,
} from "@/types/csc";

export const DEMO_PROJECT_ID = "c7a8b3d4-e5f6-4a1b-9c2d-3e4f5a6b7c8d";

export const VASTRAKART_PROJECT: Project = {
  id: DEMO_PROJECT_ID,
  agency_name: "PixelCraft Studio",
  client_name: "VastraKart Retail Pvt. Ltd.",
  title: "VastraKart E-commerce Platform — Phase 1",
  budget_cap_inr: DEMO_BUDGET_CAP_INR, // 150,000
  total_hours: DEMO_TOTAL_HOURS,       // 120
  status: "active",
  created_at: "2026-11-15T09:00:00.000Z",
};

export const VASTRAKART_SCOPE_ITEMS: ScopeItem[] = [
  {
    id: "item-001",
    project_id: DEMO_PROJECT_ID,
    title: "Auth & Email Login",
    hours: 16,
    status: "completed",
    is_swappable: false,
    created_at: "2026-11-15T09:00:00.000Z",
  },
  {
    id: "item-002",
    project_id: DEMO_PROJECT_ID,
    title: "Product Catalogue & Filters",
    hours: 20,
    status: "in_progress",
    is_swappable: false,
    created_at: "2026-11-15T09:00:00.000Z",
  },
  {
    id: "item-003",
    project_id: DEMO_PROJECT_ID,
    title: "Shopping Cart & Checkout",
    hours: 18,
    status: "in_progress",
    is_swappable: false,
    created_at: "2026-11-15T09:00:00.000Z",
  },
  {
    id: "item-004",
    project_id: DEMO_PROJECT_ID,
    title: "Admin Dashboard (Basic)",
    hours: 16,
    status: "not_started",
    is_swappable: false,
    created_at: "2026-11-15T09:00:00.000Z",
  },
  {
    id: "item-005",
    project_id: DEMO_PROJECT_ID,
    title: "Blog & Content CMS",
    hours: 14,
    status: "deferred_phase_2",
    is_swappable: true,
    created_at: "2026-11-15T09:00:00.000Z",
  },
  {
    id: "item-006",
    project_id: DEMO_PROJECT_ID,
    title: "Push Notification Banners",
    hours: 10,
    status: "not_started",
    is_swappable: true,
    created_at: "2026-11-15T09:00:00.000Z",
  },
  {
    id: "item-007",
    project_id: DEMO_PROJECT_ID,
    title: "Wishlist & Save for Later",
    hours: 12,
    status: "not_started",
    is_swappable: true,
    created_at: "2026-11-15T09:00:00.000Z",
  },
  {
    id: "item-008",
    project_id: DEMO_PROJECT_ID,
    title: "Order History & Tracking",
    hours: 14,
    status: "not_started",
    is_swappable: false,
    created_at: "2026-11-15T09:00:00.000Z",
  },
];

export const VASTRAKART_ACTIVE_CHANGE_REQUEST: ChangeRequest = {
  id: "cr-892a",
  project_id: DEMO_PROJECT_ID,
  raw_message:
    "We need WhatsApp OTP verification for checkout ASAP because customer SMS costs are too high, plus we need Excel / CSV export for all orders to reconcile accounts before Monday.",
  requested_items: [
    { title: "WhatsApp / SMS 2FA OTP", hours: 6, cost_inr: 7500 },
    { title: "Excel & CSV Order Export", hours: 8, cost_inr: 10000 },
  ],
  drift_hours: 14,
  drift_cost_inr: 17500, // 14 × 1250
  resolution_type: "scope_swap",
  swapped_out_item_id: "item-005", // Blog & Content CMS
  approval_token: DEMO_APPROVAL_TOKEN, // "demo-csc-892a"
  approval_status: "pending",
  created_at: "2026-11-20T14:30:00.000Z",
};

export const VASTRAKART_AUDIT_ENTRY: AuditLedgerEntry = {
  id: "audit-001",
  project_id: DEMO_PROJECT_ID,
  verification_hash: "#CSC-892A",
  event_type: "scope_swap",
  summary:
    "Scope swap: added WhatsApp 2FA (+6 hrs) + Excel Export (+8 hrs); deferred Blog & Content CMS (−14 hrs). Net Δ: 0 hrs / ₹0.",
  delta_hours: 0,
  delta_cost_inr: 0,
  actor: "PixelCraft Lead & VastraKart Sign-off",
  created_at: "2026-11-20T15:00:00.000Z",
};
