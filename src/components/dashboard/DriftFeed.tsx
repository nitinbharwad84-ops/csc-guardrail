"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import type { ChangeRequest } from "@/types/csc";
import { DEMO_APPROVAL_TOKEN } from "@/types/csc";

interface DriftFeedProps {
  changeRequests?: ChangeRequest[];
}

export function DriftFeed({ changeRequests = [] }: DriftFeedProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-amber-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Scope Drift &amp; Change Request Feed
          </h3>
        </div>
        <Link
          href="/simulator"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <span>Open Simulator</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
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
                  <span className="rounded-full bg-amber-100 border border-amber-200 px-2 py-0.2 text-[10px] font-semibold text-amber-800">
                    Scope Swap Proposed
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {new Date(cr.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-700 italic bg-white p-2.5 rounded-md border border-slate-200">
                &ldquo;{cr.raw_message}&rdquo;
              </p>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-amber-700 font-semibold font-mono tabular-nums">
                    +{cr.drift_hours} hrs requested
                  </span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-600 font-mono tabular-nums">
                    ₹{cr.drift_cost_inr.toLocaleString("en-IN")} value
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/approve/${cr.approval_token || DEMO_APPROVAL_TOKEN}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md hover:bg-emerald-100"
                  >
                    <span>Client Sign-off</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
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
  );
}
