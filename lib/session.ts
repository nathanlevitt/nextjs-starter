import { compare, hash } from "bcrypt";
import { cookies, headers } from "next/headers";
import { createDate, isWithinExpirationDate, TimeSpan } from "oslo";
import { generateId } from "./utils";
import { db } from "./db";
import { SecurityTokenType } from "./db/schema";

const SALT_ROUNDS = 10;

type SessionData = {
  id: string;
  token: string;
  user: { id: string };
  expiresAt: Date;
};

export async function parseHeaders() {
  const { get } = await headers();
  const ipAddress = get("x-real-ip") || "localhost";
  const userAgent = get("user-agent") || "unknown";
  return { ipAddress, userAgent };
}

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return compare(password, hash);
}

export function getExpiresAt() {
  return new TimeSpan(30, "d");
}

export async function createSession(user: { id: string }) {
  const token = await generateId(40);
  const { ipAddress, userAgent } = await parseHeaders();
  const expiresAt = createDate(getExpiresAt());

  const { id } = await db
    .insertInto("sessions")
    .values({
      token,
      userId: user.id,
      ipAddress,
      userAgent,
      expiresAt,
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  const session: SessionData = {
    id,
    token,
    user: { id: user.id },
    expiresAt,
  };
  console.log("Session created:", session);

  return session;
}

export async function setSession(user: { id: string }) {
  const isSecure = process.env.NODE_ENV === "production";
  const session = await createSession(user);

  (await cookies()).set("session", session.token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    expires: Date.now() + getExpiresAt().milliseconds(),
  });

  return session;
}

export async function deleteSession(token: string) {
  return db
    .deleteFrom("sessions")
    .where("token", "=", token)
    .executeTakeFirst();
}

export async function verifySession(token: string) {
  const session = await db
    .selectFrom("sessions")
    .selectAll()
    .where("token", "=", token)
    .executeTakeFirst();

  if (!session || !isWithinExpirationDate(session.expiresAt)) {
    await deleteSession(token);
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
      .where("token", "=", token)
      .executeTakeFirst();
  }

  return {
    id: session.id,
    token: session.token,
    user: { id: session.userId },
    expiresAt: session.expiresAt,
  } satisfies SessionData;
}

export async function createSecurityToken(
  user: { id: string },
  type: SecurityTokenType,
) {
  await db
    .deleteFrom("securityTokens")
    .where("userId", "=", user.id)
    .where("type", "=", type)
    .execute();

  const token = await generateId(40);
  const expiresAt = createDate(new TimeSpan(1, "h"));

  await db
    .insertInto("securityTokens")
    .values({
      userId: user.id,
      token,
      type,
      expiresAt,
    })
    .executeTakeFirstOrThrow();
  return token;
}
