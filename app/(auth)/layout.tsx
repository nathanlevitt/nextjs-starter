import { Icons } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-[350px] space-y-6 p-4">
      <Icons.logo className="mx-auto mt-8" />
      {children}
    </div>
  );
}
