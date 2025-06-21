"use client";

import { useEffect, useState } from "react";
import {
  FileTextIcon,
  DollarSignIcon,
  ClockIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletCardsIcon,
  Wallet2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, TCurrencyKey } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  userId: string;
  currency: string;
}

interface StatsData {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  cancelledInvoices: number;
  totalRevenue: number;
  revenueByCurrency: Record<string, number>;
  thisMonthRevenue: number;
  thisMonthInvoices: number;
  revenueGrowth: number;
  invoiceGrowth: number;
}

export default function DashboardStats({
  userId,
  currency,
}: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load statistics</div>;
  }

  const userCurrency = currency as TCurrencyKey;

  const statCards = [
    {
      title: "Total Invoices",
      value: stats.totalInvoices.toString(),
      description: `${stats.thisMonthInvoices} this month`,
      icon: FileTextIcon,
      trend: stats.invoiceGrowth,
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(
        stats.revenueByCurrency[currency] || 0,
        userCurrency
      ),
      description: `${formatCurrency(
        stats.thisMonthRevenue,
        userCurrency
      )} this month`,
      icon: Wallet2Icon,
      trend: stats.revenueGrowth,
      color: "text-green-600",
    },
    {
      title: "Pending Invoices",
      value: stats.pendingInvoices.toString(),
      description: `${(
        (stats.pendingInvoices / stats.totalInvoices) * 100 || 0
      ).toFixed(1)}% of total`,
      icon: ClockIcon,
      trend: null,
      color: "text-orange-600",
    },
    {
      title: "Paid Invoices",
      value: stats.paidInvoices.toString(),
      description: `${(
        (stats.paidInvoices / stats.totalInvoices) * 100 || 0
      ).toFixed(1)}% of total`,
      icon: CheckCircleIcon,
      trend: null,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{card.description}</span>
              {card.trend !== null && (
                <Badge
                  variant={card.trend >= 0 ? "default" : "destructive"}
                  className="ml-auto"
                >
                  {card.trend >= 0 ? (
                    <TrendingUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(card.trend).toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
