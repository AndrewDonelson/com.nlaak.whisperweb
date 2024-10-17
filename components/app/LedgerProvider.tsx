// file: @/components/app/LedgerProvider.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ledgerManager } from '@/lib/ledger';

interface LedgerContextType {
  ledgerManager: typeof ledgerManager;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // We don't need to call initializeLedger() as it's handled in the constructor
    // Just ensure that the ledgerManager is fully initialized before rendering children
    setIsReady(true);
  }, []);

  if (!isReady) {
    // You might want to render a loading indicator here
    return null;
  }

  return (
    <LedgerContext.Provider value={{ ledgerManager }}>
      {children}
    </LedgerContext.Provider>
  );
};