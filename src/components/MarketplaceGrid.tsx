"use client";

import { useMemo } from "react";
import { useAppMode } from "@/context/app-mode-context";
import { propertySamples } from "@/components/property-data";
import { PropertyCard } from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MarketplaceGrid() {
  const { searchQuery, setSearchQuery, mode } = useAppMode();

  const visibleProperties = useMemo(() => {
    return propertySamples.filter((property) => {
      const searchText = `${property.title} ${property.location}`.toLowerCase();
      return searchText.includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.32em] text-gold-300">Marketplace discovery</p>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Browse curated real estate listings</h2>
          <p className="max-w-2xl text-sm leading-6 text-blue-300">
            Explore listings optimized for {mode === "short-term" ? "short-term stays" : mode === "long-term" ? "long-term rentals" : "property sales"} on Stellar’s low-fee protocol.
          </p>
        </div>

        <div className="rounded-[2rem] border border-blue-800/70 bg-blue-950/90 p-6 shadow-xl shadow-black/20">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-400">Live filtering</p>
              <p className="mt-2 text-lg font-semibold text-foreground">Search across listings and locations</p>
            </div>
            <div className="grid gap-3">
              <Input
                label="Quick search"
                value={searchQuery}
                placeholder="Search by property or city"
                onChange={(event) => setSearchQuery(event.target.value)}
                className="bg-blue-900/90"
              />
              <Button variant="secondary" className="w-full">
                Browse listings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </section>
  );
}
