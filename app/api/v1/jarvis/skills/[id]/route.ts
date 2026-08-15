import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { db } from "@/lib/db";
import { encryptSecret } from "@/lib/encryption";
import { validateSafeUrl } from "@/lib/skills";

async function getAuthUser(request: Request) {
  const auth = await authenticate(request);
  if (auth) return auth;
  if (process.env.NODE_ENV === "development") {
    const devUser = await db.user.findFirst({ where: { email: "dev@localhost" } });
    if (devUser) return { userId: devUser.id, email: devUser.email };
  }
  return null;
}

/**
 * PATCH /api/v1/jarvis/skills/[id]
 * Updates an existing skill.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
  }

  try {
    const existing = await db.skill.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const updateData: any = {};

    if (body.displayName !== undefined) updateData.displayName = String(body.displayName).trim();
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.parameters !== undefined) updateData.parameters = body.parameters;
    if (body.requireConfirmation !== undefined) updateData.requireConfirmation = Boolean(body.requireConfirmation);
    if (body.enabled !== undefined) updateData.enabled = Boolean(body.enabled);

    if (body.config !== undefined) {
      if (body.config.url) {
        const val = validateSafeUrl(body.config.url);
        if (!val.safe) {
          return NextResponse.json({ error: val.error || "Invalid webhook URL" }, { status: 400 });
        }
      }
      updateData.config = body.config;
    }

    if (body.secret !== undefined) {
      if (body.secret === "") {
        updateData.encryptedSecret = null; // Clear secret
      } else {
        updateData.encryptedSecret = encryptSecret(body.secret);
      }
    }

    const updated = await db.skill.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      skill: {
        id: updated.id,
        name: updated.name,
        displayName: updated.displayName,
        description: updated.description,
        parameters: updated.parameters,
        type: updated.type,
        config: updated.config,
        hasSecret: Boolean(updated.encryptedSecret),
        requireConfirmation: updated.requireConfirmation,
        enabled: updated.enabled,
        isBuiltIn: false,
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update skill" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/jarvis/skills/[id]
 * Deletes a skill.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
  }

  try {
    const existing = await db.skill.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    await db.skill.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Skill removed successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete skill" },
      { status: 500 }
    );
  }
}
