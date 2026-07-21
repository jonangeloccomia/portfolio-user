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

export type TextBlockProps = {
  text: string;
  align: Align;
  textColor: string;
  fontSize: number;
  lineHeight: number;
  padding: Spacing;
  margin: Spacing;
};

const DEFAULT_SPACING: Spacing = { top: "0", right: "0", bottom: "0", left: "0" };

export const TextBlock: UserComponent<Partial<TextBlockProps>> = ({
  text = "Write a short paragraph about your product or offer.",
  align = "left",
  textColor = "#6b7280",
  fontSize = 16,
  lineHeight = 1.6,
  padding = DEFAULT_SPACING,
  margin = DEFAULT_SPACING,
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <p
      ref={(ref: HTMLParagraphElement | null) => {
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
        "whitespace-pre-wrap",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      {text}
    </p>
  );
};

function TextBlockSettings() {
  const {
    text,
    align,
    textColor,
    fontSize,
    lineHeight,
    padding,
    margin,
    actions: { setProp },
  } = useNode((node) => ({
    text: node.data.props.text,
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
        <FieldLabel htmlFor="text-body">Text</FieldLabel>
        <Textarea
          id="text-body"
          rows={5}
          value={text}
          onChange={(event) =>
            setProp((props: TextBlockProps) => {
              props.text = event.target.value;
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
            setProp((props: TextBlockProps) => {
              props.align = value;
            })
          }
        />
      </Field>
      <ColorInput
        label="Text color"
        value={textColor}
        onChange={(value) =>
          setProp((props: TextBlockProps) => {
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
          setProp((props: TextBlockProps) => {
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
          setProp((props: TextBlockProps) => {
            props.lineHeight = value;
          })
        }
      />
      <SpacingInput
        label="Padding"
        value={padding}
        onChange={(value) =>
          setProp((props: TextBlockProps) => {
            props.padding = value;
          })
        }
      />
      <SpacingInput
        label="Margin"
        value={margin}
        onChange={(value) =>
          setProp((props: TextBlockProps) => {
            props.margin = value;
          })
        }
      />
    </>
  );
}

TextBlock.craft = {
  displayName: "Text",
  props: {
    text: "Write a short paragraph about your product or offer.",
    align: "left",
    textColor: "#6b7280",
    fontSize: 16,
    lineHeight: 1.6,
    padding: { top: "0", right: "0", bottom: "0", left: "0" },
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  },
  related: { settings: TextBlockSettings },
};
