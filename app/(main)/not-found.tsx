import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";

export default async function NotFound() {
  const { user } = await validateRequest();
  if (!user) return redirect(redirects.toLogin);

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
