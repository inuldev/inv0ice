"use client";

import { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Mail, Send, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { IInvoice } from "@/models/invoice.model";
import { formatCurrency, TCurrencyKey } from "@/lib/utils";

interface SendEmailDialogProps {
  invoice: IInvoice;
  trigger?: React.ReactNode;
  onEmailSent?: () => void;
}

export function SendEmailDialog({
  invoice,
  trigger,
  onEmailSent,
}: SendEmailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    to: invoice.to.email,
    subject: `Invoice ${invoice.invoice_no} - ${formatCurrency(
      invoice.total,
      invoice.currency as TCurrencyKey
    )}`,
    message: `Dear ${invoice.to.name},

Please find attached your invoice ${invoice.invoice_no} for ${formatCurrency(
      invoice.total,
      invoice.currency as TCurrencyKey
    )}.

Due Date: ${format(invoice.due_date, "PPP")}

You can download the invoice PDF using the link in the email.

Thank you for your business!

Best regards`,
  });

  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/email/${invoice._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: emailData.subject,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Email sent successfully!");
        setIsOpen(false);
        onEmailSent?.();
      } else {
        toast.error(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button size="sm" className="flex items-center gap-2">
      <Mail className="h-4 w-4" />
      Send Email
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invoice Email
          </DialogTitle>
          <DialogDescription>
            Send invoice {invoice.invoice_no} to your client via email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invoice Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Invoice Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Invoice No:</span>
                <p className="font-medium">{invoice.invoice_no}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p className="font-medium text-blue-600">
                  {formatCurrency(
                    invoice.total,
                    invoice.currency as TCurrencyKey
                  )}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Due Date:</span>
                <p className="font-medium">
                  {format(invoice.due_date, "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium">{invoice.status}</p>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">To *</Label>
              <Input
                id="email-to"
                type="email"
                value={emailData.to}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, to: e.target.value }))
                }
                placeholder="client@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject *</Label>
              <Input
                id="email-subject"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Invoice subject"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-message">Message Preview</Label>
              <Textarea
                id="email-message"
                value={emailData.message}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Email message..."
                rows={6}
                disabled={isLoading}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This is just a preview. The actual email will use our
                professional template.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isLoading || !emailData.to || !emailData.subject}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
