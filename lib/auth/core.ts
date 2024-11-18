import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { Cookie, CookieAttributes, CookieController } from "oslo/cookie";

import { AuthSession, AuthUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import {
  deleteExpiredSessions,
  deleteSession,
  deleteUserSessions,
  getSessionAndUser,
  getUserSessions,
  setSession,
  updateSessionExpiration,
} from "@/lib/api/auth";
import { Session, User } from "@/lib/db/schema";

interface SessionCookieOptions {
  name?: string;
  expires?: boolean;
  attributes?: SessionCookieAttributesOptions;
}

interface SessionCookieAttributesOptions {
  sameSite?: "lax" | "strict";
  domain?: string;
  path?: string;
  secure?: boolean;
}

export class Auth {
  private sessionExpiresIn: TimeSpan;
  private sessionCookieController: CookieController;

  public readonly sessionCookieName: string;

  constructor(options?: {
    sessionExpiresIn?: TimeSpan;
    sessionCookie?: SessionCookieOptions;
  }) {
    this.sessionExpiresIn = options?.sessionExpiresIn ?? new TimeSpan(30, "d");
    this.sessionCookieName = options?.sessionCookie?.name ?? "auth_session";
    let sessionCookieExpiresIn = this.sessionExpiresIn;
    if (options?.sessionCookie?.expires === false) {
      sessionCookieExpiresIn = new TimeSpan(365 * 2, "d");
    }
    const baseSessionCookieAttributes: CookieAttributes = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      ...options?.sessionCookie?.attributes,
    };

    this.sessionCookieController = new CookieController(
      this.sessionCookieName,
      baseSessionCookieAttributes,
      {
        expiresIn: sessionCookieExpiresIn,
      },
    );
  }

  public async getUserSessions(userId: User["id"]): Promise<AuthSession[]> {
    const databaseSessions = await getUserSessions(userId);
    const sessions: AuthSession[] = [];
    for (const databaseSession of databaseSessions) {
      if (!isWithinExpirationDate(databaseSession.expiresAt)) {
        continue;
      }
      sessions.push({
        id: databaseSession.id,
        expiresAt: databaseSession.expiresAt,
        userId: databaseSession.userId,
        fresh: false,
      });
    }
    return sessions;
  }

  public async validateSession(
    sessionId: Session["id"],
  ): Promise<
    { user: AuthUser; session: AuthSession } | { user: null; session: null }
  > {
    const [databaseSession, databaseUser] = await getSessionAndUser(sessionId);
    if (!databaseSession) {
      return { session: null, user: null };
    }
    if (!databaseUser) {
      await deleteSession(databaseSession.id);
      return { session: null, user: null };
    }
    if (!isWithinExpirationDate(databaseSession.expiresAt)) {
      await deleteSession(databaseSession.id);
      return { session: null, user: null };
    }

    const activePeriodExpirationDate = new Date(
      databaseSession.expiresAt.getTime() -
        this.sessionExpiresIn.milliseconds() / 2,
    );
    const session: AuthSession = {
      id: databaseSession.id,
      userId: databaseSession.userId,
      fresh: false,
      expiresAt: databaseSession.expiresAt,
    };
    if (!isWithinExpirationDate(activePeriodExpirationDate)) {
      session.fresh = true;
      session.expiresAt = createDate(this.sessionExpiresIn);
      await updateSessionExpiration(databaseSession.id, session.expiresAt);
    }

    const user: AuthUser = {
      id: databaseUser.id,
      email: databaseUser.email,
      username: databaseUser.username,
      name: databaseUser.name,
    };
    return { user, session };
  }

  public async createSession(
    userId: User["id"],
    options?: {
      sessionId?: string;
    },
  ): Promise<AuthSession> {
    const sessionId = options?.sessionId ?? (await generateId(40));
    const sessionExpiresAt = createDate(this.sessionExpiresIn);
    await setSession({
      id: sessionId,
      userId,
      expiresAt: sessionExpiresAt,
    });
    const session: AuthSession = {
      id: sessionId,
      userId,
      fresh: true,
      expiresAt: sessionExpiresAt,
    };
    return session;
  }

  public async invalidateSession(sessionId: Session["id"]): Promise<void> {
    await deleteSession(sessionId);
  }

  public async invalidateUserSessions(userId: User["id"]): Promise<void> {
    await deleteUserSessions(userId);
  }

  public async deleteExpiredSessions(): Promise<void> {
    await deleteExpiredSessions();
  }

  public readSessionCookie(cookieHeader: string): string | null {
    const sessionId = this.sessionCookieController.parse(cookieHeader);
    return sessionId;
  }

  public readBearerToken(authorizationHeader: string): string | null {
    const [authScheme, token] = authorizationHeader.split(" ") as [
      string,
      string | undefined,
    ];
    if (authScheme !== "Bearer") {
      return null;
    }
    return token ?? null;
  }

  public createSessionCookie(sessionId: Session["id"]): Cookie {
    return this.sessionCookieController.createCookie(sessionId);
  }

  public createBlankSessionCookie(): Cookie {
    return this.sessionCookieController.createBlankCookie();
  }
}
