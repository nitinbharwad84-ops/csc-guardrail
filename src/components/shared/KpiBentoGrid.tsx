import React from "react";
import {
  Clock,
  IndianRupee,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export type KpiTone = "default" | "safe" | "warn" | "danger" | "brand";

export interface KpiCardItem {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
  tone?: KpiTone;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface KpiBentoGridProps {
  /** Optional custom KPI cards; defaults to canonical VastraKart demo metrics. */
  cards?: KpiCardItem[];
  className?: string;
}

const DEFAULT_VASTRAKART_CARDS: KpiCardItem[] = [
  {
    id: "budget-cap",
    label: "Fixed Budget Cap",
    value: "₹1,50,000",
    sublabel: "VastraKart · ₹1,250/hr rate",
    tone: "default",
    icon: IndianRupee,
  },
  {
    id: "total-hours",
    label: "Total Contracted Hours",
    value: "120 hrs",
    sublabel: "8 SOW baseline deliverables",
    tone: "default",
    icon: Clock,
  },
  {
    id: "active-drift",
    label: "Active Drift Request",
    value: "+14 hrs",
    sublabel: "₹17,500 · Pending swap",
    tone: "warn",
    icon: TrendingUp,
  },
  {
    id: "swappable-pool",
    label: "Swappable Buffer Pool",
    value: "3 items · 36 hrs",
    sublabel: "Ready to absorb drift at ₹0",
    tone: "safe",
    icon: RefreshCw,
  },
];

const TONE_STYLES: Record<
  KpiTone,
  { card: string; value: string; badge: string }
> = {
  default: {
    card: "bg-surface border-border",
    value: "text-text-primary",
    badge: "bg-subtle text-text-secondary",
  },
  brand: {
    card: "bg-brand-tint/60 border-indigo-200",
    value: "text-brand",
    badge: "bg-white text-brand border border-indigo-200",
  },
  safe: {
    card: "bg-safe-bg/70 border-emerald-200",
    value: "text-safe",
    badge: "bg-white text-safe border border-emerald-200",
  },
  warn: {
    card: "bg-warn-bg/80 border-amber-200",
    value: "text-warn",
    badge: "bg-white text-warn border border-amber-200",
  },
  danger: {
    card: "bg-danger-bg/80 border-red-200",
    value: "text-danger",
    badge: "bg-white text-danger border border-red-200",
  },
};

/**
 * Shared 4-card KPI bento grid using Ledger Slate & Trust Indigo tokens.
 * All financial and hour figures enforce `font-mono tabular-nums`.
 */
export function KpiBentoGrid({
  cards = DEFAULT_VASTRAKART_CARDS,
  className = "",
}: KpiBentoGridProps) {
  return (
    <section
      aria-label="Key project metrics"
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {cards.map((card) => {
        const tone = TONE_STYLES[card.tone ?? "default"];
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className={`rounded-xl border p-4 shadow-xs transition-colors ${tone.card}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-text-secondary">
                {card.label}
              </span>
              {Icon && (
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone.badge}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
            <div
              className={`mt-2.5 kpi-number font-mono tabular-nums tracking-tight ${tone.value}`}
            >
              {card.value}
            </div>
            {card.sublabel && (
              <p className="mt-1.5 text-xs text-text-muted font-mono tabular-nums">
                {card.sublabel}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default KpiBentoGrid;
