"use client";

import * as React from "react";
import { Star, ShieldCheck, BadgeCheck, LinkIcon, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  author: string;
  avatar: string;           // initials
  rating: number;           // 1-5
  date: string;
  body: string;
  txHash: string;
  verified: boolean;
  badge: "Verified Renter" | "Verified Buyer" | null;
  helpful: number;
}

interface ReputationTrackerProps {
  overallRating?: number;
  totalReviews?: number;
  reviews?: Review[];
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Alice M.",
    avatar: "AM",
    rating: 5,
    date: "May 2026",
    body: "Absolutely seamless experience. The deposit was released automatically the moment I checked out — no awkward waiting or back-and-forth with the landlord.",
    txHash: "0x3e8f…a291",
    verified: true,
    badge: "Verified Renter",
    helpful: 18,
  },
  {
    id: "r2",
    author: "Carlos T.",
    avatar: "CT",
    rating: 5,
    date: "Apr 2026",
    body: "Purchased this property entirely on-chain. The deed signing with my Freighter wallet took under 2 minutes and the title transfer was confirmed on Stellar in the same block.",
    txHash: "0x72bb…1f3d",
    verified: true,
    badge: "Verified Buyer",
    helpful: 31,
  },
  {
    id: "r3",
    author: "Priya S.",
    avatar: "PS",
    rating: 4,
    date: "Mar 2026",
    body: "Great long-term lease experience. Monthly USDC payments stream automatically so I never miss a due date. Would love a mobile app but the web experience is solid.",
    txHash: "0xa1c0…88e2",
    verified: true,
    badge: "Verified Renter",
    helpful: 12,
  },
  {
    id: "r4",
    author: "James O.",
    avatar: "JO",
    rating: 5,
    date: "Feb 2026",
    body: "Stayed for a week. Smart lock worked perfectly with the on-chain booking confirmation. Zero hidden fees — what you see is what you pay.",
    txHash: "0xf902…c55a",
    verified: true,
    badge: "Verified Renter",
    helpful: 9,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className={cn("flex items-center gap-0.5", size === "lg" ? "gap-1" : "gap-0.5")}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5",
            i < rating ? "fill-gold-400 text-gold-400" : "fill-blue-800 text-blue-700",
          )}
        />
      ))}
    </div>
  );
}

function BadgePill({ badge }: { badge: NonNullable<Review["badge"]> }) {
  const isRenter = badge === "Verified Renter";
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1",
        isRenter
          ? "bg-blue-500/15 text-blue-300 ring-blue-500/30"
          : "bg-gold-400/15 text-gold-300 ring-gold-400/30",
      )}
    >
      <BadgeCheck className="h-3 w-3" />
      {badge}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpfulCount, setHelpfulCount] = React.useState(review.helpful);
  const [voted, setVoted] = React.useState(false);

  const handleHelpful = () => {
    if (voted) return;
    setHelpfulCount((n) => n + 1);
    setVoted(true);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-blue-800/60 bg-blue-900/30 p-5">
      {/* Author row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700/60 text-sm font-bold text-foreground">
            {review.avatar}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{review.author}</span>
              {review.badge && <BadgePill badge={review.badge} />}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Stars rating={review.rating} />
              <span className="text-xs text-blue-400">{review.date}</span>
            </div>
          </div>
        </div>

        {/* On-chain verified */}
        {review.verified && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            On-chain
          </span>
        )}
      </div>

      {/* Body */}
      <p className="text-sm leading-relaxed text-blue-200">{review.body}</p>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-800/40 pt-3">
        <a
          href={`https://stellar.expert/explorer/testnet/tx/${review.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-xs text-blue-400 transition hover:text-blue-200"
        >
          <LinkIcon className="h-3 w-3" />
          {review.txHash}
        </a>
        <button
          type="button"
          onClick={handleHelpful}
          disabled={voted}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
            voted
              ? "border-emerald-700/50 text-emerald-400"
              : "border-blue-700 text-blue-400 hover:border-blue-500 hover:text-foreground",
          )}
        >
          <ThumbsUp className="h-3 w-3" />
          Helpful ({helpfulCount})
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ReputationTracker({
  overallRating = 4.9,
  totalReviews = 143,
  reviews = SAMPLE_REVIEWS,
}: ReputationTrackerProps) {
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-6 sm:p-8">
        <div className="flex flex-wrap gap-8 sm:items-center sm:justify-between">
          {/* Overall score */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-blue-400">On-Chain Reputation</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-foreground">{overallRating}</span>
              <div className="mb-1 space-y-1">
                <Stars rating={Math.round(overallRating)} size="lg" />
                <p className="text-xs text-blue-400">{totalReviews} cryptographically verified reviews</p>
              </div>
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="min-w-[200px] space-y-2">
            {ratingBreakdown.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-right text-blue-400">{star}</span>
                <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-blue-800/60">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gold-400/70 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-4 text-blue-500">{count}</span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-blue-200">All reviews tied to on-chain lease/sale tx</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BadgeCheck className="h-4 w-4 text-blue-300" />
              <span className="text-blue-200">Cannot be purchased or manipulated</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <LinkIcon className="h-4 w-4 text-gold-300" />
              <span className="text-blue-200">Permanently stored on Stellar ledger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
