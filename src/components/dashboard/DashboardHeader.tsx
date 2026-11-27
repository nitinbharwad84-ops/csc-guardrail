"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  Sparkles,
  Sliders,
  CheckSquare,
  FileSpreadsheet,
  LogOut,
} from "lucide-react";
import type { Project } from "@/types/csc";
import { createClient } from "@/lib/supabase/client";

interface DashboardHeaderProps {
  project: Project;
  isDemoMode?: boolean;
}

export function DashboardHeader({
  project,
  isDemoMode = false,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    if (typeof document !== "undefined") {
      document.cookie =
        "csc-demo-bypass=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore offline errors
    }
    router.push("/login?logout=true");
  };

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Project & Workspace Identification */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200/60">
              <Building2 className="h-3 w-3" />
              <span>{project.agency_name}</span>
            </span>

            <span className="text-slate-300">&bull;</span>

            <span className="text-xs font-medium text-slate-500">
              Client: <strong className="text-slate-800">{project.client_name}</strong>
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Active Sprint</span>
            </span>

            {isDemoMode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                <Sparkles className="h-3 w-3 text-amber-600" />
                <span>Isolated Demo Mode</span>
              </span>
            )}
          </div>

          <h1 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {project.title}
          </h1>

          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span>Statement of Work #CSC-001A</span>
            <span className="text-slate-300">&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" /> Fixed Cap: ₹1,50,000 / 120 hrs (₹1,250/hr)
            </span>
          </p>
        </div>

        {/* Action Shortcuts across the 7-screen flow + Sign Out */}
        <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
          <Link
            href="/simulator"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-indigo-600" />
            <span>Open Simulator</span>
          </Link>

          <Link
            href="/approve/demo-csc-892a"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
            <span>Client Portal</span>
          </Link>

          <Link
            href="/ledger"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-600" />
            <span>Audit Ledger</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
            title="Clear demo cookies and sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isDemoMode ? "Exit Demo" : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
