"use client";

import { createElement } from "react";
import { useEditor } from "@craftjs/core";
import { CopyIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { duplicateNode } from "./duplicate-node";

export function SettingsPanel() {
  const { selected, actions, query } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected: { id: string; settings?: React.ElementType; isDeletable: boolean } | undefined;

    if (currentNodeId && state.nodes[currentNodeId]) {
      const node = state.nodes[currentNodeId];
      selected = {
        id: currentNodeId,
        settings: node.related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return { selected };
  });

  if (!selected) {
    return (
      <div className="flex flex-col p-4">
        <p className="text-sm text-muted-foreground">
          Select an element on the canvas to edit its settings.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Settings</p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => duplicateNode(query, actions, selected.id)}
            title="Duplicate"
          >
            <CopyIcon />
          </Button>
          {selected.isDeletable && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => actions.delete(selected.id)}
              title="Delete"
            >
              <Trash2Icon className="text-destructive" />
            </Button>
          )}
        </div>
      </div>

      {selected.settings && createElement(selected.settings)}
    </div>
  );
}
