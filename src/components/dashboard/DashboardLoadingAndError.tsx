import React from "react";
import { AlertTriangle, RefreshCw, FolderSearch } from "lucide-react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading Dashboard Data">
      {/* Header Skeleton */}
      <div className="h-20 bg-slate-200/70 rounded-xl" />

      {/* KPI Bento Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-28 bg-slate-200/70 rounded-xl" />
        <div className="h-28 bg-slate-200/70 rounded-xl" />
        <div className="h-28 bg-slate-200/70 rounded-xl" />
        <div className="h-28 bg-slate-200/70 rounded-xl" />
      </div>

      {/* Scope Swap Banner Skeleton */}
      <div className="h-24 bg-slate-200/70 rounded-xl" />

      {/* Budget Progress Gauge Skeleton */}
      <div className="h-28 bg-slate-200/70 rounded-xl" />

      {/* Table Skeleton */}
      <div className="h-64 bg-slate-200/70 rounded-xl" />
    </div>
  );
}

export function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-3"
    >
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
      </div>
      <h3 className="text-base font-bold text-red-950">
        Unable to Load Scope Dashboard
      </h3>
      <p className="text-xs text-red-800 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-xs transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
}

export function DashboardEmpty({
  onLoadBenchmark,
}: {
  onLoadBenchmark?: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-3">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <FolderSearch className="h-6 w-6" />
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-900">
        No Active SOW Deliverables Found
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        No baseline deliverables are recorded for this workspace. Load the canonical
        VastraKart benchmark dataset to explore scope health.
      </p>
      {onLoadBenchmark && (
        <button
          type="button"
          onClick={onLoadBenchmark}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs transition-colors"
        >
          <span>Load VastraKart Benchmark</span>
        </button>
      )}
    </div>
  );
}
