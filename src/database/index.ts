import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import Database from "better-sqlite3";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Importing the uuid library

export function generateUniqueId(): string {
  return uuidv4(); // Generates a new unique identifier
}
export function initializeDatabase(dataDir: string) {
  if (process.env.POSTGRES_URL) {
    const db = new PostgresDatabaseAdapter({
      connectionString: process.env.POSTGRES_URL,
    });
    return db;
  } else {
    const filePath =
      process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
    // ":memory:";
    const db = new SqliteDatabaseAdapter(new Database(filePath));
    return db;
  }
}

export async function storeMessage(db: any, user: string, message: string) {
  if (db instanceof PostgresDatabaseAdapter) {
    const query = "INSERT INTO messages(user, message) VALUES($1, $2)";
    await db.run(query, [user, message]);
  } else if (db instanceof SqliteDatabaseAdapter) {
    const memory = {
      id: generateUniqueId(), // Ensure you generate a unique ID
      userId: user,
      content: message,
      createdAt: new Date().toISOString(),
      // Add additional properties if needed
    };
    await db.createMemory(memory, "memories"); // Using createMemory to store the message
  } else {
    throw new Error("Unsupported database type");
  }
}
