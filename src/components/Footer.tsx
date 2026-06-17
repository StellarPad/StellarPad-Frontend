import Link from "next/link";
import { Layers } from "lucide-react";

const LINKS = [
  { label: "Marketplace", href: "/" },
  { label: "List Property", href: "/list" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Portal", href: "/portal" },
  { label: "Disputes", href: "/disputes" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-blue-800 bg-blue-900/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          {/* Brand */}
          <div className="flex items-center gap-2 font-bold text-base">
            <Layers className="h-4 w-4 text-gold-400" />
            <span className="text-foreground">Stellar</span>
            <span className="text-gold-400">Pad</span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:justify-start">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-blue-400 transition hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Legal */}
          <p className="text-xs text-blue-500 text-center sm:text-right">
            © {new Date().getFullYear()} StellarPad Protocol<br />
            <span className="text-blue-600">0% Fees · Stellar Network</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
