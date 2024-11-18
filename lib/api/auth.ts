import { TimeSpan, createDate } from "oslo";
import { AuthSession, AuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateId } from "@/lib/utils";
import { Session, User } from "@/lib/db/schema";

export type DatabaseUser = AuthUser;
export type DatabaseSession = Omit<AuthSession, "fresh">;

export async function deleteSession(sessionId: Session["id"]): Promise<void> {
  await db
    .deleteFrom("sessions")
    .where("id", "=", sessionId)
    .executeTakeFirst();
}

export async function deleteUserSessions(userId: User["id"]): Promise<void> {
  await db
    .deleteFrom("sessions")
    .where("userId", "=", userId)
    .executeTakeFirst();
}

export async function getSessionAndUser(
  sessionId: string,
): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
  const session = await db
    .selectFrom("sessions")
    .where("id", "=", sessionId)
    .selectAll()
    .executeTakeFirst();
  const user = await db
    .selectFrom("users")
    .innerJoin("sessions", "users.id", "sessions.userId")
    .where("sessions.id", "=", sessionId)
    .selectAll("users")
    .executeTakeFirst();

  if (!session || !user) return [null, null];
  return [
    transformIntoDatabaseSession(session),
    transformIntoDatabaseUser(user),
  ];
}

export async function getUserSessions(
  userId: number,
): Promise<DatabaseSession[]> {
  const sessions = await db
    .selectFrom("sessions")
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  return sessions.map((val) => {
    return transformIntoDatabaseSession(val);
  });
}

export async function setSession(session: DatabaseSession): Promise<void> {
  await db
    .insertInto("sessions")
    .values({
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    })
    .executeTakeFirst();
}

export async function updateSessionExpiration(
  sessionId: string,
  expiresAt: Date,
): Promise<void> {
  await db
    .updateTable("sessions")
    .set({ expiresAt })
    .where("id", "=", sessionId)
    .executeTakeFirst();
}

export async function deleteExpiredSessions(): Promise<void> {
  await db
    .deleteFrom("sessions")
    .where("expiresAt", "<=", new Date())
    .executeTakeFirst();
}

export async function generateResetPasswordToken(userId: number) {
  await db
    .deleteFrom("passwordResetTokens")
    .where("userId", "=", userId)
    .execute();
  const tokenId = await generateId(40);
  const expiresAt = createDate(new TimeSpan(2, "h"));
  await db
    .insertInto("passwordResetTokens")
    .values({
      id: tokenId,
      userId,
      expiresAt,
    })
    .executeTakeFirstOrThrow();
  return tokenId;
}

function transformIntoDatabaseSession(raw: Session): DatabaseSession {
  const { id, userId, expiresAt } = raw;
  return {
    userId,
    id,
    expiresAt,
  };
}

function transformIntoDatabaseUser(raw: User): DatabaseUser {
  const { id, email, username, name } = raw;
  return {
    id,
    email,
    username,
    name,
  };
}
