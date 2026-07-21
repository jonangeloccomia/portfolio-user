import Link from "next/link";
import { CircleCheckIcon } from "lucide-react";

import { auth } from "@/config/auth";
import { Button } from "@/components/ui/button";

const CHECKLIST = [
  "Generate a full page from one prompt.",
  "Drag, drop, and restyle without code.",
  "Publish to your own link instantly.",
  "Sell access with built-in Stripe checkout.",
];

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex max-w-md mx-auto flex-col gap-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Ship landing pages, not tickets.
        </h1>
        <p className="text-muted-foreground">
          Campaignr turns a prompt or a drag-and-drop canvas into a published
          landing page — no dev queue, no boilerplate.
        </p>
      </div>

      <ul className="space-y-2.5">
        {CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
            <CircleCheckIcon className="size-4.5 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>

      <div className="grid items-center gap-3 grid-cols-2">
        {
          session?.user ? <>
            <Button asChild size="lg" className="w-auto h-auto p-3 rounded-full text-base">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </> : <>
            <Button asChild size="lg" className="w-auto h-auto p-3 rounded-full text-base">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-auto h-auto p-3 rounded-full text-base">
              <Link href="/register">Sign up</Link>
            </Button>
          </>
        }
      </div>
    </div>
  );
}
