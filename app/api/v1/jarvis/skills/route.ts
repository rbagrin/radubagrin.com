import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { db } from "@/lib/db";
import { encryptSecret } from "@/lib/encryption";
import { BUILTIN_WORKSPACE_TOOLS, validateSafeUrl } from "@/lib/skills";

// Helper for authentication with local dev fallback
async function getAuthUser(request: Request) {
  const auth = await authenticate(request);
  if (auth) return auth;
  if (process.env.NODE_ENV === "development") {
    // Ensure dev user exists in DB for foreign key relations
    let devUser = await db.user.findFirst({ where: { email: "dev@localhost" } });
    if (!devUser) {
      devUser = await db.user.create({
        data: { email: "dev@localhost", name: "Developer" },
      });
    }
    return { userId: devUser.id, email: devUser.email };
  }
  return null;
}

/**
 * GET /api/v1/jarvis/skills
 * Returns all built-in tools and user-registered custom skills.
 */
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customSkills = await db.skill.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    const formattedCustom = customSkills.map((s) => ({
      id: s.id,
      name: s.name,
      displayName: s.displayName,
      description: s.description,
      parameters: s.parameters,
      type: s.type,
      config: s.config,
      hasSecret: Boolean(s.encryptedSecret),
      requireConfirmation: s.requireConfirmation,
      enabled: s.enabled,
      isBuiltIn: false,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      builtinTools: BUILTIN_WORKSPACE_TOOLS,
      customSkills: formattedCustom,
      totalCount: BUILTIN_WORKSPACE_TOOLS.length + formattedCustom.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/jarvis/skills
 * Register a new custom skill.
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

    const {
      name,
      displayName,
      description,
      parameters,
      type = "webhook",
      config,
      secret,
      requireConfirmation = false,
      enabled = true,
    } = body;

    // Validate identifier (must be alphanumeric/underscore for function name)
    const cleanName = (name || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { error: "Skill name must be at least 2 characters (alphanumeric and underscores only)." },
        { status: 400 }
      );
    }

    // Check if name collisions with built-in tools
    if (BUILTIN_WORKSPACE_TOOLS.some((t) => t.name === cleanName)) {
      return NextResponse.json(
        { error: `"${cleanName}" is a reserved built-in workspace tool name.` },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required so the AI knows when to invoke this skill." },
        { status: 400 }
      );
    }

    // Validate URL if webhook type
    if (type === "webhook") {
      const url = config?.url?.trim();
      if (!url) {
        return NextResponse.json(
          { error: "Webhook URL is required in config." },
          { status: 400 }
        );
      }

      const validation = validateSafeUrl(url);
      if (!validation.safe) {
        return NextResponse.json(
          { error: validation.error || "Invalid webhook URL." },
          { status: 400 }
        );
      }
    }

    // Check for existing skill with same name
    const existing = await db.skill.findUnique({
      where: {
        userId_name: {
          userId: user.userId,
          name: cleanName,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `You already have a skill named "${cleanName}". Please choose a different name.` },
        { status: 400 }
      );
    }

    // Encrypt sensitive API key / token if provided
    const encryptedSecret = secret && typeof secret === "string" && secret.trim()
      ? encryptSecret(secret.trim())
      : null;

    const formattedParameters = parameters && typeof parameters === "object"
      ? parameters
      : { type: "object", properties: {} };

    const skill = await db.skill.create({
      data: {
        userId: user.userId,
        name: cleanName,
        displayName: (displayName || cleanName).trim(),
        description: description.trim(),
        parameters: formattedParameters,
        type,
        config: config || {},
        encryptedSecret,
        requireConfirmation: Boolean(requireConfirmation),
        enabled: Boolean(enabled),
      },
    });

    return NextResponse.json(
      {
        skill: {
          id: skill.id,
          name: skill.name,
          displayName: skill.displayName,
          description: skill.description,
          parameters: skill.parameters,
          type: skill.type,
          config: skill.config,
          hasSecret: Boolean(skill.encryptedSecret),
          requireConfirmation: skill.requireConfirmation,
          enabled: skill.enabled,
          isBuiltIn: false,
          createdAt: skill.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating skill:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create skill" },
      { status: 500 }
    );
  }
}
