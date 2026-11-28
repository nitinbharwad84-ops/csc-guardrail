"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Clock, X, GitBranch } from "lucide-react";
import {
  ROUTE_REGISTRY,
  getRouteKeyFromPath,
  type RouteConfig,
  type ScreenKey,
} from "@/components/dashboard/routeAvailability";

export type PendingRouteInfo = RouteConfig;

interface PendingIntegrationModalProps {
  routeInfo: PendingRouteInfo | null;
  onClose: () => void;
}

export function PendingIntegrationModal({
  routeInfo,
  onClose,
}: PendingIntegrationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!routeInfo) return;

    // Capture focus prior to opening so we can restore it on close
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus inside dialog
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Keyboard focus trapping within dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [routeInfo, onClose]);

  if (!routeInfo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pending-modal-title"
      data-testid="pending-integration-modal"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Pending Team Integration
              </span>
              <h3
                id="pending-modal-title"
                className="text-base font-bold text-slate-900 mt-1"
              >
                {routeInfo.title}
              </h3>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs text-slate-600">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">Target Route:</span>
              <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                {routeInfo.routePattern}
              </code>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">Track &amp; Ownership:</span>
              <span className="text-slate-800 font-medium">{routeInfo.track}</span>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">Assigned Engineer:</span>
              <span className="font-semibold text-indigo-700">{routeInfo.member}</span>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">User Role:</span>
              <span className="text-slate-800">{routeInfo.role}</span>
            </div>
          </div>

          <p className="leading-relaxed text-slate-700">
            {routeInfo.description}
          </p>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 text-indigo-900 flex items-start gap-2.5">
            <GitBranch className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-0.5">
              <span className="font-bold">Integration Status:</span>
              <p className="text-indigo-800 leading-normal text-[11px]">
                This screen is not yet integrated on <code className="font-mono font-semibold">main</code>. Once the assigned teammate&apos;s PR is merged by Lead Integrator Nitin and enabled in <code className="font-mono">routeAvailability.ts</code>, live navigation will activate automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper hook to manage pending route modal state
 */
export function usePendingIntegration() {
  const [activeRoute, setActiveRoute] = useState<PendingRouteInfo | null>(null);

  const openPending = useCallback((pathOrKey: string | ScreenKey) => {
    if (pathOrKey in ROUTE_REGISTRY) {
      setActiveRoute(ROUTE_REGISTRY[pathOrKey as ScreenKey]);
      return;
    }
    const key = getRouteKeyFromPath(pathOrKey);
    if (key) {
      setActiveRoute(ROUTE_REGISTRY[key]);
    }
  }, []);

  const closePending = useCallback(() => setActiveRoute(null), []);

  return { activeRoute, openPending, closePending };
}
