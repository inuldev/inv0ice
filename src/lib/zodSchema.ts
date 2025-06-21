import z from "zod";

export const availableCurrencies = ["IDR", "USD", "EUR", "GBP", "JPY"] as const;

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(3, "Last name must be at least 3 characters")
    .max(50, "Last name cannot exceed 50 characters"),
  currency: z.enum(availableCurrencies).default("USD"),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const InvoiceSchemaZod = z.object({
  invoice_no: z.string().min(1, { message: "Invoice no. is required" }),
  invoice_date: z.date({ required_error: "Invoice date is required" }),
  due_date: z.date({ required_error: "Invoice due date is required" }),
  currency: z.enum(availableCurrencies, {
    required_error: "Currency is required",
    invalid_type_error: "Please select a valid currency",
  }),
  from: z.object({
    name: z
      .string()
      .min(3, { message: "Name is required" })
      .max(100, { message: "Name is max 100 character" }),
    email: z.string().email({ message: "Email is required" }),
    address1: z.string().min(5, { message: "Address is required" }),
    address2: z.string().optional(),
    address3: z.string().optional(),
  }),

  to: z.object({
    name: z
      .string()
      .min(3, { message: "Name is required" })
      .max(100, { message: "Name is max 100 character" }),
    email: z.string().email({ message: "Email is required" }),
    address1: z.string().min(5, { message: "Address is required" }),
    address2: z.string().optional(),
    address3: z.string().optional(),
  }),

  items: z.array(
    z.object({
      item_name: z
        .string()
        .min(3, { message: "Item name is required" })
        .max(100, { message: "Max character will be 100" }),
      quantity: z.number().min(0, { message: "Quantity can't be negative" }),
      price: z.number().min(0, { message: "Price can't be negative" }),
      total: z.number().min(0, { message: "Total can't be negative" }),
    })
  ),

  sub_total: z.number(),
  discount: z.number(),
  tax_percentage: z.number(),
  total: z.number(),
  notes: z.string().optional(),
  status: z.enum(["PAID", "PENDING", "CANCEL"]).default("PENDING"),
});
