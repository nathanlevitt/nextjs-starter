import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address."),
  name: z.string().trim().min(3, "Name must be at least 3 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});
