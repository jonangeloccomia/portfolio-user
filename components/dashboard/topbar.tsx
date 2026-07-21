"use client";

import { MegaphoneIcon } from "lucide-react";

import { useUser } from "@/lib/use-user";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar() {
  const { user } = useUser();
  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : null;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-4">
      <div className="flex items-center gap-2 text-primary">
        <MegaphoneIcon className="size-5" />
        <span className="text-sm font-medium tracking-tight text-sidebar-foreground">
          Campaignr
          {displayName && (
            <span className="text-sm font-medium text-foreground">
              {" / " + displayName}
            </span>
          )}
        </span>
      </div>

      <ThemeToggle />
    </header>
  );
}
