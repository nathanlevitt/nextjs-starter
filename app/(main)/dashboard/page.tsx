import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect(redirects.toLogin);

  return <h1 className="py-4 container text-sm font-medium">Dashboard</h1>;
}
