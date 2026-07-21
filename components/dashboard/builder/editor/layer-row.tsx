"use client";

import { useEditor } from "@craftjs/core";
import { useLayer } from "@craftjs/layers";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function LayerRow({ children }: { children?: React.ReactNode }) {
  const {
    id,
    depth,
    children: childIds,
    connectors: { layer, drag },
    actions: { toggleLayer },
    expanded,
    selected,
  } = useLayer((node) => ({
    expanded: node.expanded,
    selected: node.event.selected,
  }));

  const { name } = useEditor((state) => ({
    name: state.nodes[id]
      ? state.nodes[id].data.custom?.displayName || state.nodes[id].data.displayName
      : "",
  }));

  const hasChildren = childIds.length > 0;

  return (
    <div>
      <div
        ref={(ref) => {
          if (ref) layer(drag(ref));
        }}
        style={{ paddingLeft: depth * 14 + 8 }}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm transition-colors",
          selected ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted"
        )}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleLayer();
            }}
            className="flex size-4 shrink-0 items-center justify-center"
          >
            {expanded ? (
              <ChevronDownIcon className="size-3.5" />
            ) : (
              <ChevronRightIcon className="size-3.5" />
            )}
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}
        <span className="truncate">{name}</span>
      </div>
      {hasChildren && expanded && <div>{children}</div>}
    </div>
  );
}
