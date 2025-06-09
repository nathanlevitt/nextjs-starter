import Link from "next/link";

import { getUser } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { links } from "@/lib/constants";

import { UserDropdown } from "./user-dropdown";

export async function Auth() {
  const user = await getUser();

  if (user) {
    return <UserDropdown user={user} />;
  }

  return (
    <>
      <Button variant="link" asChild>
        <Link href={links.login} prefetch>
          Log in
        </Link>
      </Button>

      <Button className="hidden sm:ml-1.5 sm:flex" asChild>
        <Link href={links.signup} prefetch>
          Get started
          <Icons.arrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </>
  );
}
