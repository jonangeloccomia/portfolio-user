"use client";

import { Editor, Frame } from "@craftjs/core";
import { PageCanvas } from "@/components/dashboard/builder/editor/elements/page-canvas";
import { Header } from "@/components/dashboard/builder/editor/elements/header";
import { TextBlock } from "@/components/dashboard/builder/editor/elements/text-block";
import { CtaButton } from "@/components/dashboard/builder/editor/elements/cta-button";
import { Container } from "@/components/dashboard/builder/editor/elements/container";
import { Video } from "@/components/dashboard/builder/editor/elements/video";
import { ImageBlock } from "@/components/dashboard/builder/editor/elements/image";

export function LivePage({ content }: { content: string }) {
  return (
    <Editor
      resolver={{ PageCanvas, Header, TextBlock, CtaButton, Container, Video, ImageBlock }}
      enabled={false}
    >
      <Frame data={content} />
    </Editor>
  );
}
