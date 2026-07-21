import { MegaphoneIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { LandingPreviewIcon } from "@/components/landing-preview-icon";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 bg-background">
      <div className="relative flex w-full flex-col px-8 py-7 sm:px-12 lg:w-1/2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-primary">
            <MegaphoneIcon className="size-5" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Campaignr
            </span>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center">{children}</div>
      </div>

      <div
        aria-hidden
        className="relative hidden overflow-hidden lg:block lg:w-1/2"
        style={{
          background:
            "linear-gradient(135deg, var(--surface) 0%, var(--background) 45%, var(--primary) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] bg-size-[56px_56px]"
        />
        <div className="absolute -bottom-24 -right-24 size-105 rounded-full bg-accent/30 blur-[120px]" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <LandingPreviewIcon className="w-full max-w-2xl drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
