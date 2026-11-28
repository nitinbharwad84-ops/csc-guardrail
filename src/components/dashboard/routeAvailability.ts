/**
 * Centralized Route Availability Registry (Member 2)
 *
 * Maps all 7 CSC Guardrail workflow screens to their Playbook v2 owners,
 * implementation status, and destination builders.
 *
 * When Member 1 integrates a teammate's branch into `main`, flip
 * `isImplemented` to `true` for that screen to enable live navigation
 * across the Sidebar, Dashboard, and Landing Page without editing UI components.
 */

export type ScreenKey =
  | "landing"
  | "login"
  | "scanner"
  | "dashboard"
  | "simulator"
  | "approve"
  | "ledger";

export interface RouteConfig {
  key: ScreenKey;
  screenNumber: string;
  routePattern: string;
  title: string;
  track: string;
  member: string;
  role: string;
  description: string;
  isImplemented: boolean;
  buildHref: (params?: { projectId?: string; approvalToken?: string }) => string;
}

export const ROUTE_REGISTRY: Record<ScreenKey, RouteConfig> = {
  landing: {
    key: "landing",
    screenNumber: "Screen 01",
    routePattern: "/",
    title: "Product Landing Page",
    track: "Track 2 — Landing, Auth & Dashboard",
    member: "Member 2",
    role: "Agency & Prospective Clients",
    description:
      "Public-facing portal explaining the Two-Layer Defense against fixed-fee agency scope creep.",
    isImplemented: true,
    buildHref: () => "/",
  },
  login: {
    key: "login",
    screenNumber: "Screen 02",
    routePattern: "/login",
    title: "Agency Workspace Login",
    track: "Track 2 — Landing, Auth & Dashboard",
    member: "Member 2",
    role: "Agency Account Leads",
    description:
      "Secure agency sign-in powered by Supabase Auth with Google OAuth, password recovery, and isolated demo access.",
    isImplemented: true,
    buildHref: () => "/login",
  },
  scanner: {
    key: "scanner",
    screenNumber: "Screen 03",
    routePattern: "/scanner",
    title: "SOW Ambiguity Scanner",
    track: "Track 4 — Layer 1 Pre-Kickoff Scanner",
    member: "Member 4 (SOW Scanner & Drift Simulator)",
    role: "Solution Architects & Delivery Leads",
    description:
      "Pre-kickoff AI scanner that detects vague, missing, or contradictory clauses in Statements of Work and locks clarifying specs before signature.",
    isImplemented: false,
    buildHref: (params) =>
      params?.projectId ? `/scanner?projectId=${encodeURIComponent(params.projectId)}` : "/scanner",
  },
  dashboard: {
    key: "dashboard",
    screenNumber: "Screen 04",
    routePattern: "/dashboard",
    title: "Scope Health Dashboard",
    track: "Track 2 — Landing, Auth & Dashboard",
    member: "Member 2",
    role: "Project Managers & Tech Leads",
    description:
      "Fixed-contract benchmark tracking the ₹1,50,000 cap, 120 hr budget, swappable deliverables pool, and active drift alerts.",
    isImplemented: true,
    buildHref: (params) =>
      params?.projectId ? `/dashboard?projectId=${encodeURIComponent(params.projectId)}` : "/dashboard",
  },
  simulator: {
    key: "simulator",
    screenNumber: "Screen 05",
    routePattern: "/simulator",
    title: "Drift & Swap Guardrail Simulator",
    track: "Track 4 — Layer 2 Swap Engine",
    member: "Member 4 (SOW Scanner & Drift Simulator)",
    role: "Account Directors & PMs",
    description:
      "Interactive scope swap engine matching incoming drift hours against swappable baseline deliverables for a ₹0 net contract impact.",
    isImplemented: false,
    buildHref: (params) =>
      params?.projectId ? `/simulator?projectId=${encodeURIComponent(params.projectId)}` : "/simulator",
  },
  approve: {
    key: "approve",
    screenNumber: "Screen 06",
    routePattern: "/approve/[token]",
    title: "Client Approval Portal",
    track: "Track 3 — Client Portal & Audit Ledger",
    member: "Member 3 (Client Portal, Ledger & PDF Export)",
    role: "Client Stakeholders (e.g. VastraKart)",
    description:
      "Dedicated single-column contract sheet presenting proposed scope trade-offs for 1-click verified client sign-off.",
    isImplemented: false,
    buildHref: (params) => `/approve/${encodeURIComponent(params?.approvalToken || "demo-csc-892a")}`,
  },
  ledger: {
    key: "ledger",
    screenNumber: "Screen 07",
    routePattern: "/ledger",
    title: "Immutable Audit Ledger",
    track: "Track 3 — Client Portal & Audit Ledger",
    member: "Member 3 (Client Portal, Ledger & PDF Export)",
    role: "Auditors & Executive Leadership",
    description:
      "Cryptographically hashed audit timeline documenting contract baselines, drift requests, and signed scope swaps with PDF handoff export.",
    isImplemented: false,
    buildHref: (params) =>
      params?.projectId ? `/ledger?projectId=${encodeURIComponent(params.projectId)}` : "/ledger",
  },
};

export function getRouteKeyFromPath(path: string): ScreenKey | null {
  if (path === "/") return "landing";
  if (path.startsWith("/login")) return "login";
  if (path.startsWith("/scanner")) return "scanner";
  if (path.startsWith("/dashboard")) return "dashboard";
  if (path.startsWith("/simulator")) return "simulator";
  if (path.startsWith("/approve")) return "approve";
  if (path.startsWith("/ledger")) return "ledger";
  return null;
}
