import type { GeneratedPage, Section, Theme } from "./schema";

type Spacing = { top: string; right: string; bottom: string; left: string };

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
const BAND_PADDING: Spacing = { top: "80", right: "24", bottom: "80", left: "24" };
const CARD_PADDING: Spacing = { top: "28", right: "28", bottom: "28", left: "28" };
const CTA_PADDING: Spacing = { top: "14", right: "26", bottom: "14", left: "26" };

const INNER_WIDTH = "1024";
const CARD_RADIUS = 16;
const BTN_RADIUS = 10;
const CHIP_SIZE = "48";

// type scale
const FS = {
  hero: 52,
  splitHeading: 34,
  sectionHeading: 36,
  ctaHeading: 38,
  cardTitle: 20,
  brand: 22,
  eyebrow: 13,
  lead: 17,
  body: 16,
  cardBody: 15,
  small: 14,
} as const;

type Palette = {
  background: string; // section band background
  surface: string; // subtle alt background for card-bearing bands
  heading: string;
  body: string;
  muted: string;
  accent: string; // primary button / accent fill
  accentText: string; // text on the accent fill
  eyebrow: string; // kicker label color
  cardBg: string;
  cardBorder: string;
  chipBg: string;
};

// "light" / "brand" / "dark" are the site's refreshed on-brand green/near-black
// system (kept in sync with lib/starter-templates.ts). The rest are a curated,
// contrast-checked bank of distinct moods so generated pages aren't always a
// recolor of the brand theme — Claude picks a theme name, never raw hex, so
// every combination stays readable.
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
  },
};

function addNode(tree: CraftContent, id: string, node: CraftNode) {
  tree[id] = node;
}

function attach(tree: CraftContent, parentId: string, childId: string) {
  tree[parentId].nodes.push(childId);
}

function container(
  tree: CraftContent,
  parent: string,
  props: Record<string, unknown>,
): string {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "Container" },
    isCanvas: true,
    props,
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

// A full-bleed section band (100% wide, colored, vertical rhythm) wrapping a
// centered 1024 inner container that actually lays out the content. Returns the
// inner id so callers attach their content there.
function makeBand(
  tree: CraftContent,
  parent: string,
  opts: {
    background: string;
    innerDisplay: "flex" | "grid";
    innerFlexDirection?: "row" | "column";
    innerGridColumns?: string;
    innerJustify?: string;
    innerAlign?: string;
    innerGap?: string;
    innerWidth?: string;
  },
): string {
  const outer = container(tree, parent, {
    background: opts.background,
    padding: BAND_PADDING,
    margin: AUTO_X,
    borderRadius: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "0",
    width: "100%",
    height: "max-content",
    gridTemplateColumns: "",
    gridTemplateRows: "",
  });
  const inner = container(tree, outer, {
    background: "transparent",
    padding: ZERO,
    margin: AUTO_X,
    borderRadius: 0,
    display: opts.innerDisplay,
    flexDirection: opts.innerFlexDirection ?? "column",
    justifyContent: opts.innerJustify ?? "flex-start",
    alignItems: opts.innerAlign ?? "stretch",
    gap: opts.innerGap ?? "20",
    width: opts.innerWidth ?? INNER_WIDTH,
    height: "max-content",
    gridTemplateColumns: opts.innerGridColumns ?? "",
    gridTemplateRows: "",
  });
  return inner;
}

// A transparent, unpadded layout container nested inside a band.
function makeGroup(
  tree: CraftContent,
  parent: string,
  opts: {
    display: "flex" | "grid";
    flexDirection?: "row" | "column";
    gridTemplateColumns?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    width?: string;
  },
): string {
  return container(tree, parent, {
    background: "transparent",
    padding: ZERO,
    margin: ZERO,
    borderRadius: 0,
    display: opts.display,
    flexDirection: opts.flexDirection ?? "column",
    justifyContent: opts.justifyContent ?? "flex-start",
    alignItems: opts.alignItems ?? "stretch",
    gap: opts.gap ?? "20",
    width: opts.width ?? "auto",
    height: "max-content",
    gridTemplateColumns: opts.gridTemplateColumns ?? "",
    gridTemplateRows: "",
  });
}

function makeCard(tree: CraftContent, parent: string, palette: Palette): string {
  return container(tree, parent, {
    background: palette.cardBg,
    padding: CARD_PADDING,
    margin: ZERO,
    borderRadius: CARD_RADIUS,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "14",
    width: "100%",
    height: "auto",
    gridTemplateColumns: "",
    gridTemplateRows: "",
    border: palette.cardBorder,
  });
}

function makeChip(tree: CraftContent, parent: string, palette: Palette): string {
  return container(tree, parent, {
    background: palette.chipBg,
    padding: ZERO,
    margin: ZERO,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "0",
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    gridTemplateColumns: "",
    gridTemplateRows: "",
  });
}

function makeEyebrow(
  tree: CraftContent,
  parent: string,
  text: string,
  palette: Palette,
  align: "left" | "center",
) {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "TextBlock" },
    isCanvas: false,
    props: {
      text: text.toUpperCase(),
      align,
      textColor: palette.eyebrow,
      fontSize: FS.eyebrow,
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

function makeHeader(
  tree: CraftContent,
  parent: string,
  text: string,
  color: string,
  fontSize: number,
  align: "left" | "center",
  level: string = "h2",
) {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "Header" },
    isCanvas: false,
    props: { text, level, align, textColor: color, fontSize, padding: ZERO, margin: ZERO },
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
  fontSize: number = FS.body,
) {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "TextBlock" },
    isCanvas: false,
    props: { text, align, textColor: color, fontSize, padding: ZERO, margin: ZERO },
    displayName: "Text",
    custom: {},
    parent,
    hidden: false,
    nodes: [],
    linkedNodes: {},
  });
  attach(tree, parent, id);
}

function makeImage(
  tree: CraftContent,
  parent: string,
  width: number,
  height: number,
  opts: { rounded?: boolean; grayscale?: boolean } = {},
) {
  const id = generateId();
  // Seeded URL so the generated page is stable across reloads instead of
  // reshuffling every render.
  const src = `https://picsum.photos/seed/${id}/${width}/${height}${opts.grayscale ? "?grayscale" : ""
    }`;
  addNode(tree, id, {
    type: { resolvedName: "ImageBlock" },
    isCanvas: false,
    props: {
      src,
      alt: "",
      width: "100%",
      height: "auto",
      ...(opts.rounded ? { borderRadius: 16 } : {}),
    },
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
) {
  const id = generateId();
  addNode(tree, id, {
    type: { resolvedName: "CtaButton" },
    isCanvas: false,
    props: {
      label,
      href: "#",
      variant: "primary",
      backgroundColor: palette.accent,
      textColor: palette.accentText,
      fontSize: 16,
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
    innerGridColumns: section.withImage ? "1.1fr 1fr" : "1fr",
    innerAlign: "center",
    innerGap: "48",
  });

  const textCol = makeGroup(tree, inner, {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
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
    const media = makeGroup(tree, inner, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    });
    makeImage(tree, media, 900, 680, { rounded: true });
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

  const columns = Array(section.imageCount).fill("1fr").join(" ");
  const grid = makeGroup(tree, inner, {
    display: "grid",
    gridTemplateColumns: columns,
    alignItems: "center",
    gap: "20",
    width: "100%",
  });

  // Uniform aspect ratio across the row (the old builder grew each image, which
  // made the strip ragged). Seeded + rounded for a clean, stable look.
  for (let i = 0; i < section.imageCount; i++) {
    makeImage(tree, grid, 640, 400, { rounded: true });
  }
}

function buildFeatureCards(
  tree: CraftContent,
  rootId: string,
  section: Extract<Section, { type: "feature_cards" }>,
) {
  const palette = THEME_PALETTE[section.theme];
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

  const columns = Array(section.cards.length).fill("1fr").join(" ");
  const grid = makeGroup(tree, inner, {
    display: "grid",
    gridTemplateColumns: columns,
    alignItems: "stretch",
    gap: "24",
    width: "100%",
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
    innerGridColumns: "1fr 1fr",
    innerAlign: "center",
    innerGap: "48",
  });

  const media = makeGroup(tree, inner, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  });
  makeImage(tree, media, 900, 720, { rounded: true });

  const textCol = makeGroup(tree, inner, {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
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
    innerAlign: "center",
    innerJustify: "center",
    innerGap: "18",
    innerWidth: "760",
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
    padding: { top: "18", right: "24", bottom: "18", left: "24" },
    margin: AUTO_X,
    borderRadius: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "0",
    width: "100%",
    height: "max-content",
    gridTemplateColumns: "",
    gridTemplateRows: "",
  });
  const inner = container(tree, outer, {
    background: "transparent",
    padding: ZERO,
    margin: AUTO_X,
    borderRadius: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20",
    width: INNER_WIDTH,
    height: "max-content",
    gridTemplateColumns: "",
    gridTemplateRows: "",
  });
  makeHeader(tree, inner, brand, light.accent, FS.brand, "left", "h1");
  makeCtaButton(tree, inner, "Get started", light);
}

function buildFooter(tree: CraftContent, rootId: string, brand: string) {
  const year = new Date().getFullYear();
  const outer = container(tree, rootId, {
    background: "#0c1411",
    padding: { top: "36", right: "24", bottom: "36", left: "24" },
    margin: AUTO_X,
    borderRadius: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "0",
    width: "100%",
    height: "max-content",
    gridTemplateColumns: "",
    gridTemplateRows: "",
  });
  const inner = container(tree, outer, {
    background: "transparent",
    padding: ZERO,
    margin: AUTO_X,
    borderRadius: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20",
    width: INNER_WIDTH,
    height: "max-content",
    gridTemplateColumns: "",
    gridTemplateRows: "",
  });
  makeHeader(tree, inner, brand, "#4ade80", FS.cardTitle, "left", "h3");
  makeTextBlock(tree, inner, `© ${year} ${brand}. All rights reserved.`, "#9ca3af", "right", FS.small);
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
