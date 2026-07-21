"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { useUser } from "@/lib/use-user";
import {
  GlobeIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserCircleIcon,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Home", href: "/dashboard", icon: HomeIcon },
      { label: "Profile", href: "/dashboard/profile", icon: UserCircleIcon },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Builder", href: "/dashboard/builder", icon: LayoutDashboardIcon },
      { label: "Published", href: "/dashboard/published", icon: GlobeIcon },
    ],
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={item.label}
      className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors sm:justify-start ${active
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
    >
      <Icon className="size-4 shrink-0" />
      <span className="hidden sm:inline">{item.label}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { clear } = useUser();

  function handleLogout() {
    clear();
    signOut({ callbackUrl: "/login" });
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-10 flex h-16 w-full shrink-0 items-center border-t border-sidebar-border bg-sidebar px-2 sm:static sm:h-full sm:w-48 sm:flex-col sm:items-stretch sm:border-t-0 sm:bg-transparent sm:px-4 sm:py-5">
      <nav className="flex flex-1 items-center justify-around gap-1 overflow-x-auto sm:flex-col sm:items-stretch sm:justify-start sm:gap-6 sm:overflow-x-visible sm:overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="contents sm:flex sm:flex-col sm:gap-1">
            <span className="hidden px-3 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/50 sm:block">
              {group.label}
            </span>
            {group.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={pathname === item.href}
              />
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:hidden"
        >
          <LogOutIcon className="size-4 shrink-0" />
        </button>
      </nav>

      <div className="hidden sm:block sm:pt-4">
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:justify-start"
        >
          <LogOutIcon className="size-4 shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
}
