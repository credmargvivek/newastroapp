// migration.ts
import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "../lib/db"; // import client also

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete!");

  // close the connection, otherwise script hangs
  await client.end();
}

main().catch((err) => {
  console.error("Migration failed");
  console.error(err);
  process.exit(1);
});
