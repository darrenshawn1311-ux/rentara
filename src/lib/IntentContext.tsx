"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserIntent } from "@/types";

interface IntentContextType {
  intent: UserIntent;
  setIntent: (intent: UserIntent) => void;
  clearIntent: () => void;
}

const IntentContext = createContext<IntentContextType | null>(null);

export function IntentProvider({ children }: { children: ReactNode }) {
  const [intent, setIntentState] = useState<UserIntent>(null);

  useEffect(() => {
    const stored = localStorage.getItem("rentara-intent") as UserIntent;
    if (stored === "renter" || stored === "agent") setIntentState(stored);
  }, []);

  const setIntent = (i: UserIntent) => {
    setIntentState(i);
    if (i) localStorage.setItem("rentara-intent", i);
  };

  const clearIntent = () => {
    setIntentState(null);
    localStorage.removeItem("rentara-intent");
  };

  return (
    <IntentContext.Provider value={{ intent, setIntent, clearIntent }}>
      {children}
    </IntentContext.Provider>
  );
}

export function useIntent() {
  const ctx = useContext(IntentContext);
  if (!ctx) throw new Error("useIntent must be used within IntentProvider");
  return ctx;
}
