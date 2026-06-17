"use client";

import * as React from "react";

export type TransactionMode = "short-term" | "long-term" | "buy";

interface AppModeContextValue {
  mode: TransactionMode;
  setMode: (mode: TransactionMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppModeContext = React.createContext<AppModeContextValue | undefined>(undefined);

export function AppModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<TransactionMode>("short-term");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  return (
    <AppModeContext.Provider value={{ mode, setMode, searchQuery, setSearchQuery }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const context = React.useContext(AppModeContext);
  if (!context) {
    throw new Error("useAppMode must be used within AppModeProvider");
  }
  return context;
}
