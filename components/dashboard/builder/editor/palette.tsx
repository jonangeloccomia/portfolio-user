"use client";

import { Element, useEditor } from "@craftjs/core";
import {
  Heading1,
  ImageIcon,
  MousePointerClick,
  SquareIcon,
  Type,
  Video as VideoIcon,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Header } from "./elements/header";
import { TextBlock } from "./elements/text-block";
import { CtaButton } from "./elements/cta-button";
import { Container } from "./elements/container";
import { Video } from "./elements/video";
import { ImageBlock } from "./elements/image";

const PALETTE_ITEMS: { label: string; icon: LucideIcon; element: React.ReactElement }[] = [
  { label: "Header", icon: Heading1, element: <Header /> },
  { label: "Text block", icon: Type, element: <TextBlock /> },
  { label: "CTA button", icon: MousePointerClick, element: <CtaButton /> },
  { label: "Container", icon: SquareIcon, element: <Element canvas is={Container} /> },
  { label: "Video", icon: VideoIcon, element: <Video /> },
  { label: "Image", icon: ImageIcon, element: <ImageBlock /> },
];

function PaletteItem({ label, icon: Icon, element }: (typeof PALETTE_ITEMS)[number]) {
  const {
    connectors: { create },
  } = useEditor();

  return (
    <div
      ref={(ref) => {
        if (ref) create(ref, element);
      }}
      className={cn(
        "flex w-full cursor-grab items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-sm text-foreground shadow-xs transition-colors hover:bg-muted active:cursor-grabbing"
      )}
    >
      <Icon className="size-4 text-muted-foreground" />
      {label}
    </div>
  );
}

export function Palette() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Elements
      </p>
      {PALETTE_ITEMS.map((item) => (
        <PaletteItem key={item.label} {...item} />
      ))}
    </div>
  );
}
