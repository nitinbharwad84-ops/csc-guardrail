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
  ArrowLeft,
  Building2,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  note?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "SOW Scanner",
    href: "/scanner",
    icon: Search,
    note: "Day-0 Spec Check",
    badge: "L1",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    name: "Scope Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    note: "Contract & Drift",
  },
  {
    name: "Guardrail Simulator",
    href: "/simulator",
    icon: Sliders,
    note: "Mid-Sprint Swap",
    badge: "L2",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    name: "Client Portal",
    href: "/approve/demo-csc-892a",
    icon: CheckSquare,
    note: "Review & Sign",
    badge: "Client",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    name: "Audit Ledger",
    href: "/ledger",
    icon: FileSpreadsheet,
    note: "Immutable Log & PDF",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    // Clear demo bypass cookie
    if (typeof document !== "undefined") {
      document.cookie =
        "csc-demo-bypass=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors in offline mode
    }

    router.push("/login?logout=true");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Top Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
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

        {/* Navigation Section */}
        <div>
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workflow Screens
          </div>
          <nav className="mt-2 space-y-1" aria-label="Sidebar Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard" && pathname?.startsWith("/dashboard"));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold border-l-3 border-indigo-600 pl-2 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-indigo-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <div className="flex flex-col truncate">
                      <span className="truncate">{item.name}</span>
                      {item.note && (
                        <span className="text-[10px] font-normal text-slate-400 leading-tight">
                          {item.note}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`ml-1.5 shrink-0 rounded-full border px-1.5 py-0.2 text-[9px] font-semibold ${
                        item.badgeColor || "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Workspace Card */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-100 text-indigo-700">
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
            <span>Contract #CSC-892A</span>
            <span className="text-emerald-700 font-semibold font-mono tabular-nums">
              ₹1,50,000 Cap
            </span>
          </div>
        </div>

        {/* Sign Out / Exit Demo */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Workspace / Sign Out</span>
        </button>

        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 w-full rounded-lg py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit to Public Landing</span>
        </Link>
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
    </>
  );
}
