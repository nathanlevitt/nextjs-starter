import { env } from "@/lib/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
} satisfies Config;
