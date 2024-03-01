import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard {user.email}!</p>
      {children}
    </div>
  );
}
