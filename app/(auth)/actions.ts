"use server";

import { cookies, headers } from "next/headers";
import { z } from "zod";
import { isWithinExpirationDate } from "oslo";

import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { sendMail } from "@/lib/email/send-email";
import { renderResetPasswordEmail } from "@/lib/email/templates/reset-password";
import { validatedAction } from "@/lib/middleware";
import {
  createSecurityToken,
  deleteSession,
  hashPassword,
  parseHeaders,
  setSession,
  verifyPassword,
} from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email.").toLowerCase(),
  password: z.string().min(1, "Password must be at least 1 character."),
});

export const login = validatedAction(loginSchema, async (data) => {
  const { email, password } = data;
  const { ipAddress } = await parseHeaders();
  console.log(`Login attempt from ${ipAddress} with email ${email}.`);

  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user) {
    return {
      error: "Invalid email or password. Please try again.",
    };
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    return {
      error: "Invalid email or password. Please try again.",
    };
  }

  await setSession(user);
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email.").toLowerCase(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Username must be at least 1 character."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signup = validatedAction(signupSchema, async (data) => {
  const { email, username, password } = data;
  console.log(data);
  const ip = (await headers()).get("x-real-ip") || "localhost";

  console.log(`Signup attempt from ${ip} with email ${email}.`);

  const existingEmail = await db
    .selectFrom("users")
    .select("id")
    .where("email", "=", email)
    .executeTakeFirst();

  if (existingEmail) {
    return {
      error: "An account with that email already exists. Please try again.",
    };
  }

  const existingUsername = await db
    .selectFrom("users")
    .select("id")
    .where("username", "=", username)
    .executeTakeFirst();

  if (existingUsername) {
    return {
      error: "An account with that username already exists. Please try again.",
    };
  }

  const hash = await hashPassword(password);
  const user = await db
    .insertInto("users")
    .values({
      email,
      username,
      password: hash,
    })
    .returning("id")
    .executeTakeFirst();

  if (!user) {
    return {
      error: "Failed to create account. Please try again.",
    };
  }

  await setSession(user);
});

export async function logout() {
  const sessionId = (await cookies()).get("session")?.value;
  if (!sessionId) return;

  // Safely delete the session from the database
  try {
    await deleteSession(sessionId);
  } catch (error) {
    console.error(error);
  }

  // Delete all cookies
  const cooks = await cookies();
  cooks.getAll().forEach((cookie) => cooks.delete(cookie.name));
}

const sendPasswordResetLinkSchema = z.object({
  email: z.string().email("Please enter a valid email.").toLowerCase(),
});

export const sendPasswordResetLink = validatedAction(
  sendPasswordResetLinkSchema,
  async (data) => {
    const { email } = data;
    const ip = (await headers()).get("x-real-ip") || "localhost";
    console.log(`Password reset request from ${ip} with email ${email}.`);

    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();

    if (!user) {
      return {
        error: "An account with that email does not exist.",
      };
    }

    const token = await createSecurityToken({ id: user.id }, "password_reset");
    const link = absoluteUrl(`/forgot-password/${token}`);

    await sendMail({
      to: user.email,
      subject: "Reset your password",
      body: await renderResetPasswordEmail({
        username: user.username,
        link,
        ipAddress: ip,
      }),
    });

    return { success: true };
  },
);

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const resetPassword = validatedAction(
  resetPasswordSchema,
  async (data) => {
    const { token, password } = data;
    const ip = (await headers()).get("x-real-ip") || "localhost";
    console.log(`Password reset attempt from ${ip} with token ${token}.`);

    const dbToken = await db
      .selectFrom("securityTokens")
      .selectAll()
      .where("token", "=", token)
      .executeTakeFirst();

    if (!dbToken) {
      return {
        error: "Invalid password reset link.",
      };
    }

    if (!isWithinExpirationDate(dbToken.expiresAt)) {
      return {
        error: "Password reset link expired.",
      };
    }

    await db.deleteFrom("securityTokens").where("token", "=", token).execute();
    await db
      .deleteFrom("sessions")
      .where("userId", "=", dbToken.userId)
      .execute();

    const hash = await hashPassword(password);
    await db
      .updateTable("users")
      .set({ password: hash })
      .where("id", "=", dbToken.userId)
      .execute();

    await setSession({ id: dbToken.userId });
  },
);
