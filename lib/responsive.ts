import type { Spacing } from "@/components/dashboard/builder/editor/inputs/spacing-input";
import type { Breakpoint, OverridableBreakpoint, Responsive } from "@/components/dashboard/builder/editor/types";

export function defaultColumns(desktop: number, breakpoint: OverridableBreakpoint): number {
  if (breakpoint === "mobile") return 1;
  return Math.max(1, Math.ceil(desktop / 2));
}

export function defaultFlexDirection(
  desktop: "row" | "column",
  breakpoint: OverridableBreakpoint
): "row" | "column" {
  if (breakpoint === "tablet") return desktop;
  return desktop === "row" ? "column" : desktop;
}

function scaleLength(value: string, factor: number): string {
  const trimmed = (value ?? "").trim();
  if (trimmed === "" || Number.isNaN(Number(trimmed))) return trimmed;
  return String(Math.round(Number(trimmed) * factor));
}

export function defaultSpacing(desktop: Spacing, breakpoint: OverridableBreakpoint): Spacing {
  if (breakpoint === "tablet") return desktop;
  return {
    top: scaleLength(desktop.top, 0.5),
    right: scaleLength(desktop.right, 0.5),
    bottom: scaleLength(desktop.bottom, 0.5),
    left: scaleLength(desktop.left, 0.5),
  };
}

export function defaultFontSize(desktop: number, breakpoint: OverridableBreakpoint): number {
  if (breakpoint === "tablet") return desktop;
  return Math.max(14, Math.round(desktop * 0.8));
}

export function resolveResponsiveValue<T>(
  breakpoint: Breakpoint,
  base: T,
  responsive: Responsive<T> | undefined,
  computeDefault: (base: T, breakpoint: OverridableBreakpoint) => T
): T {
  if (breakpoint === "desktop") return base;
  const override = responsive?.[breakpoint];
  if (override !== undefined) return override;
  return computeDefault(base, breakpoint);
}

export function nodeResponsiveClassName(nodeId: string): string {
  return `rn-${nodeId}`;
}

type CSSDeclarationMap = Record<string, string>;

function camelToKebab(prop: string): string {
  return prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function toDeclarations(map: CSSDeclarationMap): string {
  return Object.entries(map)
    .map(([prop, value]) => `${camelToKebab(prop)}: ${value} !important;`)
    .join(" ");
}

export function buildResponsiveStyle(
  nodeId: string,
  rules: { tablet?: CSSDeclarationMap; mobile?: CSSDeclarationMap }
): string {
  const className = nodeResponsiveClassName(nodeId);
  const blocks: string[] = [];

  if (rules.tablet && Object.keys(rules.tablet).length > 0) {
    blocks.push(
      `@container page (max-width: 1023px) { .${className} { ${toDeclarations(rules.tablet)} } }`
    );
  }

  if (rules.mobile && Object.keys(rules.mobile).length > 0) {
    blocks.push(
      `@container page (max-width: 767px) { .${className} { ${toDeclarations(rules.mobile)} } }`
    );
  }

  return blocks.join("\n");
}

export function buildMaxWidthStyle(nodeId: string, maxWidth: string): string {
  if (!maxWidth) return "";
  const className = nodeResponsiveClassName(nodeId);
  return `@container page (min-width: 1024px) { .${className} { max-width: ${maxWidth} !important; margin-left: auto !important; margin-right: auto !important; } }`;
}
