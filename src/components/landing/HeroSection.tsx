"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, TrendingUp, Clock, Scale } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-linear-to-b from-white via-slate-50/50 to-slate-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(#4F46E5 1px, transparent 1px), radial-gradient(#0F172A 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs mb-6 backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>Two-Layer Scope Defense for Fixed-Price Agency Projects</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.12]">
            Stop Scope Creep <br className="hidden sm:inline" />
            <span className="text-indigo-600">Before &amp; During</span> the Sprint.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            CSC Guardrail protects your agency’s fixed contracts with a continuous Two-Layer Defense:
            catch ambiguous contract deliverables at <strong>Day-0</strong>, and resolve mid-sprint
            client requests using mathematical <strong>zero-cost scope swaps</strong>.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/login/demo"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              <span>Try Live Demo</span>
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <span>Agency Login</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>No credit card or API keys required for demo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Deterministic integer-safe swap math engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Immutable cryptographic audit hashes</span>
            </div>
          </div>
        </div>

        {/* Live Contract Metrics Bar */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Benchmark Contract
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                PixelCraft Studio × VastraKart
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Audit Token: <code className="font-mono text-slate-700 font-semibold">#CSC-892A</code>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Scale className="h-3.5 w-3.5 text-slate-400" /> Contract Fixed Cap
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                ₹1,50,000
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">Strict ceiling (0% breach)</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Contracted Hours
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                120 hrs
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">Fixed rate ₹1,250 / hr</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-amber-600" /> Drift Absorbed
              </span>
              <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums mt-1">
                +14 hrs
              </span>
              <span className="text-[11px] text-amber-700/80 mt-0.5">WhatsApp + Excel export</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Net Financial Delta
              </span>
              <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
                ₹0 / 0 hrs
              </span>
              <span className="text-[11px] text-emerald-700/80 mt-0.5">Scope swap margin saved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
