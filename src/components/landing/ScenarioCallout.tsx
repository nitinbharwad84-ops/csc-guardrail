"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Sparkles,
} from "lucide-react";

export function ScenarioCallout() {
  const handleDemoBypass = () => {
    if (typeof document !== "undefined") {
      document.cookie = "csc-demo-bypass=true; path=/; max-age=86400; SameSite=Lax";
    }
  };

  return (
    <section id="scenario" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50/50 via-white to-slate-50/80 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-800">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The Golden Demo Scenario</span>
              </div>

              <h2 className="mt-4 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
                PixelCraft Studio &times; VastraKart Retail
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                During Sprint 2, the client requested urgent mid-flight scope changes via chat:
                WhatsApp / SMS 2FA for checkout security and Excel order exports for accounts.
                Under standard agency contracts, this creates awkward billing confrontation or unpaid creep.
              </p>

              {/* Step progression */}
              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-amber-950">
                      Step 1 · Client Drift Detected (+14 hrs / ₹17,500)
                    </span>
                    <p className="text-amber-800 mt-0.5">
                      WhatsApp OTP (6 hrs) + Excel Export (8 hrs) added as out-of-scope items.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5">
                  <RefreshCw className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-indigo-950">
                      Step 2 · Mathematical Zero-Cost Scope Swap (−14 hrs)
                    </span>
                    <p className="text-indigo-800 mt-0.5">
                      Swappable baseline deliverable <em>&ldquo;Blog &amp; Content CMS&rdquo;</em> (14 hrs) deferred to Phase 2.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-950">
                      Step 3 · Budget Neutrality &amp; Client Sign-off
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
                  <span>Explore in Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/approve/demo-csc-892a"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileCheck2 className="h-4 w-4 text-slate-500" />
                  <span>View Client Sign-Off Portal</span>
                </Link>
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
                  <span className="text-xs font-mono font-semibold text-indigo-600">
                    #CSC-892A
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Contract Ceiling:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      ₹1,50,000
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Total Hours:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      120 hrs
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-600 font-medium">Added Scope Drift:</span>
                    <span className="font-mono font-bold text-amber-700 tabular-nums">
                      +14 hrs (₹17,500)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-indigo-600 font-medium">Swapped Deliverable:</span>
                    <span className="font-mono font-bold text-indigo-700 tabular-nums">
                      −14 hrs (₹17,500)
                    </span>
                  </div>
                </div>

                {/* Balance Meter */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
                    <span className="text-slate-700">Net Budget Impact</span>
                    <span className="text-emerald-600 font-mono tabular-nums">₹0 / 0 hrs</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-full rounded-full" />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 text-center font-medium">
                    100% On-Budget · 0% Margin Erosion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
