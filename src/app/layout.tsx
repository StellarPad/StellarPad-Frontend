import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppModeProvider } from "@/context/app-mode-context";
import { WalletProvider } from "@/context/wallet-context";
import { CurrencyProvider } from "@/components/CurrencyToggle";
import { TxFeedbackProvider } from "@/components/TxFeedback";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StellarPad — Decentralized Real Estate Protocol",
  description: "0% Intermediary Fees. 100% Cryptographic Trust.",
  keywords: ["real estate", "stellar", "blockchain", "defi", "property"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} bg-blue-950 text-foreground`}>
      <body className="min-h-screen flex flex-col bg-transparent text-foreground">
        <AppModeProvider>
          <WalletProvider>
            <CurrencyProvider>
              <TxFeedbackProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </TxFeedbackProvider>
            </CurrencyProvider>
          </WalletProvider>
        </AppModeProvider>
      </body>
    </html>
  );
}
