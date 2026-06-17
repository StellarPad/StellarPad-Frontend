import { Layers } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-blue-800 bg-blue-900/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 font-bold text-base">
            <Layers className="h-4 w-4 text-gold-400" />
            <span className="text-foreground">Stellar</span>
            <span className="text-gold-400">Pad</span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted text-center">
            0% Intermediary Fees · 100% Cryptographic Trust · Powered by{" "}
            <span className="text-gold-400 font-medium">Stellar</span>
          </p>

          {/* Legal */}
          <p className="text-xs text-muted">© {new Date().getFullYear()} StellarPad Protocol</p>
        </div>
      </div>
    </footer>
  );
}
