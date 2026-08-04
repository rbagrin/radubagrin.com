import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { isS3Configured, getPresignedDownloadUrl, sanitizePath } from "@/lib/s3";

async function getAuthUser(request: Request) {
  const auth = await authenticate(request);
  if (auth) return auth;

  if (process.env.NODE_ENV === "development") {
    return { userId: "dev-user", email: "dev@localhost" };
  }

  return null;
}

/**
 * GET /api/v1/documents/download?key=s3Key
 * Generates a 15-minute presigned download/view URL for an S3 document.
 */
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isS3Configured()) {
    return NextResponse.json(
      { error: "S3 environment variables are not configured." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawKey = searchParams.get("key");

  if (!rawKey) {
    return NextResponse.json({ error: "Query parameter 'key' is required" }, { status: 400 });
  }

  const cleanKey = sanitizePath(rawKey);
  if (!cleanKey) {
    return NextResponse.json({ error: "Invalid key parameter" }, { status: 400 });
  }

  try {
    const downloadUrl = await getPresignedDownloadUrl(cleanKey, 900); // 15 min expiry
    return NextResponse.json({ downloadUrl, key: cleanKey });
  } catch (error: any) {
    console.error("Error generating presigned download URL:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
