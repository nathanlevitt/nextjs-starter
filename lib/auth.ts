"use server";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

import { env } from "@/lib/env";
import { signInSchema } from "@/components/forms/login-form";

export interface AuthSession {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
    };
  } | null;
}

const secretKey = env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 seconds from now")
    .sign(key);
}

export async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login({ email, password }: z.infer<typeof signInSchema>) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (password !== "password123") {
    throw new Error("Incorrect email or password");
  }

  const user = {
    id: "1",
    name: "Nate",
    email,
  };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
