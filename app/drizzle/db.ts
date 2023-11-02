import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DB_SUPABASE_URL;
if (!connectionString) {
  throw new Error("Missing environment variable: DB_SUPABASE_URL");
}
const client = postgres(connectionString);
export const drizzleDBClient = drizzle(client, { schema });
