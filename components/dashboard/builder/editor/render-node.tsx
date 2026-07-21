"use client";

import { ROOT_NODE, useEditor, useNode } from "@craftjs/core";
import { CopyIcon, GripVerticalIcon, Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { duplicateNode } from "./duplicate-node";

export function RenderNode({ render }: { render: React.ReactElement }) {
  const { id } = useNode();
  const {
    connectors: { drag },
  } = useNode();
  const { name } = useNode((node) => ({
    name: node.data.custom?.displayName || node.data.displayName,
  }));
  const { actions, query, isActive, enabled } = useEditor((state, query) => ({
    isActive: query.getEvent("selected").contains(id),
    enabled: state.options.enabled,
  }));

  if (id === ROOT_NODE || !enabled) {
    return render;
  }

  const isDeletable = query.node(id).isDeletable();

  return (
    <div
      className={cn(
        "group/canvas-item relative rounded-md border border-dashed border-transparent transition-colors",
        isActive
          ? "border-primary"
          : "hover:border-primary/40"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute left-0 z-10 flex items-center gap-1.5 rounded-tl-md rounded-br-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground opacity-0 transition-opacity",
          "group-hover/canvas-item:pointer-events-auto group-hover/canvas-item:opacity-100",
          isActive && "pointer-events-auto opacity-100"
        )}
      >
        <button
          ref={(ref) => {
            if (ref) drag(ref);
          }}
          type="button"
          className="flex size-4 cursor-grab items-center justify-center active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVerticalIcon className="size-3.5" />
        </button>
        <span>{name}</span>
        <button
          type="button"
          onClick={() => duplicateNode(query, actions, id)}
          className="flex size-4 items-center justify-center opacity-90 hover:opacity-100"
          title="Duplicate"
        >
          <CopyIcon className="size-3.5" />
        </button>
        {isDeletable && (
          <button
            type="button"
            onClick={() => actions.delete(id)}
            className="flex size-4 items-center justify-center opacity-90 hover:opacity-100"
            title="Delete"
          >
            <Trash2Icon className="size-3.5" />
          </button>
        )}
      </div>

      {render}
    </div>
  );
}
