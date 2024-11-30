"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { ActionState } from "@/lib/middleware";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { resetPassword } from "../../actions";

interface ResetPasswordProps {
  token: string;
}

export function ResetPassword({ token }: ResetPasswordProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    resetPassword,
    { error: "" },
  );

  useEffect(() => {
    if (state?.error) {
      toast(state.error, {
        icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      });
    }
  }, [state?.error]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter a new password for your account.
        </p>
      </div>

      <div className="space-y-2">
        <form className="grid gap-4" action={formAction}>
          <input type="hidden" name="token" value={token} />

          <div className="grid gap-2.5">
            <Label htmlFor="password">New Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              required
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
    </div>
  );
}
