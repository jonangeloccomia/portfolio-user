"use client";

import { Layers } from "@craftjs/layers";

import { LayerRow } from "./layer-row";

export function LayersPanel() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Layers
      </p>
      <div className="flex flex-col gap-0.5">
        <Layers renderLayer={LayerRow} expandRootOnLoad />
      </div>
    </div>
  );
}
