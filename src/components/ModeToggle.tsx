"use client";

import { useAppMode, type TransactionMode } from "@/context/app-mode-context";
import { cn } from "@/lib/utils";

const modeOptions: Array<{ key: TransactionMode; label: string; description: string }> = [
  { key: "short-term", label: "Short-Term", description: "Vacation stays" },
  { key: "long-term", label: "Long-Term", description: "Monthly leases" },
  { key: "buy", label: "Buy Property", description: "Direct purchase" },
];

export function ModeToggle() {
  const { mode, setMode } = useAppMode();

  return (
    <div className="rounded-3xl border border-blue-800/80 bg-blue-900/85 p-1 shadow-lg shadow-black/20">
      <div className="grid gap-1 sm:grid-cols-3">
        {modeOptions.map((option) => {
          const active = option.key === mode;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setMode(option.key)}
              className={cn(
                "flex flex-col gap-1 rounded-3xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                active
                  ? "border-accent bg-blue-950 text-foreground shadow-sm shadow-gold-500/10"
                  : "border-transparent bg-blue-900/70 text-blue-200 hover:bg-blue-900/95",
              )}
            >
              <span className="font-semibold">{option.label}</span>
              <span className="text-xs text-blue-400">{option.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
