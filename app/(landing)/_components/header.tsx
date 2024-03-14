"use client";

import Link from "next/link";
import { APP_TITLE, redirects } from "@/lib/constants";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 p-0">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <Link
          className="flex items-center justify-center text-sm font-medium"
          href="/"
        >
          <Icons.logo className="mr-2 h-5 w-5 shrink-0" /> {APP_TITLE}
        </Link>
        <div className="ml-auto flex items-center space-x-1">
          <Link href={redirects.toLogin}>
            <Button variant="link">Log in</Button>
          </Link>

          <Link href={redirects.toSignup}>
            <Button variant="default">
              Get started
              <Icons.arrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
