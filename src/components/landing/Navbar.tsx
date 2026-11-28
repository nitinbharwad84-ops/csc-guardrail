"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import {
  PendingIntegrationModal,
  usePendingIntegration,
} from "@/components/dashboard/PendingIntegrationModal";
import { ROUTE_REGISTRY } from "@/components/dashboard/routeAvailability";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeRoute, openPending, closePending } = usePendingIntegration();
  const ledgerConfig = ROUTE_REGISTRY.ledger;

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const headerOffset = 80; // Keep section heading clear of sticky h-16 navbar
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    window.history.pushState(null, "", `#${sectionId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg"
              aria-label="CSC Guardrail Home"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-base font-bold tracking-tight text-slate-900 leading-tight">
                  CSC Guardrail
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Client Scope &amp; Change Protection
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main Navigation"
          >
            <a
              href="#defense"
              onClick={(e) => handleAnchorClick(e, "defense")}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
            >
              2-Layer Defense
            </a>
            <a
              href="#workflow"
              onClick={(e) => handleAnchorClick(e, "workflow")}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
            >
              7-Screen Flow
            </a>
            <a
              href="#scenario"
              onClick={(e) => handleAnchorClick(e, "scenario")}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
            >
              VastraKart Demo
            </a>
            {ledgerConfig.isImplemented ? (
              <Link
                href={ledgerConfig.buildHref()}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
              >
                Audit Ledger
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openPending("ledger")}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm text-left"
              >
                Audit Ledger
              </button>
            )}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Agency Login
            </Link>
            <a
              href="/login/demo"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Try Live Demo</span>
              <ArrowRight className="h-4 w-4 ml-0.5" aria-hidden="true" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 pt-3 pb-6 sm:px-6 md:hidden">
            <nav className="flex flex-col gap-3" aria-label="Mobile Navigation">
              <a
                href="#defense"
                onClick={(e) => handleAnchorClick(e, "defense")}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                2-Layer Defense
              </a>
              <a
                href="#workflow"
                onClick={(e) => handleAnchorClick(e, "workflow")}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                7-Screen Flow
              </a>
              <a
                href="#scenario"
                onClick={(e) => handleAnchorClick(e, "scenario")}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                VastraKart Demo
              </a>
              {ledgerConfig.isImplemented ? (
                <Link
                  href={ledgerConfig.buildHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  Audit Ledger
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openPending("ledger");
                  }}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left"
                >
                  Audit Ledger
                </button>
              )}
              <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-slate-200">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Agency Login
                </Link>
                <a
                  href="/login/demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Try Live Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <PendingIntegrationModal
        routeInfo={activeRoute}
        onClose={closePending}
      />
    </>
  );
}
