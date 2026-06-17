"use client";

import { useAppMode } from "@/context/app-mode-context";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  priceNight: number;
  priceMonth: number;
  salePrice: number;
  features: string[];
  available: boolean;
}

const modePriceLabels = {
  "short-term": { label: "$/night", value: (property: PropertyCardProps) => `$${property.priceNight.toLocaleString()}` },
  "long-term": { label: "$/month", value: (property: PropertyCardProps) => `$${property.priceMonth.toLocaleString()}` },
  buy: { label: "Sale Price", value: (property: PropertyCardProps) => `$${property.salePrice.toLocaleString()}` },
};

const modeHighlights = {
  "short-term": "Daily rate with smart deposit",
  "long-term": "Automated streaming lease",
  buy: "Direct buyer title transfer",
};

export function PropertyCard(property: PropertyCardProps) {
  const { mode } = useAppMode();
  const priceLabel = modePriceLabels[mode].label;
  const priceValue = modePriceLabels[mode].value(property);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-blue-800/60 bg-blue-950/90 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
      <div className="relative overflow-hidden">
        <img src={property.image} alt={property.title} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-blue-950/90 to-transparent px-4 py-3">
          <StatusBadge variant={property.available ? "success" : "warning"}>
            {property.available ? "Available" : "Booked"}
          </StatusBadge>
          <StatusBadge variant="accent">{mode === "buy" ? "Sale" : mode === "long-term" ? "Lease" : "Stay"}</StatusBadge>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm text-blue-300">
            <span className="font-medium text-foreground">{property.location}</span>
            <span className="rounded-full bg-blue-900/90 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-200">
              {modeHighlights[mode]}
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground">{property.title}</h3>
          <p className="text-sm leading-6 text-blue-300">{property.features.slice(0, 3).join(" • ")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <span>{property.rating.toFixed(1)} ★</span>
              <span className="text-blue-500">·</span>
              <span>{property.reviews} reviews</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-foreground">{priceValue}</p>
              <span className="text-sm text-blue-400">{priceLabel}</span>
            </div>
          </div>
          <Button variant="secondary" className="w-full whitespace-nowrap sm:w-auto">
            View details
          </Button>
        </div>
      </div>
    </article>
  );
}
