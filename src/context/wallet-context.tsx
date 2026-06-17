"use client";

import * as React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WalletProvider = "freighter" | "albedo" | "passkey" | null;
export type NetworkId = "mainnet" | "testnet";

export interface AssetBalance {
  asset: string; // e.g. "XLM", "USDC", "EURC"
  balance: string;
  issuer?: string;
}

export interface WalletState {
  connected: boolean;
  provider: WalletProvider;
  address: string | null;
  network: NetworkId;
  balances: AssetBalance[];
  connecting: boolean;
  error: string | null;
}

interface WalletContextValue extends WalletState {
  connect: (provider: WalletProvider) => Promise<void>;
  disconnect: () => void;
  switchNetwork: (network: NetworkId) => void;
  refreshBalances: () => Promise<void>;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const INITIAL_STATE: WalletState = {
  connected: false,
  provider: null,
  address: null,
  network: "testnet",
  balances: [],
  connecting: false,
  error: null,
};

const WalletContext = React.createContext<WalletContextValue | undefined>(undefined);

// ─── Mock helpers (replaced by real SDK calls when integrated) ───────────────

function mockAddress(provider: WalletProvider): string {
  const seeds: Record<NonNullable<WalletProvider>, string> = {
    freighter: "GDZL6FXQNABKQEBQZXRTSQJ4GXUPUQXYWLGNEHFWEZXIGJYAWJBQJMS",
    albedo:    "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
    passkey:   "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGBIG5I8B8U5FFBUZ9VT5",
  };
  return seeds[provider as NonNullable<WalletProvider>] ?? "";
}

async function mockFetchBalances(address: string, network: NetworkId): Promise<AssetBalance[]> {
  // Simulated horizon response — replace with real Horizon SDK call
  await new Promise((r) => setTimeout(r, 600));
  void address; void network;
  return [
    { asset: "XLM",  balance: "2,458.92" },
    { asset: "USDC", balance: "1,200.00", issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" },
    { asset: "EURC", balance: "890.50",   issuer: "GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP" },
  ];
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<WalletState>(INITIAL_STATE);

  const connect = React.useCallback(async (provider: WalletProvider) => {
    if (!provider) return;
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      // Placeholder: real impl would call window.freighter.getPublicKey() etc.
      await new Promise((r) => setTimeout(r, 800));
      const address = mockAddress(provider);
      const balances = await mockFetchBalances(address, state.network);
      setState((s) => ({
        ...s,
        connected: true,
        provider,
        address,
        balances,
        connecting: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        connecting: false,
        error: err instanceof Error ? err.message : "Connection failed",
      }));
    }
  }, [state.network]);

  const disconnect = React.useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const switchNetwork = React.useCallback((network: NetworkId) => {
    setState((s) => ({ ...s, network, balances: [] }));
  }, []);

  const refreshBalances = React.useCallback(async () => {
    if (!state.address) return;
    const balances = await mockFetchBalances(state.address, state.network);
    setState((s) => ({ ...s, balances }));
  }, [state.address, state.network]);

  const value: WalletContextValue = React.useMemo(
    () => ({ ...state, connect, disconnect, switchNetwork, refreshBalances }),
    [state, connect, disconnect, switchNetwork, refreshBalances],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWallet(): WalletContextValue {
  const ctx = React.useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
