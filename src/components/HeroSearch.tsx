"use client";

import { useAppMode } from "@/context/app-mode-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const modeHintMap = {
  "short-term": "Search vacation homes, beachfront escapes, and nightly stays",
  "long-term": "Find monthly rentals, corporate leases, and extended stays",
  buy: "Browse homes, condos, and direct property sale listings",
};

export default function HeroSearch() {
  const { mode, searchQuery, setSearchQuery } = useAppMode();

  return (
    <section className="mx-auto mt-10 max-w-6xl rounded-[2rem] border border-blue-800/80 bg-blue-950/85 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-gold-300">Decentralized real estate</p>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              0% Intermediary Fees. <span className="text-gold-400">100% Cryptographic Trust.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-blue-200 sm:text-xl">
              Book short-term stays, secure long-term leases, or purchase property directly with transparent Stellar-powered escrow, savings, and on-chain reputation.
            </p>
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-blue-800/80 bg-blue-900/95 p-6 shadow-inner shadow-blue-950/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-300">Current mode</p>
                <p className="mt-1 text-xl font-semibold text-foreground capitalize">{mode.replace("-", " ")}</p>
              </div>
              <div className="rounded-2xl bg-blue-950/80 px-4 py-2 text-sm text-blue-200 ring-1 ring-blue-800">
                {mode === "buy" ? "Sale Mode" : mode === "long-term" ? "Lease Mode" : "Nightly Mode"}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Input
                label="Search properties"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={modeHintMap[mode]}
                className="bg-blue-900/90"
              />
              <Button variant="primary" className="w-full sm:w-auto">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-blue-950/80 p-4 text-sm text-blue-200 ring-1 ring-blue-800">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Fee savings</p>
                <p className="mt-2 font-semibold text-foreground">15-20% lower than Airbnb</p>
              </div>
              <div className="rounded-3xl bg-blue-950/80 p-4 text-sm text-blue-200 ring-1 ring-blue-800">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-400">On-chain trust</p>
                <p className="mt-2 font-semibold text-foreground">Smart escrow verification</p>
              </div>
              <div className="rounded-3xl bg-blue-950/80 p-4 text-sm text-blue-200 ring-1 ring-blue-800">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Reputation</p>
                <p className="mt-2 font-semibold text-foreground">Verified rental history</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-blue-800/80 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-6 shadow-2xl shadow-black/40">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-gold-400 via-blue-500 to-gold-400 opacity-70" />
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border border-blue-800/70 bg-blue-950/90 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-gold-200">Featured insight</p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">Trusted payments</h2>
              <p className="mt-2 text-sm leading-6 text-blue-300">
                Use Stellar’s low-fee settlement and cryptographic deed signing to power every reservation, lease, and sale.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-blue-800/70 bg-blue-950/85 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-400">Smart Escrow</p>
                <p className="mt-3 text-lg font-semibold text-foreground">Deposit locked until checkout</p>
              </div>
              <div className="rounded-3xl border border-blue-800/70 bg-blue-950/85 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-400">On-chain reviews</p>
                <p className="mt-3 text-lg font-semibold text-foreground">Immutable tenant history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
