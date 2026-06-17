"use client";

import * as React from "react";
import {
  Wallet,
  ChevronDown,
  RefreshCw,
  LogOut,
  Copy,
  CheckCheck,
  Loader2,
  Radio,
} from "lucide-react";
import { useWallet } from "@/context/wallet-context";
import type { NetworkId } from "@/context/wallet-context";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

const ASSET_COLORS: Record<string, string> = {
  XLM:  "text-blue-300",
  USDC: "text-emerald-300",
  EURC: "text-gold-300",
};

// ─── Disconnected button (triggers PasskeyModal externally via prop) ──────────

interface WalletWidgetProps {
  onOpenAuth: () => void;
}

export function WalletWidget({ onOpenAuth }: WalletWidgetProps) {
  const { connected, connecting, address, provider, network, balances, disconnect, switchNetwork, refreshBalances } =
    useWallet();
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalances();
    setRefreshing(false);
  };

  const handleNetworkToggle = () => {
    switchNetwork(network === "testnet" ? "mainnet" : "testnet");
  };

  // ── Not connected ──────────────────────────────────────────────────────────
  if (!connected) {
    return (
      <button
        type="button"
        onClick={onOpenAuth}
        disabled={connecting}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
      >
        {connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wallet className="h-3.5 w-3.5" />}
        {connecting ? "Connecting…" : "Connect Wallet"}
      </button>
    );
  }

  // ── Connected ──────────────────────────────────────────────────────────────
  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-full border border-blue-700 bg-blue-900/80 px-3 py-1.5 text-sm text-foreground transition hover:border-blue-500 hover:bg-blue-800/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {/* Network dot */}
        <span className={cn("h-2 w-2 rounded-full", network === "mainnet" ? "bg-emerald-400" : "bg-amber-400")} />
        <span className="max-w-[7rem] truncate font-mono text-xs">{shortAddress(address!)}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-blue-400 transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-[1.5rem] border border-blue-800 bg-blue-950 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="border-b border-blue-800/60 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400">
                  {provider} · {network}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-1 flex items-center gap-1.5 font-mono text-xs text-blue-200 transition hover:text-foreground"
                >
                  <span>{shortAddress(address!)}</span>
                  {copied ? <CheckCheck className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleNetworkToggle}
                className="flex items-center gap-1.5 rounded-full border border-blue-700 px-2.5 py-1 text-[10px] text-blue-300 transition hover:border-blue-500 hover:text-foreground"
              >
                <Radio className="h-3 w-3" />
                {network === "testnet" ? "Switch to Mainnet" : "Switch to Testnet"}
              </button>
            </div>
          </div>

          {/* Balances */}
          <div className="px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400">Asset balances</p>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="rounded-full p-1 text-blue-400 transition hover:bg-blue-800 hover:text-foreground disabled:opacity-40"
              >
                <RefreshCw className={cn("h-3 w-3", refreshing && "animate-spin")} />
              </button>
            </div>
            <div className="space-y-2">
              {balances.length === 0 ? (
                <p className="text-xs text-blue-500">No balances found</p>
              ) : (
                balances.map((b) => (
                  <div key={b.asset} className="flex items-center justify-between rounded-2xl border border-blue-800/60 bg-blue-900/40 px-4 py-2.5">
                    <span className={cn("text-sm font-semibold", ASSET_COLORS[b.asset] ?? "text-foreground")}>
                      {b.asset}
                    </span>
                    <span className="font-mono text-sm text-foreground">{b.balance}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-blue-800/60 px-5 py-3">
            <button
              type="button"
              onClick={() => { disconnect(); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-blue-300 transition hover:bg-blue-800/60 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Disconnect wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
