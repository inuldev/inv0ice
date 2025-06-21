"use client";

import Link from "next/link";
import {
  PlusIcon,
  FileTextIcon,
  SettingsIcon,
  DownloadIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickActions() {
  const actions = [
    {
      title: "Create Invoice",
      description: "Create a new invoice",
      href: "/invoice/create",
      icon: PlusIcon,
      color: "text-blue-600 hover:text-blue-700",
      bgColor: "hover:bg-blue-50",
    },
    {
      title: "View All Invoices",
      description: "Manage your invoices",
      href: "/invoice",
      icon: FileTextIcon,
      color: "text-green-600 hover:text-green-700",
      bgColor: "hover:bg-green-50",
    },
    {
      title: "Settings",
      description: "Update your profile",
      href: "/settings",
      icon: SettingsIcon,
      color: "text-gray-600 hover:text-gray-700",
      bgColor: "hover:bg-gray-50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <div
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer",
                action.bgColor
              )}
            >
              <div className={cn("p-2 rounded-md bg-gray-100", action.color)}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {action.title}
                </p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}

        {/* Additional Quick Stats */}
        {/* <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Quick Stats
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                <FileTextIcon className="h-5 w-5 mx-auto mb-1" />
              </div>
              <p className="text-xs text-blue-600 font-medium">This Month</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                <DownloadIcon className="h-5 w-5 mx-auto mb-1" />
              </div>
              <p className="text-xs text-green-600 font-medium">Export Data</p>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
