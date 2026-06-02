'use client';

import { createContext, useContext, useRef, type MutableRefObject } from 'react';

interface ProgressContextValue {
  progressRef: MutableRefObject<number>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const progressRef = useRef(0);
  return (
    <ProgressContext.Provider value={{ progressRef }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressRef(): MutableRefObject<number> {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgressRef must be used inside ProgressProvider');
  return ctx.progressRef;
}
