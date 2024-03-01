import { promisify } from "util";
import { randomBytes } from "crypto";

export async function generateId(length: number = 16) {
  const randomString = (await promisify(randomBytes)(Math.ceil(length / 2)))
    .toString("hex")
    .slice(0, length);
  return randomString;
}
