import Link from "next/link";
import { Dog } from "lucide-react";
import { APP_TITLE } from "@/lib/constants";
import { validateRequest } from "@/lib/auth";
import { Icons } from "@/components/icons";
import { UserDropdown } from "./user-dropdown";

export const Header = async () => {
  const { user } = await validateRequest();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 p-0">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <Link
          className="flex items-center justify-center text-sm font-medium"
          href="/"
        >
          <Icons.logo className="mr-2 h-5 w-5 shrink-0" /> {APP_TITLE}
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {user ? <UserDropdown email={user.email} name={user.name} /> : null}
        </div>
      </div>
    </header>
  );
};
