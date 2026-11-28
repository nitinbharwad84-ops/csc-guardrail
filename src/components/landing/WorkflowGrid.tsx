"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  LogIn,
  Search,
  LayoutDashboard,
  Sliders,
  CheckSquare,
  FileSpreadsheet,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";
import { ROUTE_REGISTRY, type ScreenKey } from "@/components/dashboard/routeAvailability";

interface ScreenCardMeta {
  key: ScreenKey;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  useDemoEntry?: boolean;
}

const SCREEN_CARDS: ScreenCardMeta[] = [
  {
    key: "landing",
    badge: "Public Entry",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Home,
  },
  {
    key: "login",
    badge: "Auth & Demo",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: LogIn,
  },
  {
    key: "scanner",
    badge: "Layer 1 Defense",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Search,
  },
  {
    key: "dashboard",
    badge: "Command Center",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: LayoutDashboard,
    useDemoEntry: true,
  },
  {
    key: "simulator",
    badge: "Layer 2 Defense",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Sliders,
  },
  {
    key: "approve",
    badge: "Client Facing",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckSquare,
  },
  {
    key: "ledger",
    badge: "Cryptographic Log",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    icon: FileSpreadsheet,
  },
];

export function WorkflowGrid() {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  return (
    <>
      <section
        id="workflow"
        className="scroll-mt-20 py-16 md:py-24 bg-slate-50 border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              Seven-Screen System Architecture
            </span>
            <h2 className="mt-4 font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              End-to-End Workflow Navigation
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              From pre-kickoff contract scan to client mobile approval and PDF ledger archiving,
              every screen serves a dedicated role in eliminating scope disputes.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCREEN_CARDS.map((card) => {
              const config = ROUTE_REGISTRY[card.key];
              const Icon = card.icon;
              return (
                <div
                  key={config.screenNumber}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {config.screenNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {!config.isImplemented && (
                          <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200">
                            <Clock className="h-2.5 w-2.5 text-amber-600" />
                            <span>Pending</span>
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${card.badgeColor}`}
                        >
                          {card.badge}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {config.title}
                        </h3>
                        <code className="text-xs font-mono text-slate-500">
                          {config.routePattern}
                        </code>
                      </div>
                    </div>

                    <p className="mt-3.5 text-xs text-slate-600 leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-[175px]">
                      {config.isImplemented ? config.role : config.member}
                    </span>

                    {config.isImplemented ? (
                      card.useDemoEntry ? (
                        <a
                          href="/login/demo"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 hover:underline"
                          aria-label={`Open ${config.title}`}
                        >
                          <span>Launch</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      ) : (
                        <Link
                          href={config.buildHref()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 hover:underline"
                          aria-label={`Open ${config.title}`}
                        >
                          <span>Launch</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => openPending(card.key)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
                        title={`${config.title} — ${config.member}`}
                      >
                        <span>Pending Integration</span>
                        <Clock className="h-3 w-3 text-amber-600" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
