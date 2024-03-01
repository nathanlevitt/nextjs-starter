"use server";

import { UserId, auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { signupSchema } from "@/lib/zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

export async function signup(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  };

  const parsedData = signupSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0].message,
    };
  }

  const { email, name, password } = parsedData.data;
  const hashedPassword = await new Argon2id().hash(password);

  let userId: UserId;
  try {
    const user = await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });
    userId = Number(user.insertId);
  } catch (error) {
    return { error: "An account with that email already exists." };
  }

  const session = await auth.createSession(userId, {});
  console.log("Created session:", session);
  const sessionCookie = auth.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
