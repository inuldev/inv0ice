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
    const allInvoices = await InvoiceModel.find({ userId }).sort({
      createdAt: 1,
    });

    // Revenue trend data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const monthInvoices = allInvoices.filter((invoice) => {
        const invoiceDate = new Date(invoice.createdAt!);
        return invoiceDate >= monthStart && invoiceDate < monthEnd;
      });

      const monthRevenue = monthInvoices
        .filter((invoice) => invoice.status === "PAID")
        .reduce((sum, invoice) => sum + invoice.total, 0);

      revenueByMonth.push({
        month: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        revenue: monthRevenue,
        invoices: monthInvoices.length,
        paid: monthInvoices.filter((inv) => inv.status === "PAID").length,
        pending: monthInvoices.filter((inv) => inv.status === "PENDING").length,
      });
    }

    // Status distribution
    const statusDistribution = [
      {
        name: "Paid",
        value: allInvoices.filter((inv) => inv.status === "PAID").length,
        color: "#22c55e",
      },
      {
        name: "Pending",
        value: allInvoices.filter((inv) => inv.status === "PENDING").length,
        color: "#f59e0b",
      },
      {
        name: "Cancelled",
        value: allInvoices.filter((inv) => inv.status === "CANCEL").length,
        color: "#ef4444",
      },
    ];

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayInvoices = allInvoices.filter((invoice) => {
        const invoiceDate = new Date(invoice.createdAt!);
        return invoiceDate >= day && invoiceDate < nextDay;
      });

      recentActivity.push({
        date: day.toISOString().split("T")[0],
        invoices: dayInvoices.length,
        revenue: dayInvoices
          .filter((invoice) => invoice.status === "PAID")
          .reduce((sum, invoice) => sum + invoice.total, 0),
      });
    }

    // Top clients by revenue
    const clientRevenue = allInvoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce((acc, invoice) => {
        const clientName = invoice.to.name;
        acc[clientName] = (acc[clientName] || 0) + invoice.total;
        return acc;
      }, {} as Record<string, number>);

    const topClients = Object.entries(clientRevenue)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([name, revenue]) => ({ name, revenue: revenue as number }));

    return NextResponse.json({
      revenueByMonth,
      statusDistribution,
      recentActivity,
      topClients,
    });
  } catch (error) {
    console.error("Dashboard charts error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
