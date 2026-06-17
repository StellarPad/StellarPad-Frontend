"use client";

import * as React from "react";
import {
  AlertTriangle, ShieldCheck, MessageSquare,
  Clock, CheckCircle2, XCircle, Loader2,
  ChevronDown, ChevronUp, FileText, Gavel,
} from "lucide-react";
import { useWallet } from "@/context/wallet-context";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type DisputeStatus = "open" | "under-review" | "resolved-tenant" | "resolved-host" | "escalated";
type ClaimType = "deposit-withheld" | "property-damage" | "maintenance-failure" | "early-termination" | "other";

interface Dispute {
  id: string;
  propertyTitle: string;
  propertyId: string;
  escrowAmount: string;
  currency: string;
  claimant: "tenant" | "host";
  claimType: ClaimType;
  description: string;
  status: DisputeStatus;
  opened: string;
  txHash: string;
  evidence: string[];
  responses: { author: string; text: string; date: string }[];
}

// ─── Sample disputes ──────────────────────────────────────────────────────────

const SAMPLE_DISPUTES: Dispute[] = [
  {
    id: "d1",
    propertyTitle: "Stellar Seaside Villa",
    propertyId: "prop-1",
    escrowAmount: "975.00",
    currency: "USDC",
    claimant: "tenant",
    claimType: "deposit-withheld",
    description: "Host refuses to release deposit despite clean checkout confirmed by smart lock logs.",
    status: "under-review",
    opened: "Jun 15, 2026",
    txHash: "3e8f…a291",
    evidence: ["Smart lock checkout log", "Property inspection photo (no damage)"],
    responses: [
      { author: "Host", text: "Claiming damage to the kitchen countertop not covered by photos.", date: "Jun 15, 2026" },
      { author: "Tenant", text: "Photos submitted show countertop undamaged at checkout time.", date: "Jun 16, 2026" },
    ],
  },
  {
    id: "d2",
    propertyTitle: "Downtown Ledger Loft",
    propertyId: "prop-2",
    escrowAmount: "10,800.00",
    currency: "USDC",
    claimant: "tenant",
    claimType: "maintenance-failure",
    description: "Heating system failed for 12 days in January. Requesting partial rent refund per lease clause §4.2.",
    status: "open",
    opened: "Jun 17, 2026",
    txHash: "72bb…1f3d",
    evidence: ["Maintenance request log (on-chain timestamp)", "Temperature sensor readings"],
    responses: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DisputeStatus, { label: string; color: string; icon: React.ReactNode }> = {
  "open":              { label: "Open",            color: "text-amber-300  border-amber-700/40  bg-amber-500/5",  icon: <Clock className="h-3.5 w-3.5" /> },
  "under-review":      { label: "Under Review",    color: "text-blue-300   border-blue-700/40   bg-blue-500/5",   icon: <Gavel className="h-3.5 w-3.5" /> },
  "resolved-tenant":   { label: "Resolved (Tenant)",  color: "text-emerald-300 border-emerald-700/40 bg-emerald-500/5", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  "resolved-host":     { label: "Resolved (Host)",    color: "text-gold-300   border-gold-600/40   bg-gold-400/5",   icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  "escalated":         { label: "Escalated",       color: "text-red-300    border-red-700/40    bg-red-500/5",    icon: <AlertTriangle className="h-3.5 w-3.5" /> },
};

const CLAIM_LABELS: Record<ClaimType, string> = {
  "deposit-withheld":   "Deposit Withheld",
  "property-damage":    "Property Damage Claim",
  "maintenance-failure":"Maintenance Failure",
  "early-termination":  "Early Termination",
  "other":              "Other",
};

// ─── New Dispute Form ─────────────────────────────────────────────────────────

function NewDisputeForm({ onClose }: { onClose: () => void }) {
  const [claimType, setClaimType] = React.useState<ClaimType>("deposit-withheld");
  const [description, setDescription] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setDone(true);
    setTimeout(onClose, 1800);
  };

  if (done) return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <CheckCircle2 className="h-12 w-12 text-emerald-400" />
      <p className="font-semibold text-foreground">Dispute filed on-chain</p>
      <p className="text-sm text-blue-300">Escrow funds are frozen. Arbitrators notified.</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="block text-xs uppercase tracking-[0.2em] text-blue-400">Claim type</label>
        <select value={claimType} onChange={(e) => setClaimType(e.target.value as ClaimType)}
          className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-4 py-2.5 text-sm text-foreground focus:border-blue-500 focus:outline-none">
          {Object.entries(CLAIM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className="block text-xs uppercase tracking-[0.2em] text-blue-400">Description</label>
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue clearly. All submissions are immutably logged on-chain."
          className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-4 py-3 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none resize-none" />
      </div>
      <div className="rounded-2xl border border-amber-700/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
        <AlertTriangle className="mb-1 inline h-3.5 w-3.5 mr-1" />
        Filing a dispute immediately freezes escrow funds. Frivolous claims may incur a small arbitration bond.
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onClose}
          className="rounded-2xl border border-blue-700 px-5 py-2.5 text-sm text-blue-300 transition hover:border-blue-500">
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} disabled={!description.trim() || submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-40">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
          {submitting ? "Filing on-chain…" : "File Dispute"}
        </button>
      </div>
    </div>
  );
}

// ─── Dispute card ─────────────────────────────────────────────────────────────

function DisputeCard({ dispute }: { dispute: Dispute }) {
  const [expanded, setExpanded] = React.useState(false);
  const [reply, setReply] = React.useState("");
  const cfg = STATUS_CONFIG[dispute.status];

  return (
    <div className="rounded-2xl border border-blue-800/60 bg-blue-900/20 overflow-hidden">
      {/* Header row */}
      <button type="button" onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left focus-visible:outline-none">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">{dispute.propertyTitle}</p>
            <span className={cn("flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", cfg.color)}>
              {cfg.icon}{cfg.label}
            </span>
          </div>
          <p className="text-sm text-blue-400">{CLAIM_LABELS[dispute.claimType]} · Opened {dispute.opened}</p>
          <p className="text-xs text-blue-500">Escrow: <span className="font-mono text-foreground">{dispute.escrowAmount} {dispute.currency}</span> · Tx: <span className="font-mono">{dispute.txHash}</span></p>
        </div>
        {expanded ? <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-blue-400" /> : <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-blue-400" />}
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-blue-800/40 px-5 pb-5 pt-4 space-y-5">
          {/* Claim description */}
          <div className="rounded-2xl border border-blue-800/40 bg-blue-950/60 p-4 text-sm text-blue-200">
            <p className="mb-1 text-xs uppercase tracking-[0.15em] text-blue-400">Claim</p>
            {dispute.description}
          </div>

          {/* Evidence */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.15em] text-blue-400">Evidence submitted</p>
            {dispute.evidence.map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-blue-200">
                <FileText className="h-3.5 w-3.5 text-blue-400" />{e}
              </div>
            ))}
          </div>

          {/* Responses thread */}
          {dispute.responses.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.15em] text-blue-400">Response thread</p>
              {dispute.responses.map((r, i) => (
                <div key={i} className={cn("rounded-2xl border p-4 text-sm",
                  r.author === "Tenant" ? "border-blue-700/50 bg-blue-900/40" : "border-gold-600/30 bg-gold-400/5"
                )}>
                  <div className="mb-1 flex items-center justify-between text-xs text-blue-400">
                    <span className="font-semibold text-foreground">{r.author}</span>
                    <span>{r.date}</span>
                  </div>
                  <p className="text-blue-200">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add response */}
          {dispute.status === "open" || dispute.status === "under-review" ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.15em] text-blue-400">Add response</p>
              <textarea rows={3} value={reply} onChange={(e) => setReply(e.target.value)}
                placeholder="Your response (stored on-chain)…"
                className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-4 py-3 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none resize-none" />
              <div className="flex gap-3">
                <button type="button" disabled={!reply.trim()}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-40">
                  <MessageSquare className="h-3.5 w-3.5" /> Submit Response
                </button>
                <button type="button"
                  className="flex items-center gap-2 rounded-2xl border border-red-700/50 px-4 py-2 text-sm text-red-300 transition hover:border-red-500">
                  <Gavel className="h-3.5 w-3.5" /> Escalate to Arbitration
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> Dispute resolved — escrow distributed per arbitration ruling.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function DisputeManager() {
  const { connected } = useWallet();
  const [showForm, setShowForm] = React.useState(false);

  if (!connected) return (
    <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-12 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-400" />
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Connect your wallet to manage disputes</h2>
        <p className="text-sm text-blue-300">All dispute records are tied to your on-chain identity.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Escrow Protection</p>
          <h1 className="text-3xl font-semibold text-foreground">Claims &amp; Disputes</h1>
          <p className="text-sm text-blue-300">All claims are immutably filed on the Stellar ledger. Escrow is frozen during arbitration.</p>
        </div>
        <button type="button" onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 rounded-2xl bg-red-600/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600">
          <AlertTriangle className="h-4 w-4" />
          {showForm ? "Cancel" : "File New Dispute"}
        </button>
      </div>

      {/* How it works */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: <AlertTriangle className="h-5 w-5 text-amber-400" />, title: "File On-Chain", desc: "Your claim is immutably timestamped on Stellar. Escrow funds are immediately frozen." },
          { icon: <Gavel className="h-5 w-5 text-blue-400" />, title: "Arbitration", desc: "Multi-sig arbitrators review evidence. Both parties can submit responses." },
          { icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />, title: "Auto Resolution", desc: "Soroban contract executes the ruling — funds distributed automatically, no intermediary." },
        ].map((step) => (
          <div key={step.title} className="rounded-2xl border border-blue-800/60 bg-blue-900/20 p-5">
            <span className="mb-3 block">{step.icon}</span>
            <p className="font-semibold text-foreground">{step.title}</p>
            <p className="mt-1 text-xs text-blue-400">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* New dispute form */}
      {showForm && (
        <div className="rounded-[2rem] border border-red-700/40 bg-red-500/5 p-6">
          <h2 className="mb-5 font-semibold text-foreground">File a New Dispute</h2>
          <NewDisputeForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Active disputes */}
      <div className="space-y-4">
        <h2 className="font-semibold text-foreground">Active Disputes ({SAMPLE_DISPUTES.length})</h2>
        {SAMPLE_DISPUTES.map((d) => <DisputeCard key={d.id} dispute={d} />)}
      </div>

      {/* Resolved notice */}
      <div className="rounded-2xl border border-emerald-800/40 bg-emerald-500/5 px-5 py-4">
        <div className="flex items-center gap-2 text-sm">
          <XCircle className="h-4 w-4 text-emerald-400" />
          <span className="text-blue-200">
            <span className="font-semibold text-emerald-300">0 resolved disputes</span> in your history. Escrow was released fairly in all completed stays.
          </span>
        </div>
      </div>
    </div>
  );
}
