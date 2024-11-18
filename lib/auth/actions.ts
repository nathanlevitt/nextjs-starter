"use server";

import bcrypt from "bcrypt";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { redirects } from "@/lib/constants";
import { User } from "@/lib/db/schema";
import { auth, validateRequest } from "@/lib/auth";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validators/auth";
import { generateResetPasswordToken } from "@/lib/api/auth";

import { sendMail } from "@/lib/email/send-email";
import { renderResetPasswordEmail } from "@/lib/email/templates/reset-password";
import { isWithinExpirationDate } from "oslo";

const ERROR = {
  default: "An error occurred, please try again.",
};

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
  const existingUser = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!existingUser) {
    return { error: "Incorrect email or password." };
  }

  const validPassword = await bcrypt.compare(password, existingUser.password);
  if (!validPassword) {
    return { error: "Incorrect email or password." };
  }

  const session = await auth.createSession(existingUser.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(redirects.afterLogin(existingUser.username));
}

export async function signup(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const parsedData = signupSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message || ERROR.default,
    };
  }

  const { email, username, password } = parsedData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  let userId: User["id"];
  try {
    const user = await db
      .insertInto("users")
      .values({
        email,
        username,
        password: hashedPassword,
      })
      .returning("id")
      .executeTakeFirst();

    if (!user) {
      return { error: "Failed to create account, please try again." };
    }

    userId = user.id;
  } catch (error) {
    console.error(error);
    return { error: "An account with that email already exists." };
  }

  const session = await auth.createSession(userId, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(redirects.afterLogin(username));
}

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return;
    // return {
    //   error: "No session found.",
    // };
  }

  await auth.invalidateSession(session.id);
  const sessionCookie = auth.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(redirects.afterLogout);
}

export async function resetPassword(prevState: unknown, formData: FormData) {
  const data = {
    token: formData.get("token"),
    password: formData.get("password"),
  };

  const parsedData = resetPasswordSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message || ERROR.default,
    };
  }

  const { token, password } = parsedData.data;

  const dbToken = await db
    .selectFrom("passwordResetTokens")
    .selectAll()
    .where("id", "=", token)
    .executeTakeFirst();

  if (dbToken) {
    await db
      .deleteFrom("passwordResetTokens")
      .where("id", "=", token)
      .executeTakeFirst();
  }

  if (!dbToken) return { error: "Invalid password reset link." };

  if (!isWithinExpirationDate(dbToken.expiresAt))
    return { error: "Password reset link expired." };

  await auth.invalidateUserSessions(dbToken.userId);
  const hashedPassword = await bcrypt.hash(password, 10);
  await db
    .updateTable("users")
    .set({ password: hashedPassword })
    .where("id", "=", dbToken.userId)
    .executeTakeFirst();
  const session = await auth.createSession(dbToken.userId, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect(redirects.afterResetPassword);
}

export async function sendPasswordResetLink(
  prevState: unknown,
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  const raw = formData.get("email");
  const email = z.string().trim().email().safeParse(raw);
  if (!email.success) {
    return { error: "Invalid email." };
  }

  try {
    const ipAddress =
      (await headers()).get("x-real-ip") ||
      (await headers()).get("x-forwarded-for") ||
      "0.0.0.0";

    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email.data)
      .executeTakeFirst();
    console.log("User:", user);

    if (!user) {
      return { error: "Invalid email." };
    }

    const verificationToken = await generateResetPasswordToken(user.id);
    const verificationLink = absoluteUrl(
      `/forgot-password/${verificationToken}`,
    );

    const mail = await sendMail({
      to: user.email,
      subject: "Reset your password",
      body: await renderResetPasswordEmail({
        username: user.username,
        link: verificationLink,
        ipAddress,
      }),
    });
    console.log("Mail:", mail);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to send reset password email." };
  }
}
