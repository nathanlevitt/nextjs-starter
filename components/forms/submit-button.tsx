"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button {...rest} type="submit" aria-disabled={pending}>
      {pending ? "Loading..." : children}
    </Button>
  );
}
