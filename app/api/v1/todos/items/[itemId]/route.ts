import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";

type Params = {
  params: Promise<{ itemId: string }>;
};

/**
 * PATCH /api/v1/todos/items/[itemId]
 * Body: { completed?: boolean, title?: string }
 * Updates completion status or title of a todo item owned by the user.
 */
export async function PATCH(request: Request, { params }: Params) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { itemId } = await params;
  const body = await request.json().catch(() => null);

  const existing = await db.todoItem.findFirst({
    where: { id: itemId, userId: auth.userId },
  });

  if (!existing) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  const updateData: { completed?: boolean; title?: string } = {};

  if (typeof body?.completed === "boolean") {
    updateData.completed = body.completed;
  }

  if (typeof body?.title === "string" && body.title.trim()) {
    updateData.title = body.title.trim();
  }

  const item = await db.todoItem.update({
    where: { id: itemId },
    data: updateData,
  });

  return Response.json({ item });
}

/**
 * DELETE /api/v1/todos/items/[itemId]
 * Deletes a todo item owned by the user.
 */
export async function DELETE(request: Request, { params }: Params) {
  const auth = await authenticate(request);
  if (!auth) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { itemId } = await params;

  const existing = await db.todoItem.findFirst({
    where: { id: itemId, userId: auth.userId },
  });

  if (!existing) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  await db.todoItem.delete({
    where: { id: itemId },
  });

  return Response.json({ success: true });
}
