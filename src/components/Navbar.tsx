import Link from "next/link";
import { Layers } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-800 bg-blue-950/90 backdrop-blur-md">
      <div className="mx-auto flex flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Layers className="h-5 w-5 text-gold-400" />
            <span className="text-foreground">Stellar</span>
            <span className="text-gold-400">Pad</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-blue-400">
            <Link href="/marketplace" className="hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/list" className="hover:text-foreground transition-colors">
              List Property
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>

          <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            Connect Wallet
          </button>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
