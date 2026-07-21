import Link from "next/link";
import { SparklesIcon, GlobeIcon, type LucideIcon } from "lucide-react";

const STEPS: {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}[] = [
    {
      label: "Create a template",
      description: "Start from scratch, a starter layout, or generate one with a prompt.",
      href: "/dashboard/builder",
      icon: SparklesIcon,
    },
    {
      label: "Customize it",
      description: "Drag, drop, and restyle every element until it fits.",
      href: "/dashboard/builder",
      icon: SparklesIcon,
    },
    {
      label: "Publish it live",
      description: "Go live on your own link and share it anywhere.",
      href: "/dashboard/published",
      icon: GlobeIcon,
    },
  ];

export function GettingStartedGuide() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Getting started</h2>
        <p className="text-sm text-muted-foreground">
          Three steps from blank page to published landing page.
        </p>
      </div>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <Link
            key={step.label}
            href={step.href}
            className="flex flex-col gap-2 rounded-xl border border-border p-4 transition-colors hover:border-primary hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {index + 1}
              </span>
              <step.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">{step.label}</p>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
