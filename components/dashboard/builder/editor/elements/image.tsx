"use client";

import { useNode, type UserComponent } from "@craftjs/core";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toCssLength } from "../inputs/spacing-input";

export type ImageProps = {
  src: string;
  alt: string;
  width: string;
  height: string;
};

export const ImageBlock: UserComponent<Partial<ImageProps>> = ({
  src = "https://placehold.co/300x300@2x.png",
  alt = "",
  width = "300",
  height = "300",
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className={cn("w-full", !src && height === "auto" && "aspect-video")}
      style={{
        width: toCssLength(width),
        height: height === "auto" ? undefined : toCssLength(height),
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full rounded-md object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
          <ImageIcon className="size-8" />
        </div>
      )}
    </div>
  );
};

function ImageSettings() {
  const {
    src,
    alt,
    width,
    height,
    actions: { setProp },
  } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  return (
    <>
      <Field>
        <FieldLabel htmlFor="image-src">Image URL</FieldLabel>
        <Input
          id="image-src"
          value={src ?? ""}
          placeholder="https://example.com/image.jpg"
          onChange={(event) =>
            setProp((props: ImageProps) => {
              props.src = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="image-alt">Alt text</FieldLabel>
        <Input
          id="image-alt"
          value={alt ?? ""}
          onChange={(event) =>
            setProp((props: ImageProps) => {
              props.alt = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="image-width">Width</FieldLabel>
        <Input
          id="image-width"
          value={width ?? ""}
          onChange={(event) =>
            setProp((props: ImageProps) => {
              props.width = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="image-height">Height</FieldLabel>
        <Input
          id="image-height"
          value={height ?? ""}
          onChange={(event) =>
            setProp((props: ImageProps) => {
              props.height = event.target.value;
            })
          }
        />
      </Field>
    </>
  );
}

ImageBlock.craft = {
  displayName: "Image",
  props: {
    src: "https://placehold.co/300x300@2x.png",
    alt: "",
    width: "300",
    height: "300",
  },
  related: { settings: ImageSettings },
};
