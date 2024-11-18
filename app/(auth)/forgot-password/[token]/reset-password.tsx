"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth/actions";

const initialState = {
  error: "",
};

interface ResetPasswordProps {
  token: string;
}

export function ResetPassword({ token }: ResetPasswordProps) {
  const [state, formAction] = useActionState(resetPassword, initialState);

  useEffect(() => {
    if (state.error) {
      toast(state.error, {
        icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      });
    }
  }, [state.error]);

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

          <SubmitButton>Reset Password</SubmitButton>
        </form>

        {state.error && (
          <div className="text-sm font-medium text-center text-destructive">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
}
