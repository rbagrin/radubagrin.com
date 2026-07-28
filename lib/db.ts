import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Prevents creating a new PrismaClient (and new DB connections) on every
// hot-reload during `next dev`. In production, one instance per server
// process is created and reused for the lifetime of the process.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL || "";
const isNeon = connectionString.includes("neon.tech");

// Use Neon serverless adapter in production/Neon, or standard driver for local Docker Postgres
const adapter = isNeon ? new PrismaNeon({ connectionString }) : undefined;

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
