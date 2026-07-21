"use client";

import { Navbar } from "./navbar";
import { Topbar } from "./topbar";
import { useFullscreen } from "./fullscreen-context";
import { cn } from "@/lib/utils";

export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const { isFullscreen } = useFullscreen();

  return (
    <div className="flex flex-col h-screen bg-background">
      {!isFullscreen && <Topbar />}
      <div className="flex flex-1 overflow-hidden">
        {!isFullscreen && <Navbar />}
        <main className={cn(
          "flex-1 overflow-y-auto sm:border-l border-t",
          !isFullscreen && "sm:rounded-tl-3xl"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
