"use client";

import { propertySamples } from "@/components/property-data";
import { PropertyCard } from "@/components/PropertyCard";

export default function MarketplaceGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-gold-300">Marketplace discovery</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Browse curated real estate listings</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-blue-300 sm:text-right">
          Explore listings optimized for short-term stays, long-term rentals, and direct property purchases — all on Stellar’s low-fee protocol.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {propertySamples.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </section>
  );
}
