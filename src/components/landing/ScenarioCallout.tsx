"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";

export function ScenarioCallout() {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  const handleDemoBypass = () => {
    if (typeof document !== "undefined") {
      document.cookie =
        "csc-demo-bypass=true; path=/; max-age=86400; SameSite=Lax";
    }
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Golden Demo Contract Benchmark
                </span>
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                The VastraKart ₹1,50,000 Scope Swap Story
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Experience the live evaluation scenario built directly into CSC Guardrail: an agency building an e-commerce platform absorbs 14 hours of mid-sprint client drift without billing an extra rupee or absorbing margin loss.
              </p>

              {/* 3-Step Walkthrough Box */}
              <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900">
                      Step 1 &middot; Client Requests Unplanned Features
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      Client requests <strong>WhatsApp OTP (+6 hrs)</strong> and <strong>Excel Export (+8 hrs)</strong> via informal messaging &mdash; a total scope drift of <strong className="font-mono tabular-nums">+14 hrs (₹17,500)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                  <RefreshCw className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900">
                      Step 2 &middot; Swap Engine Finds Equivalent Baseline Item
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      Instead of arguing over extra invoices, the agency offers to swap: <strong>Blog &amp; Content CMS (−14 hrs)</strong> is deferred to Phase 2.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-950">
                      Step 3 &middot; Budget Neutrality &amp; Client Sign-off
                    </span>
                    <p className="text-emerald-800 mt-0.5">
                      Net impact: <strong className="font-mono tabular-nums">0 hrs / ₹0 delta</strong>. Fixed cap preserved at <strong className="font-mono tabular-nums">₹1,50,000</strong>. Logged under hash <strong className="font-mono">#CSC-892A</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  onClick={handleDemoBypass}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  <span>Explore in Scope Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => openPending("/approve")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileCheck2 className="h-4 w-4 text-slate-500" />
                  <span>View Client Sign-Off Portal Info</span>
                </button>
              </div>
            </div>

            {/* Right Financial Ledger Card Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Swap Health Gauge
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-500">
                    #CSC-892A
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Contract Ceiling</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      ₹1,50,000 (120 hrs)
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-amber-700">
                    <span>Inbound Scope Drift</span>
                    <span className="font-mono font-bold tabular-nums">
                      +14 hrs (₹17,500)
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-indigo-700">
                    <span>Deferred Deliverable (Blog CMS)</span>
                    <span className="font-mono font-bold tabular-nums">
                      −14 hrs (₹17,500)
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                    <span>Net Budget Delta</span>
                    <span className="font-mono text-sm tabular-nums text-emerald-900">
                      &Delta; 0 hrs / ₹0
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                  100% agency margin preserved &middot; Client relationship intact
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pending Route Integration Modal */}
      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
