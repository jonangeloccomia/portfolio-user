"use client";

import { useEditor, useNode, type UserComponent } from "@craftjs/core";

import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ColorInput } from "../inputs/color-input";
import { SelectInput } from "../inputs/select-input";
import { SliderInput } from "../inputs/slider-input";
import { SpacingInput, toCssLength, type Spacing } from "../inputs/spacing-input";
import { breakpointFieldLabel, ResetToDefaultButton } from "../inputs/breakpoint-field";
import { useResponsivePreview } from "../breakpoint-context";
import type { OverridableBreakpoint, Responsive } from "../types";
import {
  buildMaxWidthStyle,
  buildResponsiveStyle,
  defaultColumns,
  defaultFlexDirection,
  defaultSpacing,
  resolveResponsiveValue,
} from "@/lib/responsive";

export type ContainerProps = {
  background: string;
  padding: Spacing;
  paddingResponsive: Responsive<Spacing>;
  margin: Spacing;
  marginResponsive: Responsive<Spacing>;
  borderRadius: number;
  border: string;
  display: "flex" | "grid";
  flexDirection: "row" | "column";
  flexDirectionResponsive: Responsive<"row" | "column">;
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between";
  alignItems: "flex-start" | "center" | "flex-end" | "stretch";
  gap: string;
  width: string;
  height: string;
  maxWidth: string;
  columns: number;
  columnsResponsive: Responsive<number>;
  gridTemplateColumns: string;
  gridTemplateColumnsResponsive: Responsive<string>;
  gridTemplateRows: string;
  children?: React.ReactNode;
};

const DEFAULT_SPACING: Spacing = { top: "0", right: "auto", bottom: "0", left: "auto" };

export const Container: UserComponent<Partial<ContainerProps>> = ({
  background = "#ffffff",
  padding = { top: "16", right: "16", bottom: "16", left: "16" },
  paddingResponsive = {},
  margin = DEFAULT_SPACING,
  marginResponsive = {},
  borderRadius = 8,
  border = "",
  display = "flex",
  flexDirection = "column",
  flexDirectionResponsive = {},
  justifyContent = "flex-start",
  alignItems = "stretch",
  gap = "0",
  width = "70%",
  height = "max-content",
  maxWidth = "",
  columns = 3,
  columnsResponsive = {},
  gridTemplateColumns = "",
  gridTemplateColumnsResponsive = {},
  gridTemplateRows = "",
  children,
}) => {
  const {
    connectors: { connect },
    hasChildren,
  } = useNode((node) => ({
    hasChildren: node.data.nodes.length > 0,
  }));
  const { id } = useNode();
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  const desktopGridTemplateColumns = gridTemplateColumns || `repeat(${columns}, 1fr)`;

  function columnsForBreakpoint(breakpoint: OverridableBreakpoint): string {
    const advanced = gridTemplateColumnsResponsive[breakpoint];
    if (advanced) return advanced;
    const count = resolveResponsiveValue(breakpoint, columns, columnsResponsive, defaultColumns);
    return `repeat(${count}, 1fr)`;
  }

  function buildBreakpointRules(breakpoint: OverridableBreakpoint): Record<string, string> {
    const rules: Record<string, string> = {};

    if (display === "grid") {
      rules.gridTemplateColumns = columnsForBreakpoint(breakpoint);
    } else {
      rules.flexDirection = resolveResponsiveValue(
        breakpoint,
        flexDirection,
        flexDirectionResponsive,
        defaultFlexDirection
      );
    }

    const paddingBp = resolveResponsiveValue(breakpoint, padding, paddingResponsive, defaultSpacing);
    rules.paddingTop = toCssLength(paddingBp.top);
    rules.paddingRight = toCssLength(paddingBp.right);
    rules.paddingBottom = toCssLength(paddingBp.bottom);
    rules.paddingLeft = toCssLength(paddingBp.left);

    const marginBp = resolveResponsiveValue(breakpoint, margin, marginResponsive, defaultSpacing);
    rules.marginTop = toCssLength(marginBp.top);
    rules.marginRight = toCssLength(marginBp.right);
    rules.marginBottom = toCssLength(marginBp.bottom);
    rules.marginLeft = toCssLength(marginBp.left);

    return rules;
  }

  const responsiveStyle = [
    buildResponsiveStyle(id, {
      tablet: buildBreakpointRules("tablet"),
      mobile: buildBreakpointRules("mobile"),
    }),
    buildMaxWidthStyle(id, maxWidth ? toCssLength(maxWidth) : ""),
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <div
        ref={(ref) => {
          if (ref) connect(ref);
        }}
        style={{
          background,
          paddingTop: toCssLength(padding.top),
          paddingRight: toCssLength(padding.right),
          paddingBottom: toCssLength(padding.bottom),
          paddingLeft: toCssLength(padding.left),
          marginTop: toCssLength(margin.top),
          marginRight: toCssLength(margin.right),
          marginBottom: toCssLength(margin.bottom),
          marginLeft: toCssLength(margin.left),
          borderRadius,
          border: border || undefined,
          flexDirection: display === "flex" ? flexDirection : undefined,
          justifyContent,
          alignItems,
          gap: toCssLength(gap),
          width: toCssLength(width),
          height: toCssLength(height),
          gridTemplateColumns: display === "grid" ? desktopGridTemplateColumns : undefined,
          gridTemplateRows: display === "grid" ? gridTemplateRows || undefined : undefined,
        }}
        className={cn(display, `rn-${id}`)}
      >
        {hasChildren ? (
          children
        ) : enabled ? (
          <p className="pointer-events-none m-auto text-center text-sm text-muted-foreground p-7">
            Drop elements here
          </p>
        ) : null}
      </div>
      {responsiveStyle && <style>{responsiveStyle}</style>}
    </>
  );
};

function ContainerSettings() {
  const {
    background,
    padding,
    paddingResponsive,
    margin,
    marginResponsive,
    borderRadius,
    border,
    display,
    flexDirection,
    flexDirectionResponsive,
    justifyContent,
    alignItems,
    gap,
    width,
    height,
    maxWidth,
    columns,
    columnsResponsive,
    gridTemplateColumns,
    gridTemplateColumnsResponsive,
    gridTemplateRows,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    paddingResponsive: node.data.props.paddingResponsive,
    margin: node.data.props.margin,
    marginResponsive: node.data.props.marginResponsive,
    borderRadius: node.data.props.borderRadius,
    border: node.data.props.border,
    display: node.data.props.display,
    flexDirection: node.data.props.flexDirection,
    flexDirectionResponsive: node.data.props.flexDirectionResponsive,
    justifyContent: node.data.props.justifyContent,
    alignItems: node.data.props.alignItems,
    gap: node.data.props.gap,
    width: node.data.props.width,
    height: node.data.props.height,
    maxWidth: node.data.props.maxWidth,
    columns: node.data.props.columns,
    columnsResponsive: node.data.props.columnsResponsive,
    gridTemplateColumns: node.data.props.gridTemplateColumns,
    gridTemplateColumnsResponsive: node.data.props.gridTemplateColumnsResponsive,
    gridTemplateRows: node.data.props.gridTemplateRows,
  }));
  const { breakpoint } = useResponsivePreview();

  const effectiveColumns = resolveResponsiveValue(breakpoint, columns, columnsResponsive, defaultColumns);
  const isColumnsOverridden = breakpoint !== "desktop" && columnsResponsive?.[breakpoint] !== undefined;

  const effectiveFlexDirection = resolveResponsiveValue(
    breakpoint,
    flexDirection,
    flexDirectionResponsive,
    defaultFlexDirection
  );
  const isFlexDirectionOverridden =
    breakpoint !== "desktop" && flexDirectionResponsive?.[breakpoint] !== undefined;

  const effectivePadding = resolveResponsiveValue(breakpoint, padding, paddingResponsive, defaultSpacing);
  const isPaddingOverridden = breakpoint !== "desktop" && paddingResponsive?.[breakpoint] !== undefined;

  const effectiveMargin = resolveResponsiveValue(breakpoint, margin, marginResponsive, defaultSpacing);
  const isMarginOverridden = breakpoint !== "desktop" && marginResponsive?.[breakpoint] !== undefined;

  const advancedGridTemplateColumns =
    breakpoint === "desktop" ? gridTemplateColumns : gridTemplateColumnsResponsive?.[breakpoint] ?? "";

  return (
    <>
      <ColorInput
        label="Background"
        value={background}
        onChange={(value) =>
          setProp((props: ContainerProps) => {
            props.background = value;
          })
        }
      />
      <div className="flex flex-col gap-1">
        <SpacingInput
          label={breakpointFieldLabel("Padding", breakpoint)}
          value={effectivePadding}
          onChange={(value) =>
            setProp((props: ContainerProps) => {
              if (breakpoint === "desktop") {
                props.padding = value;
              } else {
                props.paddingResponsive = { ...props.paddingResponsive, [breakpoint]: value };
              }
            })
          }
        />
        {isPaddingOverridden && (
          <ResetToDefaultButton
            onClick={() =>
              setProp((props: ContainerProps) => {
                const next = { ...props.paddingResponsive };
                delete next[breakpoint];
                props.paddingResponsive = next;
              })
            }
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <SpacingInput
          label={breakpointFieldLabel("Margin", breakpoint)}
          value={effectiveMargin}
          onChange={(value) =>
            setProp((props: ContainerProps) => {
              if (breakpoint === "desktop") {
                props.margin = value;
              } else {
                props.marginResponsive = { ...props.marginResponsive, [breakpoint]: value };
              }
            })
          }
        />
        {isMarginOverridden && (
          <ResetToDefaultButton
            onClick={() =>
              setProp((props: ContainerProps) => {
                const next = { ...props.marginResponsive };
                delete next[breakpoint];
                props.marginResponsive = next;
              })
            }
          />
        )}
      </div>
      <Field>
        <FieldLabel>Width</FieldLabel>
        <Input
          value={width ?? ""}
          onChange={(event) =>
            setProp((props: ContainerProps) => {
              props.width = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>Height</FieldLabel>
        <Input
          value={height ?? ""}
          onChange={(event) =>
            setProp((props: ContainerProps) => {
              props.height = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>Max width (desktop only)</FieldLabel>
        <Input
          placeholder="e.g. 1024 — tablet/mobile always render full width"
          value={maxWidth ?? ""}
          onChange={(event) =>
            setProp((props: ContainerProps) => {
              props.maxWidth = event.target.value;
            })
          }
        />
      </Field>
      <SliderInput
        label="Corner radius"
        value={borderRadius}
        min={0}
        max={48}
        onChange={(value) =>
          setProp((props: ContainerProps) => {
            props.borderRadius = value;
          })
        }
      />
      <Field>
        <FieldLabel>Border</FieldLabel>
        <Input
          placeholder="e.g. 1px solid #000000"
          value={border ?? ""}
          onChange={(event) =>
            setProp((props: ContainerProps) => {
              props.border = event.target.value;
            })
          }
        />
      </Field>
      <SelectInput
        label="Layout"
        value={display}
        options={[
          { value: "flex", label: "Flex" },
          { value: "grid", label: "Grid" },
        ]}
        onChange={(value) =>
          setProp((props: ContainerProps) => {
            props.display = value;
          })
        }
      />
      {display === "flex" ? (
        <div className="flex flex-col gap-1">
          <SelectInput
            label={breakpointFieldLabel("Direction", breakpoint)}
            value={effectiveFlexDirection}
            options={[
              { value: "row", label: "Row" },
              { value: "column", label: "Column" },
            ]}
            onChange={(value) =>
              setProp((props: ContainerProps) => {
                if (breakpoint === "desktop") {
                  props.flexDirection = value;
                } else {
                  props.flexDirectionResponsive = {
                    ...props.flexDirectionResponsive,
                    [breakpoint]: value,
                  };
                }
              })
            }
          />
          {isFlexDirectionOverridden && (
            <ResetToDefaultButton
              onClick={() =>
                setProp((props: ContainerProps) => {
                  const next = { ...props.flexDirectionResponsive };
                  delete next[breakpoint];
                  props.flexDirectionResponsive = next;
                })
              }
            />
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <SliderInput
              label={breakpointFieldLabel("Columns", breakpoint)}
              value={effectiveColumns}
              min={1}
              max={6}
              unit=""
              onChange={(value) =>
                setProp((props: ContainerProps) => {
                  if (breakpoint === "desktop") {
                    props.columns = value;
                  } else {
                    props.columnsResponsive = { ...props.columnsResponsive, [breakpoint]: value };
                  }
                })
              }
            />
            {isColumnsOverridden && (
              <ResetToDefaultButton
                onClick={() =>
                  setProp((props: ContainerProps) => {
                    const next = { ...props.columnsResponsive };
                    delete next[breakpoint];
                    props.columnsResponsive = next;
                  })
                }
              />
            )}
          </div>
          <Field>
            <FieldLabel>{breakpointFieldLabel("Advanced: grid template columns", breakpoint)}</FieldLabel>
            <Input
              placeholder="e.g. 1.1fr 1fr — overrides Columns above"
              value={advancedGridTemplateColumns ?? ""}
              onChange={(event) =>
                setProp((props: ContainerProps) => {
                  if (breakpoint === "desktop") {
                    props.gridTemplateColumns = event.target.value;
                  } else {
                    props.gridTemplateColumnsResponsive = {
                      ...props.gridTemplateColumnsResponsive,
                      [breakpoint]: event.target.value,
                    };
                  }
                })
              }
            />
          </Field>
          <Field>
            <FieldLabel>Grid template rows</FieldLabel>
            <Input
              placeholder="e.g. auto auto"
              value={gridTemplateRows ?? ""}
              onChange={(event) =>
                setProp((props: ContainerProps) => {
                  props.gridTemplateRows = event.target.value;
                })
              }
            />
          </Field>
        </>
      )}
      <Field>
        <FieldLabel>Gap</FieldLabel>
        <Input
          value={gap ?? ""}
          onChange={(event) =>
            setProp((props: ContainerProps) => {
              props.gap = event.target.value;
            })
          }
        />
      </Field>
      <SelectInput
        label="Justify content"
        value={justifyContent}
        options={[
          { value: "flex-start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "End" },
          { value: "space-between", label: "Space between" },
        ]}
        onChange={(value) =>
          setProp((props: ContainerProps) => {
            props.justifyContent = value;
          })
        }
      />
      <SelectInput
        label="Align items"
        value={alignItems}
        options={[
          { value: "flex-start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "End" },
          { value: "stretch", label: "Stretch" },
        ]}
        onChange={(value) =>
          setProp((props: ContainerProps) => {
            props.alignItems = value;
          })
        }
      />
    </>
  );
}

Container.craft = {
  displayName: "Container",
  props: {
    background: "#ffffff",
    padding: { top: "16", right: "16", bottom: "16", left: "16" },
    paddingResponsive: {},
    margin: { top: "0", right: "auto", bottom: "0", left: "auto" },
    marginResponsive: {},
    borderRadius: 8,
    border: "",
    display: "flex",
    flexDirection: "column",
    flexDirectionResponsive: {},
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: "0",
    width: "70%",
    height: "max-content",
    maxWidth: "",
    columns: 3,
    columnsResponsive: {},
    gridTemplateColumns: "",
    gridTemplateColumnsResponsive: {},
    gridTemplateRows: "",
  },
  isCanvas: true,
  related: { settings: ContainerSettings },
};
