import React from "react";
import { Scale, Clock, TrendingUp, ShieldCheck, FileClock } from "lucide-react";
import { HOURLY_RATE_INR, DEMO_BUDGET_CAP_INR, DEMO_TOTAL_HOURS } from "@/types/csc";

interface KpiCardsProps {
  budgetCap?: number;
  totalHours?: number;
  completedHours?: number;
  inProgressHours?: number;
  allocatedHours?: number;
  remainingHours?: number;
  driftHours?: number;
  driftCostInr?: number;
  pendingRequestsCount?: number;
  swappableCount?: number;
  swappableHours?: number;
  marginProtectedInr?: number;
}

export function KpiCards({
  budgetCap = DEMO_BUDGET_CAP_INR,
  totalHours = DEMO_TOTAL_HOURS,
  completedHours = 16,
  inProgressHours = 38,
  allocatedHours = 54, // 16h completed + 38h in progress
  remainingHours = 66,
  driftHours = 14,
  driftCostInr = 17500,
  pendingRequestsCount = 1,
  swappableCount = 3,
  swappableHours = 36,
  marginProtectedInr = 17500,
}: KpiCardsProps) {
  const allocatedPercent = Math.round((allocatedHours / totalHours) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Contract Cap Card */}
      <div className="rounded-xl p-5 bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Contract Cap
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Scale className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 block tracking-tight">
            ₹{budgetCap.toLocaleString("en-IN")}
          </span>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>₹{HOURLY_RATE_INR.toLocaleString("en-IN")}/hr rate</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 text-[10px]">
              0% Breach
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Hours Breakdown Card */}
      <div className="rounded-xl p-5 bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Contract Hours
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 block tracking-tight">
            {totalHours} hrs
          </span>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono tabular-nums text-[11px]">
              Done {completedHours}h &middot; Active {inProgressHours}h ({allocatedPercent}%)
            </span>
            <span className="font-mono font-semibold text-indigo-700 tabular-nums">
              {remainingHours}h left
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pending Change Requests Card */}
      <div className="rounded-xl p-5 bg-amber-50/40 border border-amber-200/90 shadow-2xs hover:border-amber-300 transition-colors flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-amber-800">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Pending Changes
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <FileClock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-mono tabular-nums text-amber-950 block tracking-tight">
            {pendingRequestsCount} Pending
          </span>
          <div className="mt-1 flex items-center justify-between text-xs text-amber-900">
            <span className="font-mono font-semibold">#CSC-892A</span>
            <span className="font-semibold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-300/60 text-[10px]">
              Awaiting Sign-off
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Scope Drift Card */}
      <div className="rounded-xl p-5 bg-amber-50/40 border border-amber-200/90 shadow-2xs hover:border-amber-300 transition-colors flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-amber-800">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Active Scope Drift
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-mono tabular-nums text-amber-950 block tracking-tight">
            +{driftHours} hrs
          </span>
          <div className="mt-1 flex items-center justify-between text-xs text-amber-900">
            <span>WhatsApp + Excel</span>
            <span className="font-mono font-bold tabular-nums">
              ₹{driftCostInr.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Swappable Pool & Margin Protected Card */}
      <div className="rounded-xl p-5 bg-emerald-50/40 border border-emerald-200/90 shadow-2xs hover:border-emerald-300 transition-colors flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-emerald-800">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Swappable Pool
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-950 block tracking-tight">
            {swappableCount} items &middot; {swappableHours}h
          </span>
          <div className="mt-1 flex items-center justify-between text-xs text-emerald-800">
            <span>Margin Protected</span>
            <span className="font-mono font-bold tabular-nums text-emerald-900" title="Projected margin protected upon client approval">
              ₹{marginProtectedInr.toLocaleString("en-IN")}*
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
