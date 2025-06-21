"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { currencyConfig, TCurrencyKey } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function CurrencySelector({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select currency...",
  className,
}: CurrencySelectorProps) {
  const currencies = Object.entries(currencyConfig).map(([code, config]) => ({
    value: code,
    label: `${config.symbol} ${config.name} (${code})`,
    symbol: config.symbol,
    name: config.name,
    code: code as TCurrencyKey,
  }));

  const selectedCurrency = currencies.find(
    (currency) => currency.value === value
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder}>
          {selectedCurrency && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg">
                {selectedCurrency.symbol}
              </span>
              <span>{selectedCurrency.name}</span>
              <span className="text-muted-foreground text-sm">
                ({selectedCurrency.code})
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            <div className="flex items-center gap-3 w-full">
              <span className="font-mono text-lg w-8">{currency.symbol}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{currency.name}</span>
                <span className="text-xs text-muted-foreground">
                  {currency.code}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
