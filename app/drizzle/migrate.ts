import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzleDBClient } from "./db";

export const migrateDB = async () => {
  console.log("migrating db");
  await migrate(drizzleDBClient, { migrationsFolder: "drizzle" });
  console.log("db migrated");
};

migrateDB();
