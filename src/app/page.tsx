import HeroSearch from "@/components/HeroSearch";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import { SmartEscrowVisualizer } from "@/components/SmartEscrowVisualizer";
import { SavingsMeter } from "@/components/SavingsMeter";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSearch />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <SmartEscrowVisualizer />
          <SavingsMeter />
        </div>
      </div>
      <MarketplaceGrid />
    </div>
  );
}
