"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  X,
  GitBranch,
} from "lucide-react";

export interface PendingRouteInfo {
  route: string;
  title: string;
  track: string;
  member: string;
  role: string;
  description: string;
}

export const PENDING_ROUTES: Record<string, PendingRouteInfo> = {
  "/scanner": {
    route: "/scanner",
    title: "SOW Ambiguity Scanner",
    track: "Track 1 — Layer 1 Defense",
    member: "Member 3 (Ambiguity Scanner & Spec Engine)",
    role: "Solution Architects & Delivery Leads",
    description:
      "Pre-kickoff AI scanner that detects vague, missing, or contradictory clauses in Statements of Work and generates binding spec clarifications before signature.",
  },
  "/simulator": {
    route: "/simulator",
    title: "Drift & Swap Guardrail Simulator",
    track: "Track 3 — Layer 2 Defense",
    member: "Member 4 (Scope Swap & Simulation Engine)",
    role: "Project Managers & Account Leads",
    description:
      "Interactive scope swap calculation engine that absorbs incoming drift hours by deferring non-critical swappable deliverables to Phase 2 for a net-zero contract impact.",
  },
  "/approve": {
    route: "/approve/[token]",
    title: "Client Approval Portal",
    track: "Track 4 — Client Portal",
    member: "Member 4 (Approval Interface)",
    role: "Client Stakeholders (e.g. VastraKart)",
    description:
      "A dedicated, distraction-free approval sheet presenting proposed scope trade-offs for 1-click verified client sign-off without agency sidebar clutter.",
  },
  "/ledger": {
    route: "/ledger",
    title: "Immutable Audit Ledger",
    track: "Track 5 — Audit & Verification",
    member: "Member 5 (Cryptographic Log & PDF Export)",
    role: "Auditors & Executive Leadership",
    description:
      "Cryptographically hashed audit timeline documenting all contract baselines, drift requests, and signed scope swap events with client-ready PDF handoff exports.",
  },
};

interface PendingIntegrationModalProps {
  routeInfo: PendingRouteInfo | null;
  onClose: () => void;
}

export function PendingIntegrationModal({
  routeInfo,
  onClose,
}: PendingIntegrationModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (routeInfo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [routeInfo, onClose]);

  if (!routeInfo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pending-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Pending Team Integration
              </span>
              <h3
                id="pending-modal-title"
                className="text-base font-bold text-slate-900 mt-1"
              >
                {routeInfo.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs text-slate-600">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">Target Route:</span>
              <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                {routeInfo.route}
              </code>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">Track &amp; Ownership:</span>
              <span className="text-slate-800 font-medium">{routeInfo.track}</span>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">Assigned Engineer:</span>
              <span className="font-semibold text-indigo-700">{routeInfo.member}</span>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">User Role:</span>
              <span className="text-slate-800">{routeInfo.role}</span>
            </div>
          </div>

          <p className="leading-relaxed text-slate-700">
            {routeInfo.description}
          </p>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 text-indigo-900 flex items-start gap-2.5">
            <GitBranch className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Integration Status:</span>
              <p className="text-indigo-800 leading-normal text-[11px]">
                Under development by the assigned team member. Once merged into
                the <code className="font-mono font-semibold">main</code> branch by Lead Integrator Nitin, this screen will activate automatically without 404 errors.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper hook to manage pending route modal state
 */
export function usePendingIntegration() {
  const [activeRoute, setActiveRoute] = useState<PendingRouteInfo | null>(null);

  const openPending = (path: string) => {
    // Match root path
    if (path.startsWith("/scanner")) setActiveRoute(PENDING_ROUTES["/scanner"]);
    else if (path.startsWith("/simulator")) setActiveRoute(PENDING_ROUTES["/simulator"]);
    else if (path.startsWith("/approve")) setActiveRoute(PENDING_ROUTES["/approve"]);
    else if (path.startsWith("/ledger")) setActiveRoute(PENDING_ROUTES["/ledger"]);
  };

  const closePending = () => setActiveRoute(null);

  return { activeRoute, openPending, closePending };
}
