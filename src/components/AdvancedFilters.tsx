"use client";

import * as React from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { useAppMode, type TransactionMode } from "@/context/app-mode-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterState {
  priceMin: string;
  priceMax: string;
  beds: number | null;
  baths: number | null;
  // short-term specific
  maxGuests: number | null;
  instantBook: boolean;
  petsAllowed: boolean;
  // long-term specific
  utilitiesIncluded: boolean;
  furnished: boolean;
  leaseTermMonths: string;
  // buy specific
  yearBuiltMin: string;
  lotSizeMin: string;
  propertyType: string;
  parkingSpaces: number | null;
}

const DEFAULT_FILTERS: FilterState = {
  priceMin: "",
  priceMax: "",
  beds: null,
  baths: null,
  maxGuests: null,
  instantBook: false,
  petsAllowed: false,
  utilitiesIncluded: false,
  furnished: false,
  leaseTermMonths: "",
  yearBuiltMin: "",
  lotSizeMin: "",
  propertyType: "",
  parkingSpaces: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CountPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const options = [null, 1, 2, 3, 4, 5];
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-blue-400">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt ?? "any"}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "min-w-[2.5rem] rounded-2xl border px-3 py-1.5 text-sm font-medium transition",
              value === opt
                ? "border-gold-400 bg-gold-400/10 text-gold-300"
                : "border-blue-800 bg-blue-900/60 text-blue-200 hover:border-blue-600",
            )}
          >
            {opt === null ? "Any" : opt === 5 ? "5+" : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
        checked
          ? "border-gold-400/60 bg-gold-400/5 text-foreground"
          : "border-blue-800 bg-blue-900/50 text-blue-200 hover:border-blue-600",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
          checked ? "border-gold-400 bg-gold-400" : "border-blue-600",
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-blue-950">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="block text-xs text-blue-400">{description}</span>}
      </span>
    </button>
  );
}

function RangeRow({
  label,
  prefix,
  min,
  max,
  onMinChange,
  onMaxChange,
  placeholder,
}: {
  label: string;
  prefix: string;
  min: string;
  max: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  placeholder?: [string, string];
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-blue-400">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        {(["min", "max"] as const).map((side) => (
          <div key={side} className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-blue-400">
              {prefix}
            </span>
            <input
              type="number"
              min={0}
              value={side === "min" ? min : max}
              onChange={(e) => (side === "min" ? onMinChange : onMaxChange)(e.target.value)}
              placeholder={placeholder?.[side === "min" ? 0 : 1] ?? (side === "min" ? "Min" : "Max")}
              className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 py-2.5 pl-7 pr-3 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mode-specific filter panels ─────────────────────────────────────────────

function ShortTermFilters({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}) {
  return (
    <>
      <CountPicker
        label="Max guests"
        value={filters.maxGuests}
        onChange={(v) => setFilters((p) => ({ ...p, maxGuests: v }))}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label="Instant Book"
          description="No approval needed"
          checked={filters.instantBook}
          onChange={(v) => setFilters((p) => ({ ...p, instantBook: v }))}
        />
        <Toggle
          label="Pets Allowed"
          description="Bring your furry friends"
          checked={filters.petsAllowed}
          onChange={(v) => setFilters((p) => ({ ...p, petsAllowed: v }))}
        />
      </div>
    </>
  );
}

function LongTermFilters({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}) {
  const leaseOptions = ["", "3", "6", "12", "24"];
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label="Utilities Included"
          description="Water, gas, electricity"
          checked={filters.utilitiesIncluded}
          onChange={(v) => setFilters((p) => ({ ...p, utilitiesIncluded: v }))}
        />
        <Toggle
          label="Furnished"
          description="Move-in ready"
          checked={filters.furnished}
          onChange={(v) => setFilters((p) => ({ ...p, furnished: v }))}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Lease term (months)</p>
        <div className="flex flex-wrap gap-2">
          {leaseOptions.map((opt) => (
            <button
              key={opt || "any"}
              type="button"
              onClick={() => setFilters((p) => ({ ...p, leaseTermMonths: opt }))}
              className={cn(
                "min-w-[2.5rem] rounded-2xl border px-3 py-1.5 text-sm font-medium transition",
                filters.leaseTermMonths === opt
                  ? "border-gold-400 bg-gold-400/10 text-gold-300"
                  : "border-blue-800 bg-blue-900/60 text-blue-200 hover:border-blue-600",
              )}
            >
              {opt === "" ? "Any" : `${opt}mo`}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function BuyFilters({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}) {
  const propertyTypes = ["", "House", "Condo", "Townhouse", "Land", "Multi-family"];
  return (
    <>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Property type</p>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((t) => (
            <button
              key={t || "any"}
              type="button"
              onClick={() => setFilters((p) => ({ ...p, propertyType: t }))}
              className={cn(
                "rounded-2xl border px-3 py-1.5 text-sm font-medium transition",
                filters.propertyType === t
                  ? "border-gold-400 bg-gold-400/10 text-gold-300"
                  : "border-blue-800 bg-blue-900/60 text-blue-200 hover:border-blue-600",
              )}
            >
              {t === "" ? "Any" : t}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Year built (min)</p>
          <input
            type="number"
            min={1800}
            max={2025}
            value={filters.yearBuiltMin}
            onChange={(e) => setFilters((p) => ({ ...p, yearBuiltMin: e.target.value }))}
            placeholder="e.g. 1990"
            className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-3 py-2.5 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Lot size (min sq ft)</p>
          <input
            type="number"
            min={0}
            value={filters.lotSizeMin}
            onChange={(e) => setFilters((p) => ({ ...p, lotSizeMin: e.target.value }))}
            placeholder="e.g. 5000"
            className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-3 py-2.5 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <CountPicker
        label="Parking spaces"
        value={filters.parkingSpaces}
        onChange={(v) => setFilters((p) => ({ ...p, parkingSpaces: v }))}
      />
    </>
  );
}

// ─── Mode labels ──────────────────────────────────────────────────────────────

const PRICE_LABELS: Record<TransactionMode, { label: string; prefix: string; placeholder: [string, string] }> = {
  "short-term": { label: "Nightly rate (USD)", prefix: "$", placeholder: ["50", "1,000"] },
  "long-term": { label: "Monthly rent (USD)", prefix: "$", placeholder: ["500", "10,000"] },
  buy: { label: "Sale price (USD)", prefix: "$", placeholder: ["100,000", "5,000,000"] },
};

function activeFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.priceMin) count++;
  if (filters.priceMax) count++;
  if (filters.beds !== null) count++;
  if (filters.baths !== null) count++;
  if (filters.maxGuests !== null) count++;
  if (filters.instantBook) count++;
  if (filters.petsAllowed) count++;
  if (filters.utilitiesIncluded) count++;
  if (filters.furnished) count++;
  if (filters.leaseTermMonths) count++;
  if (filters.yearBuiltMin) count++;
  if (filters.lotSizeMin) count++;
  if (filters.propertyType) count++;
  if (filters.parkingSpaces !== null) count++;
  return count;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdvancedFilters() {
  const { mode } = useAppMode();
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);

  const activeCount = activeFilterCount(filters);
  const priceConfig = PRICE_LABELS[mode];

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950/90 shadow-xl shadow-black/20">
      {/* Header / trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-blue-400" />
          <span className="font-semibold text-foreground">Advanced Filters</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-gold-400/20 px-2 py-0.5 text-xs font-semibold text-gold-300 ring-1 ring-gold-400/30">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="flex items-center gap-1.5 rounded-full border border-blue-700 px-3 py-1 text-xs text-blue-300 transition hover:border-blue-500 hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Reset
            </button>
          )}
          {open ? (
            <ChevronUp className="h-4 w-4 text-blue-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-400" />
          )}
        </div>
      </button>

      {/* Collapsible body */}
      {open && (
        <div className="border-t border-blue-800/60 px-6 pb-6 pt-5">
          {/* Mode badge */}
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-blue-400">
            Filters for{" "}
            <span className="text-gold-300">
              {mode === "short-term" ? "Short-Term Stays" : mode === "long-term" ? "Long-Term Rentals" : "Property Sales"}
            </span>
          </p>

          <div className="space-y-6">
            {/* Price range — always shown */}
            <RangeRow
              label={priceConfig.label}
              prefix={priceConfig.prefix}
              min={filters.priceMin}
              max={filters.priceMax}
              onMinChange={(v) => setFilters((p) => ({ ...p, priceMin: v }))}
              onMaxChange={(v) => setFilters((p) => ({ ...p, priceMax: v }))}
              placeholder={priceConfig.placeholder}
            />

            {/* Beds / baths — always shown */}
            <div className="grid gap-6 sm:grid-cols-2">
              <CountPicker
                label="Bedrooms"
                value={filters.beds}
                onChange={(v) => setFilters((p) => ({ ...p, beds: v }))}
              />
              <CountPicker
                label="Bathrooms"
                value={filters.baths}
                onChange={(v) => setFilters((p) => ({ ...p, baths: v }))}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-blue-800/40" />

            {/* Mode-specific filters */}
            {mode === "short-term" && <ShortTermFilters filters={filters} setFilters={setFilters} />}
            {mode === "long-term" && <LongTermFilters filters={filters} setFilters={setFilters} />}
            {mode === "buy" && <BuyFilters filters={filters} setFilters={setFilters} />}

            {/* Apply button */}
            <Button variant="primary" className="w-full sm:w-auto">
              Apply filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
