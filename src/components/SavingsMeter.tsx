"use client";

import * as React from "react";
import { TrendingDown, DollarSign, RefreshCw } from "lucide-react";
import { useAppMode, type TransactionMode } from "@/context/app-mode-context";
import { cn } from "@/lib/utils";

// ─── Config per mode ──────────────────────────────────────────────────────────

interface ModeConfig {
  label: string;
  competitorName: string;
  competitorFee: number; // percentage
  stellarFee: number;    // percentage (our platform fee — essentially 0)
  defaultDeal: number;
  dealLabel: string;
  dealPrefix: string;
}

const MODE_CONFIG: Record<TransactionMode, ModeConfig> = {
  "short-term": {
    label: "Short-Term Stay",
    competitorName: "Airbnb",
    competitorFee: 14.2,
    stellarFee: 0,
    defaultDeal: 800,
    dealLabel: "Total booking value",
    dealPrefix: "$",
  },
  "long-term": {
    label: "Long-Term Lease",
    competitorName: "Zillow / Apartments.com",
    competitorFee: 8.5,
    stellarFee: 0,
    defaultDeal: 18000,
    dealLabel: "Annual rent",
    dealPrefix: "$",
  },
  buy: {
    label: "Property Sale",
    competitorName: "Traditional Broker",
    competitorFee: 6.0,
    stellarFee: 0,
    defaultDeal: 750000,
    dealLabel: "Property sale price",
    dealPrefix: "$",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function SavingsBar({ pct }: { pct: number }) {
  // pct = savings as % of competitor fee (always 100% since stellarFee=0)
  return (
    <div className="relative h-4 overflow-hidden rounded-full bg-blue-800/60">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SavingsMeter() {
  const { mode } = useAppMode();
  const cfg = MODE_CONFIG[mode];

  const [dealValue, setDealValue] = React.useState(cfg.defaultDeal);
  const [inputStr, setInputStr] = React.useState(String(cfg.defaultDeal));

  // Sync defaults when mode changes
  React.useEffect(() => {
    setDealValue(cfg.defaultDeal);
    setInputStr(String(cfg.defaultDeal));
  }, [mode, cfg.defaultDeal]);

  const competitorFeeAmt = (dealValue * cfg.competitorFee) / 100;
  const stellarFeeAmt = dealValue * 0.00001; // Stellar network fee placeholder ~$0.00001
  const savings = competitorFeeAmt - stellarFeeAmt;
  const savingsPct = competitorFeeAmt > 0 ? (savings / competitorFeeAmt) * 100 : 0;

  const handleInput = (v: string) => {
    setInputStr(v);
    const n = parseFloat(v.replace(/,/g, ""));
    if (!isNaN(n) && n > 0) setDealValue(n);
  };

  const handleReset = () => {
    setDealValue(cfg.defaultDeal);
    setInputStr(String(cfg.defaultDeal));
  };

  return (
    <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-6 shadow-xl shadow-black/20 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Fee Savings Calculator</p>
          <h3 className="text-xl font-semibold text-foreground">See exactly what you save on StellarPad</h3>
          <p className="text-sm text-blue-300">
            Compared to <span className="text-foreground">{cfg.competitorName}</span> charging{" "}
            <span className="text-red-400 font-semibold">{cfg.competitorFee}%</span>
          </p>
        </div>
        <TrendingDown className="h-8 w-8 text-emerald-400 opacity-80" />
      </div>

      {/* Input */}
      <div className="mb-6 space-y-2">
        <label className="block text-xs uppercase tracking-[0.2em] text-blue-400">{cfg.dealLabel}</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-blue-400">
              <DollarSign className="h-4 w-4" />
            </span>
            <input
              type="number"
              min={1}
              value={inputStr}
              onChange={(e) => handleInput(e.target.value)}
              className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 py-3 pl-10 pr-4 text-base font-semibold text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-blue-700 p-3 text-blue-400 transition hover:border-blue-500 hover:text-foreground"
            aria-label="Reset"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Comparison rows */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {/* Competitor */}
        <div className="rounded-2xl border border-red-800/40 bg-red-500/5 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-400">{cfg.competitorName}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-red-300">
            ${fmt(competitorFeeAmt)}
          </p>
          <p className="mt-1 text-xs text-red-400/80">{cfg.competitorFee}% platform fee</p>
        </div>

        {/* StellarPad */}
        <div className="rounded-2xl border border-emerald-800/40 bg-emerald-500/5 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">StellarPad</p>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-300">
            ~${stellarFeeAmt < 0.01 ? "0.00" : fmt(stellarFeeAmt)}
          </p>
          <p className="mt-1 text-xs text-emerald-400/80">Stellar network fee only (~$0.00001)</p>
        </div>
      </div>

      {/* Savings bar */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-300">Your savings</span>
          <span className="font-semibold text-emerald-300">{savingsPct.toFixed(1)}% less</span>
        </div>
        <SavingsBar pct={savingsPct} />
      </div>

      {/* Big savings callout */}
      <div className="flex items-center justify-between rounded-2xl border border-emerald-700/40 bg-emerald-500/8 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">You keep</p>
          <p className="mt-1 font-mono text-3xl font-bold text-emerald-300">${fmt(savings)}</p>
        </div>
        <div className="text-right text-sm text-blue-300">
          <p>On every <span className="text-foreground font-semibold">{cfg.label}</span></p>
          <p className="mt-1 text-xs text-blue-400">powered by Stellar's sub-cent fees</p>
        </div>
      </div>
    </div>
  );
}
