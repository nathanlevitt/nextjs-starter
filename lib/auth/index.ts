import { cache } from "react";
import { cookies } from "next/headers";

import { Auth } from "@/lib/auth/core";
import { Session, User } from "@/lib/db/schema";

export type AuthUser = Pick<User, "id" | "email" | "username" | "name">;
export type AuthSession = Pick<Session, "id" | "userId" | "expiresAt"> & {
  fresh: boolean;
};

export const auth = new Auth({
  sessionCookie: {
    name: "auth_session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: AuthUser; session: AuthSession } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(auth.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await auth.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = auth.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = auth.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      // Next.js throws when you attempt to set cookie when rendering page
    }
    return result;
  }
);
