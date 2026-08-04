import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import {
  isS3Configured,
  listS3Objects,
  createS3Folder,
  deleteS3ObjectOrPrefix,
  sanitizePath,
  S3_BUCKET_NAME,
} from "@/lib/s3";
import {
  listDocumentsByFolder,
  deleteDocumentMetadata,
} from "@/lib/documents";

// Helper to check authentication with local dev fallback
async function getAuthUser(request: Request) {
  const auth = await authenticate(request);
  if (auth) return auth;

  // In local dev mode, allow seamless module evaluation if no cookie is set
  if (process.env.NODE_ENV === "development") {
    return { userId: "dev-user", email: "dev@localhost" };
  }

  return null;
}

/**
 * GET /api/v1/documents?prefix=folderPath
 * Returns list of folders, files, and their Postgres RAG metadata under prefix.
 */
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawPrefix = searchParams.get("prefix") || "";
  const cleanPrefix = sanitizePath(rawPrefix);

  if (!isS3Configured()) {
    return NextResponse.json({
      isConfigured: false,
      bucketName: "",
      prefix: cleanPrefix,
      folders: ["sample_reports/", "archive/"],
      files: [
        {
          key: "sample_doc.pdf",
          name: "sample_doc.pdf",
          isFolder: false,
          size: 245000,
          lastModified: new Date().toISOString(),
          status: "uploaded",
          metadata: { tags: ["sample", "demo"], ragIndexed: false },
        },
        {
          key: "financial_summary.xlsx",
          name: "financial_summary.xlsx",
          isFolder: false,
          size: 1120000,
          lastModified: new Date().toISOString(),
          status: "indexed",
          metadata: { tags: ["finance", "2026"], ragIndexed: true },
        },
      ],
    });
  }

  try {
    const { folders, files } = await listS3Objects(cleanPrefix);
    const dbDocs = await listDocumentsByFolder(cleanPrefix);

    // Map DB metadata onto S3 files
    const dbMap = new Map<string, (typeof dbDocs)[number]>(
      dbDocs.map((d: (typeof dbDocs)[number]) => [d.s3Key, d])
    );

    const enrichedFiles = files.map((file) => {
      const dbItem = dbMap.get(file.key);
      return {
        ...file,
        status: dbItem?.status || "uploaded",
        metadata: dbItem?.metadata || null,
        dbId: dbItem?.id || null,
      };
    });

    return NextResponse.json({
      isConfigured: true,
      bucketName: S3_BUCKET_NAME,
      prefix: cleanPrefix,
      folders,
      files: enrichedFiles,
    });
  } catch (error: any) {
    const errorMsg = error?.message || error?.cause?.message || String(error);
    console.error("Error listing S3 objects:", errorMsg);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/documents
 * Body: { action: "create_folder", folderPath: string }
 */
export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isS3Configured()) {
    return NextResponse.json(
      { error: "S3 environment variables (S3_ENDPOINT, S3_ACCESS_KEY_ID, etc.) are not configured." },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || body.action !== "create_folder" || !body.folderPath) {
    return NextResponse.json(
      { error: "Invalid payload. 'action': 'create_folder' and 'folderPath' are required." },
      { status: 400 }
    );
  }

  const cleanPath = sanitizePath(body.folderPath);
  if (!cleanPath) {
    return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
  }

  try {
    const createdKey = await createS3Folder(cleanPath);
    return NextResponse.json({ success: true, folderKey: createdKey }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating S3 folder:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create folder" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/documents?key=...
 * Removes object or folder prefix from S3 and deletes matching Postgres metadata records.
 */
export async function DELETE(request: Request) {
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
    // Delete from S3
    await deleteS3ObjectOrPrefix(cleanKey);
    // Clean up metadata in Postgres DB
    await deleteDocumentMetadata(cleanKey);

    return NextResponse.json({ success: true, deletedKey: cleanKey });
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete document" },
      { status: 500 }
    );
  }
}
