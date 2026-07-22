"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CopyIcon,
  FilePlusIcon,
  Globe2Icon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LandingPreviewIcon } from "@/components/landing-preview-icon";
import { STARTER_TEMPLATE_CONTENT, STARTER_TEMPLATE_NAME } from "@/lib/starter-templates";
import { useUser } from "@/lib/use-user";
import { GenerateWithAi } from "./generate-dialog";

const DEFAULT_GENERATION_TOKENS = 3;

type Template = {
  _id: string;
  name: string;
  updatedAt: string;
};

function formatUpdatedAt(value: string) {
  return `Edited ${new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}

function NewTemplateDialog({
  triggerSize,
  triggerClassName,
}: {
  triggerSize?: "default" | "sm";
  triggerClassName?: string;
}) {
  const router = useRouter();
  const { user, refetch } = useUser();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [view, setView] = useState<"choose" | "ai">("choose");

  const tokensLeft = user?.generationTokens ?? DEFAULT_GENERATION_TOKENS;
  const noTokensLeft = tokensLeft <= 0;

  const resetAndClose = () => {
    setOpen(false);
    setView("choose");
  };

  const handleStartFromTemplate = async () => {
    setCreating(true);
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: STARTER_TEMPLATE_NAME,
          content: JSON.stringify(STARTER_TEMPLATE_CONTENT),
        }),
      });
      if (response.ok) {
        const { template } = await response.json();
        router.push(`/dashboard/builder/${template._id}`);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          resetAndClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size={triggerSize} className={triggerClassName}>
          <PlusIcon data-icon="inline-start" />
          New template
        </Button>
      </DialogTrigger>
      <DialogContent>
        {view === "choose" ? (
          <>
            <DialogHeader>
              <DialogTitle>Create a new template</DialogTitle>
              <DialogDescription>
                Start from an existing layout, build from an empty page, or generate one from a prompt.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                disabled={creating}
                onClick={handleStartFromTemplate}
                className="flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LayoutTemplateIcon className="size-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  {creating ? "Creating..." : "Start from template"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Duplicate an existing layout to build on.
                </p>
              </button>
              <Link
                href="/dashboard/builder/new"
                className="flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary hover:bg-muted"
              >
                <FilePlusIcon className="size-5 text-primary" />
                <p className="text-sm font-medium text-foreground">Start from scratch</p>
                <p className="text-xs text-muted-foreground">Begin with a blank page.</p>
              </Link>
              <button
                type="button"
                disabled={noTokensLeft}
                onClick={() => setView("ai")}
                className="flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-transparent"
              >
                <SparklesIcon className="size-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Generate with AI {noTokensLeft ? "" : `(${tokensLeft} left)`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {noTokensLeft
                    ? "No generations left."
                    : "Describe the page you want."}
                </p>
              </button>
            </div>
          </>
        ) : (
          <GenerateWithAi
            creating={creating}
            onGenerating={setCreating}
            onBack={() => setView("choose")}
            onGenerated={(templateId) => {
              void refetch();
              router.push(`/dashboard/builder/${templateId}`);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Builder() {
  const [templates, setTemplates] = useState<Template[] | null>(null);

  const loadTemplates = () => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data.templates ?? []))
      .catch(() => setTemplates([]));
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    loadTemplates();
  };

  const handleDuplicate = async (id: string) => {
    await fetch(`/api/templates/${id}/duplicate`, { method: "POST" });
    loadTemplates();
  };

  return (
    <div className="flex w-full flex-col gap-7 p-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Builder</h1>
          <p className="text-sm text-muted-foreground">
            Templates you&apos;ve created.
          </p>
        </div>
        <NewTemplateDialog />
      </div>

      {templates === null ? (
        <p className="text-sm text-muted-foreground">Loading templates...</p>
      ) : templates.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Card key={template._id} className="group/template overflow-hidden p-0">
              <CardContent className="flex items-center gap-0 p-0">
                <div className="size-20 bg-surface flex items-center justify-center border-r">
                  <LandingPreviewIcon className="w-full max-w-2xl drop-shadow-2xl" />
                </div>
                <Link href={`/dashboard/builder/${template._id}`} className="block flex-1 px-3 space-y-0.5">
                  <h2 className="line-clamp-2 text-sm font-medium text-primary">{template.name}</h2>
                  <p className="truncate text-xs font-medium text-foreground">
                    {formatUpdatedAt(template.updatedAt)}
                  </p>
                </Link>
                <div className="shrink-0 flex items-center pr-3">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Duplicate"
                    className="cursor-pointer"
                    onClick={() => handleDuplicate(template._id)}
                  >
                    <CopyIcon />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon-sm" title="Delete" className="cursor-pointer">
                        <Trash2Icon className="text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete template?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete &quot;{template.name}&quot;. This
                          can&apos;t be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(template._id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-24 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <LayoutDashboardIcon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No templates yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first template to get started.
            </p>
          </div>
          <NewTemplateDialog triggerSize="sm" triggerClassName="mt-1" />
        </div>
      )}
    </div>
  );
}
