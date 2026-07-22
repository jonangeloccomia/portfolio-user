"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { Breakpoint } from "./types";

type ResponsivePreviewValue = {
  breakpoint: Breakpoint;
  setBreakpoint: (breakpoint: Breakpoint) => void;
};

const ResponsivePreviewContext = createContext<ResponsivePreviewValue | null>(null);

export function ResponsivePreviewProvider({ children }: { children: ReactNode }) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  return (
    <ResponsivePreviewContext.Provider value={{ breakpoint, setBreakpoint }}>
      {children}
    </ResponsivePreviewContext.Provider>
  );
}

export function useResponsivePreview(): ResponsivePreviewValue {
  const context = useContext(ResponsivePreviewContext);
  if (!context) {
    throw new Error("useResponsivePreview must be used within a ResponsivePreviewProvider");
  }
  return context;
}
