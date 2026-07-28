import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";

/**
 * GET /api/v1/reminders
 * Returns the authenticated user's reminders, read from Neon via Prisma.
 * This is the reference pattern for a real, DB-backed module endpoint —
 * both the web app and the mobile app call this exact same route.
 */
export async function GET(request: Request) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const reminders = await db.reminder.findMany({
    where: { userId: auth.userId },
    orderBy: { dueDate: "asc" },
  });

  return Response.json({ reminders });
}

/**
 * POST /api/v1/reminders
 * Body: { "title": string, "dueDate": string (ISO date), "notifyBy"?: "email" | "push" }
 */
export async function POST(request: Request) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.dueDate) {
    return Response.json({ error: "title and dueDate are required" }, { status: 400 });
  }

  const reminder = await db.reminder.create({
    data: {
      userId: auth.userId,
      title: body.title,
      dueDate: new Date(body.dueDate),
      notifyBy: body.notifyBy === "push" ? "push" : "email",
    },
  });

  return Response.json({ reminder }, { status: 201 });
}
