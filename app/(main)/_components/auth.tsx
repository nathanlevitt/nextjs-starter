import Link from "next/link";

import { getUser } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { UserDropdown } from "./user-dropdown";

export async function Auth() {
  const user = await getUser();

  if (user) {
    return <UserDropdown user={user} />;
  }

  return (
    <>
      <Link href="/login">
        <Button variant="link">Log in</Button>
      </Link>

      <Link href="/signup">
        <Button variant="default">
          Get started
          <Icons.arrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Link>
    </>
  );
}