"use client";

import * as React from "react";
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Wifi, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TxState = "idle" | "awaiting-signature" | "broadcasting" | "success" | "error" | "rejected";

export interface TxFeedbackOptions {
  state: TxState;
  message?: string;
  txHash?: string;
  onDismiss?: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface TxFeedbackContextValue {
  show: (opts: TxFeedbackOptions) => void;
  dismiss: () => void;
}

const TxFeedbackContext = React.createContext<TxFeedbackContextValue | undefined>(undefined);

export function TxFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = React.useState<TxFeedbackOptions | null>(null);

  const show = React.useCallback((opts: TxFeedbackOptions) => setCurrent(opts), []);
  const dismiss = React.useCallback(() => setCurrent(null), []);

  // Auto-dismiss success after 4s
  React.useEffect(() => {
    if (current?.state === "success") {
      const t = setTimeout(dismiss, 4000);
      return () => clearTimeout(t);
    }
  }, [current?.state, dismiss]);

  return (
    <TxFeedbackContext.Provider value={{ show, dismiss }}>
      {children}
      {current && <TxToast opts={current} onDismiss={dismiss} />}
    </TxFeedbackContext.Provider>
  );
}

export function useTxFeedback() {
  const ctx = React.useContext(TxFeedbackContext);
  if (!ctx) throw new Error("useTxFeedback must be used within TxFeedbackProvider");
  return ctx;
}

// ─── Toast config ─────────────────────────────────────────────────────────────

const STATE_CONFIG: Record<Exclude<TxState, "idle">, {
  icon: React.ReactNode; label: string; border: string; bg: string;
}> = {
  "awaiting-signature": {
    icon: <Loader2 className="h-5 w-5 animate-spin text-blue-400" />,
    label: "Awaiting Wallet Signature…",
    border: "border-blue-700/60", bg: "bg-blue-900/90",
  },
  broadcasting: {
    icon: <Wifi className="h-5 w-5 animate-pulse text-gold-300" />,
    label: "Broadcasting to Stellar Network…",
    border: "border-gold-600/40", bg: "bg-blue-900/90",
  },
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    label: "Transaction Confirmed",
    border: "border-emerald-700/50", bg: "bg-emerald-500/8",
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-400" />,
    label: "Transaction Failed",
    border: "border-red-700/50", bg: "bg-red-500/8",
  },
  rejected: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    label: "Signature Rejected",
    border: "border-amber-700/50", bg: "bg-amber-500/8",
  },
};

// ─── Toast component ──────────────────────────────────────────────────────────

function TxToast({ opts, onDismiss }: { opts: TxFeedbackOptions; onDismiss: () => void }) {
  if (opts.state === "idle") return null;
  const cfg = STATE_CONFIG[opts.state];

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-[100] w-80 rounded-2xl border p-4 shadow-2xl shadow-black/50 backdrop-blur-md transition-all",
      cfg.border, cfg.bg
    )}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{cfg.label}</p>
          {opts.message && <p className="mt-0.5 text-xs text-blue-300">{opts.message}</p>}
          {opts.txHash && (
            <a href={`https://stellar.expert/explorer/testnet/tx/${opts.txHash}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-1 block font-mono text-xs text-blue-400 hover:text-blue-200 truncate">
              {opts.txHash}
            </a>
          )}
        </div>
        <button type="button" onClick={onDismiss}
          className="shrink-0 rounded-full p-1 text-blue-500 hover:bg-blue-800/60 hover:text-foreground transition">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {/* Progress bar for broadcasting */}
      {(opts.state === "broadcasting" || opts.state === "awaiting-signature") && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-blue-800/50">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
        </div>
      )}
    </div>
  );
}

// ─── Demo panel (for showcase) ────────────────────────────────────────────────

export function TxFeedbackDemo() {
  const { show } = useTxFeedback();

  const demos: { label: string; opts: TxFeedbackOptions }[] = [
    { label: "Awaiting Signature", opts: { state: "awaiting-signature", message: "Approve in your Freighter wallet." } },
    { label: "Broadcasting", opts: { state: "broadcasting", message: "Submitting signed XDR to Horizon." } },
    { label: "Success", opts: { state: "success", message: "Escrow created.", txHash: "3e8f…a291" } },
    { label: "Error", opts: { state: "error", message: "Insufficient fee. Try increasing the base fee." } },
    { label: "Rejected", opts: { state: "rejected", message: "User cancelled the signing request." } },
  ];

  return (
    <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-6 sm:p-8">
      <p className="mb-2 text-xs uppercase tracking-[0.28em] text-blue-400">Transaction States</p>
      <h3 className="mb-1 text-xl font-semibold text-foreground">Network Feedback Demo</h3>
      <p className="mb-6 text-sm text-blue-300">Tap any state to see the toast notification.</p>
      <div className="flex flex-wrap gap-3">
        {demos.map((d) => (
          <button key={d.label} type="button" onClick={() => show(d.opts)}
            className="rounded-2xl border border-blue-800 bg-blue-900/40 px-4 py-2 text-sm text-blue-200 transition hover:border-blue-600 hover:text-foreground">
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
