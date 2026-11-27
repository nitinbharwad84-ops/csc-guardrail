import React, { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { BudgetGauge } from "@/components/dashboard/BudgetGauge";
import { ScopeSwapBanner } from "@/components/dashboard/ScopeSwapBanner";
import { ScopeTable } from "@/components/dashboard/ScopeTable";
import { DriftFeed } from "@/components/dashboard/DriftFeed";
import { DashboardSkeleton } from "@/components/dashboard/DashboardLoadingAndError";
import {
  VASTRAKART_PROJECT,
  VASTRAKART_SCOPE_ITEMS,
  VASTRAKART_ACTIVE_CHANGE_REQUEST,
} from "@/components/dashboard/fixtures";
import { createServerSupabaseClient, SERVER_DEMO_MODE } from "@/lib/supabase/server";
import type { Project, ScopeItem, ChangeRequest } from "@/types/csc";
import { HOURLY_RATE_INR } from "@/types/csc";
import { AlertCircle, Layers } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scope Health Dashboard — CSC Guardrail",
  description:
    "Live fixed-contract health dashboard tracking the ₹1,50,000 cap, 120 hr budget, swappable deliverables pool, and active drift alerts.",
};

interface DashboardContentProps {
  searchParams?: Promise<{ state?: string }>;
}

async function DashboardContent({ searchParams }: DashboardContentProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const stateParam = resolvedParams?.state;

  const cookieStore = await cookies();
  const demoBypassCookie = cookieStore.get("csc-demo-bypass")?.value === "true";

  let project: Project = VASTRAKART_PROJECT;
  let scopeItems: ScopeItem[] = VASTRAKART_SCOPE_ITEMS;
  let changeRequests: ChangeRequest[] = [VASTRAKART_ACTIVE_CHANGE_REQUEST];
  let isDemoMode = SERVER_DEMO_MODE || demoBypassCookie;

  // Handle test states for QA & edge-case verification
  if (stateParam === "error") {
    return (
      <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Unable to Load Contract Data
          </h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A connection error occurred while querying the project database.
            You can switch to isolated demo mode or retry.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              Reload Default Benchmark
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (stateParam === "empty") {
    return (
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          project={{
            ...VASTRAKART_PROJECT,
            title: "Uninitialized Project Workspace",
          }}
          isDemoMode={isDemoMode}
        />
        <div className="p-6 lg:p-8 flex-1 flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              No Scope Deliverables Recorded
            </h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              This project has not uploaded or scanned a Statement of Work yet.
              Run the SOW Ambiguity Scanner to initialize deliverables.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/scanner"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
              >
                Go to SOW Ambiguity Scanner
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                View VastraKart Benchmark
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Attempt live Supabase query if credentials are active and not in demo mode
  if (!SERVER_DEMO_MODE && !demoBypassCookie) {
    try {
      const supabase = await createServerSupabaseClient();
      // Check session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Unauthorized access without login or demo cookie -> redirect to login
        redirect("/login?unauthorized=true");
      }

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (projectData && !projectError) {
        project = projectData as Project;

        const { data: scopeData } = await supabase
          .from("scope_items")
          .select("*")
          .eq("project_id", project.id)
          .order("created_at", { ascending: true });

        if (scopeData && scopeData.length > 0) {
          scopeItems = scopeData as ScopeItem[];
        }

        const { data: crData } = await supabase
          .from("change_requests")
          .select("*")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false });

        if (crData && crData.length > 0) {
          changeRequests = crData as ChangeRequest[];
        }
      } else {
        isDemoMode = true;
      }
    } catch {
      // Graceful fallback to static demo fixtures on network/env failure
      isDemoMode = true;
    }
  }

  // Mathematically verified calculations from SOW deliverables
  const completedHours = scopeItems
    .filter((i) => i.status === "completed")
    .reduce((sum, i) => sum + i.hours, 0); // 16 hrs (Auth & Email Login)

  const inProgressHours = scopeItems
    .filter((i) => i.status === "in_progress")
    .reduce((sum, i) => sum + i.hours, 0); // 38 hrs (Catalogue 20h + Cart 18h)

  const allocatedHours = completedHours + inProgressHours; // 54 hrs committed (45%)
  const remainingHours = Math.max(0, project.total_hours - allocatedHours); // 66 hrs uncommitted (55%)

  // Precise financial valuations at ₹1,250/hr
  const completedInr = completedHours * HOURLY_RATE_INR;   // ₹20,000 actual completed spend
  const inProgressInr = inProgressHours * HOURLY_RATE_INR; // ₹47,500 active in-progress allocation

  const swappableItems = scopeItems.filter((i) => i.is_swappable);
  const swappableCount = swappableItems.length; // 3 items (Push 10h, Wishlist 12h, Blog CMS 14h)
  const swappableHours = swappableItems.reduce((sum, i) => sum + i.hours, 0); // 36 hrs

  // Change requests metrics
  const pendingRequests = changeRequests.filter((cr) => cr.approval_status === "pending");
  const pendingRequestsCount = pendingRequests.length; // 1 Pending (#CSC-892A)

  const activeDriftHours = changeRequests.reduce((sum, cr) => sum + cr.drift_hours, 0); // 14 hrs
  const activeDriftCostInr = changeRequests.reduce((sum, cr) => sum + cr.drift_cost_inr, 0); // ₹17,500

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
      {/* Project Header Bar */}
      <DashboardHeader project={project} isDemoMode={isDemoMode} />

      {/* Dashboard Body */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI Bento Grid (5 Cards: Cap, Hours, Pending Changes, Active Drift, Swappable Pool) */}
        <KpiCards
          budgetCap={project.budget_cap_inr}
          totalHours={project.total_hours}
          completedHours={completedHours}
          inProgressHours={inProgressHours}
          allocatedHours={allocatedHours}
          remainingHours={remainingHours}
          driftHours={activeDriftHours}
          driftCostInr={activeDriftCostInr}
          pendingRequestsCount={pendingRequestsCount}
          swappableCount={swappableCount}
          swappableHours={swappableHours}
          marginProtectedInr={activeDriftCostInr}
        />

        {/* Active Scope Swap Callout Banner */}
        <ScopeSwapBanner
          hash="#CSC-892A"
          driftHours={activeDriftHours}
          driftCostInr={activeDriftCostInr}
          swappedItemTitle="Blog & Content CMS"
          swappedHours={14}
          netDeltaHours={0}
          netDeltaCostInr={0}
        />

        {/* Budget Financial Gauge (Distinct Completed Spend vs In-Progress Allocation vs Headroom) */}
        <BudgetGauge
          completedInr={completedInr}
          inProgressInr={inProgressInr}
          budgetCapInr={project.budget_cap_inr}
        />

        {/* Two-Column Grid: SOW Deliverables Table + Scope Drift Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* SOW Deliverables Baseline Table (2 cols on xl) */}
          <div className="xl:col-span-2">
            <ScopeTable items={scopeItems} />
          </div>

          {/* Drift Alert Feed (1 col on xl) */}
          <div className="xl:col-span-1 space-y-4">
            <DriftFeed changeRequests={changeRequests} />

            {/* Quick Navigation Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Related Screens
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/scanner"
                    className="group flex items-center justify-between text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <span>03. SOW Ambiguity Scanner</span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Day-0
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/simulator"
                    className="group flex items-center justify-between text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <span>05. Drift &amp; Swap Simulator</span>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      Engine
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/approve/demo-csc-892a"
                    className="group flex items-center justify-between text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <span>06. Client Approval Portal</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Sign-off
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ledger"
                    className="group flex items-center justify-between text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <span>07. Immutable Audit Ledger</span>
                    <span className="text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      PDF
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage(props: DashboardContentProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* App Sidebar */}
      <DashboardSidebar />

      {/* Main Content with Suspense Boundary for Partial Prerendering */}
      <Suspense
        fallback={
          <div className="flex-1 p-6 lg:p-8">
            <DashboardSkeleton />
          </div>
        }
      >
        <DashboardContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
