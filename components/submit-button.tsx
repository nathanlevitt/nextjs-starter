"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function SubmitButton(
  props: React.ComponentPropsWithoutRef<typeof Button>
) {
  const { pending } = useFormStatus();

  return <Button {...props} type="submit" disabled={pending} />;
}
