import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Prevents creating a new PrismaClient (and new DB connections) on every
// hot-reload during `next dev`. In production, one instance per server
// process is created and reused for the lifetime of the process.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL || "";
const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

// Prisma 7 requires a driver adapter. 
// Use standard pg adapter for localhost TCP, and Neon for remote WebSocket.
const adapter = isLocal 
  ? new PrismaPg(new Pool({ connectionString })) 
  : new PrismaNeon({ connectionString });

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
