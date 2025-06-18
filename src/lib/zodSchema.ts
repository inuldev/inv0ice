import z from "zod";

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name is required" })
    .max(50, { message: "First Name max 50 character" }),
  lastName: z
    .string()
    .min(3, { message: "Last name is required" })
    .max(50, { message: "Last Name max 50 character" }),
  currency: z.string({ message: "Select currency" }).optional(),
});
