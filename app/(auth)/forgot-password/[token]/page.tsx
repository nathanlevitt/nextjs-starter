import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";
import { ResetPassword } from "./reset-password";

export default async function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const { user } = await validateRequest();

  if (user) redirect(redirects.afterLogin);

  return <ResetPassword token={params.token} />;
}
