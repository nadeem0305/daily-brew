// lib/db.ts
import { neon } from "@neondatabase/serverless";

// This pulls the secret URL from your .env.local file
const databaseUrl = process.env.DATABASE_URL!;

// This is the 'sql' function we will use to talk to Neon
export const sql = neon(databaseUrl);
