"use client";

import { useRef, useState } from "react";
import { GripHorizontalIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const PANEL_MARGIN = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function FloatingPanel({
  title,
  anchor,
  width,
  className,
  children,
}: {
  title: string;
  anchor: "left" | "right";
  width: number;
  className?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = panelRef.current?.getBoundingClientRect();
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      posX: position?.x ?? rect?.left ?? PANEL_MARGIN,
      posY: position?.y ?? rect?.top ?? PANEL_MARGIN,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const start = dragStart.current;
    const maxX = window.innerWidth - width - PANEL_MARGIN;
    const maxY = window.innerHeight - PANEL_MARGIN;
    setPosition({
      x: clamp(start.posX + (event.clientX - start.x), PANEL_MARGIN, Math.max(PANEL_MARGIN, maxX)),
      y: clamp(start.posY + (event.clientY - start.y), PANEL_MARGIN, Math.max(PANEL_MARGIN, maxY)),
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute z-20 flex max-h-[calc(100%-2rem)] flex-col rounded-xl border border-border bg-card shadow-lg",
        !position && (anchor === "left" ? "top-2 left-2" : "top-2 right-2"),
        className
      )}
      style={position ? { left: position.x, top: position.y, width } : { width }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex shrink-0 cursor-grab items-center justify-center gap-1.5 rounded-t-xl border-b border-border py-1.5 text-xs font-medium text-muted-foreground active:cursor-grabbing"
        title={title}
      >
        <GripHorizontalIcon className="size-3.5" />
      </div>
      <div className="flex flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
