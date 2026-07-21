"use client";

import * as React from "react";
import type { Session } from "next-auth";

type UserData = Session["user"] | null;

type UserContextValue = {
  user: UserData;
  refetch: () => Promise<void>;
  clear: () => void;
};

const UserContext = React.createContext<UserContextValue | null>(null);

async function fetchUser(): Promise<UserData> {
  const res = await fetch("/api/me");
  const data = res.ok ? await res.json() : null;
  return data ? data.user : null;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserData>(null);

  const refetch = React.useCallback(async () => {
    setUser(await fetchUser());
  }, []);

  const clear = React.useCallback(() => {
    setUser(null);
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    fetchUser().then((fetchedUser) => {
      if (!cancelled) {
        setUser(fetchedUser);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = React.useMemo(
    () => ({ user, refetch, clear }),
    [user, refetch, clear]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
