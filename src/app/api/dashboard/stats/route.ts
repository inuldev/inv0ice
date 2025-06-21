import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import InvoiceModel from "@/models/invoice.model";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = session.user.id;

    // Get all invoices for the user
    const allInvoices = await InvoiceModel.find({ userId });

    // Calculate statistics
    const totalInvoices = allInvoices.length;
    const paidInvoices = allInvoices.filter(
      (invoice) => invoice.status === "PAID"
    ).length;
    const pendingInvoices = allInvoices.filter(
      (invoice) => invoice.status === "PENDING"
    ).length;
    const cancelledInvoices = allInvoices.filter(
      (invoice) => invoice.status === "CANCEL"
    ).length;

    // Calculate total revenue (only from paid invoices)
    const totalRevenue = allInvoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    // Calculate revenue by currency
    const revenueByCurrency = allInvoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce((acc, invoice) => {
        const currency = invoice.currency || "USD";
        acc[currency] = (acc[currency] || 0) + (invoice.total || 0);
        return acc;
      }, {} as Record<string, number>);

    // Calculate this month's statistics
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const thisMonthInvoices = allInvoices.filter(
      (invoice) => new Date(invoice.createdAt!) >= currentMonth
    );

    const thisMonthRevenue = thisMonthInvoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce((sum, invoice) => sum + invoice.total, 0);

    // Calculate growth percentage (comparing to last month)
    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastMonthInvoices = allInvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.createdAt!);
      return invoiceDate >= lastMonth && invoiceDate < currentMonth;
    });

    const lastMonthRevenue = lastMonthInvoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce((sum, invoice) => sum + invoice.total, 0);

    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : thisMonthRevenue > 0
        ? 100
        : 0;

    const invoiceGrowth =
      lastMonthInvoices.length > 0
        ? ((thisMonthInvoices.length - lastMonthInvoices.length) /
            lastMonthInvoices.length) *
          100
        : thisMonthInvoices.length > 0
        ? 100
        : 0;

    return NextResponse.json({
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      cancelledInvoices,
      totalRevenue,
      revenueByCurrency,
      thisMonthRevenue,
      thisMonthInvoices: thisMonthInvoices.length,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      invoiceGrowth: Math.round(invoiceGrowth * 100) / 100,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
