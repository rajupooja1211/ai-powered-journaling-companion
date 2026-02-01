import { testConnection } from "./config/database.js";

async function test() {
  console.log("🔍 Testing database connection...");
  const success = await testConnection();

  if (success) {
    console.log("🎉 Database is ready to use!");
  } else {
    console.log("❌ Database connection failed. Check your .env file.");
  }

  process.exit(0);
}

test();
