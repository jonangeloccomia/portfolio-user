"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Editor, Element, Frame, useEditor } from "@craftjs/core";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  Maximize2Icon,
  Minimize2Icon,
  Redo2Icon,
  SaveIcon,
  Undo2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFullscreen } from "@/components/dashboard/fullscreen-context";
import { FloatingPanel } from "./editor/floating-panel";
import { Palette } from "./editor/palette";
import { LayersPanel } from "./editor/layers-panel";
import { SettingsPanel } from "./editor/settings-panel";
import { RenderNode } from "./editor/render-node";
import { PageCanvas } from "./editor/elements/page-canvas";
import { Header } from "./editor/elements/header";
import { TextBlock } from "./editor/elements/text-block";
import { CtaButton } from "./editor/elements/cta-button";
import { Container } from "./editor/elements/container";
import { Video } from "./editor/elements/video";
import { ImageBlock } from "./editor/elements/image";

function HistoryControls() {
  const { actions, canUndo, canRedo } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={!canUndo}
        onClick={() => actions.history.undo()}
        title="Undo"
      >
        <Undo2Icon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={!canRedo}
        onClick={() => actions.history.redo()}
        title="Redo"
      >
        <Redo2Icon />
      </Button>
    </div>
  );
}

function PreviewToggle() {
  const { actions, enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        actions.setOptions((options) => {
          options.enabled = !enabled;
        })
      }
    >
      {enabled ? <EyeIcon data-icon="inline-start" /> : <EyeOffIcon data-icon="inline-start" />}
      {enabled ? "Preview" : "Exit preview"}
    </Button>
  );
}

function TitleInput({
  name,
  onChange,
}: {
  name: string;
  onChange: (name: string) => void;
}) {
  return (
    <input
      value={name}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Untitled template"
      className="-mx-1 w-56 rounded px-1 text-lg font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function SaveButton({ templateId, name }: { templateId?: string; name: string }) {
  const { query } = useEditor();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const handleSave = async () => {
    setStatus("saving");
    const content = query.serialize();

    try {
      const response = templateId
        ? await fetch(`/api/templates/${templateId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, content }),
          })
        : await fetch("/api/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, content }),
          });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      if (!templateId) {
        const { template } = await response.json();
        router.replace(`/dashboard/builder/${template._id}`);
      }

      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Button variant="default" size="sm" onClick={handleSave} disabled={status === "saving"}>
      <SaveIcon data-icon="inline-start" />
      {status === "saving" ? "Saving..." : status === "error" ? "Retry save" : "Save"}
    </Button>
  );
}

function FullscreenToggle({
  isFullscreen,
  onToggle,
}: {
  isFullscreen: boolean;
  onToggle: () => void;
}) {
  return (
    <Button variant="outline" size="sm" onClick={onToggle}>
      {isFullscreen ? (
        <Minimize2Icon data-icon="inline-start" />
      ) : (
        <Maximize2Icon data-icon="inline-start" />
      )}
      {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
    </Button>
  );
}

const PANEL_WIDTH = 256;

function EditorBody({ initialContent }: { initialContent?: string }) {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto">
        {initialContent ? (
          <Frame data={initialContent} />
        ) : (
          <Frame>
            <Element is={PageCanvas} canvas />
          </Frame>
        )}
      </div>
      {enabled && (
        <>
          <FloatingPanel title="Elements" anchor="left" width={PANEL_WIDTH}>
            <Palette />
            <Separator />
            <LayersPanel />
          </FloatingPanel>
          <FloatingPanel title="Settings" anchor="right" width={PANEL_WIDTH}>
            <SettingsPanel />
          </FloatingPanel>
        </>
      )}
    </div>
  );
}

export default function BuilderNew({
  templateId,
  initialName,
  initialContent,
}: {
  templateId?: string;
  initialName?: string;
  initialContent?: string;
}) {
  const { isFullscreen, setIsFullscreen } = useFullscreen();
  const [name, setName] = useState(initialName ?? "Untitled template");

  return (
    <Editor
      resolver={{ PageCanvas, Header, TextBlock, CtaButton, Container, Video, ImageBlock }}
      onRender={RenderNode}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon-sm">
              <Link href="/dashboard/builder">
                <ArrowLeftIcon />
              </Link>
            </Button>
            <TitleInput name={name} onChange={setName} />
          </div>
          <div className="flex items-center gap-2">
            <HistoryControls />
            <FullscreenToggle
              isFullscreen={isFullscreen}
              onToggle={() => setIsFullscreen(!isFullscreen)}
            />
            <PreviewToggle />
            <SaveButton templateId={templateId} name={name} />
          </div>
        </div>

        <EditorBody initialContent={initialContent} />
      </div>
    </Editor>
  );
}
