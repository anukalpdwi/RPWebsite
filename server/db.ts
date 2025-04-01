
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Mock database client and pool for local development
const mockPool = {
  connect: () => Promise.resolve(),
  query: () => Promise.resolve({ rows: [] }),
  end: () => Promise.resolve(),
} as unknown as Pool;

export const pool = mockPool;
export const db = drizzle({ client: mockPool, schema });  