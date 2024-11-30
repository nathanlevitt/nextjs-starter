import { compare, hash } from "bcrypt";
import { cookies } from "next/headers";
import { createDate, isWithinExpirationDate, TimeSpan } from "oslo";
import { generateId } from "./utils";
import { db } from "./db";

const SALT_ROUNDS = 10;

type SessionData = {
  id: string;
  user: { id: number };
  expiresAt: Date;
};

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return compare(password, hash);
}

export function getExpiresAt() {
  return new TimeSpan(30, "d");
}

export async function createSession(user: { id: number }) {
  const sessionId = await generateId(40);
  const expiresAt = createDate(getExpiresAt());

  const session: SessionData = {
    id: sessionId,
    user: { id: user.id },
    expiresAt,
  };

  await db
    .insertInto("sessions")
    .values({
      id: session.id,
      userId: session.user.id,
      expiresAt,
    })
    .executeTakeFirst();

  return session;
}

export async function setSession(user: { id: number }) {
  (await cookies()).set("test", "test", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    // expires: Date.now() + getExpiresAt().milliseconds(),
  });

  const session = await createSession(user);
  console.log(session);

  (await cookies()).set("session", session.id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: Date.now() + getExpiresAt().milliseconds(),
  });

  return session;
}

export async function deleteSession(sessionId: string) {
  return db
    .deleteFrom("sessions")
    .where("id", "=", sessionId)
    .executeTakeFirst();
}

export async function verifySession(sessionId: string) {
  const session = await db
    .selectFrom("sessions")
    .selectAll()
    .where("id", "=", sessionId)
    .executeTakeFirst();

  if (!session || !isWithinExpirationDate(session.expiresAt)) {
    await deleteSession(sessionId);
    return null;
  }

  // Refresh session expiration if it's within half of the expiration time
  const activePeriodExpirationDate = new Date(
    session.expiresAt.getTime() - getExpiresAt().milliseconds() / 2,
  );
  if (isWithinExpirationDate(activePeriodExpirationDate)) {
    session.expiresAt = createDate(getExpiresAt());
    await db
      .updateTable("sessions")
      .set({ expiresAt: session.expiresAt })
      .where("id", "=", sessionId)
      .executeTakeFirst();
  }

  return {
    id: session.id,
    user: { id: session.userId },
    expiresAt: session.expiresAt,
  } satisfies SessionData;
}

export async function createResetPasswordToken(userId: number) {
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
