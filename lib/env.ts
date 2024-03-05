import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().url(),
    DATABASE_HOST: z.string(),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  runtimeEnv: {
    // Server-side env vars
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    // Client-side env vars
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  emptyStringAsUndefined: true,
});

// import { z } from "zod";

// const envVariables = z.object({
//   NODE_ENV: z
//     .enum(["development", "test", "production"])
//     .default("development"),
//   JWT_SECRET_KEY: z.string().min(1),
//   JWT_REFRESH_SECRET_KEY: z.string().min(1),
//   DATABASE_URL: z.string().min(1),
//   DATABASE_HOST: z.string().min(1),
//   DATABASE_USERNAME: z.string().min(1),
//   DATABASE_PASSWORD: z.string().min(1),
//   DATABASE_NAME: z.string().min(1),
// });

// // Validate that the environment variables are set
// envVariables.parse(process.env);

// declare global {
//   namespace NodeJS {
//     interface ProcessEnv extends z.infer<typeof envVariables> {}
//   }
// }
