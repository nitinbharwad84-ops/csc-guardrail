"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftRight,
  Building2,
  FileCheck2,
  LayoutDashboard,
  Menu,
  ScanSearch,
  ScrollText,
  ShieldCheck,
  X,
} from "lucide-react";
import { DEMO_APPROVAL_TOKEN } from "@/types/csc";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  matchPrefix: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "SOW Scanner",
    href: "/scanner",
    icon: ScanSearch,
    badge: "Day-0",
    matchPrefix: "/scanner",
  },
  {
    label: "Scope Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    matchPrefix: "/dashboard",
  },
  {
    label: "Guardrail Simulator",
    href: "/simulator",
    icon: ArrowLeftRight,
    matchPrefix: "/simulator",
  },
  {
    label: "Client Portal",
    href: `/approve/${DEMO_APPROVAL_TOKEN}`,
    icon: FileCheck2,
    matchPrefix: "/approve",
  },
  {
    label: "Audit Ledger",
    href: "/ledger",
    icon: ScrollText,
    matchPrefix: "/ledger",
  },
];

export interface AppSidebarProps {
  /** Optional page content; when provided, AppSidebar renders the full two-column shell. */
  children?: React.ReactNode;
  /** Optional agency name override (defaults to PixelCraft Studio). */
  agencyName?: string;
  /** Optional active project subtitle (defaults to VastraKart · Phase 1). */
  projectLabel?: string;
}

/**
 * Shared 240px workspace sidebar for App Shell screens (Screens 3, 4, 5, 7).
 *
 * Supports both standalone usage (`<AppSidebar />` inside a flex layout) and
 * wrapper usage (`<AppSidebar>{children}</AppSidebar>`).
 */
export function AppSidebar({
  children,
  agencyName = "PixelCraft Studio",
  projectLabel = "VastraKart · Phase 1",
}: AppSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-surface">
      {/* Top Brand + Nav */}
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-ring"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-xs">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="leading-tight">
              <span className="block font-display text-sm font-bold tracking-tight text-text-primary">
                CSC Guardrail
              </span>
              <span className="block text-[11px] font-medium text-text-muted">
                Scope Defense
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-text-muted hover:bg-subtle hover:text-text-primary md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 p-3" aria-label="Workspace navigation">
          <div className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            2-Layer Workflow
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.matchPrefix !== "/" && pathname?.startsWith(item.matchPrefix));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors focus-ring ${
                  isActive
                    ? "bg-brand-tint text-brand font-semibold"
                    : "text-text-secondary hover:bg-subtle hover:text-text-primary"
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive
                        ? "text-brand"
                        : "text-text-muted group-hover:text-text-primary"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge && (
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-white text-brand border border-indigo-200"
                        : "bg-subtle text-text-muted"
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

      {/* Bottom Workspace Card */}
      <div className="border-t border-border p-3 space-y-2">
        <div className="rounded-xl border border-border bg-canvas p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-text-primary">
                {agencyName}
              </p>
              <p className="truncate text-[11px] text-text-muted">
                {projectLabel}
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2 text-[11px]">
            <span className="text-text-muted">Contract Cap</span>
            <span className="font-mono tabular-nums font-semibold text-text-primary">
              ₹1,50,000
            </span>
          </div>
        </div>

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-subtle hover:text-text-primary transition-colors focus-ring"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    </div>
  );

  const sidebarElement = (
    <>
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold text-text-primary">
            CSC Guardrail
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-border p-1.5 text-text-secondary hover:bg-subtle"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-[240px] max-w-[80vw] border-r border-border bg-surface shadow-sm">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Fixed 240px Sidebar */}
      <aside className="app-sidebar hidden md:sticky md:top-0 md:flex md:h-screen md:flex-col">
        {sidebarContent}
      </aside>
    </>
  );

  if (children !== undefined) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-canvas">
        {sidebarElement}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    );
  }

  return sidebarElement;
}

export default AppSidebar;
