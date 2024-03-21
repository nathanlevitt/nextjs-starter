import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { redirects } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { getUserById } from "@/lib/api/user";
import { DisplayName } from "./_components/display-name";
import { Username } from "./_components/username";

export default async function AccountSettingsPage() {
  const { user: authUser } = await validateRequest();
  if (!authUser) redirect(redirects.toLogin);

  const user = await getUserById(authUser.id);
  if (!user) redirect(redirects.toLogin);

  return (
    <section className="grid gap-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      <Separator />

      <DisplayName user={user} />
      <Username user={user} />
    </section>
  );
}
