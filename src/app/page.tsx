import HeroSearch from "@/components/HeroSearch";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import { SmartEscrowVisualizer } from "@/components/SmartEscrowVisualizer";
import { SavingsMeter } from "@/components/SavingsMeter";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { TxFeedbackDemo } from "@/components/TxFeedback";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSearch />

      {/* Solution widgets */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-1 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-blue-400">Problems we solve</p>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Built to fix real estate's biggest failures</h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <SmartEscrowVisualizer />
          <SavingsMeter />
        </div>
      </section>

      {/* Currency + Tx feedback */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Fiat ↔ Stablecoin</p>
            <CurrencyToggle />
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Network feedback</p>
            <TxFeedbackDemo />
          </div>
        </div>
      </section>

      <MarketplaceGrid />
    </div>
  );
}
