"use client";

import React from "react";
import {
  Search,
  Sliders,
  CheckSquare,
  FileSpreadsheet,
  Clock,
} from "lucide-react";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";

export function RelatedScreensPanel() {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Workflow Tracks
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">7-Screen Architecture</span>
        </div>

        <ul className="mt-3 space-y-2 text-xs">
          <li>
            <button
              type="button"
              onClick={() => openPending("/scanner")}
              className="group flex items-center justify-between w-full text-slate-600 hover:text-indigo-600 transition-colors py-1 text-left"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span>03. SOW Ambiguity Scanner</span>
              </div>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5 text-amber-600" />
                <span>Track 1</span>
              </span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => openPending("/simulator")}
              className="group flex items-center justify-between w-full text-slate-600 hover:text-indigo-600 transition-colors py-1 text-left"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span>05. Drift &amp; Swap Simulator</span>
              </div>
              <span className="text-[10px] font-semibold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5 text-indigo-600" />
                <span>Track 3</span>
              </span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => openPending("/approve")}
              className="group flex items-center justify-between w-full text-slate-600 hover:text-indigo-600 transition-colors py-1 text-left"
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span>06. Client Approval Portal</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5 text-emerald-600" />
                <span>Track 4</span>
              </span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => openPending("/ledger")}
              className="group flex items-center justify-between w-full text-slate-600 hover:text-indigo-600 transition-colors py-1 text-left"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span>07. Immutable Audit Ledger</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5 text-slate-500" />
                <span>Track 5</span>
              </span>
            </button>
          </li>
        </ul>
      </div>

      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
