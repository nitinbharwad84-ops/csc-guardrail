import React from "react";
import { CheckCircle2, Info } from "lucide-react";
import { DEMO_BUDGET_CAP_INR, HOURLY_RATE_INR } from "@/types/csc";

interface BudgetGaugeProps {
  completedInr?: number; // Completed deliverable milestone value (16 hrs = ₹20,000)
  inProgressInr?: number; // Active in-progress allocation (38 hrs = ₹47,500)
  budgetCapInr?: number;  // Fixed ceiling (120 hrs = ₹1,50,000)
}

export function BudgetGauge({
  completedInr = 20000,
  inProgressInr = 47500,
  budgetCapInr = DEMO_BUDGET_CAP_INR, // ₹1,50,000
}: BudgetGaugeProps) {
  const allocatedInr = completedInr + inProgressInr; // ₹67,500
  const remainingInr = Math.max(0, budgetCapInr - allocatedInr); // ₹82,500

  const completedHours = Math.round(completedInr / HOURLY_RATE_INR); // 16 hrs
  const inProgressHours = Math.round(inProgressInr / HOURLY_RATE_INR); // 38 hrs
  const remainingHours = Math.round(remainingInr / HOURLY_RATE_INR); // 66 hrs

  const completedPercent = (completedInr / budgetCapInr) * 100;
  const inProgressPercent = (inProgressInr / budgetCapInr) * 100;
  const remainingPercent = (remainingInr / budgetCapInr) * 100;

  return (
    <div className="rounded-xl p-5 bg-white border border-slate-200/90 shadow-2xs">
      {/* Title & Rate Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Contract Financial Health &amp; Scope Allocation
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            Contract Rate:{" "}
            <strong className="font-mono text-slate-800">
              ₹{HOURLY_RATE_INR.toLocaleString("en-IN")}/hr
            </strong>
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold text-[11px]">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>0% Cap Breach</span>
          </span>
        </div>
      </div>

      <div className="mt-4">
        {/* Progress summary labels */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline text-xs mb-2.5 gap-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              <strong className="text-slate-900 font-mono tabular-nums">
                ₹{completedInr.toLocaleString("en-IN")}
              </strong>{" "}
              <span className="text-slate-500">
                completed valuation ({completedHours}h delivered)
              </span>
            </span>
            <span className="text-slate-300">&bull;</span>
            <span>
              <strong className="text-indigo-700 font-mono tabular-nums">
                ₹{inProgressInr.toLocaleString("en-IN")}
              </strong>{" "}
              <span className="text-slate-500">
                in-progress allocation ({inProgressHours}h active)
              </span>
            </span>
          </div>

          <div className="text-right">
            <strong className="text-emerald-700 font-mono tabular-nums">
              ₹{remainingInr.toLocaleString("en-IN")}
            </strong>{" "}
            <span className="text-slate-500">
              uncommitted scope headroom ({remainingHours}h)
            </span>
          </div>
        </div>

        {/* Multi-Segment Visual Progress Bar */}
        <div
          className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex"
          role="progressbar"
          aria-valuenow={Math.round((allocatedInr / budgetCapInr) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Contract Scope and Budget Allocation Breakdown"
        >
          {/* Segment 1: Completed Deliverable Valuation */}
          <div
            className="h-full bg-indigo-700 rounded-l-full transition-all duration-500"
            style={{ width: `${completedPercent}%` }}
            title={`Completed milestone valuation: ₹${completedInr.toLocaleString("en-IN")} (${completedHours} hrs)`}
          />
          {/* Segment 2: In-Progress Scope Allocation */}
          <div
            className="h-full bg-indigo-400 transition-all duration-500"
            style={{ width: `${inProgressPercent}%` }}
            title={`In-progress allocation: ₹${inProgressInr.toLocaleString("en-IN")} (${inProgressHours} hrs)`}
          />
          {/* Segment 3: Safe Uncommitted Headroom */}
          <div
            className="h-full bg-emerald-400 rounded-r-full transition-all duration-500"
            style={{ width: `${remainingPercent}%` }}
            title={`Uncommitted headroom: ₹${remainingInr.toLocaleString("en-IN")} (${remainingHours} hrs)`}
          />
        </div>

        {/* Legend & Clarifications */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-700" />
              <span>Completed Valuation (₹{completedInr.toLocaleString("en-IN")})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span>In-Progress Allocation (₹{inProgressInr.toLocaleString("en-IN")})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Uncommitted Headroom (₹{remainingInr.toLocaleString("en-IN")})</span>
            </div>
          </div>

          <div className="font-mono text-slate-700 font-medium tabular-nums">
            Total Contract Ceiling: ₹{budgetCapInr.toLocaleString("en-IN")} (120 hrs)
          </div>
        </div>

        {/* Financial Governance Disclaimer */}
        <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
          <Info className="h-3 w-3 shrink-0" />
          <span>
            Note: Figures represent contractual delivery milestone valuations based on SOW hours at ₹1,250/hr, not actual cash disbursements.
          </span>
        </p>
      </div>
    </div>
  );
}
