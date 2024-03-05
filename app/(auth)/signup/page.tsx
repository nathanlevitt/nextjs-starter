import React from "react";
import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";
import { Signup } from "./signup";

export default async function SignupPage() {
  const { user } = await validateRequest();

  if (user) redirect(redirects.afterLogin);

  return <Signup />;
}
