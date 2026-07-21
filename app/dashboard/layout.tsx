import { UserProvider } from "@/lib/use-user";
import { FullscreenProvider } from "@/components/dashboard/fullscreen-context";
import { DashboardChrome } from "@/components/dashboard/dashboard-chrome";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <FullscreenProvider>
        <DashboardChrome>{children}</DashboardChrome>
      </FullscreenProvider>
    </UserProvider>
  );
}
