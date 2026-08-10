import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";

type Params = {
  params: Promise<{ listId: string }>;
};

/**
 * POST /api/v1/todos/[listId]/items
 * Body: { title: string }
 * Creates a new todo item inside the specified list for the authenticated user.
 */
export async function POST(request: Request, { params }: Params) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { listId } = await params;
  const body = await request.json().catch(() => null);
  const title = body?.title?.trim();

  if (!title) {
    return Response.json({ error: "Item title is required" }, { status: 400 });
  }

  // Ensure list belongs to user
  const list = await db.todoList.findFirst({
    where: { id: listId, userId: auth.userId },
  });

  if (!list) {
    return Response.json({ error: "List not found" }, { status: 404 });
  }

  const item = await db.todoItem.create({
    data: {
      listId,
      userId: auth.userId,
      title,
    },
  });

  return Response.json({ item }, { status: 201 });
}
