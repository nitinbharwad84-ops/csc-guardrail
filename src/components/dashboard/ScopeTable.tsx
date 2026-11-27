"use client";

import React, { useState, useMemo } from "react";
import type { ScopeItem, ScopeItemStatus } from "@/types/csc";
import { HOURLY_RATE_INR } from "@/types/csc";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDashed,
  ShieldCheck,
} from "lucide-react";

interface ScopeTableProps {
  items: ScopeItem[];
}

export function ScopeTable({ items }: ScopeTableProps) {
  const [filter, setFilter] = useState<"all" | ScopeItemStatus | "swappable">("all");

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "swappable") return items.filter((i) => i.is_swappable);
    return items.filter((i) => i.status === filter);
  }, [items, filter]);

  // Status Counts
  const counts = useMemo(() => {
    return {
      all: items.length,
      in_progress: items.filter((i) => i.status === "in_progress").length,
      completed: items.filter((i) => i.status === "completed").length,
      deferred_phase_2: items.filter((i) => i.status === "deferred_phase_2").length,
      not_started: items.filter((i) => i.status === "not_started").length,
      swappable: items.filter((i) => i.is_swappable).length,
    };
  }, [items]);

  const totalFilteredHours = useMemo(() => {
    return filteredItems.reduce((acc, curr) => acc + curr.hours, 0);
  }, [filteredItems]);

  const renderStatusPill = (status: ScopeItemStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            <Clock className="h-3 w-3 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      case "deferred_phase_2":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <AlertCircle className="h-3 w-3" />
            <span>Deferred P2</span>
          </span>
        );
      case "not_started":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            <CircleDashed className="h-3 w-3 text-slate-400" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50 gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            SOW Deliverables &amp; Baseline Scope
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statement of Work deliverables with contracted hours and Phase 2 swap eligibility
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-indigo-600 text-white font-semibold"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter("in_progress")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === "in_progress"
                ? "bg-indigo-600 text-white font-semibold"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            In Progress ({counts.in_progress})
          </button>
          <button
            type="button"
            onClick={() => setFilter("deferred_phase_2")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === "deferred_phase_2"
                ? "bg-indigo-600 text-white font-semibold"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            Deferred ({counts.deferred_phase_2})
          </button>
          <button
            type="button"
            onClick={() => setFilter("swappable")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === "swappable"
                ? "bg-indigo-600 text-white font-semibold"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            Swappable ({counts.swappable})
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3 px-4 sm:px-6">
                Deliverable
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Hours
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Valuation (₹)
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                Status
              </th>
              <th scope="col" className="py-3 px-4 sm:px-6 text-center">
                Swap Eligibility
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50/80 transition-colors ${
                  item.status === "deferred_phase_2"
                    ? "bg-amber-50/30"
                    : item.is_swappable
                    ? "bg-emerald-50/20"
                    : ""
                }`}
              >
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.status === "deferred_phase_2" && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                        Swapped out
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800 font-medium">
                  {item.hours} hrs
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600">
                  ₹{(item.hours * HOURLY_RATE_INR).toLocaleString("en-IN")}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {renderStatusPill(item.status)}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-center">
                  {item.is_swappable ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Swappable</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono text-sm">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50/70 font-semibold text-xs text-slate-900">
              <td className="py-3 px-4 sm:px-6">
                Total ({filteredItems.length} items shown)
              </td>
              <td className="py-3 px-4 text-right font-mono tabular-nums text-indigo-700 font-bold">
                {totalFilteredHours} hrs
              </td>
              <td className="py-3 px-4 text-right font-mono tabular-nums text-indigo-700 font-bold">
                ₹{(totalFilteredHours * HOURLY_RATE_INR).toLocaleString("en-IN")}
              </td>
              <td colSpan={2} className="py-3 px-4 sm:px-6 text-center text-slate-500 font-normal">
                Fixed Rate: ₹1,250 / hr
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
