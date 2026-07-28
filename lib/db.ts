import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Prevents creating a new PrismaClient (and new DB connections) on every
// hot-reload during `next dev`. In production, one instance per server
// process is created and reused for the lifetime of the process.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// As of Prisma 7, PrismaClient no longer reads a connection URL from
// schema.prisma — it needs a driver adapter instead. This is Neon's pooled
// connection string, matching what the app uses at runtime.
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
