"use client";

import React from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Sliders,
  ExternalLink,
  FileSpreadsheet,
} from "lucide-react";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";

export type ScopeSwapStatus =
  | "proposed"
  | "pending_approval"
  | "approved"
  | "rejected";

interface ScopeSwapBannerProps {
  status?: ScopeSwapStatus;
  hash?: string;
  driftHours?: number;
  driftCostInr?: number;
  swappedItemTitle?: string;
  swappedHours?: number;
  netDeltaHours?: number;
  netDeltaCostInr?: number;
}

export function ScopeSwapBanner({
  status = "pending_approval",
  hash = "#CSC-892A",
  driftHours = 14,
  driftCostInr = 17500,
  swappedItemTitle = "Blog & Content CMS",
  swappedHours = 14,
  netDeltaHours = 0,
  netDeltaCostInr = 0,
}: ScopeSwapBannerProps) {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  const renderStatusBadge = () => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="h-3 w-3 text-emerald-700" />
            <span>Zero-Cost Neutralized &amp; Approved</span>
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800 border border-rose-300">
            <XCircle className="h-3 w-3 text-rose-700" />
            <span>Swap Rejected by Client</span>
          </span>
        );
      case "proposed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 border border-blue-300">
            <Clock className="h-3 w-3 text-blue-700" />
            <span>Swap Drafted (Internal)</span>
          </span>
        );
      case "pending_approval":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 border border-amber-300">
            <Clock className="h-3 w-3 text-amber-700" />
            <span>Awaiting Client Sign-off</span>
          </span>
        );
    }
  };

  return (
    <>
      <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Information Block */}
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-amber-950 text-sm">
                  Scope Swap Proposal
                </span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/70">
                  {hash}
                </span>
                {renderStatusBadge()}
              </div>

              <div className="mt-2 text-xs text-amber-900 leading-relaxed space-y-1">
                <p>
                  <strong>Requested Scope Additions:</strong> WhatsApp OTP (+6 hrs) + Excel Export (+8 hrs) ={" "}
                  <span className="font-mono font-semibold tabular-nums text-amber-950">
                    +{driftHours} hrs (₹{driftCostInr.toLocaleString("en-IN")} value)
                  </span>
                </p>
                <p>
                  <strong>Proposed Trade-off:</strong> {swappedItemTitle} (−{swappedHours} hrs) deferred to Phase 2.
                </p>
                <p className="pt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-semibold text-slate-800">Projected Net Impact:</span>
                  <span className="font-mono tabular-nums bg-white px-2 py-0.5 rounded-md border border-amber-300 text-slate-900 font-bold">
                    {netDeltaHours > 0 ? `+${netDeltaHours}` : `${netDeltaHours}`} hrs / ₹{netDeltaCostInr.toLocaleString("en-IN")}
                  </span>
                  <span className="text-amber-800 font-medium">
                    (Projected margin protection: ₹{driftCostInr.toLocaleString("en-IN")} upon client sign-off)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons (Accessible modal triggers to prevent 404s) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t border-amber-200/60 lg:border-t-0">
            <button
              type="button"
              onClick={() => openPending("/simulator")}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              title="Track 3 Simulator — In Development by Member 4"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Simulate Swap</span>
            </button>

            <button
              type="button"
              onClick={() => openPending("/approve")}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/60 transition-colors shadow-2xs"
              title="Track 4 Client Approval Portal — In Development by Member 4"
            >
              <span>Client Portal</span>
              <ExternalLink className="h-3 w-3 text-amber-700" />
            </button>

            <button
              type="button"
              onClick={() => openPending("/ledger")}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/60 transition-colors shadow-2xs"
              title="Track 5 Audit Ledger — In Development by Member 5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-amber-800" />
              <span>Audit Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Route Integration Modal */}
      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
