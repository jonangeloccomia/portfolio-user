"use client";

import { useEditor, useNode, type UserComponent } from "@craftjs/core";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ColorInput } from "../inputs/color-input";
import { SelectInput } from "../inputs/select-input";
import { SliderInput } from "../inputs/slider-input";
import { SpacingInput, toCssLength, type Spacing } from "../inputs/spacing-input";

export type ContainerProps = {
  background: string;
  padding: Spacing;
  margin: Spacing;
  borderRadius: number;
  border: string;
  display: "flex" | "grid";
  flexDirection: "row" | "column";
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between";
  alignItems: "flex-start" | "center" | "flex-end" | "stretch";
  gap: string;
  width: string;
  height: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  children?: React.ReactNode;
};

const DEFAULT_SPACING: Spacing = { top: "0", right: "auto", bottom: "0", left: "auto" };

export const Container: UserComponent<Partial<ContainerProps>> = ({
  background = "#ffffff",
  padding = { top: "16", right: "16", bottom: "16", left: "16" },
  margin = DEFAULT_SPACING,
  borderRadius = 8,
  border = "",
  display = "flex",
  flexDirection = "column",
  justifyContent = "flex-start",
  alignItems = "stretch",
  gap = "0",
  width = "70%",
  height = "max-content",
  gridTemplateColumns = "",
  gridTemplateRows = "",
  children,
}) => {
  const {
    connectors: { connect },
    hasChildren,
  } = useNode((node) => ({
    hasChildren: node.data.nodes.length > 0,
  }));
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
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
        gridTemplateColumns: display === "grid" ? gridTemplateColumns || undefined : undefined,
        gridTemplateRows: display === "grid" ? gridTemplateRows || undefined : undefined,
      }}
      className={display}
    >
      {hasChildren ? (
        children
      ) : enabled ? (
        <p className="pointer-events-none m-auto text-center text-sm text-muted-foreground p-7">
          Drop elements here
        </p>
      ) : null}
    </div>
  );
};

function ContainerSettings() {
  const {
    background,
    padding,
    margin,
    borderRadius,
    border,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    width,
    height,
    gridTemplateColumns,
    gridTemplateRows,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
    borderRadius: node.data.props.borderRadius,
    border: node.data.props.border,
    display: node.data.props.display,
    flexDirection: node.data.props.flexDirection,
    justifyContent: node.data.props.justifyContent,
    alignItems: node.data.props.alignItems,
    gap: node.data.props.gap,
    width: node.data.props.width,
    height: node.data.props.height,
    gridTemplateColumns: node.data.props.gridTemplateColumns,
    gridTemplateRows: node.data.props.gridTemplateRows,
  }));

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
      <SpacingInput
        label="Padding"
        value={padding}
        onChange={(value) =>
          setProp((props: ContainerProps) => {
            props.padding = value;
          })
        }
      />
      <SpacingInput
        label="Margin"
        value={margin}
        onChange={(value) =>
          setProp((props: ContainerProps) => {
            props.margin = value;
          })
        }
      />
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
        <>
          <SelectInput
            label="Direction"
            value={flexDirection}
            options={[
              { value: "row", label: "Row" },
              { value: "column", label: "Column" },
            ]}
            onChange={(value) =>
              setProp((props: ContainerProps) => {
                props.flexDirection = value;
              })
            }
          />
        </>
      ) : (
        <>
          <Field>
            <FieldLabel>Grid template columns</FieldLabel>
            <Input
              placeholder="e.g. 1fr 1fr"
              value={gridTemplateColumns ?? ""}
              onChange={(event) =>
                setProp((props: ContainerProps) => {
                  props.gridTemplateColumns = event.target.value;
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
    margin: { top: "0", right: "auto", bottom: "0", left: "auto" },
    borderRadius: 8,
    border: "",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: "0",
    width: "70%",
    height: "max-content",
    gridTemplateColumns: "",
    gridTemplateRows: "",
  },
  isCanvas: true,
  related: { settings: ContainerSettings },
};
