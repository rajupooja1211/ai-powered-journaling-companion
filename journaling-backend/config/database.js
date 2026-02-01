import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log when connected
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

// Handle errors
pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  process.exit(-1);
});

// Test connection function
export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(
      "✅ Database connection test successful at:",
      result.rows[0].now,
    );
    return true;
  } catch (error) {
    console.error("❌ Database connection test failed:", error.message);
    return false;
  }
}

// Query helper function
export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
}

// Export the pool as default
export default pool;
