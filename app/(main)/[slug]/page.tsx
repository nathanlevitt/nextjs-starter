import { notFound, redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { user } = await validateRequest();
  if (!user) redirect(redirects.toLogin);

  if (user.username !== params.slug) return notFound();

  return <p className="text-sm font-medium">{params.slug} dashboard</p>;
}
