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

export async function updateUser(userId: User["id"], data: Partial<User>) {
  // Username validation
  if (data.username) {
    const existingUser = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.username, data.username!),
    });
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Username already taken.");
    }
  }

  return db.update(users).set(data).where(eq(users.id, userId));
}
