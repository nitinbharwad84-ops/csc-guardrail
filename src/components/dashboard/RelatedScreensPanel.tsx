"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  Sliders,
  CheckSquare,
  FileSpreadsheet,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";
import { ROUTE_REGISTRY, type ScreenKey } from "@/components/dashboard/routeAvailability";

interface RelatedItem {
  key: ScreenKey;
  label: string;
  trackLabel: string;
  badgeStyle: string;
  icon: React.ElementType;
}

const RELATED_ITEMS: RelatedItem[] = [
  {
    key: "scanner",
    label: "03. SOW Ambiguity Scanner",
    trackLabel: "Track 4",
    badgeStyle: "text-amber-800 bg-amber-50 border-amber-200",
    icon: Search,
  },
  {
    key: "simulator",
    label: "05. Drift & Swap Simulator",
    trackLabel: "Track 4",
    badgeStyle: "text-indigo-800 bg-indigo-50 border-indigo-200",
    icon: Sliders,
  },
  {
    key: "approve",
    label: "06. Client Approval Portal",
    trackLabel: "Track 3",
    badgeStyle: "text-emerald-800 bg-emerald-50 border-emerald-200",
    icon: CheckSquare,
  },
  {
    key: "ledger",
    label: "07. Immutable Audit Ledger",
    trackLabel: "Track 3",
    badgeStyle: "text-slate-700 bg-slate-100 border-slate-200",
    icon: FileSpreadsheet,
  },
];

export function RelatedScreensPanel({
  projectId,
  approvalToken = "demo-csc-892a",
}: {
  projectId?: string;
  approvalToken?: string;
}) {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Workflow Tracks
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">
            7-Screen Architecture
          </span>
        </div>

        <ul className="mt-3 space-y-2 text-xs">
          {RELATED_ITEMS.map((item) => {
            const config = ROUTE_REGISTRY[item.key];
            const Icon = item.icon;
            if (config.isImplemented) {
              return (
                <li key={item.key}>
                  <Link
                    href={config.buildHref({ projectId, approvalToken })}
                    className="group flex items-center justify-between w-full text-slate-600 hover:text-indigo-600 transition-colors py-1"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-600" />
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => openPending(item.key)}
                  className="group flex items-center justify-between w-full text-slate-600 hover:text-indigo-600 transition-colors py-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${item.badgeStyle}`}
                  >
                    <Clock className="h-2.5 w-2.5" />
                    <span>{item.trackLabel}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
