"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { signup } from "@/lib/auth/actions";

const initialState = {
  error: "",
};

export function Signup() {
  const [state, formAction] = useFormState(signup, initialState);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="font-medium underline-offset-4 hover:text-primary hover:underline"
            href="/login"
          >
            Log in
          </Link>
        </p>
      </div>

      <div className="space-y-2">
        <form className="grid gap-4" action={formAction}>
          <div className="grid gap-2.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" />
          </div>

          <div className="grid gap-2.5">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" />
          </div>

          <div className="grid gap-2.5">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" />
          </div>

          <SubmitButton>Sign up</SubmitButton>
        </form>

        {state.error && (
          <div className="text-sm font-medium text-center text-destructive">
            {state.error}
          </div>
        )}
      </div>

      <p className="px-8 text-sm text-center text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          className="underline underline-offset-4 hover:text-primary"
          href="/terms"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="underline underline-offset-4 hover:text-primary"
          href="/privacy"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
