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
  Search,
  X,
  Layers,
} from "lucide-react";

interface ScopeTableProps {
  items: ScopeItem[];
}

export function ScopeTable({ items = [] }: ScopeTableProps) {
  const [filter, setFilter] = useState<"all" | ScopeItemStatus | "swappable">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    let list = items;

    // Apply tab filter
    if (filter === "swappable") {
      list = list.filter((i) => i.is_swappable);
    } else if (filter !== "all") {
      list = list.filter((i) => i.status === filter);
    }

    // Apply text search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((i) => i.title.toLowerCase().includes(q));
    }

    return list;
  }, [items, filter, searchQuery]);

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
            <Clock className="h-3 w-3 animate-pulse" />
            <span>In Progress</span>
          </span>
        );
      case "deferred_phase_2":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <AlertCircle className="h-3 w-3" />
            <span>Deferred P2</span>
          </span>
        );
      case "not_started":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            <CircleDashed className="h-3 w-3 text-slate-400" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              SOW Deliverables Baseline Scope
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statement of Work deliverables with contracted hours and Phase 2 swap candidate indicators
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deliverables..."
              className="block w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-7 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
              filter === "all"
                ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 font-medium"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter("in_progress")}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
              filter === "in_progress"
                ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 font-medium"
            }`}
          >
            In Progress ({counts.in_progress})
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
              filter === "completed"
                ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 font-medium"
            }`}
          >
            Completed ({counts.completed})
          </button>
          <button
            type="button"
            onClick={() => setFilter("deferred_phase_2")}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
              filter === "deferred_phase_2"
                ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 font-medium"
            }`}
          >
            Deferred P2 ({counts.deferred_phase_2})
          </button>
          <button
            type="button"
            onClick={() => setFilter("swappable")}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
              filter === "swappable"
                ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 font-medium"
            }`}
          >
            Swappable Pool ({counts.swappable})
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3 px-4 sm:px-6">
                Deliverable
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Hours
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Milestone Value (₹)
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                Status
              </th>
              <th scope="col" className="py-3 px-4 sm:px-6 text-center">
                Swap Candidate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
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
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                          Deferred to P2
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
                      <span className="text-slate-400 font-mono text-xs">Non-swappable</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="h-6 w-6 text-slate-300" />
                    <span className="text-xs font-medium">
                      {searchQuery
                        ? `No deliverables match "${searchQuery}".`
                        : "No deliverables in this category."}
                    </span>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Clear search filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
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
                Contract Rate: ₹1,250 / hr
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
