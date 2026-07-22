import { InfoIcon } from "lucide-react";

export function PortfolioNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
        <InfoIcon className="size-4" />
      </span>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">Portfolio project</p>
          <p className="text-xs text-muted-foreground">
            This app is a portfolio piece showcasing my skills, still rough around edges and under
            improvement — including a full payment flow. No real charges happen.
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-background/60 p-3">
          <p className="text-xs font-medium text-foreground">Test the payment with Stripe</p>
          <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
            <li>
              Card number: <span className="font-mono text-foreground">4242 4242 4242 4242</span>
            </li>
            <li>
              Expiry: <span className="font-mono text-foreground">any future date</span> (e.g.{" "}
              <span className="font-mono text-foreground">12/34</span>)
            </li>
            <li>
              CVC: <span className="font-mono text-foreground">any 3 digits</span>
            </li>
            <li>
              ZIP: <span className="font-mono text-foreground">any 5 digits</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
