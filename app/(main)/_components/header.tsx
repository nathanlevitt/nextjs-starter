import { Suspense } from "react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { APP_TITLE, links } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

import { Auth } from "./auth";

export async function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-10 border-b p-0">
      <div className="container flex items-center gap-2 px-4 py-2">
        <div className="flex items-center space-x-3">
          <Link
            className="flex items-center justify-center text-sm font-medium"
            href={links.home}
            prefetch
          >
            <Icons.logo className="mr-2 h-5 w-5 shrink-0" />
            {APP_TITLE}
          </Link>
        </div>

        <div className="ml-auto flex items-center">
          <Suspense fallback={<Skeleton className="h-9 w-9 rounded-full" />}>
            <Auth />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
