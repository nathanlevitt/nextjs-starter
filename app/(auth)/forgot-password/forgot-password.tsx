"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionState } from "@/lib/middleware";
import { links } from "@/lib/constants";

import { sendPasswordResetLink } from "../actions";

export function ForgotPassword() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    sendPasswordResetLink,
    { error: "" },
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast("Password reset link sent!", {
        icon: <CheckCircle className="h-4 w-4" />,
      });
      router.push(links.login);
    }
    if (state?.error) {
      toast(state.error, {
        icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      });
    }
  }, [router, state?.error, state?.success]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Password reset link will be sent to your email.
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

          <Button type="submit" disabled={pending}>
            Reset password
          </Button>
        </form>

        {state?.error && (
          <div className="text-center text-sm font-medium text-destructive">
            {state.error}
          </div>
        )}
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          className="font-medium underline-offset-4 hover:text-primary hover:underline"
          href={links.signup}
          prefetch
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
