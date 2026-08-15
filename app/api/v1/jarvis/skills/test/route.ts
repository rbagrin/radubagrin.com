import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { db } from "@/lib/db";
import { executeToolCall, executeCustomSkill } from "@/lib/skills";
import { encryptSecret } from "@/lib/encryption";

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
 * POST /api/v1/jarvis/skills/test
 * Test-execute a skill with sample arguments.
 */
export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { toolName, skillId, customDraft, args = {} } = body;

    // 1. If testing an unsaved/draft skill
    if (customDraft) {
      const startTime = Date.now();
      try {
        const encryptedSecret = customDraft.secret
          ? encryptSecret(customDraft.secret)
          : null;

        const output = await executeCustomSkill(
          {
            name: customDraft.name || "test_skill",
            config: customDraft.config || {},
            encryptedSecret,
          },
          args
        );

        return NextResponse.json({
          success: true,
          output,
          executionTimeMs: Date.now() - startTime,
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: err.message || "Execution error",
          executionTimeMs: Date.now() - startTime,
        });
      }
    }

    // 2. If testing by toolName or skillId
    const targetToolName = toolName || (skillId ? (await db.skill.findUnique({ where: { id: skillId } }))?.name : null);

    if (!targetToolName) {
      return NextResponse.json({ error: "toolName or skillId is required" }, { status: 400 });
    }

    const result = await executeToolCall(user.userId, targetToolName, args);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to execute skill test" },
      { status: 500 }
    );
  }
}
