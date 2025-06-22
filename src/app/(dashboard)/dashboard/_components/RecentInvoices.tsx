"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ExternalLinkIcon, MoreVerticalIcon } from "lucide-react";

import { IInvoice } from "@/models/invoice.model";
import { formatCurrency, TCurrencyKey } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecentInvoicesProps {
  userId: string;
  currency: string;
}

export default function RecentInvoices({
  userId,
  currency,
}: RecentInvoicesProps) {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentInvoices = async () => {
      try {
        const response = await fetch("/api/invoice?page=1");
        if (response.ok) {
          const data = await response.json();
          // Get only the first 5 invoices for recent activity
          setInvoices(data.data?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentInvoices();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCEL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 animate-pulse"
              >
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Invoices</CardTitle>
        <Link href="/invoice">
          <Button variant="ghost" size="sm">
            View All
            <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No invoices found</p>
            <Link href="/invoice/create">
              <Button className="mt-2" size="sm">
                Create Your First Invoice
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice._id?.toString()}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {invoice.to.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {invoice.invoice_no}
                    </p>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 truncate">
                      {invoice.to.name}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(
                        invoice.total,
                        (invoice.currency || currency) as TCurrencyKey
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {format(new Date(invoice.invoice_date), "dd MMM yyyy")}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(
                          `/api/invoice/${userId}/${invoice._id}`,
                          "_blank"
                        )
                      }
                    >
                      View PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/invoice/edit/${invoice._id}`}>Edit</Link>
                    </DropdownMenuItem>
                    {invoice.status === "PENDING" && (
                      <DropdownMenuItem asChild>
                        <Link href={`/invoice/paid/${invoice._id}`}>
                          Mark as Paid
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
