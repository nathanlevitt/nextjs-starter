import { InferSelectModel, eq, lte } from "drizzle-orm";
import { AuthSession, AuthUser, SessionId, UserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { passwordResetTokens, sessions } from "@/lib/db/schema";
import { users } from "@/lib/db/migrations/schema";
import { generateId } from "@/lib/utils";
import { TimeSpan, createDate } from "oslo";

export type DatabaseUser = AuthUser;
export type DatabaseSession = Omit<AuthSession, "fresh">;

export async function deleteSession(sessionId: SessionId): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function deleteUserSessions(userId: UserId): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function getSessionAndUser(
  sessionId: SessionId
): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
  const result = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));
  if (!result[0]) return [null, null];
  return [
    transformIntoDatabaseSession(result[0].session),
    transformIntoDatabaseUser(result[0].user),
  ];
}

export async function getUserSessions(
  userId: UserId
): Promise<DatabaseSession[]> {
  const result = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId));
  return result.map((val) => {
    return transformIntoDatabaseSession(val);
  });
}

export async function setSession(session: DatabaseSession): Promise<void> {
  await db.insert(sessions).values({
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
  });
}

export async function updateSessionExpiration(
  sessionId: SessionId,
  expiresAt: Date
): Promise<void> {
  await db
    .update(sessions)
    .set({
      expiresAt,
    })
    .where(eq(sessions.id, sessionId));
}

export async function deleteExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lte(sessions.expiresAt, new Date()));
}

export async function generateResetPasswordToken(userId: UserId) {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));
  const tokenId = await generateId(40);
  const expiresAt = createDate(new TimeSpan(2, "h"));
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt,
  });
  return tokenId;
}

function transformIntoDatabaseSession(
  raw: InferSelectModel<typeof sessions>
): DatabaseSession {
  const { id, userId, expiresAt } = raw;
  return {
    userId,
    id,
    expiresAt,
  };
}

function transformIntoDatabaseUser(
  raw: InferSelectModel<typeof users>
): DatabaseUser {
  const { id, email, name } = raw;
  return {
    id,
    email,
    name,
  };
}
