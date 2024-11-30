import { cookies } from "next/headers";
import { verifySession } from "./session";
import { db } from "./db";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const session = await verifySession(sessionCookie.value);
  if (!session || !session.user || typeof session.user.id !== "number") {
    return null;
  }

  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", session.user.id)
    .executeTakeFirst();

  if (!user) return null;

  return user;
}
