"use client";

import { useActionState } from "react";

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

  return (
    <form action={formAction}>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Username</CardTitle>
          <CardDescription>
            This is your URL namespace within {APP_TITLE}.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid gap-2">
            <div className="flex">
              <div className="flex h-full items-center overflow-hidden rounded-md rounded-r-none border border-r-0 bg-muted px-3 text-sm text-muted-foreground sm:shrink-0">
                <span className="truncate">{baseUrl}/</span>
              </div>
              <Input
                id="username"
                name="username"
                className="rounded-l-none border-l-0"
                defaultValue={user.username || ""}
              />
            </div>

            {state?.error && (
              <div className="text-sm font-medium text-destructive">
                {state.error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-muted py-2.5">
          <p className="text-sm text-muted-foreground">
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
