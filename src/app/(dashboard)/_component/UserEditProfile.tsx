"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/SubmitButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { currencyOption } from "@/lib/utils";
import { onboardingSchema, type OnboardingFormData } from "@/lib/zodSchema";

export default function UserEditProfile({
  firstName,
  lastName,
  email,
  currency,
}: {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  currency?: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      currency: (currency ?? "USD") as OnboardingFormData["currency"],
    },
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || "Something went wrong");
      }

      router.refresh(); // Refresh session & UI
    } catch (error: any) {
      setErrorMessage(error.message || "Update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      {/* First Name */}
      <div className="grid gap-2">
        <Label>First Name</Label>
        <Input
          placeholder="Inul"
          type="text"
          {...register("firstName")}
          disabled={isLoading}
        />
        {errors.firstName && (
          <p className="text-xs text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="grid gap-2">
        <Label>Last Name</Label>
        <Input
          placeholder="Dev"
          type="text"
          {...register("lastName")}
          disabled={isLoading}
        />
        {errors.lastName && (
          <p className="text-xs text-red-500">{errors.lastName.message}</p>
        )}
      </div>

      {/* Currency */}
      <div className="grid gap-2">
        <Label>Select Currency</Label>
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(currencyOption).map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Email */}
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input
          placeholder="inuldev@invoice.com"
          type="email"
          value={email ?? ""}
          disabled
        />
      </div>

      {/* Submit Button */}
      <SubmitButton title="Update Profile" isLoading={isLoading} />

      {/* Error Message */}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </form>
  );
}
