import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(255),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(255),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Invalid token."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(255),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
