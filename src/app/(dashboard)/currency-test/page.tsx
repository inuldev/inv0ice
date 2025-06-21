"use client";

import { useState } from "react";

import { TCurrencyKey } from "@/lib/utils";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CurrencyDisplay,
  CurrencyInput,
} from "@/components/ui/currency-display";

export default function CurrencyTestPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<TCurrencyKey>("USD");
  const [amount, setAmount] = useState<number>(1234.56);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Currency System Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency Selector Test */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Selector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CurrencySelector
              value={selectedCurrency}
              onValueChange={(value) =>
                setSelectedCurrency(value as TCurrencyKey)
              }
              placeholder="Select currency..."
            />
            <p className="text-sm text-muted-foreground">
              Selected: {selectedCurrency}
            </p>
          </CardContent>
        </Card>

        {/* Currency Display Test */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Display</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Full Format:</p>
              <CurrencyDisplay
                amount={amount}
                currency={selectedCurrency}
                className="text-lg font-semibold"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Symbol Only:</p>
              <CurrencyDisplay
                amount={amount}
                currency={selectedCurrency}
                showSymbolOnly
                className="text-lg font-semibold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Currency Input Test */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CurrencyInput
              currency={selectedCurrency}
              value={amount}
              onChange={setAmount}
              placeholder="Enter amount"
            />
            <p className="text-sm text-muted-foreground">Value: {amount}</p>
          </CardContent>
        </Card>

        {/* All Currencies Test */}
        <Card>
          <CardHeader>
            <CardTitle>All Currencies Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["IDR", "USD", "EUR", "GBP", "JPY"] as TCurrencyKey[]).map(
              (curr) => (
                <div key={curr} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{curr}:</span>
                  <CurrencyDisplay
                    amount={1234.56}
                    currency={curr}
                    className="text-sm"
                  />
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
