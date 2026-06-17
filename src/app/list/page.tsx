"use client";

import * as React from "react";
import { ListingWizardPart1, type ListingBasics } from "@/components/ListingWizardPart1";
import { ListingWizardPart2 } from "@/components/ListingWizardPart2";

export default function ListPage() {
  const [basics, setBasics] = React.useState<ListingBasics | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-blue-400">List a Property</p>
        <h1 className="text-3xl font-semibold text-foreground">Create a New Listing</h1>
        <p className="text-sm text-blue-300">Published to the Stellar network with a Soroban contract address.</p>
      </div>
      <div className="rounded-[2rem] border border-blue-800/80 bg-blue-950/90 p-6 sm:p-8">
        {!basics
          ? <ListingWizardPart1 onNext={setBasics} />
          : <ListingWizardPart2 basics={basics} onBack={() => setBasics(null)} />
        }
      </div>
    </div>
  );
}
