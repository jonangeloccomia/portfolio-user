export type Align = "left" | "center";

export type Breakpoint = "desktop" | "tablet" | "mobile";
export type OverridableBreakpoint = Exclude<Breakpoint, "desktop">;
export type Responsive<T> = Partial<Record<OverridableBreakpoint, T>>;
