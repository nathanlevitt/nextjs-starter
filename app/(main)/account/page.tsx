import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/queries";
import { links } from "@/lib/constants";

import { DisplayName } from "./_components/display-name";
import { Username } from "./_components/username";

export default async function AccountSettingsPage() {
  const hostname = (await headers()).get("x-forwarded-host") || "";
  const user = await getUser();

  if (!user) {
    return redirect(links.login);
  }

  return (
    <section className="grid gap-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      <Separator />

      <DisplayName user={user} />
      <Username user={user} baseUrl={hostname} />
    </section>
  );
}
