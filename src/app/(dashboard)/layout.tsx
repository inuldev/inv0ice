import { Suspense } from "react";

import Loading from "@/components/Loading";
import { ProtectedPage } from "@/components/CheckAuth";
import { SidebarProvider } from "@/components/ui/sidebar";

import DashboardHeader from "./_component/DashboardHeader";
import DashboardSidebar from "./_component/DashboardSidebar";
import UserProfileDropDown from "./_component/UserProfileDropdown";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/**sidebar**/}
      <DashboardSidebar>
        <UserProfileDropDown isFullName isArrowUp />
      </DashboardSidebar>

      <main className="w-full relative">
        {/**header**/}
        <DashboardHeader />
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <ProtectedPage />
      </main>
    </SidebarProvider>
  );
}
