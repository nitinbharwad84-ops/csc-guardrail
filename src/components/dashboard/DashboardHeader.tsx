"use client";

import React from "react";
import {
  Building2,
  Calendar,
  Sparkles,
  GitBranch,
  Info,
} from "lucide-react";
import type { Project } from "@/types/csc";
import { HOURLY_RATE_INR } from "@/types/csc";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";

interface DashboardHeaderProps {
  project: Project;
  isDemoMode?: boolean;
}

export function DashboardHeader({
  project,
  isDemoMode = false,
}: DashboardHeaderProps) {
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  return (
    <>
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Project & Workspace Identification */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200/60">
                <Building2 className="h-3.5 w-3.5" />
                <span>{project.agency_name}</span>
              </span>

              <span className="text-slate-300">&bull;</span>

              <span className="text-xs font-medium text-slate-500">
                Client: <strong className="text-slate-800">{project.client_name}</strong>
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Active Sprint</span>
              </span>

              {isDemoMode ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200 shadow-2xs">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  <span>Isolated Demo Mode</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-800 border border-indigo-200 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span>Production Workspace</span>
                </span>
              )}
            </div>

            <h1 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {project.title}
            </h1>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span>Statement of Work #CSC-001A</span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>Fixed Ceiling: </span>
                <strong className="font-mono text-slate-800">
                  ₹{project.budget_cap_inr.toLocaleString("en-IN")}
                </strong>
                <span> / {project.total_hours} hrs</span>
                <span className="font-mono text-slate-500">
                  (₹{HOURLY_RATE_INR.toLocaleString("en-IN")}/hr)
                </span>
              </span>
            </p>
          </div>

          {/* Quick Actions & Status Strip (Zero 404 links, No duplicate exit button) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openPending("/simulator")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
              title="Track 3 Simulator — In Development by Member 4"
            >
              <GitBranch className="h-3.5 w-3.5 text-indigo-600" />
              <span>Track Status</span>
            </button>

            <button
              type="button"
              onClick={() => openPending("/approve")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
              title="Track 4 Client Portal — In Development by Member 4"
            >
              <Info className="h-3.5 w-3.5 text-emerald-600" />
              <span>Portal Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Route Integration Modal */}
      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
