import React from "react";
import Link from "next/link";
import { Search, Sliders, ArrowRight, Check, AlertCircle, RefreshCw } from "lucide-react";

export function TwoLayerDefense() {
  return (
    <section id="defense" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-3 py-1 rounded-full">
            The Two-Layer Architecture
          </span>
          <h2 className="mt-4 font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Why One-Off Approvals Fail: Continuous Scope Defense
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Most agency scope creep happens either because the initial Statement of Work was too vague,
            or because client changes were accepted verbally mid-sprint. CSC Guardrail closes both loopholes.
          </p>
        </div>

        {/* 2-Layer Comparison Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Layer 1 Card */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 hover:border-slate-300 transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                  <Search className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                    Layer 1 — Pre-Kickoff
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Day-0 SOW Ambiguity Scanner
                  </h3>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                Screen 3 · /scanner
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-600 leading-relaxed">
              Scans raw SOW contracts before signing to flag vaguely worded deliverables where client expectations
              and agency engineering estimates inevitably diverge.
            </p>

            {/* Spec example pill box */}
            <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-amber-900">
                    Flagged Clause: &ldquo;Standard user login &amp; account profile&rdquo;
                  </p>
                  <p className="text-amber-800">
                    <strong>Missing Spec:</strong> Authentication method is unspecified. Is it Email/Password only, Google OAuth, or WhatsApp 2FA?
                  </p>
                  <p className="text-emerald-800 font-medium">
                    ✓ Resolved: Email/Password locked for Phase 1. OTP/OAuth explicitly documented as out-of-scope add-on.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Checklist */}
            <ul className="mt-6 space-y-3 text-sm text-slate-700 flex-1">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Deterministic offline fallback JSON ensures 100% demo uptime without API keys</span>
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
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
              >
                <span>Launch SOW Ambiguity Scanner</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
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
              <span className="hidden sm:inline-flex text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                Screen 5 · /simulator
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
                    Net Result: Δ 0 hrs / ₹0 extra bill · 100% Agency Margin Protected
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
              <Link
                href="/simulator"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <span>Launch Drift &amp; Swap Simulator</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
