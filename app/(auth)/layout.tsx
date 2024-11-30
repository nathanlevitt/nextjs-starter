import { redirect } from "next/navigation";
import { Icons } from "@/components/icons";
import { getUser } from "@/lib/queries";
import { links } from "@/lib/constants";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user) {
    redirect(links.home);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[350px] space-y-6 p-4">
      <Icons.logo className="mx-auto mt-8" />
      {children}
    </div>
  );
}
