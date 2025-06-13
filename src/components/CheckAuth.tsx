import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

//dashboard
export async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <></>;
}

//component for unprotected page
//login
//landing
export async function UnprotectedPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <></>;
}
