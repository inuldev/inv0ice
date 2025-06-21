import { formatCurrency, TCurrencyKey } from "./utils";

// Legacy function - kept for backward compatibility
export default function currencyFormat(amt: number, currency: string) {
  return formatCurrency(amt, currency as TCurrencyKey);
}
