"use client";

import Link from "next/link";
import * as React from "react";
import { Layers, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { PasskeyModal } from "@/components/PasskeyModal";
import { WalletWidget } from "@/components/WalletWidget";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { ROUTES } from "@/constants";

export default function Navbar() {
  const [authOpen, setAuthOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: ROUTES.MARKETPLACE, label: "Marketplace" },
    { href: ROUTES.LIST_PROPERTY, label: "List Property" },
    { href: ROUTES.DASHBOARD, label: "Dashboard" },
    { href: ROUTES.PORTAL, label: "My Portal" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-blue-800 bg-blue-950/90 backdrop-blur-md">
        <div className="mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2 font-bold text-lg tracking-tight flex-shrink-0"
            >
              <Layers className="h-5 w-5 text-gold-400" />
              <span className="text-foreground">Stellar</span>
              <span className="text-gold-400">Pad</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-blue-400 flex-1 mx-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground transition-colors duration-200 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <CurrencyToggle compact />
              <WalletWidget onOpenAuth={() => setAuthOpen(true)} />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-blue-900/50 rounded-lg transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-foreground" />
                ) : (
                  <Menu className="h-5 w-5 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mode Toggle - Full Width Below */}
          <div className="mt-3 hidden md:flex mx-auto w-full max-w-4xl">
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-blue-800 bg-blue-950/95 backdrop-blur-sm animate-in fade-in slide-in-from-top-2"
          >
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 rounded-lg text-blue-400 hover:bg-blue-900/50 hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Mode Toggle */}
            <div className="px-4 py-3 border-t border-blue-800">
              <ModeToggle />
            </div>
          </div>
        )}
      </header>

      <PasskeyModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
