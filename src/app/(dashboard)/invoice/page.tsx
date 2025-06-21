import { Suspense } from "react";

import { auth } from "@/lib/auth";
import Loading from "@/components/Loading";

import InvoiceClientPage from "../_component/InvoiceClientPage";

export default async function InvoicePage() {
  const session = await auth();
  return (
    <Suspense fallback={<Loading />}>
      <InvoiceClientPage
        currency={session?.user.currency}
        userId={session?.user.id}
      />
    </Suspense>
  );
}
