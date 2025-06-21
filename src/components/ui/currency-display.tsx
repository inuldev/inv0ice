import { formatCurrency, TCurrencyKey, getCurrencySymbol } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  currency: TCurrencyKey;
  className?: string;
  showSymbolOnly?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function CurrencyDisplay({
  amount,
  currency,
  className = "",
  showSymbolOnly = false,
  minimumFractionDigits,
  maximumFractionDigits,
}: CurrencyDisplayProps) {
  if (showSymbolOnly) {
    const symbol = getCurrencySymbol(currency);
    return (
      <span className={className}>
        {symbol}
        {amount.toLocaleString()}
      </span>
    );
  }

  const formattedAmount = formatCurrency(amount, currency, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return <span className={className}>{formattedAmount}</span>;
}

// Komponen khusus untuk input dengan currency prefix
interface CurrencyInputProps {
  currency: TCurrencyKey;
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CurrencyInput({
  currency,
  value,
  onChange,
  placeholder = "0.00",
  disabled = false,
  className = "",
}: CurrencyInputProps) {
  const symbol = getCurrencySymbol(currency);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value) || 0;
    onChange?.(numValue);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
        {symbol}
      </div>
      <input
        type="number"
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-8 pr-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
        step="0.01"
        min="0"
      />
    </div>
  );
}
