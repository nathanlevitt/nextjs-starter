import { Separator } from "@/components/ui/separator";
import { APP_TITLE } from "@/lib/constants";
import { getUser } from "@/lib/queries";

export default async function Home() {
  const user = await getUser();

  const message = user
    ? `Welcome back, ${user.name || user.username}!`
    : `Welcome to ${APP_TITLE}!`;

  return (
    <section className="container grid gap-6 px-4 py-8">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>

      <Separator />
    </section>
  );
}
