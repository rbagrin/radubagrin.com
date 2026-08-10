import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";

type Params = {
  params: Promise<{ listId: string }>;
};

/**
 * PATCH /api/v1/todos/[listId]
 * Body: { name: string }
 * Renames a todo list owned by the authenticated user.
 */
export async function PATCH(request: Request, { params }: Params) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { listId } = await params;
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();

  if (!name) {
    return Response.json({ error: "List name is required" }, { status: 400 });
  }

  // Ensure list belongs to the user
  const existing = await db.todoList.findFirst({
    where: { id: listId, userId: auth.userId },
  });

  if (!existing) {
    return Response.json({ error: "List not found" }, { status: 404 });
  }

  const list = await db.todoList.update({
    where: { id: listId },
    data: { name },
    include: { items: true },
  });

  return Response.json({ list });
}

/**
 * DELETE /api/v1/todos/[listId]
 * Deletes a todo list owned by the authenticated user.
 */
export async function DELETE(request: Request, { params }: Params) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { listId } = await params;

  // Ensure list belongs to the user
  const existing = await db.todoList.findFirst({
    where: { id: listId, userId: auth.userId },
  });

  if (!existing) {
    return Response.json({ error: "List not found" }, { status: 404 });
  }

  await db.todoList.delete({
    where: { id: listId },
  });

  return Response.json({ success: true });
}
