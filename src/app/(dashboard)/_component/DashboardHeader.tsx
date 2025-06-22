import { SidebarTrigger } from "@/components/ui/sidebar";

import UserProfileDropDown from "./UserProfileDropdown";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 h-14  w-full border-b backdrop-blur-3xl flex items-center px-4">
      <SidebarTrigger />
      <div className="ml-auto w-fit">
        <UserProfileDropDown isArrowUp={false} isFullName={false} />
      </div>
    </header>
  );
}
