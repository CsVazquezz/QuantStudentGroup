import mysql from "mysql2/promise";

// Serverless-safe: opens a fresh connection per invocation and lets the
// caller close it. Pools don't survive across Vercel function calls.
export async function getConnection() {
  if (process.env.DATABASE_URL) {
    // Production (TiDB Cloud) — DATABASE_URL includes host/user/pass/db.
    // TiDB requires TLS; the server cert is fully validated.
    return mysql.createConnection({
      uri: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: true, minVersion: "TLSv1.2" },
    });
  }

  // Local development — individual env vars, no SSL needed.
  return mysql.createConnection({
    host:     process.env.DB_HOST     ?? "localhost",
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME     ?? "quanttec",
  });
}
