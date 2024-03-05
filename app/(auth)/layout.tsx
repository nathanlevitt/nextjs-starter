import { Icons } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[350px] min-h-screen p-4 space-y-6">
      <Icons.logo className="mx-auto mt-8" />
      {children}
    </div>
  );
}
