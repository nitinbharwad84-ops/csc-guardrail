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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";

interface NavItemConfig {
  name: string;
  href: string;
  icon: React.ElementType;
  isImplemented: boolean;
  pendingOwner?: string;
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
        href: "/dashboard",
        icon: LayoutDashboard,
        isImplemented: true,
      },
    ],
  },
  {
    title: "SCOPE PROTECTION",
    items: [
      {
        name: "SOW Scanner",
        href: "/scanner",
        icon: Search,
        isImplemented: false,
        pendingOwner: "Member 3 (Track 1)",
      },
      {
        name: "Guardrail Simulator",
        href: "/simulator",
        icon: Sliders,
        isImplemented: false,
        pendingOwner: "Member 4 (Track 3)",
      },
    ],
  },
  {
    title: "CLIENT MANAGEMENT",
    items: [
      {
        name: "Client Portal",
        href: "/approve",
        icon: CheckSquare,
        isImplemented: false,
        pendingOwner: "Member 4 (Track 4)",
      },
      {
        name: "Audit Ledger",
        href: "/ledger",
        icon: FileSpreadsheet,
        isImplemented: false,
        pendingOwner: "Member 5 (Track 5)",
      },
    ],
  },
];

interface DashboardSidebarProps {
  isDemoMode?: boolean;
}

export function DashboardSidebar({ isDemoMode = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const inDemo = isDemoMode;
  const { activeRoute, openPending, closePending } = usePendingIntegration();

  const handleSignOut = async () => {
    // 1. Clear demo bypass cookie
    if (typeof document !== "undefined") {
      document.cookie =
        "csc-demo-bypass=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }

    // 2. Terminate Supabase authenticated session if active
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors in offline/demo mode
    }

    // 3. Clean transition to login page with sign-out confirmation
    router.push("/login?logout=true");
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
                  const isActive =
                    item.isImplemented &&
                    (pathname === item.href ||
                      (item.href === "/dashboard" &&
                        pathname?.startsWith("/dashboard")));

                  if (item.isImplemented) {
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
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

                  // Unimplemented teammate route — triggers modal, NEVER a 404
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        openPending(item.href);
                      }}
                      className="group flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                      title={`${item.name} — ${item.pendingOwner} (Pending Integration)`}
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
        {/* Agency Profile Card */}
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

        {/* Single Context-Aware Account Exit Action */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg py-2 px-3 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 border border-rose-200/80 transition-colors shadow-2xs"
          title={inDemo ? "Exit isolated demo workspace" : "Sign out of account"}
        >
          <LogOut className="h-4 w-4 text-rose-600" />
          <span>{inDemo ? "Exit Demo" : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar toggle button */}
      <div className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-sans text-sm font-bold text-slate-900">
            CSC Guardrail
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

      {/* Pending Route Integration Modal */}
      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
