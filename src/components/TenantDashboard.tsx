"use client";

import * as React from "react";
import Link from "next/link";
import {
  Home, Calendar, CreditCard, FileText,
  TrendingUp, Clock, CheckCircle2, AlertTriangle,
  ArrowRight, Wallet,
} from "lucide-react";
import { useWallet } from "@/context/wallet-context";
import { cn } from "@/lib/utils";

// ─── Sample data ──────────────────────────────────────────────────────────────

const ACTIVE_STAYS = [
  {
    id: "prop-1",
    title: "Stellar Seaside Villa",
    location: "Santa Barbara, CA",
    type: "short-term" as const,
    checkIn: "Jun 18, 2026",
    checkOut: "Jun 21, 2026",
    amount: "975.00",
    currency: "USDC",
    escrowStatus: "locked" as const,
    txHash: "3e8f…a291",
  },
  {
    id: "prop-2",
    title: "Downtown Ledger Loft",
    location: "Seattle, WA",
    type: "long-term" as const,
    checkIn: "May 1, 2026",
    checkOut: "Apr 30, 2027",
    amount: "5,400.00",
    currency: "USDC",
    escrowStatus: "active" as const,
    txHash: "72bb…1f3d",
    nextPayment: "Jul 1, 2026",
  },
];

const OWNED_DEEDS = [
  {
    id: "prop-3",
    title: "Suburban Estate Retreat",
    location: "Austin, TX",
    purchaseDate: "Mar 5, 2026",
    price: "780,000.00",
    currency: "USDC",
    txHash: "a1c0…88e2",
  },
];

const PAYMENT_HISTORY = [
  { date: "Jun 1, 2026", description: "Long-Term Rent — Ledger Loft", amount: "5,400.00", status: "paid" as const },
  { date: "May 1, 2026", description: "Long-Term Rent — Ledger Loft", amount: "5,400.00", status: "paid" as const },
  { date: "Mar 5, 2026", description: "Property Purchase — Estate Retreat", amount: "780,000.00", status: "paid" as const },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESCROW_COLORS = {
  locked:   { dot: "bg-blue-400",    label: "Deposit Locked",   text: "text-blue-300"    },
  active:   { dot: "bg-gold-400",    label: "Lease Active",     text: "text-gold-300"    },
  released: { dot: "bg-emerald-400", label: "Deposit Released", text: "text-emerald-300" },
  disputed: { dot: "bg-red-400",     label: "Disputed",         text: "text-red-300"     },
};

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-blue-800/60 bg-blue-900/30 p-5">
      <div className="mb-3 flex items-center gap-2 text-blue-400">{icon}<span className="text-xs uppercase tracking-[0.2em]">{label}</span></div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-blue-400">{sub}</p>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function TenantDashboard() {
  const { connected, address, balances } = useWallet();
  const usdcBalance = balances.find((b) => b.asset === "USDC")?.balance ?? "—";

  if (!connected) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-12 text-center">
        <Wallet className="h-12 w-12 text-blue-400" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Connect your wallet to view your dashboard</h2>
          <p className="text-sm text-blue-300">Your active stays, leases, and owned deeds will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Tenant & Buyer Portal</p>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">My Portfolio</h1>
          <p className="mt-1 font-mono text-sm text-blue-400">{address?.slice(0, 8)}…{address?.slice(-6)}</p>
        </div>
        <div className="rounded-2xl border border-blue-800 bg-blue-900/40 px-5 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400">USDC Balance</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-300">{usdcBalance}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Calendar className="h-4 w-4" />} label="Active bookings" value={String(ACTIVE_STAYS.length)} sub="1 short-term · 1 long-term" />
        <StatCard icon={<Home className="h-4 w-4" />} label="Owned deeds" value={String(OWNED_DEEDS.length)} sub="On-chain title held" />
        <StatCard icon={<CreditCard className="h-4 w-4" />} label="Next payment" value="Jul 1" sub="$5,400.00 USDC auto-stream" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Fees saved" value="$46,800" sub="vs. traditional platforms" />
      </div>

      {/* Active stays & leases */}
      <section className="space-y-4">
        <h2 className="font-semibold text-foreground">Active Stays &amp; Leases</h2>
        {ACTIVE_STAYS.map((stay) => {
          const esc = ESCROW_COLORS[stay.escrowStatus];
          return (
            <div key={stay.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-blue-800/60 bg-blue-900/20 p-5">
              <div className="flex items-start gap-4">
                <div className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", esc.dot)} />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{stay.title}</p>
                  <p className="text-sm text-blue-400">{stay.location}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-blue-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{stay.checkIn} → {stay.checkOut}</span>
                    <span className={esc.text}>{esc.label}</span>
                  </div>
                  {"nextPayment" in stay && (
                    <p className="text-xs text-gold-300">Next payment: {stay.nextPayment}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold text-foreground">{stay.amount} <span className="text-emerald-300 text-sm">{stay.currency}</span></p>
                <Link href={`/property/${stay.id}`} className="mt-2 flex items-center justify-end gap-1 text-xs text-blue-400 transition hover:text-foreground">
                  View details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Owned deeds */}
      <section className="space-y-4">
        <h2 className="font-semibold text-foreground">Owned Property Deeds</h2>
        {OWNED_DEEDS.map((deed) => (
          <div key={deed.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-emerald-800/40 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{deed.title}</p>
                <p className="text-sm text-blue-400">{deed.location}</p>
                <p className="text-xs text-blue-500">Purchased {deed.purchaseDate} · Tx: <span className="font-mono">{deed.txHash}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-semibold text-foreground">{deed.price} <span className="text-emerald-300 text-sm">{deed.currency}</span></p>
              <p className="mt-1 text-xs text-emerald-400">Title on-chain ✓</p>
            </div>
          </div>
        ))}
      </section>

      {/* Payment history */}
      <section className="space-y-4">
        <h2 className="font-semibold text-foreground">Payment History</h2>
        <div className="overflow-hidden rounded-2xl border border-blue-800/60">
          {PAYMENT_HISTORY.map((tx, i) => (
            <div key={i} className={cn("flex flex-wrap items-center justify-between gap-3 px-5 py-4",
              i < PAYMENT_HISTORY.length - 1 && "border-b border-blue-800/40"
            )}>
              <div>
                <p className="text-sm font-medium text-foreground">{tx.description}</p>
                <p className="text-xs text-blue-400">{tx.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-foreground">${tx.amount}</span>
                {tx.status === "paid"
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  : <AlertTriangle className="h-4 w-4 text-amber-400" />
                }
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Browse Properties", href: "/", icon: <Home className="h-4 w-4" /> },
            { label: "View Escrow Status", href: "/", icon: <FileText className="h-4 w-4" /> },
            { label: "Raise a Dispute", href: "/disputes", icon: <AlertTriangle className="h-4 w-4" /> },
          ].map((action) => (
            <Link key={action.label} href={action.href}
              className="flex items-center justify-between rounded-2xl border border-blue-800 bg-blue-900/30 px-5 py-3.5 text-sm text-blue-200 transition hover:border-blue-600 hover:text-foreground">
              <span className="flex items-center gap-2">{action.icon}{action.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-500" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
