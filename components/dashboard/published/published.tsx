"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckIcon, CopyIcon, GlobeIcon } from "lucide-react";

import { useUser } from "@/lib/use-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SelectInput } from "@/components/dashboard/builder/editor/inputs/select-input";
import { PortfolioNotice } from "@/components/dashboard/portfolio-notice";

type Template = { _id: string; name: string; updatedAt: string };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Published() {
  const { user, refetch } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [templates, setTemplates] = useState<Template[] | null>(null);
  // Manual pick from the dropdown. Falls back to the live template (or the
  // first template) via `selectedId` below until the user overrides it.
  const [selectedOverride, setSelectedOverride] = useState<string | null>(null);
  const [busy, setBusy] = useState<"checkout" | "switch" | null>(null);
  const [copied, setCopied] = useState(false);
  const [banner, setBanner] = useState<"success" | "canceled" | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data: { templates?: Template[] }) => setTemplates(data.templates ?? []))
      .catch(() => setTemplates([]));
  }, []);

  useEffect(() => {
    if (searchParams.get("success")) {
      // One-time banner from the Stripe redirect; the URL is cleared right
      // after, so this can't be derived from render state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBanner("success");
      refetch();
      router.replace("/dashboard/published");
    } else if (searchParams.get("canceled")) {
      setBanner("canceled");
      router.replace("/dashboard/published");
    }
  }, [searchParams, refetch, router]);

  const selectedId = selectedOverride ?? user?.liveTemplateId ?? templates?.[0]?._id ?? "";

  const isActive = !!user?.liveExpiresAt && new Date(user.liveExpiresAt) > new Date();
  const isLiveSelection = isActive && user?.liveTemplateId === selectedId;

  async function handleCheckout() {
    if (!selectedId) return;
    setBusy("checkout");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selectedId }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    } finally {
      setBusy(null);
    }
  }

  async function handleSwitch() {
    if (!selectedId) return;
    setBusy("switch");
    try {
      const res = await fetch("/api/billing/live-template", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selectedId }),
      });
      if (res.ok) {
        await refetch();
      }
    } finally {
      setBusy(null);
    }
  }

  function handleCopy() {
    if (!user?.slug) return;
    navigator.clipboard.writeText(`${window.location.origin}/landing/${user.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const publishLabel = !user?.liveExpiresAt
    ? "Publish for $3/mo"
    : isActive
      ? "Extend +1 month ($3)"
      : "Republish for $3/mo";

  return (
    <div className="flex w-full max-w-2xl flex-col gap-7 p-7">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Published</h1>
        <p className="text-sm text-muted-foreground">
          Make one of your templates live at a public URL.
        </p>
      </div>

      <PortfolioNotice />

      {banner === "success" && (
        <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground">
          Payment complete — your page is live.
        </p>
      )}
      {banner === "canceled" && (
        <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
          Checkout canceled.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeIcon className="size-4" />
            {isActive ? "Live" : user?.liveExpiresAt ? "Expired" : "Not published yet"}
          </CardTitle>
          <CardDescription>
            {isActive && user?.liveExpiresAt
              ? `Expires ${formatDate(user.liveExpiresAt)}`
              : user?.liveExpiresAt
                ? `Expired ${formatDate(user.liveExpiresAt)}`
                : "Publish a template to get a public link."}
          </CardDescription>
        </CardHeader>
        {user?.slug && (
          <CardContent>
            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
              <span className="flex-1 truncate text-muted-foreground">
                {typeof window !== "undefined" ? window.location.origin : ""}/landing/{user.slug}
              </span>
              <Button type="button" variant="ghost" size="icon-sm" onClick={handleCopy}>
                {copied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose template</CardTitle>
          <CardDescription>Pick which template goes live.</CardDescription>
        </CardHeader>
        <CardContent>
          {templates === null ? (
            <p className="text-sm text-muted-foreground">Loading templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any templates yet. Create one in the Builder first.
            </p>
          ) : (
            <SelectInput
              label="Template"
              value={selectedId}
              options={templates.map((template) => ({
                value: template._id,
                label: template.name,
              }))}
              onChange={setSelectedOverride}
            />
          )}
        </CardContent>
        <CardFooter className="justify-end gap-3">
          {isActive && !isLiveSelection && (
            <Button
              type="button"
              variant="outline"
              disabled={busy !== null}
              onClick={handleSwitch}
            >
              {busy === "switch" ? "Switching..." : "Switch live template"}
            </Button>
          )}
          <Button type="button" disabled={!selectedId || busy !== null} onClick={handleCheckout}>
            {busy === "checkout" ? "Redirecting..." : publishLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
