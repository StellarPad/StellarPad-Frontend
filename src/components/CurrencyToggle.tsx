"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

export type DisplayCurrency = "USD" | "USDC" | "EUR" | "EURC" | "XLM";

interface CurrencyContextValue {
  display: DisplayCurrency;
  setDisplay: (c: DisplayCurrency) => void;
  convert: (usdAmount: number) => string;
}

const CurrencyContext = React.createContext<CurrencyContextValue | undefined>(undefined);

// Simulated rates (replace with real feed)
const RATES: Record<DisplayCurrency, { symbol: string; rate: number }> = {
  USD:  { symbol: "$",    rate: 1 },
  USDC: { symbol: "USDC ", rate: 1 },
  EUR:  { symbol: "€",    rate: 0.92 },
  EURC: { symbol: "EURC ", rate: 0.92 },
  XLM:  { symbol: "XLM ", rate: 8.33 }, // ~$0.12/XLM
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [display, setDisplay] = React.useState<DisplayCurrency>("USD");

  const convert = React.useCallback((usdAmount: number): string => {
    const { symbol, rate } = RATES[display];
    const converted = usdAmount * rate;
    const formatted = converted >= 1000
      ? converted.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${symbol}${formatted}`;
  }, [display]);

  return (
    <CurrencyContext.Provider value={{ display, setDisplay, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = React.useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

// ─── Toggle widget ────────────────────────────────────────────────────────────

const GROUPS: { label: string; options: DisplayCurrency[] }[] = [
  { label: "Fiat", options: ["USD", "EUR"] },
  { label: "Stablecoin", options: ["USDC", "EURC"] },
  { label: "Native", options: ["XLM"] },
];

export function CurrencyToggle({ compact = false }: { compact?: boolean }) {
  const { display, setDisplay } = useCurrency();

  if (compact) {
    // Cycles through USD → USDC → EUR → EURC → XLM
    const all: DisplayCurrency[] = ["USD", "USDC", "EUR", "EURC", "XLM"];
    const next = all[(all.indexOf(display) + 1) % all.length];
    return (
      <button type="button" onClick={() => setDisplay(next)}
        className="flex items-center gap-1.5 rounded-full border border-blue-700 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-blue-500">
        <RefreshCw className="h-3 w-3 text-blue-400" />
        {display}
      </button>
    );
  }

  return (
    <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-5">
      <p className="mb-4 text-xs uppercase tracking-[0.24em] text-blue-400">Display Currency</p>
      <div className="space-y-3">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-blue-600">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((opt) => (
                <button key={opt} type="button" onClick={() => setDisplay(opt)}
                  className={cn("rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                    display === opt
                      ? "border-gold-400/60 bg-gold-400/10 text-gold-300"
                      : "border-blue-800 bg-blue-900/40 text-blue-300 hover:border-blue-600"
                  )}>
                  {opt} <span className="text-blue-500">{RATES[opt].symbol.trim()}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-blue-800/40 bg-blue-900/20 px-4 py-3 text-xs text-blue-400">
        Prices shown across all listings will update instantly. Rates are indicative.
      </div>
    </div>
  );
}
