import type { GeneratedPage, Section, Theme } from "./schema";

type Spacing = { top: string; right: string; bottom: string; left: string };
type Breakpoint = "tablet" | "mobile";
type ResponsiveSpacing = Partial<Record<Breakpoint, Spacing>>;
type ResponsiveNumber = Partial<Record<Breakpoint, number>>;
type ResponsiveString = Partial<Record<Breakpoint, string>>;

type CraftNode = {
  type: { resolvedName: string };
  isCanvas: boolean;
  props: Record<string, unknown>;
  displayName: string;
  custom: Record<string, unknown>;
  parent?: string;
  hidden: boolean;
  nodes: string[];
  linkedNodes: Record<string, string>;
};

export type CraftContent = Record<string, CraftNode>;

const ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateId(): string {
  let id = "";
  for (let i = 0; i < 10; i++) {
    id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return id;
}

// ---- construction tokens ---------------------------------------------------
const ZERO: Spacing = { top: "0", right: "0", bottom: "0", left: "0" };
const AUTO_X: Spacing = { top: "0", right: "auto", bottom: "0", left: "auto" };

// Vertical rhythm tightens as the viewport narrows.
const BAND_PADDING: Spacing = { top: "80", right: "24", bottom: "80", left: "24" };
const BAND_PADDING_RESPONSIVE: ResponsiveSpacing = {
  tablet: { top: "56", right: "24", bottom: "56", left: "24" },
  mobile: { top: "40", right: "16", bottom: "40", left: "16" },
};
const NAV_PADDING: Spacing = { top: "18", right: "24", bottom: "18", left: "24" };
const NAV_PADDING_RESPONSIVE: ResponsiveSpacing = {
  mobile: { top: "14", right: "16", bottom: "14", left: "16" },
};
const FOOTER_PADDING: Spacing = { top: "36", right: "24", bottom: "36", left: "24" };
const FOOTER_PADDING_RESPONSIVE: ResponsiveSpacing = {
  mobile: { top: "28", right: "16", bottom: "28", left: "16" },
};
const CARD_PADDING: Spacing = { top: "28", right: "28", bottom: "28", left: "28" };
const CARD_PADDING_RESPONSIVE: ResponsiveSpacing = {
  mobile: { top: "22", right: "22", bottom: "22", left: "22" },
};
const CTA_PADDING: Spacing = { top: "14", right: "26", bottom: "14", left: "26" };

const INNER_WIDTH = "1024";
const NARROW_WIDTH = "760";
const CARD_RADIUS = 16;
const MEDIA_RADIUS = 16;
const BTN_RADIUS = 10;
const CHIP_SIZE = "48";
const HEADING_LINE_HEIGHT = 1.2;
const BODY_LINE_HEIGHT = 1.6;

// Type scale: every size ships with its tablet/mobile step-downs so a 52px
// hero headline doesn't overflow a 380px screen.
type FontStep = { base: number; tablet: number; mobile: number };
const FS = {
  hero: { base: 52, tablet: 40, mobile: 32 },
  sectionHeading: { base: 36, tablet: 30, mobile: 26 },
  splitHeading: { base: 34, tablet: 28, mobile: 24 },
  ctaHeading: { base: 38, tablet: 30, mobile: 26 },
  cardTitle: { base: 20, tablet: 20, mobile: 18 },
  brand: { base: 22, tablet: 20, mobile: 18 },
  eyebrow: { base: 13, tablet: 13, mobile: 12 },
  lead: { base: 17, tablet: 16, mobile: 16 },
  body: { base: 16, tablet: 15, mobile: 15 },
  cardBody: { base: 15, tablet: 15, mobile: 14 },
  small: { base: 14, tablet: 14, mobile: 13 },
} satisfies Record<string, FontStep>;

function responsiveFont(step: FontStep): ResponsiveNumber {
  return { tablet: step.tablet, mobile: step.mobile };
}

type Palette = {
  background: string;
  surface: string;
  heading: string;
  body: string;
  muted: string;
  accent: string;
  accentText: string;
  eyebrow: string;
  cardBg: string;
  cardBorder: string;
  chipBg: string;
  mediaBg: string;
};

// "light" / "brand" / "dark" mirror the refreshed on-brand green/near-black
// system in lib/starter-templates.ts. The rest are a curated, contrast-checked
// bank of distinct moods so generated pages aren't always a recolor of the
// brand theme — Claude picks a theme name, never raw hex.
const THEME_PALETTE: Record<Theme, Palette> = {
  light: {
    background: "#ffffff",
    surface: "#f6f9f7",
    heading: "#0f1a14",
    body: "#6b7280",
    muted: "#9ca3af",
    accent: "#16a34a",
    accentText: "#ffffff",
    eyebrow: "#16a34a",
    cardBg: "#ffffff",
    cardBorder: "1px solid #e8ede9",
    chipBg: "#dcfce7",
    mediaBg: "#f6f9f7",
  },
  brand: {
    background: "#16a34a",
    surface: "#16a34a",
    heading: "#ffffff",
    body: "#dcfce7",
    muted: "#bbf7d0",
    accent: "#ffffff",
    accentText: "#166534",
    eyebrow: "#dcfce7",
    cardBg: "#15803d",
    cardBorder: "1px solid rgba(255,255,255,0.22)",
    chipBg: "#ffffff",
    mediaBg: "#15803d",
  },
  dark: {
    background: "#0c1411",
    surface: "#0c1411",
    heading: "#ffffff",
    body: "#9ca3af",
    muted: "#6b7280",
    accent: "#16a34a",
    accentText: "#ffffff",
    eyebrow: "#4ade80",
    cardBg: "#131f19",
    cardBorder: "1px solid rgba(255,255,255,0.08)",
    chipBg: "#16a34a",
    mediaBg: "#131f19",
  },
  warm: {
    background: "#fdf6ec",
    surface: "#f8ecd9",
    heading: "#9a3412",
    body: "#78350f",
    muted: "#b45309",
    accent: "#c2410c",
    accentText: "#ffffff",
    eyebrow: "#c2410c",
    cardBg: "#ffffff",
    cardBorder: "1px solid #ecd9bf",
    chipBg: "#fde4d3",
    mediaBg: "#f8ecd9",
  },
  cool: {
    background: "#f0f5fa",
    surface: "#e6eef7",
    heading: "#1e3a5f",
    body: "#475569",
    muted: "#64748b",
    accent: "#1e3a5f",
    accentText: "#ffffff",
    eyebrow: "#2563eb",
    cardBg: "#ffffff",
    cardBorder: "1px solid #d5e2ef",
    chipBg: "#dbe7f5",
    mediaBg: "#e6eef7",
  },
  bold: {
    background: "#0f172a",
    surface: "#0f172a",
    heading: "#ffffff",
    body: "#cbd5e1",
    muted: "#94a3b8",
    accent: "#f97316",
    accentText: "#0f172a",
    eyebrow: "#f97316",
    cardBg: "#16213b",
    cardBorder: "1px solid rgba(255,255,255,0.08)",
    chipBg: "#f97316",
    mediaBg: "#16213b",
  },
  pastel: {
    background: "#f5f0ff",
    surface: "#ece2ff",
    heading: "#6d28d9",
    body: "#4c1d95",
    muted: "#7c3aed",
    accent: "#6d28d9",
    accentText: "#ffffff",
    eyebrow: "#7c3aed",
    cardBg: "#ffffff",
    cardBorder: "1px solid #e2d5fb",
    chipBg: "#e9dcff",
    mediaBg: "#ece2ff",
  },
  mono: {
    background: "#f8f8f8",
    surface: "#efefef",
    heading: "#18181b",
    body: "#52525b",
    muted: "#71717a",
    accent: "#18181b",
    accentText: "#ffffff",
    eyebrow: "#18181b",
    cardBg: "#ffffff",
    cardBorder: "1px solid #e4e4e7",
    chipBg: "#e4e4e7",
    mediaBg: "#efefef",
  },
};

function addNode(tree: CraftContent, id: string, node: CraftNode) {
  tree[id] = node;
}

function attach(tree: CraftContent, parentId: string, childId: string) {
  tree[parentId].nodes.push(childId);
}

// ---- prop factories --------------------------------------------------------
// Every Container gets the full prop set so the editor's settings panels always
// have something to bind to (missing keys make controls render undefined).

type ContainerOpts = {
  background: string;
  padding?: Spacing;
  paddingResponsive?: ResponsiveSpacing;
  margin?: Spacing;
  marginResponsive?: ResponsiveSpacing;
  borderRadius?: number;
  border?: string;
  display: "flex" | "grid";
  flexDirection?: "row" | "column";
  flexDirectionResponsive?: ResponsiveString;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  columns?: number;
  columnsResponsive?: ResponsiveNumber;
  gridTemplateColumns?: string;
  gridTemplateColumnsResponsive?: ResponsiveString;
  gridTemplateRows?: string;
};

function containerProps(o: ContainerOpts): Record<string, unknown> {
  return {
    background: o.background,
    padding: o.padding ?? ZERO,
    paddingResponsive: o.paddingResponsive ?? {},
    margin: o.margin ?? ZERO,
    marginResponsive: o.marginResponsive ?? {},
    borderRadius: o.borderRadius ?? 0,
    border: o.border ?? "",
    display: o.display,
    flexDirection: o.flexDirection ?? "column",
    flexDirectionResponsive: o.flexDirectionResponsive ?? {},
    justifyContent: o.justifyContent ?? "flex-start",
    alignItems: o.alignItems ?? "stretch",
    gap: o.gap ?? "20",
    width: o.width ?? "100%",
    height: o.height ?? "max-content",
    maxWidth: o.maxWidth ?? "",
    columns: o.columns ?? 3,
    columnsResponsive: o.columnsResponsive ?? {},
    gridTemplateColumns: o.gridTemplateColumns ?? "",
    gridTemplateColumnsResponsive: o.gridTemplateColumnsResponsive ?? {},
    gridTemplateRows: o.gridTemplateRows ?? "",
  };
}

function container(tree: CraftContent, parent: string, o: ContainerOpts): string {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "Container" },
    isCanvas: true,
    props: containerProps(o),
    displayName: "Container",
    custom: {},
    parent,
    hidden: false,
    nodes: [],
    linkedNodes: {},
  });
  attach(tree, parent, id);
  return id;
}

// Desktop track list + the tablet/mobile collapse, expressed through BOTH the
// `columns` and `gridTemplateColumns` channels so the Container resolves the
// same layout whichever one it reads.
function gridTracks(
  desktop: number | string,
  opts: { tablet: number; mobile: number },
): Pick<
  ContainerOpts,
  "columns" | "columnsResponsive" | "gridTemplateColumns" | "gridTemplateColumnsResponsive"
> {
  const repeat = (n: number) => Array(n).fill("1fr").join(" ");
  const desktopTracks = typeof desktop === "number" ? repeat(desktop) : desktop;
  const desktopCount =
    typeof desktop === "number" ? desktop : desktop.trim().split(/\s+/).length;
  return {
    columns: desktopCount,
    gridTemplateColumns: desktopTracks,
    columnsResponsive: { tablet: opts.tablet, mobile: opts.mobile },
    gridTemplateColumnsResponsive: {
      tablet: repeat(opts.tablet),
      mobile: repeat(opts.mobile),
    },
  };
}

// A full-bleed section band wrapping a centered, max-width-constrained inner
// container. Returns the inner id — callers attach content there.
function makeBand(
  tree: CraftContent,
  parent: string,
  opts: {
    background: string;
    innerDisplay: "flex" | "grid";
    innerFlexDirection?: "row" | "column";
    innerJustify?: string;
    innerAlign?: string;
    innerGap?: string;
    innerMaxWidth?: string;
    tracks?: ReturnType<typeof gridTracks>;
  },
): string {
  const outer = container(tree, parent, {
    background: opts.background,
    padding: BAND_PADDING,
    paddingResponsive: BAND_PADDING_RESPONSIVE,
    margin: AUTO_X,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "0",
    width: "100%",
  });
  const inner = container(tree, outer, {
    background: "transparent",
    margin: AUTO_X,
    display: opts.innerDisplay,
    flexDirection: opts.innerFlexDirection ?? "column",
    justifyContent: opts.innerJustify ?? "flex-start",
    alignItems: opts.innerAlign ?? "stretch",
    gap: opts.innerGap ?? "20",
    width: "100%",
    maxWidth: opts.innerMaxWidth ?? INNER_WIDTH,
    ...(opts.tracks ?? {}),
  });
  return inner;
}

// Transparent, unpadded layout group nested inside a band.
function makeGroup(
  tree: CraftContent,
  parent: string,
  opts: {
    display: "flex" | "grid";
    flexDirection?: "row" | "column";
    flexDirectionResponsive?: ResponsiveString;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    width?: string;
    tracks?: ReturnType<typeof gridTracks>;
  },
): string {
  return container(tree, parent, {
    background: "transparent",
    display: opts.display,
    flexDirection: opts.flexDirection ?? "column",
    flexDirectionResponsive: opts.flexDirectionResponsive ?? {},
    justifyContent: opts.justifyContent ?? "flex-start",
    alignItems: opts.alignItems ?? "stretch",
    gap: opts.gap ?? "20",
    width: opts.width ?? "auto",
    ...(opts.tracks ?? {}),
  });
}

// ImageBlock has no borderRadius prop, so rounding lives on a wrapper.
function makeMediaFrame(tree: CraftContent, parent: string, palette: Palette): string {
  return container(tree, parent, {
    background: palette.mediaBg,
    borderRadius: MEDIA_RADIUS,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0",
    width: "100%",
  });
}

function makeCard(tree: CraftContent, parent: string, palette: Palette): string {
  return container(tree, parent, {
    background: palette.cardBg,
    padding: CARD_PADDING,
    paddingResponsive: CARD_PADDING_RESPONSIVE,
    borderRadius: CARD_RADIUS,
    border: palette.cardBorder,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "14",
    width: "100%",
    height: "auto",
  });
}

function makeChip(tree: CraftContent, parent: string, palette: Palette): string {
  return container(tree, parent, {
    background: palette.chipBg,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "0",
    width: CHIP_SIZE,
    height: CHIP_SIZE,
  });
}

function makeHeader(
  tree: CraftContent,
  parent: string,
  text: string,
  color: string,
  step: FontStep,
  align: "left" | "center" | "right",
  level: string = "h2",
) {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "Header" },
    isCanvas: false,
    props: {
      text,
      level,
      align,
      textColor: color,
      fontSize: step.base,
      fontSizeResponsive: responsiveFont(step),
      lineHeight: HEADING_LINE_HEIGHT,
      padding: ZERO,
      margin: ZERO,
    },
    displayName: "Header",
    custom: {},
    parent,
    hidden: false,
    nodes: [],
    linkedNodes: {},
  });
  attach(tree, parent, id);
}

function makeTextBlock(
  tree: CraftContent,
  parent: string,
  text: string,
  color: string,
  align: "left" | "center" | "right",
  step: FontStep = FS.body,
) {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "TextBlock" },
    isCanvas: false,
    props: {
      text,
      align,
      textColor: color,
      fontSize: step.base,
      fontSizeResponsive: responsiveFont(step),
      lineHeight: BODY_LINE_HEIGHT,
      padding: ZERO,
      margin: ZERO,
    },
    displayName: "Text",
    custom: {},
    parent,
    hidden: false,
    nodes: [],
    linkedNodes: {},
  });
  attach(tree, parent, id);
}

function makeEyebrow(
  tree: CraftContent,
  parent: string,
  text: string,
  palette: Palette,
  align: "left" | "center",
) {
  makeTextBlock(tree, parent, text.toUpperCase(), palette.eyebrow, align, FS.eyebrow);
}

function makeImage(
  tree: CraftContent,
  parent: string,
  width: number,
  height: number,
  opts: { alt?: string; grayscale?: boolean; width?: string } = {},
) {
  const id = generateId();
  // Seeded URL so the page is stable across reloads instead of reshuffling.
  const src = `https://picsum.photos/seed/${id}/${width}/${height}${opts.grayscale ? "?grayscale" : ""
    }`;
  addNode(tree, id, {
    type: { resolvedName: "ImageBlock" },
    isCanvas: false,
    props: { src, alt: opts.alt ?? "", width: opts.width ?? "100%", height: "auto" },
    displayName: "Image",
    custom: {},
    parent,
    hidden: false,
    nodes: [],
    linkedNodes: {},
  });
  attach(tree, parent, id);
}

function makeCtaButton(
  tree: CraftContent,
  parent: string,
  label: string,
  palette: Palette,
  variant: "primary" | "secondary" = "primary",
) {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "CtaButton" },
    isCanvas: false,
    props: {
      label,
      href: "#",
      variant,
      backgroundColor: palette.accent,
      textColor: palette.accentText,
      fontSize: FS.body.base,
      fontSizeResponsive: responsiveFont(FS.body),
      borderRadius: BTN_RADIUS,
      width: "max-content",
      height: "max-content",
      padding: CTA_PADDING,
      margin: ZERO,
    },
    displayName: "Button",
    custom: {},
    parent,
    hidden: false,
    nodes: [],
    linkedNodes: {},
  });
  attach(tree, parent, id);
}

// ---- section builders ------------------------------------------------------

function buildHero(tree: CraftContent, rootId: string, section: Extract<Section, { type: "hero" }>) {
  const palette = THEME_PALETTE[section.theme];
  const inner = makeBand(tree, rootId, {
    background: palette.background,
    innerDisplay: "grid",
    innerAlign: "center",
    innerGap: "48",
    tracks: section.withImage
      ? gridTracks("1.1fr 1fr", { tablet: 1, mobile: 1 })
      : gridTracks(1, { tablet: 1, mobile: 1 }),
  });

  const textCol = makeGroup(tree, inner, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "20",
    width: "auto",
  });
  if (section.eyebrow) makeEyebrow(tree, textCol, section.eyebrow, palette, "left");
  makeHeader(tree, textCol, section.headline, palette.heading, FS.hero, "left", "h1");
  makeTextBlock(tree, textCol, section.body, palette.body, "left", FS.lead);
  if (section.buttonLabel) {
    const btnRow = makeGroup(tree, textCol, {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "12",
      width: "auto",
    });
    makeCtaButton(tree, btnRow, section.buttonLabel, palette);
  }

  if (section.withImage) {
    const frame = makeMediaFrame(tree, inner, palette);
    makeImage(tree, frame, 900, 680);
  }
}

function buildFeatureGrid(
  tree: CraftContent,
  rootId: string,
  section: Extract<Section, { type: "feature_grid" }>,
) {
  const palette = THEME_PALETTE[section.theme];
  const inner = makeBand(tree, rootId, {
    background: palette.surface,
    innerDisplay: "flex",
    innerFlexDirection: "column",
    innerAlign: "center",
    innerGap: "32",
  });

  if (section.headline) {
    makeHeader(tree, inner, section.headline, palette.heading, FS.sectionHeading, "center");
  }

  const grid = makeGroup(tree, inner, {
    display: "grid",
    alignItems: "center",
    gap: "20",
    width: "100%",
    tracks: gridTracks(section.imageCount, {
      tablet: Math.min(section.imageCount, 3),
      mobile: 2,
    }),
  });

  // Uniform aspect ratio across the row — the old builder grew each image,
  // which made the strip ragged inside equal 1fr tracks.
  for (let i = 0; i < section.imageCount; i++) {
    const frame = makeMediaFrame(tree, grid, palette);
    makeImage(tree, frame, 640, 400);
  }
}

function buildFeatureCards(
  tree: CraftContent,
  rootId: string,
  section: Extract<Section, { type: "feature_cards" }>,
) {
  const palette = THEME_PALETTE[section.theme];
  const count = section.cards.length;
  const inner = makeBand(tree, rootId, {
    background: palette.surface,
    innerDisplay: "flex",
    innerFlexDirection: "column",
    innerAlign: "center",
    innerGap: "40",
  });

  if (section.eyebrow) makeEyebrow(tree, inner, section.eyebrow, palette, "center");
  if (section.headline) {
    makeHeader(tree, inner, section.headline, palette.heading, FS.sectionHeading, "center");
  }

  const grid = makeGroup(tree, inner, {
    display: "grid",
    alignItems: "stretch",
    gap: "24",
    width: "100%",
    tracks: gridTracks(count, { tablet: Math.min(count, 2), mobile: 1 }),
  });

  for (const card of section.cards) {
    const cardId = makeCard(tree, grid, palette);
    makeChip(tree, cardId, palette);
    makeHeader(tree, cardId, card.title, palette.heading, FS.cardTitle, "left", "h3");
    makeTextBlock(tree, cardId, card.body, palette.body, "left", FS.cardBody);
  }
}

function buildContentSplit(
  tree: CraftContent,
  rootId: string,
  section: Extract<Section, { type: "content_split" }>,
) {
  const palette = THEME_PALETTE[section.theme];
  const inner = makeBand(tree, rootId, {
    background: palette.background,
    innerDisplay: "grid",
    innerAlign: "center",
    innerGap: "48",
    tracks: gridTracks(2, { tablet: 1, mobile: 1 }),
  });

  const frame = makeMediaFrame(tree, inner, palette);
  makeImage(tree, frame, 900, 720);

  const textCol = makeGroup(tree, inner, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "18",
    width: "auto",
  });
  if (section.eyebrow) makeEyebrow(tree, textCol, section.eyebrow, palette, "left");
  makeHeader(tree, textCol, section.headline, palette.heading, FS.splitHeading, "left");
  makeTextBlock(tree, textCol, section.body, palette.body, "left", FS.lead);
}

function buildCtaBanner(
  tree: CraftContent,
  rootId: string,
  section: Extract<Section, { type: "cta_banner" }>,
) {
  const palette = THEME_PALETTE[section.theme];
  const inner = makeBand(tree, rootId, {
    background: palette.background,
    innerDisplay: "flex",
    innerFlexDirection: "column",
    innerJustify: "center",
    innerAlign: "center",
    innerGap: "18",
    innerMaxWidth: NARROW_WIDTH,
  });

  if (section.eyebrow) makeEyebrow(tree, inner, section.eyebrow, palette, "center");
  makeHeader(tree, inner, section.headline, palette.heading, FS.ctaHeading, "center");
  makeTextBlock(tree, inner, section.body, palette.body, "center", FS.lead);
  makeCtaButton(tree, inner, section.buttonLabel, palette);
}

// ---- chrome: nav + footer (static, derived from the template name) ---------

function buildNav(tree: CraftContent, rootId: string, brand: string) {
  const light = THEME_PALETTE.light;
  const outer = container(tree, rootId, {
    background: "#ffffff",
    padding: NAV_PADDING,
    paddingResponsive: NAV_PADDING_RESPONSIVE,
    margin: AUTO_X,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "0",
    width: "100%",
    maxWidth: "1024",
  });
  const inner = container(tree, outer, {
    background: "transparent",
    margin: AUTO_X,
    display: "flex",
    flexDirection: "row",
    flexDirectionResponsive: { mobile: "row" },
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20",
    width: "100%",
    maxWidth: INNER_WIDTH,
  });
  makeHeader(tree, inner, brand, light.accent, FS.brand, "left", "h1");
  makeCtaButton(tree, inner, "Get started", light);
}

function buildFooter(tree: CraftContent, rootId: string, brand: string) {
  const year = new Date().getFullYear();
  const outer = container(tree, rootId, {
    background: "#0c1411",
    padding: FOOTER_PADDING,
    paddingResponsive: FOOTER_PADDING_RESPONSIVE,
    margin: AUTO_X,
    display: "grid",
    flexDirection: "column",
    alignItems: "center",
    gap: "0",
    width: "100%",
    gridTemplateColumns: "1fr",
    gridTemplateColumnsResponsive: {
      tablet: "1fr",
      mobile: "1fr",
    }
  });
  const inner = container(tree, outer, {
    background: "transparent",
    margin: AUTO_X,
    display: "flex",
    flexDirection: "row",
    flexDirectionResponsive: { mobile: "column" },
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20",
    width: "100%",
    maxWidth: INNER_WIDTH,
  });
  makeHeader(tree, inner, brand, "#4ade80", FS.cardTitle, "left", "h3");
  makeTextBlock(
    tree,
    inner,
    `© ${year} ${brand}. All rights reserved.`,
    "#9ca3af",
    "right",
    FS.small,
  );
}

export function buildCraftContent(page: GeneratedPage): CraftContent {
  const tree: CraftContent = {};
  tree.ROOT = {
    type: { resolvedName: "PageCanvas" },
    isCanvas: true,
    props: { background: "#ffffff", textColor: "#0f1a14", padding: ZERO },
    displayName: "Page",
    custom: {},
    hidden: false,
    nodes: [],
    linkedNodes: {},
  };

  buildNav(tree, "ROOT", page.templateName);

  for (const section of page.sections) {
    switch (section.type) {
      case "hero":
        buildHero(tree, "ROOT", section);
        break;
      case "feature_grid":
        buildFeatureGrid(tree, "ROOT", section);
        break;
      case "feature_cards":
        buildFeatureCards(tree, "ROOT", section);
        break;
      case "content_split":
        buildContentSplit(tree, "ROOT", section);
        break;
      case "cta_banner":
        buildCtaBanner(tree, "ROOT", section);
        break;
    }
  }

  buildFooter(tree, "ROOT", page.templateName);

  return tree;
}
