"use client";

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
import { updateDisplayName } from "../actions";
import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";

const initialState = {
  error: "",
};

interface DisplayNameProps {
  user: User;
}

export function DisplayName({ user }: DisplayNameProps) {
  const [state, formAction] = useActionState(
    updateDisplayName.bind(null, user.id),
    initialState
  );

  return (
    <form action={formAction}>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Display Name</CardTitle>
          <CardDescription>
            Please enter your full name or a display name.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid w-full items-center gap-2">
            <div className="flex flex-col space-y-1.5">
              <Input id="name" name="name" defaultValue={user.name || ""} />
            </div>

            {state.error && (
              <div className="text-sm font-medium text-destructive">
                {state.error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-muted py-2.5">
          <p className="text-sm text-muted-foreground">
            Please use 32 characters at maximum.
          </p>
          <SubmitButton type="submit">Save</SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
