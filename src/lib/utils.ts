import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyOption = {
  IDR: "Rp",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
} as const;

export type TCurrencyKey = keyof typeof currencyOption;

export const getCurrencySymbol = (code: TCurrencyKey): string => {
  return currencyOption[code];
};
