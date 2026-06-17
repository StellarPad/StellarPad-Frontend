"use client";

import * as React from "react";
import { X, Fingerprint, KeyRound, Wallet, Shield, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMethod = "passkey" | "wallet";
type Step = "choose" | "passkey-register" | "passkey-verify" | "wallet-connect" | "success";

interface PasskeyModalProps {
  open: boolean;
  onClose: () => void;
}

// ─── Wallet options ───────────────────────────────────────────────────────────

const WALLET_OPTIONS = [
  { id: "freighter", label: "Freighter", description: "Official Stellar browser extension" },
  { id: "albedo", label: "Albedo", description: "Web-based Stellar transaction signer" },
];

// ─── Small helpers ────────────────────────────────────────────────────────────

function MethodCard({
  icon,
  title,
  description,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-4 rounded-3xl border border-blue-800 bg-blue-900/60 p-5 text-left transition hover:border-blue-600 hover:bg-blue-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-950 ring-1 ring-blue-800">
        {icon}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{title}</span>
          {badge && (
            <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold-300 ring-1 ring-gold-400/30">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm text-blue-300">{description}</span>
      </span>
      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
    </button>
  );
}

function StatusRow({ icon, label, ok }: { icon?: React.ReactNode; label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={cn("flex h-6 w-6 items-center justify-center rounded-full", ok ? "bg-emerald-500/20" : "bg-blue-800/60")}>
        {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <span className="h-2 w-2 rounded-full bg-blue-600" />}
      </span>
      <span className={ok ? "text-foreground" : "text-blue-400"}>{label}</span>
    </div>
  );
}

// ─── Step views ───────────────────────────────────────────────────────────────

function ChooseStep({ onSelect }: { onSelect: (m: AuthMethod) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">Sign in to StellarPad</h2>
        <p className="text-sm text-blue-300">No passwords. No seed phrases required to get started.</p>
      </div>

      <div className="space-y-3 pt-2">
        <MethodCard
          icon={<Fingerprint className="h-5 w-5 text-gold-300" />}
          title="Use a Passkey"
          description="Register with your device biometrics (Face ID, fingerprint, or PIN). Fastest Web2-style onboarding."
          badge="Recommended"
          onClick={() => onSelect("passkey")}
        />
        <MethodCard
          icon={<Wallet className="h-5 w-5 text-blue-300" />}
          title="Connect Stellar Wallet"
          description="Link an existing Freighter or Albedo wallet for full on-chain control."
          onClick={() => onSelect("wallet")}
        />
      </div>

      <p className="pt-2 text-center text-xs text-blue-500">
        By continuing you agree to the StellarPad{" "}
        <a href="#" className="underline hover:text-blue-300">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-blue-300">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

function PasskeyRegisterStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [username, setUsername] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async () => {
    if (!username.trim()) return;
    setLoading(true);
    // Simulated WebAuthn credential creation delay
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">Create a Passkey</h2>
        <p className="text-sm text-blue-300">Your device will prompt you with biometrics or a PIN — no passwords stored.</p>
      </div>

      <div className="space-y-3 rounded-3xl border border-blue-800 bg-blue-900/40 p-5">
        <div className="flex items-center gap-3 text-sm text-blue-300">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span>Credentials never leave your device</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-blue-300">
          <KeyRound className="h-4 w-4 text-gold-300" />
          <span>FIDO2 / WebAuthn standard — phishing-proof</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-blue-300">
          <Fingerprint className="h-4 w-4 text-blue-300" />
          <span>Works with Face ID, Touch ID, Windows Hello</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.2em] text-blue-400">Display name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. alice@example.com"
          className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-4 py-3 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-blue-700 px-5 py-2.5 text-sm text-blue-300 transition hover:border-blue-500 hover:text-foreground"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!username.trim() || loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
          {loading ? "Waiting for device…" : "Create Passkey"}
        </button>
      </div>
    </div>
  );
}

function WalletConnectStep({ onConnected, onBack }: { onConnected: () => void; onBack: () => void }) {
  const [connecting, setConnecting] = React.useState<string | null>(null);

  const handleConnect = async (id: string) => {
    setConnecting(id);
    // Simulate wallet handshake
    await new Promise((r) => setTimeout(r, 1200));
    setConnecting(null);
    onConnected();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">Connect Wallet</h2>
        <p className="text-sm text-blue-300">Select a Stellar wallet to connect. Your keys stay in your wallet.</p>
      </div>

      <div className="space-y-3">
        {WALLET_OPTIONS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => handleConnect(w.id)}
            disabled={connecting !== null}
            className="flex w-full items-center justify-between gap-4 rounded-3xl border border-blue-800 bg-blue-900/60 px-5 py-4 text-left transition hover:border-blue-600 hover:bg-blue-900/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>
              <span className="block font-semibold text-foreground">{w.label}</span>
              <span className="block text-sm text-blue-300">{w.description}</span>
            </span>
            {connecting === w.id ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-blue-500" />
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="rounded-2xl border border-blue-700 px-5 py-2.5 text-sm text-blue-300 transition hover:border-blue-500 hover:text-foreground"
      >
        Back
      </button>
    </div>
  );
}

function SuccessStep({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-2 ring-emerald-500/30">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
      </span>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">You're in!</h2>
        <p className="text-sm text-blue-300">Your identity is secured. You can now book stays, sign leases, and purchase property on-chain.</p>
      </div>
      <div className="w-full space-y-2 rounded-3xl border border-blue-800 bg-blue-900/40 p-5 text-left">
        <StatusRow label="Identity verified" ok />
        <StatusRow label="Stellar account abstraction ready" ok />
        <StatusRow label="On-chain reputation wallet initialised" ok />
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

export function PasskeyModal({ open, onClose }: PasskeyModalProps) {
  const [step, setStep] = React.useState<Step>("choose");

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setStep("choose"), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-blue-800/80 bg-blue-950 shadow-2xl shadow-black/50">
        {/* Gold accent strip */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-[2rem] bg-gradient-to-r from-gold-400/40 via-gold-300 to-gold-400/40" />

        <div className="p-8">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full p-1.5 text-blue-400 transition hover:bg-blue-800 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X className="h-4 w-4" />
          </button>

          {step === "choose" && (
            <ChooseStep
              onSelect={(m) => setStep(m === "passkey" ? "passkey-register" : "wallet-connect")}
            />
          )}
          {step === "passkey-register" && (
            <PasskeyRegisterStep
              onNext={() => setStep("success")}
              onBack={() => setStep("choose")}
            />
          )}
          {step === "wallet-connect" && (
            <WalletConnectStep
              onConnected={() => setStep("success")}
              onBack={() => setStep("choose")}
            />
          )}
          {step === "success" && <SuccessStep onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}
