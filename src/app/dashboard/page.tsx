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

  // Authorization Guard:
  // - In offline/demo mode (SERVER_DEMO_MODE), require an explicit active demo session cookie
  //   so exiting demo mode prevents browser back navigation or direct access from restoring it.
  // - In live Supabase mode (!SERVER_DEMO_MODE), require either a demo cookie (isolated demo)
  //   or an authenticated Supabase user (verified below outside try/catch).
  if (SERVER_DEMO_MODE && !demoBypassCookie && !stateParam) {
    redirect("/login?unauthorized=true");
  }

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
              <a
                href="/login/demo"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
              >
                Reload Default Benchmark
              </a>
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
                <a
                  href="/login/demo"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                >
                  View VastraKart Benchmark
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Live Supabase check when credentials are active and NOT in isolated demo mode
  if (!SERVER_DEMO_MODE && !demoBypassCookie) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?unauthorized=true");
    }

    let liveFetchStatus: "ok" | "no_projects" | "db_error" = "ok";

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
      } else {
        liveFetchStatus = "no_projects";
      }
    } catch {
      liveFetchStatus = "db_error";
    }

    if (liveFetchStatus === "no_projects") {
      return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
          <DashboardSidebar isDemoMode={false} />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                No Authorized Workspace Projects Found
              </h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Your account is authenticated, but no agency projects are linked to your workspace yet.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (liveFetchStatus === "db_error") {
      return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
          <DashboardSidebar isDemoMode={false} />
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
    .reduce((sum, i) => sum + i.hours, 0);

  const inProgressHours = scopeItems
    .filter((i) => i.status === "in_progress")
    .reduce((sum, i) => sum + i.hours, 0);

  const allocatedHours = completedHours + inProgressHours;
  const remainingHours = Math.max(0, project.total_hours - allocatedHours);

  const completedInr = completedHours * HOURLY_RATE_INR;
  const inProgressInr = inProgressHours * HOURLY_RATE_INR;

  const swappableItems = scopeItems.filter((i) => i.is_swappable);
  const swappableCount = swappableItems.length;
  const swappableHours = swappableItems.reduce((sum, i) => sum + i.hours, 0);

  const pendingRequests = changeRequests.filter(
    (cr) => cr.approval_status === "pending"
  );
  const pendingRequestsCount = pendingRequests.length;

  const activeDriftHours = changeRequests.reduce(
    (sum, cr) => sum + cr.drift_hours,
    0
  );
  const activeDriftCostInr = changeRequests.reduce(
    (sum, cr) => sum + cr.drift_cost_inr,
    0
  );

  const approvalToken =
    changeRequests[0]?.approval_token || "demo-csc-892a";

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <DashboardSidebar
        isDemoMode={isDemoMode}
        projectId={project.id}
        approvalToken={approvalToken}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          project={project}
          isDemoMode={isDemoMode}
          approvalToken={approvalToken}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
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

          <ScopeSwapBanner
            status="pending_approval"
            hash="#CSC-892A"
            driftHours={activeDriftHours}
            driftCostInr={activeDriftCostInr}
            swappedItemTitle="Blog & Content CMS"
            swappedHours={14}
            netDeltaHours={0}
            netDeltaCostInr={0}
            projectId={project.id}
            approvalToken={approvalToken}
          />

          <BudgetGauge
            completedInr={completedInr}
            inProgressInr={inProgressInr}
            budgetCapInr={project.budget_cap_inr}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <div className="xl:col-span-2">
              <ScopeTable items={scopeItems} />
            </div>

            <div className="xl:col-span-1 space-y-4">
              <DriftFeed
                changeRequests={changeRequests}
                projectId={project.id}
              />
              <RelatedScreensPanel
                projectId={project.id}
                approvalToken={approvalToken}
              />
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
