import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";
import { Login } from "./login";

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) redirect(redirects.afterLogin);

  return <Login />;
}
