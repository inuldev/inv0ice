import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-2">
      Dashboard Page
      <Button
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >
        LogOut
      </Button>
    </div>
  );
}
