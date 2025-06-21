"use client";

import Link from "next/link";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import Loading from "@/components/Loading";
import { IInvoice } from "@/models/invoice.model";
import { DataTable } from "@/components/DataTable";
import { cn, formatCurrency, TCurrencyKey } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface IInvoiceClientPage {
  currency: string | undefined;
  userId: string | undefined;
}

export default function InvoiceClientPage({
  userId,
  currency,
}: IInvoiceClientPage) {
  const [data, setData] = useState<IInvoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/invoice?page=${page}`);
      const responseData = await response.json();

      if (response.status === 200) {
        setData(responseData.data || []);
        setTotalPage(responseData.totalPage || 1);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSendEmail = async (invoiceId: string, subject: string) => {
    try {
      toast.loading("Sending email...");
      const response = await fetch(`/api/email/${invoiceId}`, {
        method: "POST",
        body: JSON.stringify({
          subject: subject,
        }),
      });

      const responsedata = await response.json();

      if (response.status === 200) {
        toast.success(responsedata.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };

  const columns: ColumnDef<IInvoice>[] = [
    {
      accessorKey: "invoice_no",
      header: "Invoice No",
    },
    {
      accessorKey: "invoice_date",
      header: "Date",
      cell: ({ row }) => {
        return format(row.original.invoice_date, "PP");
      },
    },
    {
      accessorKey: "due_date",
      header: "Due",
      cell: ({ row }) => {
        return format(row.original.due_date, "PP");
      },
    },
    {
      accessorKey: "to.name",
      header: "Client Name",
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const invoiceCurrency = (row.original.currency ||
          currency ||
          "USD") as TCurrencyKey;
        return formatCurrency(row.original.total, invoiceCurrency);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <Badge>{row.original.status}</Badge>;
      },
    },
    {
      accessorKey: "_id", //id not in use
      header: "Action",
      cell: ({ row }) => {
        const invoiceId = row.original._id?.toString();
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="sr-only">Open menu</span>
              <MoreVerticalIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/api/invoice/${userId}/${invoiceId}`)
                }
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/invoice/edit/${invoiceId}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/invoice/paid/${invoiceId}`)}
              >
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleSendEmail(
                    invoiceId as string,
                    `Invoice from ${row.original.from.name}`
                  )
                }
              >
                Send Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-xl font-semibold">Invoice</h1>
        <Link
          href={"/invoice/create"}
          className={cn(buttonVariants(), "cursor-pointer")}
        >
          Create Invoice
        </Link>
      </div>

      {/* {data && data.length === 0 && !isLoading && (
        <div className="min-h-60 h-full w-full bg-neutral-100 flex justify-center items-center rounded">
          <p className="font-semibold">No invoice found</p>
        </div>
      )} */}

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <DataTable columns={columns} data={data} />
          {totalPage !== 1 && (
            <div className="my-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={() => setPage(1)} />
                  </PaginationItem>

                  {new Array(totalPage).fill(null).map((index: number) => {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          onClick={() => setPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => setPage(totalPage)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
