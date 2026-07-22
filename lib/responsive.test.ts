import { describe, expect, it } from "vitest";
import {
  buildMaxWidthStyle,
  buildResponsiveStyle,
  defaultColumns,
  defaultFlexDirection,
  defaultFontSize,
  defaultSpacing,
  nodeResponsiveClassName,
  resolveResponsiveValue,
} from "./responsive";

describe("defaultColumns", () => {
  it("halves and ceils for tablet", () => {
    expect(defaultColumns(4, "tablet")).toBe(2);
    expect(defaultColumns(3, "tablet")).toBe(2);
    expect(defaultColumns(1, "tablet")).toBe(1);
  });

  it("is always 1 for mobile", () => {
    expect(defaultColumns(4, "mobile")).toBe(1);
    expect(defaultColumns(1, "mobile")).toBe(1);
  });
});

describe("defaultFlexDirection", () => {
  it("keeps tablet the same as desktop", () => {
    expect(defaultFlexDirection("row", "tablet")).toBe("row");
    expect(defaultFlexDirection("column", "tablet")).toBe("column");
  });

  it("switches row to column on mobile", () => {
    expect(defaultFlexDirection("row", "mobile")).toBe("column");
  });

  it("leaves column as column on mobile", () => {
    expect(defaultFlexDirection("column", "mobile")).toBe("column");
  });
});

describe("defaultSpacing", () => {
  const desktop = { top: "64", right: "32", bottom: "64", left: "32" };

  it("keeps tablet the same as desktop", () => {
    expect(defaultSpacing(desktop, "tablet")).toEqual(desktop);
  });

  it("halves and rounds each side for mobile", () => {
    expect(defaultSpacing(desktop, "mobile")).toEqual({
      top: "32",
      right: "16",
      bottom: "32",
      left: "16",
    });
  });

  it("passes through non-numeric values unchanged", () => {
    const value = { top: "auto", right: "0", bottom: "auto", left: "0" };
    expect(defaultSpacing(value, "mobile")).toEqual({
      top: "auto",
      right: "0",
      bottom: "auto",
      left: "0",
    });
  });
});

describe("defaultFontSize", () => {
  it("keeps tablet the same as desktop", () => {
    expect(defaultFontSize(48, "tablet")).toBe(48);
  });

  it("scales down by 20% for mobile", () => {
    expect(defaultFontSize(48, "mobile")).toBe(38);
  });

  it("floors mobile font size at 14", () => {
    expect(defaultFontSize(16, "mobile")).toBe(14);
    expect(defaultFontSize(10, "mobile")).toBe(14);
  });
});

describe("resolveResponsiveValue", () => {
  it("returns the base value for desktop", () => {
    expect(resolveResponsiveValue("desktop", 4, { tablet: 2 }, defaultColumns)).toBe(4);
  });

  it("returns the explicit override when present", () => {
    expect(resolveResponsiveValue("tablet", 4, { tablet: 3 }, defaultColumns)).toBe(3);
  });

  it("falls back to the computed default when no override exists", () => {
    expect(resolveResponsiveValue("tablet", 4, {}, defaultColumns)).toBe(2);
    expect(resolveResponsiveValue("mobile", 4, undefined, defaultColumns)).toBe(1);
  });
});

describe("nodeResponsiveClassName", () => {
  it("prefixes the node id", () => {
    expect(nodeResponsiveClassName("abc123")).toBe("rn-abc123");
  });
});

describe("buildResponsiveStyle", () => {
  it("emits @container blocks for tablet and mobile", () => {
    const css = buildResponsiveStyle("abc123", {
      tablet: { gridTemplateColumns: "repeat(2, 1fr)" },
      mobile: { gridTemplateColumns: "repeat(1, 1fr)" },
    });
    expect(css).toContain("@container page (max-width: 1023px) { .rn-abc123 { grid-template-columns: repeat(2, 1fr) !important; } }");
    expect(css).toContain("@container page (max-width: 767px) { .rn-abc123 { grid-template-columns: repeat(1, 1fr) !important; } }");
  });

  it("converts camelCase properties to kebab-case", () => {
    const css = buildResponsiveStyle("x", { mobile: { minHeight: "44px" } });
    expect(css).toContain("min-height: 44px !important;");
  });

  it("omits empty rule blocks", () => {
    expect(buildResponsiveStyle("x", {})).toBe("");
    expect(buildResponsiveStyle("x", { tablet: {} })).toBe("");
  });
});

describe("buildMaxWidthStyle", () => {
  it("returns an empty string when maxWidth is unset", () => {
    expect(buildMaxWidthStyle("x", "")).toBe("");
  });

  it("gates the rule behind the desktop container width", () => {
    const css = buildMaxWidthStyle("x", "1024px");
    expect(css).toBe(
      "@container page (min-width: 1024px) { .rn-x { max-width: 1024px !important; margin-left: auto !important; margin-right: auto !important; } }"
    );
  });
});
