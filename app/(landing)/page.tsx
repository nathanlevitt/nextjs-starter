import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";

export default async function Home() {
  const { user } = await validateRequest();

  if (user) redirect(redirects.afterLogin(user.username));

  return (
    <section className="mx-auto grid max-w-5xl flex-col items-center justify-center gap-4 py-10 text-center md:py-12">
      <p className="text-sm font-medium">Landing page</p>
    </section>
  );
}
