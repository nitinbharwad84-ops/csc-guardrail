"use client";

import React from "react";
import {
  FileCode2,
  Sliders,
  Check,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
} from "lucide-react";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";

export function TwoLayerDefense() {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  return (
    <>
      <section id="defense" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full shadow-2xs">
              Continuous Scope Protection
            </span>
            <h2 className="mt-4 font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              The Two-Layer Scope Defense Architecture
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Most agency scope creep happens either before day one (vague SOW clauses) or during sprint execution
              (casual chat app requests). CSC Guardrail stops both.
            </p>
          </div>

          {/* Two-Column Comparison Cards */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Layer 1 Card */}
            <div className="flex flex-col rounded-2xl border border-amber-200 bg-white p-6 sm:p-8 shadow-xs hover:border-amber-300 transition-shadow">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                    <FileCode2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                      Layer 1 — Pre-Kickoff
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      Day-0 SOW Ambiguity Scanner
                    </h3>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  <Clock className="h-3 w-3 text-amber-600" />
                  <span>Member 3 &middot; Track 1</span>
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-600 leading-relaxed">
                Before contracts are signed, the SOW Scanner inspects deliverable language for hidden scope expansion risks:
                unspecified auth flows, vague integrations, and ambiguous design iteration promises.
              </p>

              {/* VastraKart Example Ambiguity Callout */}
              <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1 text-amber-900">
                    <p className="font-semibold text-amber-950">
                      SOW Clause: &ldquo;Standard login system for customers&rdquo;
                    </p>
                    <p>
                      <strong>Flagged Ambiguity:</strong> Auth method unspecified (Email vs Google OAuth vs WhatsApp OTP).
                    </p>
                    <p className="text-amber-800 italic">
                      Clarification generated: &ldquo;Phase 1 includes Email/Password + Google OAuth. WhatsApp OTP deferred to Phase 2.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="mt-6 space-y-3 text-sm text-slate-700 flex-1">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Deterministic offline fallback ensures 100% demo uptime without API keys</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Clarification questions auto-generated to pin down exact deliverable parameters</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Locks baseline deliverable hours into the immutable contract table</span>
                </li>
              </ul>

              <div className="mt-8 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => openPending("/scanner")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  <span>View SOW Ambiguity Scanner Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Layer 2 Card */}
            <div className="flex flex-col rounded-2xl border border-indigo-200 bg-white p-6 sm:p-8 shadow-xs hover:border-indigo-300 transition-shadow">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                    <Sliders className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md">
                      Layer 2 — Mid-Sprint
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      Mid-Sprint Drift &amp; Swap Guardrail
                    </h3>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                  <Clock className="h-3 w-3 text-indigo-600" />
                  <span>Member 4 &middot; Track 3</span>
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-600 leading-relaxed">
                When clients message unplanned requests mid-sprint, the Swap Engine parses drift items and matches
                them against swappable baseline deliverables to maintain exact budget neutrality.
              </p>

              {/* Swap Math example pill box */}
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="flex items-start gap-2.5">
                  <RefreshCw className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-emerald-950">
                      Active Swap Equation: WhatsApp (+6h) + Excel (+8h) = +14 hrs
                    </p>
                    <p className="text-emerald-800">
                      <strong>Swapped Out:</strong> Blog &amp; Content CMS (−14 hrs) deferred to Phase 2.
                    </p>
                    <p className="text-emerald-900 font-bold font-mono tabular-nums">
                      Net Result: &Delta; 0 hrs / ₹0 extra bill &middot; 100% Agency Margin Protected
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="mt-6 space-y-3 text-sm text-slate-700 flex-1">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Integer-safe arithmetic in paise &amp; hours prevents rounding inaccuracies</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>One-click client sign-off link generated with cryptographic hash</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Every change logged to the immutable audit ledger with PDF export</span>
                </li>
              </ul>

              <div className="mt-8 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => openPending("/simulator")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <span>View Drift &amp; Swap Simulator Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
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
