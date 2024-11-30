import { Suspense } from "react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { APP_TITLE } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

import { Auth } from "./auth";

export async function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 p-0">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <div className="flex items-center space-x-3">
          <Link
            className="flex items-center justify-center text-sm font-medium"
            href="/"
          >
            <Icons.logo className="mr-2 h-5 w-5 shrink-0" />
            {APP_TITLE}
          </Link>

          <Icons.slash className="w-4 shrink-0 text-muted" />
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
            <Auth />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
