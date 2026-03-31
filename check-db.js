
import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./shared/schema.js";
import { sql, desc, eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

async function check() {
  if (!process.env.DATABASE_URL) {
    console.log("NO DATABASE_URL");
    return;
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });
  
  try {
    const logsCount = await db.select({ count: sql`count(*)` }).from(schema.visitorLogs);
    console.log("TOTAL VISITOR LOGS:", logsCount[0].count);
    
    const logsToday = await db.select().from(schema.visitorLogs).where(eq(schema.visitorLogs.visitDate, new Date().toISOString().split('T')[0]));
    console.log("VISITOR LOG ENTRIES TODAY:", logsToday.length);
    
    const stats = await db.select().from(schema.websiteVisits).orderBy(desc(schema.websiteVisits.date)).limit(5);
    console.log("VISIT STATS (last 5 days):", JSON.stringify(stats, null, 2));
  } catch (e) {
    console.error("DB ERROR:", e.message);
  } finally {
    await pool.end();
  }
}

check();
