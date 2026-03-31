
import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./shared/schema.js";
import { sql } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

async function check() {
  if (!process.env.DATABASE_URL) {
    console.log("NO DATABASE_URL");
    return;
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });
  
  try {
    const res = await db.select().from(schema.studentNotifications);
    console.log("RECORDS:", JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("DB ERROR:", e.message);
  } finally {
    await pool.end();
  }
}

check();
