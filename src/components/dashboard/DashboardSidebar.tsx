"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  LayoutDashboard,
  Sliders,
  CheckSquare,
  FileSpreadsheet,
  Building2,
  Menu,
  X,
  LogOut,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";
import { ROUTE_REGISTRY, type ScreenKey } from "@/components/dashboard/routeAvailability";

interface NavItemConfig {
  name: string;
  key: ScreenKey;
  icon: React.ElementType;
}

interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

const NAV_SECTIONS: NavSectionConfig[] = [
  {
    title: "WORKSPACE",
    items: [
      {
        name: "Overview / Scope Dashboard",
        key: "dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "SCOPE PROTECTION",
    items: [
      {
        name: "SOW Scanner",
        key: "scanner",
        icon: Search,
      },
      {
        name: "Guardrail Simulator",
        key: "simulator",
        icon: Sliders,
      },
    ],
  },
  {
    title: "CLIENT MANAGEMENT",
    items: [
      {
        name: "Client Portal",
        key: "approve",
        icon: CheckSquare,
      },
      {
        name: "Audit Ledger",
        key: "ledger",
        icon: FileSpreadsheet,
      },
    ],
  },
];

interface DashboardSidebarProps {
  isDemoMode?: boolean;
  projectId?: string;
  approvalToken?: string;
}

export function DashboardSidebar({
  isDemoMode = false,
  projectId,
  approvalToken,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [exitError, setExitError] = useState<string | null>(null);
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  /**
   * Isolated Demo Exit:
   * - Does NOT instantiate a Supabase client or call auth.signOut()
   * - Clears demo cookie server-side via /login/demo?action=exit and replaces history
   */
  const handleDemoExit = () => {
    setExiting(true);
    setExitError(null);
    if (typeof document !== "undefined") {
      document.cookie =
        "csc-demo-bypass=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
    window.location.replace("/login/demo?action=exit");
  };

  /**
   * Authenticated Supabase Sign-Out:
   * - Calls supabase.auth.signOut() and checks both returned { error } and thrown exceptions
   * - Only redirects with ?logout=true if sign-out succeeds
   */
  const handleAuthenticatedSignOut = async () => {
    setExiting(true);
    setExitError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        setExitError(error.message || "Sign out failed. Please try again.");
        setExiting(false);
        return;
      }

      if (typeof document !== "undefined") {
        document.cookie =
          "csc-demo-bypass=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      }

      router.replace("/login?logout=true");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Network error during sign out.";
      setExitError(msg);
      setExiting(false);
    }
  };

  const handleExitClick = () => {
    if (isDemoMode) {
      handleDemoExit();
    } else {
      void handleAuthenticatedSignOut();
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Top Brand Header (Links to Public Landing Page) */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg group"
            title="Return to Public Landing Page"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-sm font-bold tracking-tight text-slate-900 leading-tight">
                CSC Guardrail
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Agency Workspace
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Close navigation drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5" aria-label="Sidebar Navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const config = ROUTE_REGISTRY[item.key];
                  const href = config.buildHref({ projectId, approvalToken });
                  const isActive =
                    config.isImplemented &&
                    (pathname === href ||
                      (item.key === "dashboard" &&
                        pathname?.startsWith("/dashboard")));

                  if (config.isImplemented) {
                    return (
                      <Link
                        key={item.name}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-all ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 font-semibold border-l-3 border-indigo-600 pl-2 shadow-2xs"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive
                                ? "text-indigo-600"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        openPending(item.key);
                      }}
                      className="group flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                      title={`${item.name} — ${config.member} (Pending Integration)`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="ml-1.5 shrink-0 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/70">
                        <Clock className="h-2.5 w-2.5 text-amber-600" />
                        <span>Pending</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* ACCOUNT Section: Agency Profile + Single Context-Aware Exit Action */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate">
                PixelCraft Studio
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                Client: VastraKart
              </span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-200/60">
            <span>#CSC-892A</span>
            <span className="text-emerald-700 font-semibold font-mono tabular-nums">
              ₹1,50,000 Cap
            </span>
          </div>
        </div>

        {exitError && (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-[11px] text-rose-800 flex items-start gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
            <span>{exitError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleExitClick}
          disabled={exiting}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg py-2 px-3 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 border border-rose-200/80 transition-colors shadow-2xs disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          title={isDemoMode ? "Exit isolated demo workspace" : "Sign out of account"}
        >
          {exiting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
              <span>{isDemoMode ? "Exiting Demo..." : "Signing Out..."}</span>
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4 text-rose-600" />
              <span>{isDemoMode ? "Exit Demo" : "Sign Out"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar toggle button */}
      <div className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-sans text-sm font-bold text-slate-900">
            CSC Guardrail
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation drawer"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white sticky top-0 h-screen overflow-y-auto"
        aria-label="Sidebar"
      >
        {sidebarContent}
      </aside>

      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
