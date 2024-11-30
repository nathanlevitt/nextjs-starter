import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/queries";
import { links } from "@/lib/constants";
import { logout } from "../(auth)/actions";

export default async function NotFound() {
  const user = await getUser();

  if (!user) {
    return redirect(links.login);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center space-y-6 py-10 text-center md:py-12">
      <h1 className="text-4xl font-bold">404</h1>
      <p>
        You are logged in as <span className="font-bold">{user.username}</span>{" "}
        <span className="text-muted-foreground">({user.email})</span>
      </p>

      <form action={logout}>
        <Button type="submit">Sign in as a different user</Button>
      </form>
    </div>
  );
}
