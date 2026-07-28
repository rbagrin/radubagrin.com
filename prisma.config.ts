import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Used by the Prisma CLI only (migrate, studio, db push, etc).
// PrismaClient itself gets its connection via the adapter in lib/db.ts —
// this file has no effect on the running app.
//
// DIRECT_URL (Neon's unpooled connection) is used here because schema
// migrations should bypass the PgBouncer pooler.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
