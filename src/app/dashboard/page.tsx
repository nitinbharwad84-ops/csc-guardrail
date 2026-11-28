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
import { RelatedScreensPanel } from "@/components/dashboard/RelatedScreensPanel";
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
  title: "Scope Dashboard | CSC Guardrail",
  description:
    "Live fixed-price contract scope health dashboard tracking the ₹1,50,000 cap, 120 hr budget, swappable deliverables pool, and active drift alerts.",
};

interface DashboardContentProps {
  searchParams?: Promise<{ state?: string }>;
}

async function DashboardContent({ searchParams }: DashboardContentProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const stateParam = resolvedParams?.state;

  const cookieStore = await cookies();
  const demoBypassCookie = cookieStore.get("csc-demo-bypass")?.value === "true";
  const isDemoMode = SERVER_DEMO_MODE || demoBypassCookie;

  let project: Project = VASTRAKART_PROJECT;
  let scopeItems: ScopeItem[] = VASTRAKART_SCOPE_ITEMS;
  let changeRequests: ChangeRequest[] = [VASTRAKART_ACTIVE_CHANGE_REQUEST];

  // Handle explicit QA test state (?state=error)
  if (stateParam === "error") {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <DashboardSidebar isDemoMode={isDemoMode} />
        <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Unable to Load Contract Data
            </h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              A connection error occurred while querying the project database.
              You can evaluate via the isolated demo workspace or retry.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
              >
                Reload Default Benchmark
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle explicit QA test state (?state=empty)
  if (stateParam === "empty") {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <DashboardSidebar isDemoMode={isDemoMode} />
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
                  href="/dashboard"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                >
                  View VastraKart Benchmark
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Live Supabase check if credentials are active and NOT in demo mode
  if (!SERVER_DEMO_MODE && !demoBypassCookie) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?unauthorized=true");
    }

    try {
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
      }
    } catch {
      return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
          <DashboardSidebar isDemoMode={isDemoMode} />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-md w-full rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Database Query Failure
              </h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Your authenticated session is valid, but project records could not be fetched from Supabase.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                >
                  Retry Query
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Contract calculation metrics
  const completedHours = scopeItems
    .filter((i) => i.status === "completed")
    .reduce((sum, i) => sum + i.hours, 0); // 16 hrs (Auth & Email Login)

  const inProgressHours = scopeItems
    .filter((i) => i.status === "in_progress")
    .reduce((sum, i) => sum + i.hours, 0); // 38 hrs (Catalogue 20h + Cart 18h)

  const allocatedHours = completedHours + inProgressHours; // 54 hrs committed (45%)
  const remainingHours = Math.max(0, project.total_hours - allocatedHours); // 66 hrs uncommitted (55%)

  // Milestone financial valuations at ₹1,250/hr
  const completedInr = completedHours * HOURLY_RATE_INR;   // ₹20,000 completed deliverable value
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* App Sidebar with Context-Aware Exit Button */}
      <DashboardSidebar isDemoMode={isDemoMode} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Project Header Bar */}
        <DashboardHeader project={project} isDemoMode={isDemoMode} />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* KPI Bento Grid */}
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

          {/* Active Scope Swap Proposal Banner */}
          <ScopeSwapBanner
            status="pending_approval"
            hash="#CSC-892A"
            driftHours={activeDriftHours}
            driftCostInr={activeDriftCostInr}
            swappedItemTitle="Blog & Content CMS"
            swappedHours={14}
            netDeltaHours={0}
            netDeltaCostInr={0}
          />

          {/* Budget Financial Gauge */}
          <BudgetGauge
            completedInr={completedInr}
            inProgressInr={inProgressInr}
            budgetCapInr={project.budget_cap_inr}
          />

          {/* Two-Column Layout: Baseline Scope Table + Scope Drift Feed */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* SOW Deliverables Baseline Table (2 cols on xl) */}
            <div className="xl:col-span-2">
              <ScopeTable items={scopeItems} />
            </div>

            {/* Scope Drift Feed + Related Screens (1 col on xl) */}
            <div className="xl:col-span-1 space-y-4">
              <DriftFeed changeRequests={changeRequests} />
              <RelatedScreensPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage(props: DashboardContentProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
          <DashboardSidebar isDemoMode={true} />
          <div className="flex-1 p-6 lg:p-8">
            <DashboardSkeleton />
          </div>
        </div>
      }
    >
      <DashboardContent searchParams={props.searchParams} />
    </Suspense>
  );
}
