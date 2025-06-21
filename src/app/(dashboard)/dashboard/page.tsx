import { Suspense } from "react";
import { auth } from "@/lib/auth";

import Loading from "@/components/Loading";

import QuickActions from "./_components/QuickActions";
import RecentInvoices from "./_components/RecentInvoices";
import DashboardStats from "./_components/DashboardStats";
import DashboardCharts from "./_components/DashboardCharts";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    return <div>Unauthorized</div>;
  }

  // Ensure required user data exists
  if (!session.user.id || !session.user.firstName || !session.user.currency) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800">
            Profile Incomplete
          </h2>
          <p className="text-yellow-700 mt-2">
            Please complete your profile setup to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your invoices today.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<Loading />}>
        <DashboardStats
          userId={session.user.id}
          currency={session.user.currency}
        />
      </Suspense>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<Loading />}>
            <DashboardCharts
              userId={session.user.id}
              currency={session.user.currency}
            />
          </Suspense>
        </div>

        <div className="space-y-6">
          <QuickActions />
          <Suspense fallback={<Loading />}>
            <RecentInvoices
              userId={session.user.id}
              currency={session.user.currency}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
