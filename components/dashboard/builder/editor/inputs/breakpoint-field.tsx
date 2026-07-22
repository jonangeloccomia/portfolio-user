"use client";

import type { Breakpoint } from "../types";

const BREAKPOINT_SUFFIX: Record<Exclude<Breakpoint, "desktop">, string> = {
  tablet: "Tablet",
  mobile: "Mobile",
};

export function breakpointFieldLabel(baseLabel: string, breakpoint: Breakpoint): string {
  if (breakpoint === "desktop") return baseLabel;
  return `${baseLabel} — ${BREAKPOINT_SUFFIX[breakpoint]}`;
}

export function ResetToDefaultButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
    >
      Reset to default
    </button>
  );
}
