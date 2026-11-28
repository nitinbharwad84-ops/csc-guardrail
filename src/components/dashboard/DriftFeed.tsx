"use client";

import React from "react";
import {
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Clock,
  Sliders,
} from "lucide-react";
import type { ChangeRequest } from "@/types/csc";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";

interface DriftFeedProps {
  changeRequests?: ChangeRequest[];
}

export function DriftFeed({ changeRequests = [] }: DriftFeedProps) {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Scope Drift &amp; Change Request Feed
            </h3>
          </div>
          <button
            type="button"
            onClick={() => openPending("/simulator")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            title="Simulate scope swaps in Track 3 engine"
          >
            <span>Simulator</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {changeRequests.length > 0 ? (
            changeRequests.map((cr) => (
              <div
                key={cr.id}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      #CSC-892A
                    </span>
                    <span className="rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-900 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5 text-amber-700" />
                      <span>Swap Proposed</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Nov 24, 2026 &middot; Sprint 2
                  </span>
                </div>

                <div className="mt-2.5 space-y-1.5">
                  <div className="text-xs text-slate-700 bg-white p-2.5 rounded-md border border-slate-200">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Client Communication Note:
                    </span>
                    <p className="italic text-slate-800 leading-relaxed">
                      &ldquo;{cr.raw_message}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-900 font-bold font-mono tabular-nums bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      +{cr.drift_hours} hrs drift
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-700 font-mono font-medium tabular-nums">
                      ₹{cr.drift_cost_inr.toLocaleString("en-IN")} value
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openPending("/simulator")}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-md hover:bg-slate-50 shadow-2xs"
                      title="Open in Simulator"
                    >
                      <Sliders className="h-3 w-3 text-indigo-600" />
                      <span>Simulate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openPending("/approve")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-colors shadow-2xs"
                      title="View Client Sign-off Sheet"
                    >
                      <span>Sign-off</span>
                      <ExternalLink className="h-3 w-3 text-emerald-700" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              No active scope drift items pending.
            </div>
          )}
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
