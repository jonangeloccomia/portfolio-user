"use client";

import { useNode, type UserComponent } from "@craftjs/core";

import { ColorInput } from "../inputs/color-input";
import { SpacingInput, toCssLength, type Spacing } from "../inputs/spacing-input";

export type PageCanvasProps = {
  background: string;
  textColor: string;
  padding: Spacing;
  children?: React.ReactNode;
};

const DEFAULT_PADDING: Spacing = { top: "0", right: "0", bottom: "0", left: "0" };

export const PageCanvas: UserComponent<Partial<PageCanvasProps>> = ({
  background = "#ffffff",
  textColor = "#000000",
  padding = DEFAULT_PADDING,
  children,
}) => {
  const {
    connectors: { connect },
    hasChildren,
  } = useNode((node) => ({
    hasChildren: node.data.nodes.length > 0,
  }));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      style={
        {
          background,
          color: textColor,
          paddingTop: toCssLength(padding.top),
          paddingRight: toCssLength(padding.right),
          paddingBottom: toCssLength(padding.bottom),
          paddingLeft: toCssLength(padding.left),
          containerType: "inline-size",
          containerName: "page",
        } as React.CSSProperties
      }
      className="mx-auto flex w-full flex-col min-h-full"
    >
      {hasChildren ? (
        children
      ) : (
        <p className="pointer-events-none flex flex-1 items-center justify-center text-center text-sm">
          Drag elements here to start building your page.
        </p>
      )}
    </div>
  );
};

function PageCanvasSettings() {
  const {
    background,
    textColor,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    textColor: node.data.props.textColor,
    padding: node.data.props.padding,
  }));

  return (
    <>
      <ColorInput
        label="Background"
        value={background}
        onChange={(value) =>
          setProp((props: PageCanvasProps) => {
            props.background = value;
          })
        }
      />
      <ColorInput
        label="Text color"
        value={textColor}
        onChange={(value) =>
          setProp((props: PageCanvasProps) => {
            props.textColor = value;
          })
        }
      />
      <SpacingInput
        label="Padding"
        value={padding}
        onChange={(value) =>
          setProp((props: PageCanvasProps) => {
            props.padding = value;
          })
        }
      />
    </>
  );
}

PageCanvas.craft = {
  displayName: "Page",
  props: {
    background: "#ffffff",
    textColor: "#000000",
    padding: { top: "0", right: "0", bottom: "0", left: "0" },
  },
  isCanvas: true,
  related: { settings: PageCanvasSettings },
};
