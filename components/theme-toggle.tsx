"use client"

import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMounted } from "@/lib/use-mounted"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <div className={className}>
      <Label htmlFor="dark-mode-toggle" className="cursor-pointer">
        <SunIcon className="size-4" />
        <Switch
          id="dark-mode-toggle"
          checked={mounted && resolvedTheme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle dark mode"
        />
        <MoonIcon className="size-4" />
      </Label>
    </div>
  )
}
