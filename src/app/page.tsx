import HeroSearch from "@/components/HeroSearch";
import MarketplaceGrid from "@/components/MarketplaceGrid";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSearch />
      <MarketplaceGrid />
    </div>
  );
}
