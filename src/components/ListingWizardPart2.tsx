"use client";

import * as React from "react";
import { Loader2, CheckCircle2, Zap, DollarSign, Calendar, Shield } from "lucide-react";
import type { ListingBasics } from "@/components/ListingWizardPart1";
import { cn } from "@/lib/utils";

interface ListingWizardPart2Props {
  basics: ListingBasics;
  onBack: () => void;
}

interface PricingForm {
  // short-term
  priceNight: string;
  minNights: string;
  depositPct: string;
  // long-term
  priceMonth: string;
  leaseMonths: string;
  securityDeposit: string;
  utilitiesIncluded: boolean;
  // buy
  salePrice: string;
  acceptOffers: boolean;
  titleEscrow: boolean;
  // shared
  currency: "USDC" | "EURC" | "XLM";
  autoReleaseEscrow: boolean;
  reputationRequired: number;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-[0.2em] text-blue-400">{label}</label>
      {children}
    </div>
  );
}

function MoneyInput({ value, onChange, placeholder, prefix = "$" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; prefix?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-blue-400">{prefix}</span>
      <input type="number" min={0} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 py-2.5 pl-8 pr-4 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none" />
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={cn("flex items-start gap-3 rounded-2xl border p-4 text-left transition",
        checked ? "border-blue-500/60 bg-blue-500/8" : "border-blue-800 bg-blue-900/30 hover:border-blue-600"
      )}>
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
        checked ? "border-blue-400 bg-blue-400" : "border-blue-600"
      )}>
        {checked && <CheckCircle2 className="h-3 w-3 text-blue-950" />}
      </span>
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {desc && <span className="text-xs text-blue-400">{desc}</span>}
      </span>
    </button>
  );
}

export function ListingWizardPart2({ basics, onBack }: ListingWizardPart2Props) {
  const [form, setForm] = React.useState<PricingForm>({
    priceNight: "", minNights: "1", depositPct: "20",
    priceMonth: "", leaseMonths: "12", securityDeposit: "", utilitiesIncluded: false,
    salePrice: "", acceptOffers: true, titleEscrow: true,
    currency: "USDC", autoReleaseEscrow: true, reputationRequired: 0,
  });
  const [publishing, setPublishing] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const set = <K extends keyof PricingForm>(k: K, v: PricingForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1600));
    setPublishing(false);
    setDone(true);
  };

  if (done) return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-2 ring-emerald-500/30">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
      </span>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Listing Published!</h2>
        <p className="text-sm text-blue-300">
          <span className="text-foreground font-medium">{basics.title}</span> is live on the Stellar network.
        </p>
      </div>
      <div className="rounded-2xl border border-blue-800 bg-blue-900/30 px-6 py-4 text-sm text-left w-full space-y-2">
        <div className="flex justify-between"><span className="text-blue-400">Contract</span><span className="font-mono text-foreground">CAAR…X7KQ</span></div>
        <div className="flex justify-between"><span className="text-blue-400">Network fee</span><span className="text-emerald-300">~$0.00001</span></div>
        <div className="flex justify-between"><span className="text-blue-400">IPFS metadata</span><span className="font-mono text-foreground">Qm3f…9e2d</span></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-7">
      {/* Step header */}
      <div className="flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">2</span>
        <div>
          <p className="font-semibold text-foreground">Smart Pricing &amp; Contract Logic</p>
          <p className="text-xs text-blue-400">Step 2 of 2 · {basics.title} · {basics.mode}</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          <span className="h-2 w-8 rounded-full bg-blue-600" />
          <span className="h-2 w-8 rounded-full bg-blue-600" />
        </div>
      </div>

      {/* Currency */}
      <Field label="Settlement currency">
        <div className="flex gap-2">
          {(["USDC", "EURC", "XLM"] as const).map((c) => (
            <button key={c} type="button" onClick={() => set("currency", c)}
              className={cn("rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                form.currency === c ? "border-blue-500 bg-blue-500/15 text-foreground" : "border-blue-800 text-blue-400 hover:border-blue-600"
              )}>{c}</button>
          ))}
        </div>
      </Field>

      {/* Mode-specific pricing */}
      {basics.mode === "short-term" && (
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Price per night">
            <MoneyInput value={form.priceNight} onChange={(v) => set("priceNight", v)} placeholder="e.g. 250" />
          </Field>
          <Field label="Min nights">
            <MoneyInput prefix="" value={form.minNights} onChange={(v) => set("minNights", v)} placeholder="1" />
          </Field>
          <Field label="Deposit %">
            <MoneyInput prefix="%" value={form.depositPct} onChange={(v) => set("depositPct", v)} placeholder="20" />
          </Field>
        </div>
      )}

      {basics.mode === "long-term" && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Monthly rent">
              <MoneyInput value={form.priceMonth} onChange={(v) => set("priceMonth", v)} placeholder="e.g. 3,500" />
            </Field>
            <Field label="Security deposit">
              <MoneyInput value={form.securityDeposit} onChange={(v) => set("securityDeposit", v)} placeholder="e.g. 7,000" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Lease term (months)">
              <input type="number" min={1} value={form.leaseMonths} onChange={(e) => set("leaseMonths", e.target.value)}
                className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-4 py-2.5 text-sm text-foreground focus:border-blue-500 focus:outline-none" />
            </Field>
            <div className="flex items-end">
              <Toggle label="Utilities included" checked={form.utilitiesIncluded} onChange={(v) => set("utilitiesIncluded", v)} />
            </div>
          </div>
        </div>
      )}

      {basics.mode === "buy" && (
        <div className="space-y-5">
          <Field label="Sale price">
            <MoneyInput value={form.salePrice} onChange={(v) => set("salePrice", v)} placeholder="e.g. 850,000" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle label="Accept offers below asking" checked={form.acceptOffers} onChange={(v) => set("acceptOffers", v)} />
            <Toggle label="On-chain title escrow" desc="Soroban deed contract" checked={form.titleEscrow} onChange={(v) => set("titleEscrow", v)} />
          </div>
        </div>
      )}

      {/* Smart contract settings */}
      <div className="space-y-4 rounded-2xl border border-blue-800/60 bg-blue-900/20 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-400">
          <Zap className="h-3.5 w-3.5" /> Soroban Contract Settings
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Auto-release escrow on checkout"
            desc="No manual approval needed"
            checked={form.autoReleaseEscrow} onChange={(v) => set("autoReleaseEscrow", v)} />
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-[0.2em] text-blue-400">Min reputation score</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={100} value={form.reputationRequired}
                onChange={(e) => set("reputationRequired", Number(e.target.value))}
                className="flex-1 accent-blue-500" />
              <span className="w-8 text-right text-sm font-semibold text-foreground">{form.reputationRequired}</span>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          {[
            { icon: <DollarSign className="h-3.5 w-3.5 text-emerald-400" />, label: "Platform fee", value: "0%" },
            { icon: <Shield className="h-3.5 w-3.5 text-blue-400" />, label: "Escrow reserve", value: "0.5%" },
            { icon: <Calendar className="h-3.5 w-3.5 text-gold-300" />, label: "Settle time", value: "~5s" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-xl border border-blue-800/40 bg-blue-950/60 px-3 py-2">
              {item.icon}
              <span className="text-blue-400">{item.label}</span>
              <span className="ml-auto font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onBack}
          className="rounded-2xl border border-blue-700 px-5 py-2.5 text-sm text-blue-300 transition hover:border-blue-500 hover:text-foreground">
          ← Edit Basics
        </button>
        <button type="button" onClick={handlePublish} disabled={publishing}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 sm:flex-none sm:px-8">
          {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {publishing ? "Publishing to Stellar…" : "Publish Listing On-Chain"}
        </button>
      </div>
    </div>
  );
}
