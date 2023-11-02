import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DB_SUPABASE_URL;
if (!connectionString) {
  throw new Error("Missing environment variable: DB_SUPABASE_URL");
}

export default {
  schema: "app/drizzle/schema.ts",
  out: "drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: connectionString,
  },
} satisfies Config;
