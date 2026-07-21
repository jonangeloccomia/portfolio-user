"use client";

import { createContext, useContext, useState } from "react";

const FullscreenContext = createContext<{
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
} | null>(null);

export function FullscreenProvider({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <FullscreenContext.Provider value={{ isFullscreen, setIsFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreen() {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error("useFullscreen must be used within FullscreenProvider");
  }
  return context;
}
