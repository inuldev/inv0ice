"use client";

import { Loader2 } from "lucide-react";

import { Button } from "./ui/button";

type SubmitButtonProps = {
  title: string;
  isLoading?: boolean;
};

export default function SubmitButton({ title, isLoading }: SubmitButtonProps) {
  return (
    <Button disabled={isLoading} type="submit">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        title
      )}
    </Button>
  );
}
