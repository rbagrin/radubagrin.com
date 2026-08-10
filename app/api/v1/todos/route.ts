import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";

/**
 * GET /api/v1/todos
 * Returns all todo lists and items for the authenticated user.
 */
export async function GET(request: Request) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const lists = await db.todoList.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "asc" },
    include: {
      items: {
        orderBy: [
          { completed: "asc" },
          { createdAt: "desc" },
        ],
      },
    },
  });

  return Response.json({ lists });
}

/**
 * POST /api/v1/todos
 * Body: { name: string }
 * Creates a new todo list for the authenticated user.
 */
export async function POST(request: Request) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();

  if (!name) {
    return Response.json({ error: "List name is required" }, { status: 400 });
  }

  const list = await db.todoList.create({
    data: {
      userId: auth.userId,
      name,
    },
    include: {
      items: true,
    },
  });

  return Response.json({ list }, { status: 201 });
}
