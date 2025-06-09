"use client";

import { useActionState, useEffect } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/db/schema";
import { updateUsername } from "../actions";
import { APP_TITLE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ActionState } from "@/lib/middleware";

interface UsernameProps {
  baseUrl: string;
  user: User;
}

export function Username({ baseUrl, user }: UsernameProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateUsername,
    { error: "" },
  );

  useEffect(() => {
    if (pending) return;
    if (state?.success) {
      console.log("Username updated successfully:", state.success);
      toast("Username updated successfully!", {
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }
    if (state?.error) {
      console.error("Error updating username:", state.error);
      toast(state.error, {
        icon: <AlertTriangle className="text-destructive h-4 w-4" />,
      });
    }
  }, [pending, state.error, state.success]);

  return (
    <form action={formAction}>
      <Card className="pb-0">
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>
            This is your URL namespace within {APP_TITLE}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex">
              <div className="bg-muted text-muted-foreground flex h-full items-center overflow-hidden rounded-md rounded-r-none border border-r-0 px-3 text-sm sm:shrink-0">
                <span className="truncate">{baseUrl}/</span>
              </div>
              <Input
                id="username"
                name="username"
                className="rounded-l-none border-l-0"
                defaultValue={state.values?.username || user.username || ""}
              />
            </div>

            {state?.error && (
              <div className="text-destructive text-sm font-medium">
                {state.error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted flex justify-between py-2.5">
          <p className="text-muted-foreground text-sm">
            Please use 48 characters at maximum.
          </p>
          <Button type="submit" disabled={pending}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
