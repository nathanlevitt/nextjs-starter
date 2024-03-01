import { promisify } from "util";
import { randomBytes } from "crypto";

export type AuthErrorCode = "invalid-credentials";
export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message?: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export async function generateId(length: number = 16) {
  const randomString = (await promisify(randomBytes)(Math.ceil(length / 2)))
    .toString("hex")
    .slice(0, length);
  return randomString;
}
