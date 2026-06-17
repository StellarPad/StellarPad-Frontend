"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin, Star, BedDouble, Bath, Users, Shield,
  Wifi, ParkingSquare, Flame, Wind,
  ChevronLeft, Share2, Heart, CheckCircle2,
} from "lucide-react";
import { useAppMode, type TransactionMode } from "@/context/app-mode-context";
import { ReputationTracker } from "@/components/ReputationTracker";
import { SmartEscrowVisualizer } from "@/components/SmartEscrowVisualizer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { PropertyCardProps } from "@/components/PropertyCard";

// ─── Extended property type ───────────────────────────────────────────────────

export interface PropertyDetail extends PropertyCardProps {
  description: string;
  host: {
    name: string;
    initials: string;
    verified: boolean;
    responseRate: string;
    joinedYear: number;
  };
  amenities: string[];
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  yearBuilt?: number;
  lotSqft?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi":         <Wifi className="h-4 w-4" />,
  "Parking":      <ParkingSquare className="h-4 w-4" />,
  "Heating":      <Flame className="h-4 w-4" />,
  "Air conditioning": <Wind className="h-4 w-4" />,
};

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

interface PricingConfig {
  label: string;
  price: string;
  sub: string;
  cta: string;
}

function getPricing(p: PropertyDetail, mode: TransactionMode): PricingConfig {
  if (mode === "short-term") return {
    label: "Nightly rate",
    price: `$${fmt(p.priceNight)}`,
    sub: "per night · smart deposit locked at booking",
    cta: "Reserve Stay",
  };
  if (mode === "long-term") return {
    label: "Monthly rent",
    price: `$${fmt(p.priceMonth)}`,
    sub: "per month · automated USDC streaming",
    cta: "Sign Lease On-Chain",
  };
  return {
    label: "Sale price",
    price: `$${fmt(p.salePrice)}`,
    sub: "direct purchase · cryptographic title transfer",
    cta: "Purchase Property",
  };
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function Gallery({ images, title }: { images: string[]; title: string }) {
  const [main, setMain] = React.useState(0);
  return (
    <div className="overflow-hidden rounded-[2rem] border border-blue-800/60">
      <img src={images[main]} alt={title} className="h-72 w-full object-cover sm:h-96" />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-blue-950/90 p-3">
          {images.map((img, i) => (
            <button key={i} type="button" onClick={() => setMain(i)}
              className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition",
                i === main ? "border-gold-400" : "border-transparent opacity-60 hover:opacity-100"
              )}>
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PropertyDetailView({ property }: { property: PropertyDetail }) {
  const { mode } = useAppMode();
  const pricing = getPricing(property, mode);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back nav */}
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-blue-400 transition hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* ── Left column ── */}
        <div className="space-y-8">
          {/* Gallery */}
          <Gallery images={property.images} title={property.title} />

          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge variant={property.available ? "success" : "warning"}>
                  {property.available ? "Available" : "Booked"}
                </StatusBadge>
                <StatusBadge variant="accent">
                  {mode === "buy" ? "For Sale" : mode === "long-term" ? "Long-Term Lease" : "Short-Term Stay"}
                </StatusBadge>
              </div>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{property.title}</h1>
              <div className="flex items-center gap-2 text-sm text-blue-300">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
                <span className="text-blue-600">·</span>
                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                <span>{property.rating.toFixed(1)}</span>
                <span className="text-blue-600">·</span>
                <span>{property.reviews} reviews</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Share"
                className="rounded-full border border-blue-700 p-2.5 text-blue-400 transition hover:border-blue-500 hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Save" onClick={() => setSaved((s) => !s)}
                className={cn("rounded-full border p-2.5 transition",
                  saved ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-blue-700 text-blue-400 hover:border-blue-500 hover:text-foreground"
                )}>
                <Heart className={cn("h-4 w-4", saved && "fill-red-400")} />
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {[
              { icon: <BedDouble className="h-4 w-4" />, value: `${property.bedrooms}`, label: "beds" },
              { icon: <Bath className="h-4 w-4" />, value: `${property.bathrooms}`, label: "baths" },
              { icon: <Users className="h-4 w-4" />, value: `${property.maxGuests}`, label: "guests" },
              ...(property.yearBuilt
                ? [{ icon: <Shield className="h-4 w-4" />, value: String(property.yearBuilt), label: "year built" }]
                : []),
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-blue-800/60 bg-blue-900/30 p-4 text-center">
                <span className="mx-auto mb-1 flex justify-center text-blue-400">{stat.icon}</span>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-blue-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-3 rounded-[1.5rem] border border-blue-800/60 bg-blue-900/20 p-6">
            <h2 className="font-semibold text-foreground">About this property</h2>
            <p className="text-sm leading-7 text-blue-200">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Amenities</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {property.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 rounded-2xl border border-blue-800/40 bg-blue-900/20 px-4 py-3 text-sm text-blue-200">
                  <span className="text-blue-400">{AMENITY_ICONS[a] ?? <CheckCircle2 className="h-4 w-4" />}</span>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Smart Escrow — short-term / long-term only */}
          {mode !== "buy" && (
            <div className="space-y-3">
              <h2 className="font-semibold text-foreground">Smart Deposit Escrow</h2>
              <SmartEscrowVisualizer depositAmount={mode === "long-term" ? "2,400.00" : "975.00"} />
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground">On-Chain Reviews</h2>
            <ReputationTracker overallRating={property.rating} totalReviews={property.reviews} />
          </div>
        </div>

        {/* ── Right column — sticky booking card ── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950 p-6 shadow-2xl shadow-black/30">
            {/* Price */}
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-400">{pricing.label}</p>
              <p className="mt-1 text-4xl font-bold text-foreground">{pricing.price}</p>
              <p className="mt-1 text-xs text-blue-400">{pricing.sub}</p>
            </div>

            {/* Mode-specific fields */}
            {mode === "short-term" && (
              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-blue-400">Check-in</p>
                  <input type="date" className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-blue-400">Check-out</p>
                  <input type="date" className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
            )}
            {mode === "long-term" && (
              <div className="mb-5 space-y-1">
                <p className="text-xs text-blue-400">Lease start date</p>
                <input type="date" className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none" />
              </div>
            )}

            <Button variant="primary" href={`/property/${property.id}/checkout`} className="w-full" size="lg">
              {pricing.cta}
            </Button>

            {/* Fee breakdown */}
            <div className="mt-5 space-y-2 border-t border-blue-800/50 pt-4 text-sm">
              {mode === "short-term" && (
                <>
                  <div className="flex justify-between text-blue-300">
                    <span>${fmt(property.priceNight)} × 3 nights</span>
                    <span>${fmt(property.priceNight * 3)}</span>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>Security deposit (escrowed)</span>
                    <span>$975.00</span>
                  </div>
                </>
              )}
              {mode === "buy" && (
                <div className="flex justify-between text-blue-300">
                  <span>Closing (Stellar network fee)</span>
                  <span>~$0.00</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-emerald-300">
                <span>StellarPad platform fee</span>
                <span>$0.00</span>
              </div>
            </div>

            {/* Host card */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-800/50 bg-blue-900/30 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-700/60 font-bold text-foreground">
                {property.host.initials}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{property.host.name}</p>
                <p className="text-xs text-blue-400">
                  Host since {property.host.joinedYear} · {property.host.responseRate} response rate
                </p>
              </div>
              {property.host.verified && (
                <Shield className="h-4 w-4 shrink-0 text-emerald-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
