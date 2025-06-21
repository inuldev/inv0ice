"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Download, Eye, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { IInvoice } from "@/models/invoice.model";
import { formatCurrency, TCurrencyKey } from "@/lib/utils";
import { SendEmailDialog } from "@/components/SendEmailDialog";

interface InvoicePreviewProps {
  invoice: IInvoice;
  userId: string;
}

export function InvoicePreview({ invoice, userId }: InvoicePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/invoice/${userId}/${invoice._id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoice.invoice_no}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    window.open(`/api/invoice/${userId}/${invoice._id}`, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCEL":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter out empty address lines
  const getAddressLines = (
    address1?: string,
    address2?: string | null,
    address3?: string | null
  ) => {
    return [address1, address2, address3].filter(
      (line) => line && line.trim() !== ""
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-blue-600">
              Invoice #{invoice.invoice_no}
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              Created on {format(invoice.invoice_date, "MMM dd, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isLoading ? "Downloading..." : "Download"}
              </Button>
              <SendEmailDialog
                invoice={invoice}
                onEmailSent={() => console.log("Email sent successfully")}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Invoice Date
            </h3>
            <p className="text-sm">
              {format(invoice.invoice_date, "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Due Date
            </h3>
            <p className="text-sm">
              {format(invoice.due_date, "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Currency
            </h3>
            <p className="text-sm">{invoice.currency}</p>
          </div>
        </div>

        <Separator />

        {/* From & To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              From
            </h3>
            <div className="space-y-1">
              <p className="font-semibold">{invoice.from.name}</p>
              <p className="text-sm text-muted-foreground">
                {invoice.from.email}
              </p>
              {getAddressLines(
                invoice.from.address1,
                invoice.from.address2,
                invoice.from.address3
              ).map((line, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Bill To
            </h3>
            <div className="space-y-1">
              <p className="font-semibold">{invoice.to.name}</p>
              <p className="text-sm text-muted-foreground">
                {invoice.to.email}
              </p>
              {getAddressLines(
                invoice.to.address1,
                invoice.to.address2,
                invoice.to.address3
              ).map((line, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Items */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Items
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {invoice.items.map((item, index) => (
              <div
                key={index}
                className="px-4 py-3 grid grid-cols-12 gap-4 text-sm border-t"
              >
                <div className="col-span-6">{item.item_name}</div>
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-2 text-right">
                  {formatCurrency(item.price, invoice.currency as TCurrencyKey)}
                </div>
                <div className="col-span-2 text-right font-medium">
                  {formatCurrency(item.total, invoice.currency as TCurrencyKey)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>
                {formatCurrency(
                  invoice.sub_total,
                  invoice.currency as TCurrencyKey
                )}
              </span>
            </div>
            {invoice.discount && invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount:</span>
                <span>
                  -
                  {formatCurrency(
                    invoice.discount,
                    invoice.currency as TCurrencyKey
                  )}
                </span>
              </div>
            )}
            {invoice.tax_percentage && invoice.tax_percentage > 0 && (
              <div className="flex justify-between text-sm">
                <span>Tax ({invoice.tax_percentage}%):</span>
                <span>
                  {formatCurrency(
                    ((invoice.sub_total - (invoice.discount || 0)) *
                      invoice.tax_percentage) /
                      100,
                    invoice.currency as TCurrencyKey
                  )}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">
                {formatCurrency(
                  invoice.total,
                  invoice.currency as TCurrencyKey
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && invoice.notes.trim() !== "" && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                Notes
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {invoice.notes}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
