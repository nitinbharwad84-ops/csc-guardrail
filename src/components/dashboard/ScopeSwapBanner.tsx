import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Sliders, ExternalLink } from "lucide-react";
import { DEMO_APPROVAL_TOKEN } from "@/types/csc";

interface ScopeSwapBannerProps {
  hash?: string;
  driftHours?: number;
  driftCostInr?: number;
  swappedItemTitle?: string;
  swappedHours?: number;
  netDeltaHours?: number;
  netDeltaCostInr?: number;
}

export function ScopeSwapBanner({
  hash = "#CSC-892A",
  driftHours = 14,
  driftCostInr = 17500,
  swappedItemTitle = "Blog & Content CMS",
  swappedHours = 14,
  netDeltaHours = 0,
  netDeltaCostInr = 0,
}: ScopeSwapBannerProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Information Block */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-amber-950 text-sm">
                Active Scope Swap Notification
              </span>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/70">
                {hash}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                <span>Zero-Cost Neutralized</span>
              </span>
            </div>

            <div className="mt-2 text-xs text-amber-900 leading-relaxed space-y-1">
              <p>
                <strong>Client Scope Additions:</strong> WhatsApp 2FA (+6 hrs) + Excel Export (+8 hrs) ={" "}
                <span className="font-mono font-semibold tabular-nums text-amber-950">
                  +{driftHours} hrs (₹{driftCostInr.toLocaleString("en-IN")})
                </span>{" "}
                added.
              </p>
              <p>
                <strong>Deliverable Traded Off:</strong> {swappedItemTitle} (−{swappedHours} hrs) deferred to Phase 2.
              </p>
              <p className="font-semibold text-emerald-900 pt-0.5 flex items-center gap-1.5">
                <span>Net Scope Impact:</span>
                <span className="font-mono tabular-nums bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {netDeltaHours > 0 ? `+${netDeltaHours}` : `${netDeltaHours}`} hrs / ₹{netDeltaCostInr.toLocaleString("en-IN")}
                </span>
                <span className="text-emerald-700 font-normal">
                  &larr; Fixed contract cap (₹1,50,000) strictly preserved.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Links */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t border-amber-200/60 lg:border-t-0">
          <Link
            href="/simulator"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Open Simulator</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href={`/approve/${DEMO_APPROVAL_TOKEN}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/50 transition-colors"
          >
            <span>Client Portal</span>
            <ExternalLink className="h-3 w-3 text-amber-700" />
          </Link>

          <Link
            href="/ledger"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/50 transition-colors"
          >
            <span>Audit Ledger</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
