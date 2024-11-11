import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";
import { ResetPassword } from "./reset-password";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { user } = await validateRequest();

  if (user) redirect(redirects.afterLogin(user.username));

  return <ResetPassword token={token} />;
}
