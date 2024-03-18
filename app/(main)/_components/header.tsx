import Link from "next/link";

import { validateRequest } from "@/lib/auth";
import { Icons } from "@/components/icons";
import { UserDropdown } from "./user-dropdown";
import { getUserById } from "@/lib/api/user";

export async function Header() {
  const { user: authUser } = await validateRequest();
  if (!authUser) return null;

  const user = await getUserById(authUser.id);

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 p-0">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <div className="flex items-center space-x-3">
          <Link
            className="flex items-center justify-center text-sm font-medium"
            href="/"
          >
            <Icons.logo className="h-5 w-5 shrink-0" />
          </Link>

          <Icons.slash className="w-4 text-muted shrink-0" />
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {user ? <UserDropdown user={user} /> : null}
        </div>
      </div>
    </header>
  );
}
