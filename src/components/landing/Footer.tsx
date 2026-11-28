"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";
import { ROUTE_REGISTRY } from "@/components/dashboard/routeAvailability";

export function Footer() {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  return (
    <>
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-sans text-base font-bold text-slate-900 tracking-tight">
                  CSC Guardrail
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Client Scope &amp; Change Guardrail: An automated Two-Layer Defense protecting agency fixed-fee margins against creep through Day-0 ambiguity detection and Mid-Sprint zero-cost scope swaps.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-400">
                PixelCraft Studio &middot; Statement of Work #CSC-001A
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                System Workflow
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
                  {ROUTE_REGISTRY.scanner.isImplemented ? (
                    <Link
                      href={ROUTE_REGISTRY.scanner.buildHref()}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      03. SOW Scanner
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openPending("scanner")}
                      className="hover:text-indigo-600 transition-colors text-left flex items-center gap-1 text-slate-500"
                    >
                      <span>03. SOW Scanner</span>
                      <span className="text-[9px] text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">
                        Pending
                      </span>
                    </button>
                  )}
                </li>
                <li>
                  <a href="/login/demo" className="hover:text-indigo-600 transition-colors">
                    04. Scope Health Dashboard
                  </a>
                </li>
                <li>
                  {ROUTE_REGISTRY.simulator.isImplemented ? (
                    <Link
                      href={ROUTE_REGISTRY.simulator.buildHref()}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      05. Swap Simulator
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openPending("simulator")}
                      className="hover:text-indigo-600 transition-colors text-left flex items-center gap-1 text-slate-500"
                    >
                      <span>05. Swap Simulator</span>
                      <span className="text-[9px] text-indigo-700 bg-indigo-50 px-1 rounded border border-indigo-200">
                        Pending
                      </span>
                    </button>
                  )}
                </li>
                <li>
                  {ROUTE_REGISTRY.approve.isImplemented ? (
                    <Link
                      href={ROUTE_REGISTRY.approve.buildHref({ approvalToken: "demo-csc-892a" })}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      06. Client Approval Portal
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openPending("approve")}
                      className="hover:text-indigo-600 transition-colors text-left flex items-center gap-1 text-slate-500"
                    >
                      <span>06. Client Approval Portal</span>
                      <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                        Pending
                      </span>
                    </button>
                  )}
                </li>
                <li>
                  {ROUTE_REGISTRY.ledger.isImplemented ? (
                    <Link
                      href={ROUTE_REGISTRY.ledger.buildHref()}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      07. Immutable Audit Ledger
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openPending("ledger")}
                      className="hover:text-indigo-600 transition-colors text-left flex items-center gap-1 text-slate-500"
                    >
                      <span>07. Immutable Audit Ledger</span>
                      <span className="text-[9px] text-slate-700 bg-slate-100 px-1 rounded border border-slate-200">
                        Pending
                      </span>
                    </button>
                  )}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Design &amp; Architecture
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>Next.js App Router &amp; Turbopack</li>
                <li>TypeScript Strict Domain Typing</li>
                <li>Ledger Slate &amp; Trust Indigo Tokens</li>
                <li>Supabase PostgreSQL &amp; SSR Auth</li>
                <li>Tabular-nums Financial Precision</li>
                <li className="pt-2 text-slate-400">
                  Built for PU Digital Hackathon 2.0
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              &copy; 2026 CSC Guardrail. Built by Member 2 for the CSC Hackathon Team.
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <span>Trust Indigo &amp; Ledger Slate Design System</span>
            </div>
          </div>
        </div>
      </footer>

      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
