import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Enhanced currency configuration with symbols, names, and locales
export const currencyConfig = {
  IDR: {
    symbol: "Rp",
    name: "Indonesian Rupiah",
    locale: "id-ID",
    code: "IDR",
  },
  USD: {
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    code: "USD",
  },
  EUR: {
    symbol: "€",
    name: "Euro",
    locale: "de-DE",
    code: "EUR",
  },
  GBP: {
    symbol: "£",
    name: "British Pound",
    locale: "en-GB",
    code: "GBP",
  },
  JPY: {
    symbol: "¥",
    name: "Japanese Yen",
    locale: "ja-JP",
    code: "JPY",
  },
} as const;

// Legacy support - keep for backward compatibility
export const currencyOption = {
  IDR: "Rp",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
} as const;

export type TCurrencyKey = keyof typeof currencyConfig;

export const getCurrencySymbol = (code: TCurrencyKey): string => {
  return currencyConfig[code]?.symbol || "$";
};

export const getCurrencyName = (code: TCurrencyKey): string => {
  return currencyConfig[code]?.name || "US Dollar";
};

export const getCurrencyLocale = (code: TCurrencyKey): string => {
  return currencyConfig[code]?.locale || "en-US";
};

// Enhanced currency formatter with proper locale support
export const formatCurrency = (
  amount: number,
  currencyCode: TCurrencyKey,
  options?: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  const config = currencyConfig[currencyCode];
  if (!config) return `$${amount.toFixed(2)}`;

  const formatter = new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  });

  return formatter.format(amount);
};

// Simple number formatter with currency symbol
export const formatCurrencySimple = (
  amount: number,
  currencyCode: TCurrencyKey
): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toLocaleString()}`;
};
