"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutTemplateIcon, GlobeIcon } from "lucide-react";

import { useUser } from "@/lib/use-user";
import { GettingStartedGuide } from "@/components/dashboard/getting-started-guide";
import { PortfolioNotice } from "@/components/dashboard/portfolio-notice";

type Template = { _id: string; name: string; updatedAt: string };

export function DashboardOverview() {
  const { user } = useUser();
  const [templateCount, setTemplateCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data: { templates?: Template[] }) => setTemplateCount(data.templates?.length ?? 0))
      .catch(() => setTemplateCount(0));
  }, []);

  const isLive = !!user?.liveExpiresAt && new Date(user.liveExpiresAt) > new Date();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {user?.firstName ? `Welcome back, ${user.firstName}` : "Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s where your landing pages stand.
        </p>
      </div>

      <PortfolioNotice />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/builder"
          className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary hover:bg-muted"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LayoutTemplateIcon className="size-4" />
          </span>
          <div>
            <p className="text-xl font-semibold text-foreground">
              {templateCount ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {templateCount === 1 ? "Template" : "Templates"} created
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/published"
          className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary hover:bg-muted"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GlobeIcon className="size-4" />
          </span>
          <div>
            <p className="text-xl font-semibold text-foreground">
              {isLive ? "Live" : "Not live"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isLive ? "Your page is published" : "Publish a page to go live"}
            </p>
          </div>
        </Link>
      </div>

      <GettingStartedGuide />
    </div>
  );
}
