"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { login } from "@/app/login/actions";

const initialState = {
  error: "",
};

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="space-y-2">
      <form className="grid gap-4" action={formAction}>
        <div className="grid gap-2.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" />
        </div>

        <div className="grid gap-2.5">
          <Label htmlFor="password" className="flex items-end justify-between">
            Password
            <Link
              href="/forgot-password"
              className="text-xs leading-none text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </Label>
          <Input type="password" id="password" name="password" />
        </div>

        <SubmitButton>Sign in</SubmitButton>
      </form>

      {state.error && (
        <div className="text-sm font-medium text-center text-destructive">
          {state.error}
        </div>
      )}
    </div>
  );
}
