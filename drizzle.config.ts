import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./lib/db/schema",
  out: "./lib/db/migrations",
  dbCredentials: {
    uri: process.env.DATABASE_URL as string,
  },
  driver: "mysql2",
} satisfies Config;
