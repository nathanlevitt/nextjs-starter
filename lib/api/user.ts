import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { User, users } from "@/lib/db/schema";

export async function getUserById(
  userId: User["id"]
): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });
}

export async function getUserByUsername(
  username: User["username"]
): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: (table, { eq }) => eq(table.username, username),
  });
}

export async function updateUser(userId: User["id"], data: Partial<User>) {
  return db.update(users).set(data).where(eq(users.id, userId));
}
