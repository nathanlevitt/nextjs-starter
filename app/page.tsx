import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

export default async function Home() {
  const { user, session } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="container">
      <h1 className="text-lg font-bold">Hi, {user.name}!</h1>

      <code className="text-xs">
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </code>
    </div>
  );
}
