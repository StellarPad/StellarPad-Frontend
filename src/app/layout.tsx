import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StellarPad — Decentralized Real Estate Protocol",
  description: "0% Intermediary Fees. 100% Cryptographic Trust.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
