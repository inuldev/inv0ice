import { format } from "date-fns";
import { NextResponse, NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import { sendEmail } from "@/lib/email.config";
import { formatCurrency, TCurrencyKey } from "@/lib/utils";
import InvoiceModel, { IInvoice } from "@/models/invoice.model";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string; userId: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({
        message: "Unauthorized access",
      });
    }

    const { invoiceId } = await params;
    const { subject } = await request.json();

    await connectDB();

    const invoiceData: IInvoice | null = await InvoiceModel.findById(invoiceId);

    if (!invoiceData) {
      return NextResponse.json({
        message: "No invoice found",
      });
    }

    const invoiceURL = `${process.env.DOMAIN}/api/invoice/${session.user.id}/${invoiceId}`;

    const emailResponse = await sendEmail(invoiceData.to.email, subject, {
      props: {
        firstName: session.user.firstName,
        invoiceNo: invoiceData.invoice_no,
        dueDate: format(invoiceData.due_date, "PPP"),
        total: `${formatCurrency(
          invoiceData.total,
          invoiceData.currency as TCurrencyKey
        )}`,
        invoiceURL: invoiceURL,
      },
    });

    if (emailResponse.success) {
      return NextResponse.json({
        message: "Email sent successfully",
        data: emailResponse,
      });
    } else {
      return NextResponse.json(
        {
          message: emailResponse.error || "Failed to send email",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({
      message: error || error.message || "Something went wrong",
    });
  }
}
