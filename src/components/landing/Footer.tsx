"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-sans text-base font-bold text-slate-900">
                CSC Guardrail
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Client Scope &amp; Change Guardrail is a two-layer defense system that stops fixed-price
              agency scope creep before kickoff and during sprints through mathematical zero-cost scope swaps.
            </p>
            <div className="text-xs text-slate-400">
              Agency Benchmark:{" "}
              <strong className="text-slate-700 font-semibold">PixelCraft Studio</strong>
              <span className="mx-2">&bull;</span>
              Demo Client:{" "}
              <strong className="text-slate-700 font-semibold">VastraKart Retail Pvt. Ltd.</strong>
            </div>
          </div>

          {/* Workflow Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Workflow Screens
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  01. Product Landing
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  02. Agency Login &amp; Demo
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-indigo-600 transition-colors">
                  03. SOW Ambiguity Scanner
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
                  04. Scope Health Dashboard
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-indigo-600 transition-colors">
                  05. Drift &amp; Swap Simulator
                </Link>
              </li>
              <li>
                <Link href="/approve/demo-csc-892a" className="hover:text-indigo-600 transition-colors">
                  06. Client Approval Portal
                </Link>
              </li>
              <li>
                <Link href="/ledger" className="hover:text-indigo-600 transition-colors">
                  07. Immutable Audit Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Engine &amp; Design
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>Next.js 15 App Router &amp; Turbopack</li>
              <li>TypeScript Strict Domain Typing</li>
              <li>Tailwind CSS (Ledger Slate &amp; Trust Indigo)</li>
              <li>Supabase PostgreSQL &amp; Deterministic Fallbacks</li>
              <li>Tabular Numbers Financial Precision</li>
              <li className="pt-2 text-slate-400">
                Built for PU Digital Hackathon 2.0
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; 2026 CSC Guardrail. Built by Member 2 for the CSC Hackathon Team.
          </p>
          <div className="flex items-center gap-2">
            <span>Designed in Trust Indigo &amp; Ledger Slate</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
