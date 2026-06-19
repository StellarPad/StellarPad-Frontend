import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppModeProvider } from "@/context/app-mode-context";
import { WalletProvider } from "@/context/wallet-context";
import { ToastProvider } from "@/context/toast-context";
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
        <ErrorBoundary>
          <AppModeProvider>
            <WalletProvider>
              <ToastProvider>
                <CurrencyProvider>
                  <TxFeedbackProvider>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </TxFeedbackProvider>
                </CurrencyProvider>
              </ToastProvider>
            </WalletProvider>
          </AppModeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
