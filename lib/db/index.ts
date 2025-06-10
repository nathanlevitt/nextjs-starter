import { Pool } from "@neondatabase/serverless";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";

import { Database } from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
  plugins: [new CamelCasePlugin()],
});
