import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";

const connectionUrl = new URL(env.DATABASE_URL);
connectionUrl.searchParams.set("uselibpqcompat", "true");
connectionUrl.searchParams.set("sslmode", "require");

const pool = new Pool({
  connectionString: connectionUrl.toString(),
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool);
export * from "drizzle-orm";
export default db;