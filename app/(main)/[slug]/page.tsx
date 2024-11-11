import { notFound, redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { user } = await validateRequest();
  if (!user) redirect(redirects.toLogin);

  if (user.username !== slug) return notFound();

  return <p className="text-sm font-medium">{slug} dashboard</p>;
}
