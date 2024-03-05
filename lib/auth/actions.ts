"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { loginSchema, signupSchema } from "@/lib/validators/auth";
import { User, users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirects } from "@/lib/constants";

export async function login(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsedData = loginSchema.safeParse(data);
  if (!parsedData.success) {
    return { error: "Incorrect email or password." };
  }

  const { email, password } = parsedData.data;
  const existingUser = (
    await db.select().from(users).where(eq(users.email, email))
  )?.[0];
  if (!existingUser) {
    return { error: "Incorrect email or password." };
  }

  const validPassword = await bcrypt.compare(password, existingUser.password);
  if (!validPassword) {
    return { error: "Incorrect email or password." };
  }

  const session = await auth.createSession(existingUser.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect(redirects.afterLogin);
}

export async function signup(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  };

  const parsedData = signupSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      error:
        parsedData.error.issues[0]?.message ||
        "An error occurred, please try again.",
    };
  }

  const { email, name, password } = parsedData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  let userId: User["id"];
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
  return redirect(redirects.afterLogin);
}
