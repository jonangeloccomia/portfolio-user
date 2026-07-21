"use client";

import { useEditor, useNode, type UserComponent } from "@craftjs/core";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ColorInput } from "../inputs/color-input";
import { SliderInput } from "../inputs/slider-input";
import { SpacingInput, toCssLength, type Spacing } from "../inputs/spacing-input";

export type CtaButtonProps = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  borderRadius: number;
  width: string;
  height: string;
  padding: Spacing;
  margin: Spacing;
};

const DEFAULT_PADDING: Spacing = { top: "12", right: "24", bottom: "12", left: "24" };
const DEFAULT_MARGIN: Spacing = { top: "0", right: "0", bottom: "0", left: "0" };

export const CtaButton: UserComponent<Partial<CtaButtonProps>> = ({
  label = "Get started",
  href = "#",
  variant = "primary",
  backgroundColor = "#000000",
  textColor = "#ffffff",
  fontSize = 16,
  borderRadius = 24,
  width = "max-content",
  height = "max-content",
  padding = DEFAULT_PADDING,
  margin = DEFAULT_MARGIN,
}) => {
  const {
    connectors: { connect },
  } = useNode();
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <a
      ref={(ref: HTMLAnchorElement | null) => {
        if (ref) connect(ref);
      }}
      href={href}
      onClick={(event) => {
        // While editing, the anchor shouldn't actually navigate away.
        if (enabled) event.preventDefault();
      }}
      style={{
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        fontSize: `${fontSize}px`,
        borderRadius,
        width: width ? toCssLength(width) : "max-content",
        height: height ? toCssLength(height) : "max-content",
        paddingTop: toCssLength(padding.top),
        paddingRight: toCssLength(padding.right),
        paddingBottom: toCssLength(padding.bottom),
        paddingLeft: toCssLength(padding.left),
        marginTop: toCssLength(margin.top),
        marginRight: toCssLength(margin.right),
        marginBottom: toCssLength(margin.bottom),
        marginLeft: toCssLength(margin.left),
      }}
      className={cn(
        buttonVariants({ variant: variant === "primary" ? "default" : "secondary" }),
        "block"
      )}
    >
      {label}
    </a>
  );
};

function CtaButtonSettings() {
  const {
    label,
    href,
    backgroundColor,
    textColor,
    fontSize,
    borderRadius,
    width,
    height,
    padding,
    margin,
    actions: { setProp },
  } = useNode((node) => ({
    label: node.data.props.label,
    href: node.data.props.href,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    fontSize: node.data.props.fontSize,
    borderRadius: node.data.props.borderRadius,
    width: node.data.props.width,
    height: node.data.props.height,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
  }));

  return (
    <>
      <Field>
        <FieldLabel htmlFor="cta-label">Label</FieldLabel>
        <Input
          id="cta-label"
          value={label}
          onChange={(event) =>
            setProp((props: CtaButtonProps) => {
              props.label = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="cta-href">Link</FieldLabel>
        <Input
          id="cta-href"
          placeholder="https://... or #anchor"
          value={href}
          onChange={(event) =>
            setProp((props: CtaButtonProps) => {
              props.href = event.target.value;
            })
          }
        />
      </Field>
      <ColorInput
        label="Background color"
        value={backgroundColor}
        onChange={(value) =>
          setProp((props: CtaButtonProps) => {
            props.backgroundColor = value;
          })
        }
      />
      <ColorInput
        label="Font color"
        value={textColor}
        onChange={(value) =>
          setProp((props: CtaButtonProps) => {
            props.textColor = value;
          })
        }
      />
      <SliderInput
        label="Font size"
        value={fontSize}
        min={10}
        max={48}
        onChange={(value) =>
          setProp((props: CtaButtonProps) => {
            props.fontSize = value;
          })
        }
      />
      <SliderInput
        label="Corner radius"
        value={borderRadius}
        min={0}
        max={48}
        onChange={(value) =>
          setProp((props: CtaButtonProps) => {
            props.borderRadius = value;
          })
        }
      />
      <Field>
        <FieldLabel>Width</FieldLabel>
        <Input
          placeholder="auto"
          value={width ?? ""}
          onChange={(event) =>
            setProp((props: CtaButtonProps) => {
              props.width = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>Height</FieldLabel>
        <Input
          placeholder="auto"
          value={height ?? ""}
          onChange={(event) =>
            setProp((props: CtaButtonProps) => {
              props.height = event.target.value;
            })
          }
        />
      </Field>
      <SpacingInput
        label="Padding"
        value={padding}
        onChange={(value) =>
          setProp((props: CtaButtonProps) => {
            props.padding = value;
          })
        }
      />
      <SpacingInput
        label="Margin"
        value={margin}
        onChange={(value) =>
          setProp((props: CtaButtonProps) => {
            props.margin = value;
          })
        }
      />
    </>
  );
}

CtaButton.craft = {
  displayName: "Button",
  props: {
    label: "Get started",
    href: "#",
    variant: "primary",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    fontSize: 16,
    borderRadius: 24,
    width: "max-content",
    height: "max-content",
    padding: { top: "12", right: "24", bottom: "12", left: "24" },
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  },
  related: { settings: CtaButtonSettings },
};
