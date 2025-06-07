import { createKysely } from "@vercel/postgres-kysely";
import { CamelCasePlugin } from "kysely";

import { Database } from "./schema";

export const db = createKysely<Database>(undefined, {
  plugins: [new CamelCasePlugin()],
});
