import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

import CreateEditInvoice from "../../_component/CreateEditInvoice";

export default async function InvoiceCreate() {
  const session = await auth();

  return (
    <div className="p-4">
      <div className="flex items-center  gap-4">
        <Link href={"/invoice"} className={buttonVariants({ size: "icon" })}>
          <ArrowLeft />
        </Link>
        <h1 className="text-xl font-semibold">Create Invoice</h1>
      </div>
      <CreateEditInvoice
        firstName={session?.user.firstName}
        lastName={session?.user.lastName}
        email={session?.user.email}
        currency={session?.user.currency}
      />
    </div>
  );
}
