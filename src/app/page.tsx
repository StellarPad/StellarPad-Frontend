import HeroSearch from "@/components/HeroSearch";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import { SmartEscrowVisualizer } from "@/components/SmartEscrowVisualizer";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSearch />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <SmartEscrowVisualizer />
      </div>
      <MarketplaceGrid />
    </div>
  );
}
