"use client";

import { useNode, type UserComponent } from "@craftjs/core";

import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { SegmentedControl } from "../segmented-control";
import { ColorInput } from "../inputs/color-input";
import { SliderInput } from "../inputs/slider-input";
import { SpacingInput, toCssLength, type Spacing } from "../inputs/spacing-input";
import type { Align } from "../types";

export type HeaderProps = {
  text: string;
  level: "h1" | "h2";
  align: Align;
  textColor: string;
  fontSize: number;
  lineHeight: number;
  padding: Spacing;
  margin: Spacing;
};

const DEFAULT_SPACING: Spacing = { top: "0", right: "0", bottom: "0", left: "0" };

export const Header: UserComponent<Partial<HeaderProps>> = ({
  text = "Your headline here",
  level = "h1",
  align = "left",
  textColor = "#000000",
  fontSize = 36,
  lineHeight = 1.2,
  padding = DEFAULT_SPACING,
  margin = DEFAULT_SPACING,
}) => {
  const {
    connectors: { connect },
  } = useNode();
  const Tag = level;

  return (
    <Tag
      ref={(ref: HTMLHeadingElement | null) => {
        if (ref) connect(ref);
      }}
      style={{
        color: textColor,
        fontSize: `${fontSize}px`,
        lineHeight,
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
        "font-heading font-semibold",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      {text}
    </Tag>
  );
};

function HeaderSettings() {
  const {
    text,
    level,
    align,
    textColor,
    fontSize,
    lineHeight,
    padding,
    margin,
    actions: { setProp },
  } = useNode((node) => ({
    text: node.data.props.text,
    level: node.data.props.level,
    align: node.data.props.align,
    textColor: node.data.props.textColor,
    fontSize: node.data.props.fontSize,
    lineHeight: node.data.props.lineHeight,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
  }));

  return (
    <>
      <Field>
        <FieldLabel htmlFor="header-text">Text</FieldLabel>
        <Textarea
          id="header-text"
          value={text}
          onChange={(event) =>
            setProp((props: HeaderProps) => {
              props.text = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>Heading level</FieldLabel>
        <SegmentedControl
          value={level}
          options={[
            { value: "h1", label: "H1" },
            { value: "h2", label: "H2" },
          ]}
          onChange={(value) =>
            setProp((props: HeaderProps) => {
              props.level = value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>Alignment</FieldLabel>
        <SegmentedControl
          value={align}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
          ]}
          onChange={(value) =>
            setProp((props: HeaderProps) => {
              props.align = value;
            })
          }
        />
      </Field>
      <ColorInput
        label="Text color"
        value={textColor}
        onChange={(value) =>
          setProp((props: HeaderProps) => {
            props.textColor = value;
          })
        }
      />
      <SliderInput
        label="Font size"
        value={fontSize}
        min={12}
        max={96}
        onChange={(value) =>
          setProp((props: HeaderProps) => {
            props.fontSize = value;
          })
        }
      />
      <SliderInput
        label="Line height"
        value={lineHeight}
        min={1}
        max={2.5}
        step={0.1}
        unit=""
        onChange={(value) =>
          setProp((props: HeaderProps) => {
            props.lineHeight = value;
          })
        }
      />
      <SpacingInput
        label="Padding"
        value={padding}
        onChange={(value) =>
          setProp((props: HeaderProps) => {
            props.padding = value;
          })
        }
      />
      <SpacingInput
        label="Margin"
        value={margin}
        onChange={(value) =>
          setProp((props: HeaderProps) => {
            props.margin = value;
          })
        }
      />
    </>
  );
}

Header.craft = {
  displayName: "Header",
  props: {
    text: "Your headline here",
    level: "h1",
    align: "left",
    textColor: "#000000",
    fontSize: 36,
    lineHeight: 1.2,
    padding: { top: "0", right: "0", bottom: "0", left: "0" },
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  },
  related: { settings: HeaderSettings },
};
