"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/use-user";

export function LogoutButton() {
  const { clear } = useUser();

  return (
    <Button
      variant="outline"
      onClick={() => {
        clear();
        signOut({ callbackUrl: "/login" });
      }}
    >
      Log out
    </Button>
  );
}
