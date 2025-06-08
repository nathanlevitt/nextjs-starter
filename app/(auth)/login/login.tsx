"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ActionState } from "@/lib/middleware";
import { Button } from "@/components/ui/button";
import { links } from "@/lib/constants";

import { login } from "../actions";

export function Login() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    login,
    { error: "" },
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium underline-offset-4 hover:text-primary hover:underline"
            href={links.signup}
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="space-y-2">
        <form className="grid gap-4" action={formAction}>
          <div className="grid gap-2.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              defaultValue={state.values?.email}
            />
          </div>

          <div className="grid gap-2.5">
            <Label
              htmlFor="password"
              className="flex items-end justify-between"
            >
              Password
              <Link
                href="/forgot-password"
                className="text-xs leading-none text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              defaultValue={state.values?.password}
            />
          </div>

          <Button type="submit" disabled={pending}>
            Sign in
          </Button>
        </form>

        {state?.error && (
          <div className="text-center text-sm font-medium text-destructive">
            {state.error}
          </div>
        )}
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
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
