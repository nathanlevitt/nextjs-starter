import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return <h1>Hi, {user.name}!</h1>;
}
