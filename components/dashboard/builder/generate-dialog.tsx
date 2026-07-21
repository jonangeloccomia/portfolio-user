"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function GenerateWithAi({
  creating,
  onGenerating,
  onBack,
  onGenerated,
}: {
  creating: boolean;
  onGenerating: (value: boolean) => void;
  onBack: () => void;
  onGenerated: (templateId: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    onGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (response.ok) {
        const { template } = await response.json();
        onGenerated(template._id);
        return;
      }
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Something went wrong. Try again.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      onGenerating(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Generate with AI</DialogTitle>
        <DialogDescription>
          Describe the landing page you want. Be specific about tone and sections.
        </DialogDescription>
      </DialogHeader>
      <Textarea
        autoFocus
        rows={4}
        placeholder="e.g. landing page for a fitness app, energetic, hero + 3 features + CTA"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        disabled={creating}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onBack} disabled={creating}>
          Back
        </Button>
        <Button type="button" onClick={handleGenerate} disabled={creating || prompt.trim().length === 0}>
          {creating ? "Generating..." : "Generate"}
        </Button>
      </div>
    </>
  );
}
