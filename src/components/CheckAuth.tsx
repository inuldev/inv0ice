import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * Proteksi halaman hanya untuk user yang sudah login
 */
export async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Pastikan data onboarding sudah lengkap
  const { firstName, lastName, currency } = session.user;

  if (!firstName || !lastName || !currency) {
    return redirect("/onboarding");
  }

  return null;
}

/**
 * Proteksi halaman hanya untuk user yang belum isi onboarding
 */
export async function OnboardingGuard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { firstName, lastName, currency } = session.user;

  if (firstName && lastName && currency) {
    return redirect("/dashboard");
  }

  return null;
}

/**
 * Proteksi halaman untuk user yang belum login
 */
export async function UnprotectedPage() {
  const session = await auth();

  if (session) {
    const { firstName, lastName, currency } = session.user;

    if (firstName && lastName && currency) {
      return redirect("/dashboard");
    } else {
      return redirect("/onboarding");
    }
  }

  return null;
}
