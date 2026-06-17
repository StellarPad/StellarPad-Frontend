"use client";

import * as React from "react";
import { Lock, Clock, Home, ShieldCheck, Unlock, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type EscrowStatus = "locked" | "active" | "checkout" | "released" | "disputed";

interface EscrowStage {
  id: EscrowStatus;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  ring: string;
  bgActive: string;
}

interface SmartEscrowVisualizerProps {
  depositAmount?: string;
  currency?: string;
  /** Demo prop — lets parent drive the active stage */
  initialStage?: EscrowStatus;
}

// ─── Stage definitions ────────────────────────────────────────────────────────

const STAGES: EscrowStage[] = [
  {
    id: "locked",
    label: "Deposit Locked",
    sublabel: "Tenant funds held in Soroban contract",
    icon: <Lock className="h-5 w-5" />,
    color: "text-blue-300",
    ring: "ring-blue-500",
    bgActive: "bg-blue-500/20",
  },
  {
    id: "active",
    label: "Stay Active",
    sublabel: "Smart contract monitors lease conditions",
    icon: <Home className="h-5 w-5" />,
    color: "text-gold-300",
    ring: "ring-gold-400",
    bgActive: "bg-gold-400/15",
  },
  {
    id: "checkout",
    label: "Checkout Initiated",
    sublabel: "On-chain verification in progress",
    icon: <Clock className="h-5 w-5" />,
    color: "text-amber-300",
    ring: "ring-amber-400",
    bgActive: "bg-amber-400/10",
  },
  {
    id: "released",
    label: "Deposit Released",
    sublabel: "Funds auto-returned to tenant wallet",
    icon: <Unlock className="h-5 w-5" />,
    color: "text-emerald-300",
    ring: "ring-emerald-400",
    bgActive: "bg-emerald-400/10",
  },
];

const STAGE_ORDER: EscrowStatus[] = ["locked", "active", "checkout", "released"];

// ─── Component ────────────────────────────────────────────────────────────────

export function SmartEscrowVisualizer({
  depositAmount = "1,200.00",
  currency = "USDC",
  initialStage = "locked",
}: SmartEscrowVisualizerProps) {
  const [activeStage, setActiveStage] = React.useState<EscrowStatus>(initialStage);
  const [disputed, setDisputed] = React.useState(false);

  const activeIdx = STAGE_ORDER.indexOf(activeStage);

  const advance = () => {
    const next = STAGE_ORDER[activeIdx + 1];
    if (next) setActiveStage(next);
  };

  const handleDispute = () => {
    setDisputed(true);
    setActiveStage("disputed");
  };

  const handleReset = () => {
    setDisputed(false);
    setActiveStage("locked");
  };

  return (
    <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-6 shadow-xl shadow-black/20 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Soroban Smart Escrow</p>
          <h3 className="text-xl font-semibold text-foreground">Deposit Protection Timeline</h3>
          <p className="text-sm text-blue-300">Funds held trustlessly on-chain — no landlord can withhold unfairly.</p>
        </div>

        {/* Deposit badge */}
        <div className="rounded-2xl border border-blue-800 bg-blue-900/60 px-5 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400">Locked deposit</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">
            {depositAmount}{" "}
            <span className="text-base font-semibold text-emerald-300">{currency}</span>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mb-8">
        {/* Connecting line */}
        <div className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-0.5 bg-blue-800/60 sm:block" />

        <div className="space-y-4">
          {STAGES.map((stage, idx) => {
            const isActive = stage.id === activeStage && !disputed;
            const isDone = idx < activeIdx && !disputed;
            const isFuture = idx > activeIdx || disputed;

            return (
              <div
                key={stage.id}
                className={cn(
                  "relative flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300",
                  isActive
                    ? `border-blue-700 ${stage.bgActive}`
                    : isDone
                    ? "border-blue-800/40 bg-blue-900/20 opacity-70"
                    : "border-blue-800/30 bg-transparent opacity-40",
                )}
              >
                {/* Icon */}
                <span
                  className={cn(
                    "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-2",
                    isActive ? `${stage.ring} ${stage.bgActive}` : isDone ? "bg-emerald-500/15 ring-emerald-500" : "bg-blue-900/40 ring-blue-800",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <span className={isActive ? stage.color : "text-blue-600"}>{stage.icon}</span>
                  )}
                </span>

                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn("font-semibold", isActive ? "text-foreground" : "text-blue-400")}>
                      {stage.label}
                    </p>
                    {isActive && (
                      <span className="animate-pulse rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-blue-300 ring-1 ring-blue-500/40">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-blue-400">{stage.sublabel}</p>
                  {isActive && stage.id === "locked" && (
                    <p className="mt-2 text-xs text-blue-500">
                      Contract address: <span className="font-mono text-blue-400">CAAR…X7KQ</span>
                    </p>
                  )}
                  {isActive && stage.id === "released" && (
                    <p className="mt-2 text-xs text-emerald-400">
                      ✓ Tx hash: <span className="font-mono">3e8f…a291</span> confirmed in 4s
                    </p>
                  )}
                </div>

                {/* Step number */}
                <span className="text-xs text-blue-700">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}

          {/* Disputed state */}
          {disputed && (
            <div className="flex items-start gap-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/20 ring-2 ring-red-500">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </span>
              <div>
                <p className="font-semibold text-red-300">Dispute Raised</p>
                <p className="mt-0.5 text-sm text-red-400/80">
                  Arbitration in progress via Soroban multi-sig. Funds remain frozen until resolution.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        {!disputed && activeStage !== "released" && (
          <button
            type="button"
            onClick={advance}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <ShieldCheck className="h-4 w-4" />
            {activeStage === "locked" ? "Confirm Check-In" : activeStage === "active" ? "Initiate Checkout" : "Release Deposit"}
          </button>
        )}

        {!disputed && activeStage !== "released" && (
          <button
            type="button"
            onClick={handleDispute}
            className="flex items-center gap-2 rounded-2xl border border-red-700/60 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:border-red-500 hover:text-red-200"
          >
            <AlertTriangle className="h-4 w-4" />
            Raise Dispute
          </button>
        )}

        {(disputed || activeStage === "released") && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-blue-700 px-5 py-2.5 text-sm text-blue-300 transition hover:border-blue-500 hover:text-foreground"
          >
            Reset Demo
          </button>
        )}
      </div>

      {/* Trust note */}
      <div className="mt-6 rounded-2xl border border-blue-800/40 bg-blue-900/30 px-5 py-3">
        <p className="text-xs text-blue-400">
          <span className="font-semibold text-blue-300">How it works:</span> Deposit is locked in a Soroban smart contract at booking. The contract automatically releases funds to the tenant after a dispute-free checkout, or routes to arbitration if a claim is raised — <span className="text-foreground">no landlord can arbitrarily withhold your deposit.</span>
        </p>
      </div>
    </div>
  );
}
