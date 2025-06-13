import { Suspense } from "react";

import { ProtectedPage } from "@/components/CheckAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full relative">
      <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
      <ProtectedPage />
    </main>
  );
}
