import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";
import { ForgotPassword } from "./forgot-password";

export default async function ForgotPasswordPage() {
  const { user } = await validateRequest();

  if (user) redirect(redirects.afterLogin(user.username));

  return <ForgotPassword />;
}
