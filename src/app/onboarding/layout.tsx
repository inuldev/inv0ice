import { Suspense } from "react";

import { OnboardingGuard } from "@/components/CheckAuth";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full relative">
      <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
      <OnboardingGuard />
    </main>
  );
}
