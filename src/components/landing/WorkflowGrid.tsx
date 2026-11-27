import React from "react";
import Link from "next/link";
import {
  Home,
  LogIn,
  Search,
  LayoutDashboard,
  Sliders,
  CheckSquare,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";

interface ScreenCard {
  number: string;
  route: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  role: string;
}

const SCREENS: ScreenCard[] = [
  {
    number: "Screen 01",
    route: "/",
    title: "Product Landing Page",
    badge: "Public Entry",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Home,
    description:
      "Public-facing portal explaining the Two-Layer Defense against fixed-fee agency scope creep with quick-launch navigation.",
    role: "Agency & Prospective Clients",
  },
  {
    number: "Screen 02",
    route: "/login",
    title: "Agency Workspace Login",
    badge: "Auth & Demo",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: LogIn,
    description:
      "Secure agency sign-in powered by Supabase Auth with an instant zero-credential demo workspace bypass for stage presentations.",
    role: "Agency Account Leads",
  },
  {
    number: "Screen 03",
    route: "/scanner",
    title: "SOW Ambiguity Scanner",
    badge: "Layer 1 Defense",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Search,
    description:
      "Pre-kickoff contract analyzer that flags vaguely phrased deliverables and generates precision specs before signatures.",
    role: "Solution Architects & Delivery Leads",
  },
  {
    number: "Screen 04",
    route: "/dashboard",
    title: "Scope Health Dashboard",
    badge: "Command Center",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: LayoutDashboard,
    description:
      "Live VastraKart benchmark tracking the ₹1,50,000 cap, 120 hr budget, swappable deliverables pool, and active drift alerts.",
    role: "Project Managers & Tech Leads",
  },
  {
    number: "Screen 05",
    route: "/simulator",
    title: "Drift & Swap Simulator",
    badge: "Layer 2 Defense",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Sliders,
    description:
      "Interactive scope engine matching incoming WhatsApp & Excel drift (+14 hrs) against swappable deliverables for a ₹0 net swap.",
    role: "Account Directors & PMs",
  },
  {
    number: "Screen 06",
    route: "/approve/demo-csc-892a",
    title: "Client Approval Portal",
    badge: "Client Facing",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckSquare,
    description:
      "Dedicated single-column contract sheet with zero agency sidebar clutter for 1-click client sign-off on scope adjustments.",
    role: "VastraKart Client Stakeholders",
  },
  {
    number: "Screen 07",
    route: "/ledger",
    title: "Immutable Audit Ledger",
    badge: "Cryptographic Log",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    icon: FileSpreadsheet,
    description:
      "Verifiable timeline recording every scope modification with hash #CSC-892A and automated client-ready PDF handoff exports.",
    role: "Auditors & Executive Leadership",
  },
];

export function WorkflowGrid() {
  return (
    <section id="workflow" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
            Seven-Screen System Architecture
          </span>
          <h2 className="mt-4 font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            End-to-End Workflow Navigation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From pre-kickoff contract scan to client mobile approval and PDF ledger archiving,
            every screen serves a dedicated role in eliminating scope disputes.
          </p>
        </div>

        {/* 7-Screen Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCREENS.map((screen) => {
            const Icon = screen.icon;
            return (
              <div
                key={screen.number}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {screen.number}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${screen.badgeColor}`}
                    >
                      {screen.badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {screen.title}
                      </h3>
                      <code className="text-xs font-mono text-slate-500">
                        {screen.route}
                      </code>
                    </div>
                  </div>

                  <p className="mt-3.5 text-xs text-slate-600 leading-relaxed">
                    {screen.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {screen.role}
                  </span>
                  <Link
                    href={screen.route}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 hover:underline"
                    aria-label={`Open ${screen.title}`}
                  >
                    <span>Launch</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
