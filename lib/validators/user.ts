import { z } from "zod";
import { User } from "../db/schema";

export const userSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  email: z.string().email("Invalid email."),
  emailVerified: z.boolean(),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(255, "Username must be at most 255 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(255, "Password must be at most 255 characters."),
  avatar: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
}) satisfies z.ZodType<User>;
