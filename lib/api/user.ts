import { db } from "@/lib/db";
import { UpdateUser, User } from "@/lib/db/schema";

export async function getUserById(
  userId: User["id"]
): Promise<User | undefined> {
  return db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", userId)
    .executeTakeFirst();
}

export async function getUserByUsername(
  username: User["username"]
): Promise<User | undefined> {
  return db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirst();
}

export async function updateUser(userId: User["id"], data: UpdateUser) {
  return db.updateTable("users").set(data).where("id", "=", userId).execute();
}
