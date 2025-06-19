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
