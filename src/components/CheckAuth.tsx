import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

// dashboard
export async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    // redirect ke halaman login jika user belum login
    redirect("/login");
  }

  if (
    !session.user.firstName &&
    !session.user.lastName &&
    !session.user.currency
  ) {
    // redirect ke halaman onboarding jika user belum melengkapi form onboarding
    redirect("/onboarding");
  }

  return <></>;
}

// onboarding
export async function OnboardingGuard() {
  const session = await auth();

  if (!session) {
    // redirect ke halaman login jika user belum login
    redirect("/login");
  }

  if (
    session.user.firstName &&
    session.user.lastName &&
    session.user.currency
  ) {
    // redirect ke halaman dashboard jika user sudah melengkapi form onboarding
    redirect("/dashboard");
  }

  return <></>;
}

// login
export async function UnprotectedPage() {
  const session = await auth();

  if (session) {
    if (
      !session.user.firstName ||
      !session.user.lastName ||
      !session.user.currency
    ) {
      // redirect ke halaman onboarding jika user belum melengkapi form onboarding
      redirect("/onboarding");
    }
    // redirect ke halaman dashboard jika user sudah melengkapi form onboarding
    redirect("/dashboard");
  }

  return <></>;
}
