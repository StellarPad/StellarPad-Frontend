"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2, DollarSign, TrendingUp, Users,
  BarChart3, Eye, Edit, Plus, ArrowRight,
  CheckCircle2, Clock, AlertTriangle, Wallet,
  Tag,
} from "lucide-react";
import { useWallet } from "@/context/wallet-context";
import { cn } from "@/lib/utils";

// ─── Sample data ──────────────────────────────────────────────────────────────

const LISTINGS = [
  {
    id: "prop-1",
    title: "Stellar Seaside Villa",
    location: "Santa Barbara, CA",
    mode: "short-term" as const,
    status: "active" as const,
    occupancyPct: 84,
    monthRevenue: "8,775.00",
    views: 342,
    pendingOffers: 0,
  },
  {
    id: "prop-2",
    title: "Downtown Ledger Loft",
    location: "Seattle, WA",
    mode: "long-term" as const,
    status: "occupied" as const,
    occupancyPct: 100,
    monthRevenue: "5,400.00",
    views: 195,
    pendingOffers: 0,
  },
  {
    id: "prop-3",
    title: "Suburban Estate Retreat",
    location: "Austin, TX",
    mode: "buy" as const,
    status: "listed" as const,
    occupancyPct: 0,
    monthRevenue: "0.00",
    views: 510,
    pendingOffers: 3,
  },
];

const REVENUE_STREAM = [
  { month: "Mar", amount: 5400 },
  { month: "Apr", amount: 10200 },
  { month: "May", amount: 14175 },
  { month: "Jun", amount: 14175 },
];

const INCOMING_OFFERS = [
  { id: "o1", buyer: "GCEZ…VT5", property: "Suburban Estate Retreat", amount: "765,000.00", currency: "USDC", date: "Jun 16, 2026", status: "pending" as const },
  { id: "o2", buyer: "GDZL…JMS", property: "Suburban Estate Retreat", amount: "772,000.00", currency: "USDC", date: "Jun 17, 2026", status: "pending" as const },
  { id: "o3", buyer: "GDQP…W37", property: "Suburban Estate Retreat", amount: "780,000.00", currency: "USDC", date: "Jun 17, 2026", status: "pending" as const },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODE_BADGE: Record<string, string> = {
  "short-term": "bg-blue-500/15 text-blue-300",
  "long-term":  "bg-gold-400/15 text-gold-300",
  "buy":        "bg-emerald-500/15 text-emerald-300",
};

const STATUS_CONFIG = {
  active:   { dot: "bg-emerald-400", label: "Active" },
  occupied: { dot: "bg-gold-400",    label: "Occupied" },
  listed:   { dot: "bg-blue-400",    label: "Listed for Sale" },
  inactive: { dot: "bg-blue-800",    label: "Inactive" },
};

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-2xl border p-5", accent ? "border-emerald-800/40 bg-emerald-500/5" : "border-blue-800/60 bg-blue-900/30")}>
      <div className="mb-3 flex items-center gap-2 text-blue-400">{icon}<span className="text-xs uppercase tracking-[0.2em]">{label}</span></div>
      <p className={cn("text-2xl font-bold", accent ? "text-emerald-300" : "text-foreground")}>{value}</p>
      {sub && <p className="mt-1 text-xs text-blue-400">{sub}</p>}
    </div>
  );
}

// Mini bar chart
function RevenueChart() {
  const max = Math.max(...REVENUE_STREAM.map((r) => r.amount));
  return (
    <div className="rounded-2xl border border-blue-800/60 bg-blue-900/20 p-5">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-blue-400">Monthly Revenue (USDC)</p>
      <div className="flex items-end gap-3">
        {REVENUE_STREAM.map((r) => (
          <div key={r.month} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-blue-300">${(r.amount / 1000).toFixed(1)}k</span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all"
              style={{ height: `${(r.amount / max) * 80}px` }}
            />
            <span className="text-xs text-blue-500">{r.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function LandlordDashboard() {
  const { connected, address, balances } = useWallet();
  const usdcBalance = balances.find((b) => b.asset === "USDC")?.balance ?? "—";
  const [offerStatuses, setOfferStatuses] = React.useState<Record<string, "pending" | "accepted" | "declined">>(
    Object.fromEntries(INCOMING_OFFERS.map((o) => [o.id, o.status]))
  );

  if (!connected) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-12 text-center">
        <Wallet className="h-12 w-12 text-blue-400" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Connect your wallet to access the Landlord Portal</h2>
          <p className="text-sm text-blue-300">Your listings, revenue, and incoming offers will appear here.</p>
        </div>
      </div>
    );
  }

  const totalMonthRevenue = LISTINGS.reduce((acc, l) => acc + parseFloat(l.monthRevenue.replace(/,/g, "")), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Landlord & Seller Portal</p>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">Property Management</h1>
          <p className="mt-1 font-mono text-sm text-blue-400">{address?.slice(0, 8)}…{address?.slice(-6)}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-blue-800 bg-blue-900/40 px-5 py-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400">USDC Balance</p>
            <p className="mt-1 font-mono text-2xl font-bold text-emerald-300">{usdcBalance}</p>
          </div>
          <Link href="/list"
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
            <Plus className="h-4 w-4" /> New Listing
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Building2 className="h-4 w-4" />} label="Active listings" value={String(LISTINGS.length)} sub="2 rentals · 1 for sale" />
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="This month" value={`$${totalMonthRevenue.toLocaleString()}`} sub="USDC received" accent />
        <StatCard icon={<Users className="h-4 w-4" />} label="Occupancy" value="73%" sub="Across rental portfolio" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Pending offers" value={String(INCOMING_OFFERS.filter((o) => offerStatuses[o.id] === "pending").length)} sub="On Suburban Estate" />
      </div>

      {/* Revenue chart */}
      <RevenueChart />

      {/* Listings */}
      <section className="space-y-4">
        <h2 className="font-semibold text-foreground">My Listings</h2>
        {LISTINGS.map((listing) => {
          const statusCfg = STATUS_CONFIG[listing.status];
          return (
            <div key={listing.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-800/60 bg-blue-900/20 p-5">
              <div className="flex items-center gap-4">
                <div className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusCfg.dot)} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{listing.title}</p>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest", MODE_BADGE[listing.mode])}>
                      {listing.mode === "short-term" ? "Short-term" : listing.mode === "long-term" ? "Long-term" : "For Sale"}
                    </span>
                  </div>
                  <p className="text-sm text-blue-400">{listing.location} · {statusCfg.label}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-blue-500">Revenue/mo</p>
                  <p className="font-mono font-semibold text-foreground">${listing.monthRevenue}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-blue-500">Occupancy</p>
                  <p className="font-semibold text-foreground">{listing.occupancyPct}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-blue-500">Views</p>
                  <div className="flex items-center gap-1 font-semibold text-foreground"><Eye className="h-3.5 w-3.5 text-blue-400" />{listing.views}</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/property/${listing.id}`} className="rounded-xl border border-blue-700 p-2 text-blue-400 transition hover:border-blue-500 hover:text-foreground"><Eye className="h-3.5 w-3.5" /></Link>
                  <button className="rounded-xl border border-blue-700 p-2 text-blue-400 transition hover:border-blue-500 hover:text-foreground"><Edit className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Incoming offers */}
      <section className="space-y-4">
        <h2 className="font-semibold text-foreground">Incoming Purchase Offers</h2>
        {INCOMING_OFFERS.map((offer) => {
          const status = offerStatuses[offer.id];
          return (
            <div key={offer.id} className={cn(
              "flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5",
              status === "accepted" ? "border-emerald-800/40 bg-emerald-500/5"
                : status === "declined" ? "border-blue-800/30 opacity-50"
                : "border-blue-800/60 bg-blue-900/20"
            )}>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{offer.property}</p>
                <p className="text-sm text-blue-400">Buyer: <span className="font-mono">{offer.buyer}</span> · {offer.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono font-semibold text-foreground">{offer.amount} <span className="text-emerald-300 text-sm">{offer.currency}</span></p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-blue-400">
                    <Tag className="h-3 w-3" />
                    {status === "accepted" ? <span className="text-emerald-400">Accepted</span>
                      : status === "declined" ? <span className="text-blue-500">Declined</span>
                      : "Awaiting response"}
                  </div>
                </div>
                {status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => setOfferStatuses((s) => ({ ...s, [offer.id]: "accepted" }))}
                      className="flex items-center gap-1 rounded-xl border border-emerald-700/50 px-3 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-500/10">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                    </button>
                    <button onClick={() => setOfferStatuses((s) => ({ ...s, [offer.id]: "declined" }))}
                      className="flex items-center gap-1 rounded-xl border border-blue-700 px-3 py-1.5 text-xs text-blue-400 transition hover:border-blue-500">
                      <AlertTriangle className="h-3.5 w-3.5" /> Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "List a Property", href: "/list", icon: <Plus className="h-4 w-4" /> },
            { label: "Revenue Analytics", href: "#", icon: <BarChart3 className="h-4 w-4" /> },
            { label: "Escrow Disputes", href: "/disputes", icon: <Clock className="h-4 w-4" /> },
          ].map((a) => (
            <Link key={a.label} href={a.href}
              className="flex items-center justify-between rounded-2xl border border-blue-800 bg-blue-900/30 px-5 py-3.5 text-sm text-blue-200 transition hover:border-blue-600 hover:text-foreground">
              <span className="flex items-center gap-2">{a.icon}{a.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-500" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
