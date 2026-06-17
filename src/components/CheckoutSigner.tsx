"use client";

import * as React from "react";
import {
  FileText, ShieldCheck, Wallet, CheckCircle2,
  Loader2, AlertTriangle, ExternalLink, Lock,
} from "lucide-react";
import { useWallet } from "@/context/wallet-context";
import { useAppMode, type TransactionMode } from "@/context/app-mode-context";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SignStep = "review" | "signing" | "broadcasting" | "confirmed" | "failed";

interface DeedClause {
  label: string;
  value: string;
}

interface CheckoutSignerProps {
  propertyTitle: string;
  propertyId: string;
  amount: string;
  currency?: string;
}

// ─── XDR placeholder builder ──────────────────────────────────────────────────

function buildMockXdr(mode: TransactionMode, propertyId: string, amount: string): string {
  // Placeholder — replace with real @stellar/stellar-sdk TransactionBuilder
  const payload = btoa(`stellarpad:${mode}:${propertyId}:${amount}:${Date.now()}`);
  return `AAAAAgAAAA${payload.slice(0, 40)}AAAAAAAAAA==`;
}

// ─── Deed content per mode ────────────────────────────────────────────────────

function getDeedClauses(mode: TransactionMode, props: CheckoutSignerProps): DeedClause[] {
  const base: DeedClause[] = [
    { label: "Property", value: props.propertyTitle },
    { label: "Property ID", value: props.propertyId },
    { label: "Amount", value: `${props.amount} ${props.currency ?? "USDC"}` },
    { label: "Network", value: "Stellar Testnet" },
    { label: "Protocol", value: "StellarPad v1 · Soroban Contract" },
  ];
  if (mode === "short-term") return [
    ...base,
    { label: "Type", value: "Short-Term Stay Agreement" },
    { label: "Security deposit", value: `Locked in Soroban escrow · auto-released on checkout` },
    { label: "Cancellation", value: "48-hour refund window enforced by contract" },
  ];
  if (mode === "long-term") return [
    ...base,
    { label: "Type", value: "Residential Lease Agreement" },
    { label: "Payment stream", value: "Monthly USDC auto-transfer via Stellar payments" },
    { label: "Lease term", value: "12 months · renewable on-chain" },
    { label: "Security deposit", value: "2× monthly rent · Soroban escrow" },
  ];
  return [
    ...base,
    { label: "Type", value: "Property Purchase Deed" },
    { label: "Title transfer", value: "Cryptographic on-chain deed NFT issued on confirmation" },
    { label: "Closing cost", value: "~$0.00 (Stellar network fee only)" },
  ];
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <span className={cn(
      "flex h-2.5 w-2.5 rounded-full transition-all",
      done ? "bg-emerald-400" : active ? "animate-pulse bg-blue-400" : "bg-blue-800",
    )} />
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CheckoutSigner({
  propertyTitle,
  propertyId,
  amount,
  currency = "USDC",
}: CheckoutSignerProps) {
  const { mode } = useAppMode();
  const { connected, address, provider } = useWallet();

  const [step, setStep] = React.useState<SignStep>("review");
  const [txHash, setTxHash] = React.useState<string | null>(null);
  const [xdr] = React.useState(() => buildMockXdr(mode, propertyId, amount));

  const clauses = getDeedClauses(mode, { propertyTitle, propertyId, amount, currency });

  const modeLabel =
    mode === "short-term" ? "Stay Agreement" :
    mode === "long-term"  ? "Lease Deed" :
                            "Purchase Deed";

  const handleSign = async () => {
    if (!connected) return;
    setStep("signing");
    await new Promise((r) => setTimeout(r, 1400)); // wallet prompt simulation
    setStep("broadcasting");
    await new Promise((r) => setTimeout(r, 1200)); // Stellar network simulation
    // 5% simulated failure rate for realism
    if (Math.random() < 0.05) { setStep("failed"); return; }
    const hash = `${Math.random().toString(16).slice(2, 10)}…${Math.random().toString(16).slice(2, 10)}`;
    setTxHash(hash);
    setStep("confirmed");
  };

  const handleRetry = () => { setStep("review"); setTxHash(null); };

  return (
    <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-6 shadow-xl shadow-black/20 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Cryptographic Signing</p>
          <h3 className="text-xl font-semibold text-foreground">{modeLabel}</h3>
          <p className="text-sm text-blue-300">Review and sign your agreement on the Stellar network.</p>
        </div>
        <FileText className="h-6 w-6 shrink-0 text-blue-400" />
      </div>

      {/* Progress dots */}
      <div className="mb-6 flex items-center gap-2">
        {(["review", "signing", "broadcasting", "confirmed"] as const).map((s) => (
          <React.Fragment key={s}>
            <StepDot active={step === s} done={
              step === "confirmed" || (step === "broadcasting" && s === "signing") ||
              (step === "signing" && false)
            } />
            {s !== "confirmed" && <span className="h-px flex-1 bg-blue-800/60" />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Review step ── */}
      {step === "review" && (
        <>
          <div className="mb-6 space-y-2 rounded-2xl border border-blue-800/50 bg-blue-900/30 p-5">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-400">
              <Lock className="h-3.5 w-3.5" />
              Deed contents · read carefully
            </div>
            {clauses.map((c) => (
              <div key={c.label} className="flex flex-col gap-0.5 border-b border-blue-800/30 pb-2 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-4">
                <span className="shrink-0 text-xs text-blue-400">{c.label}</span>
                <span className="text-xs font-medium text-foreground sm:text-right">{c.value}</span>
              </div>
            ))}
          </div>

          {/* XDR preview */}
          <div className="mb-6 space-y-1.5">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Transaction XDR envelope</p>
            <div className="overflow-x-auto rounded-2xl border border-blue-800/40 bg-blue-950 px-4 py-3">
              <code className="break-all font-mono text-[10px] text-blue-400">{xdr}</code>
            </div>
          </div>

          {/* Wallet status */}
          {!connected ? (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-700/40 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Connect a wallet to sign this transaction.
            </div>
          ) : (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-700/40 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>
                Signing with <span className="font-semibold">{provider}</span> ·{" "}
                <span className="font-mono text-xs">{address?.slice(0, 8)}…{address?.slice(-4)}</span>
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSign}
            disabled={!connected}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-40"
          >
            <Wallet className="h-4 w-4" />
            Sign & Submit {modeLabel}
          </button>
        </>
      )}

      {/* ── Signing / broadcasting ── */}
      {(step === "signing" || step === "broadcasting") && (
        <div className="flex flex-col items-center gap-6 py-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/15 ring-2 ring-blue-500/30">
            <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
          </span>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">
              {step === "signing" ? "Awaiting Wallet Signature…" : "Broadcasting to Stellar Network…"}
            </p>
            <p className="text-sm text-blue-400">
              {step === "signing"
                ? `Approve the transaction in your ${provider} wallet.`
                : "Submitting signed XDR to Horizon. Usually confirms in ~5 seconds."}
            </p>
          </div>
        </div>
      )}

      {/* ── Confirmed ── */}
      {step === "confirmed" && (
        <div className="flex flex-col items-center gap-6 py-6 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-2 ring-emerald-500/30">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </span>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">{modeLabel} Signed & Confirmed</p>
            <p className="text-sm text-blue-300">Your agreement is permanently recorded on the Stellar ledger.</p>
          </div>
          <div className="w-full space-y-2 rounded-2xl border border-blue-800 bg-blue-900/40 px-5 py-4 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-400">Transaction hash</span>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-mono text-xs text-blue-300 transition hover:text-foreground"
              >
                {txHash}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-400">Status</span>
              <span className="text-emerald-300">Finalized · ~4s</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-400">Network fee paid</span>
              <span className="text-foreground">~$0.00001</span>
            </div>
          </div>
          {mode === "buy" && (
            <p className="text-sm text-blue-300">
              Your on-chain deed NFT will appear in your wallet within the next ledger close.
            </p>
          )}
        </div>
      )}

      {/* ── Failed ── */}
      {step === "failed" && (
        <div className="flex flex-col items-center gap-6 py-6 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 ring-2 ring-red-500/30">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </span>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">Transaction Rejected</p>
            <p className="text-sm text-blue-300">The Stellar network returned an error. Your funds were not moved.</p>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-2xl border border-blue-700 px-6 py-2.5 text-sm text-blue-300 transition hover:border-blue-500 hover:text-foreground"
          >
            Review &amp; Retry
          </button>
        </div>
      )}
    </div>
  );
}
