import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { isS3Configured, uploadS3File, sanitizePath } from "@/lib/s3";
import { upsertDocumentMetadata } from "@/lib/documents";

async function getAuthUser(request: Request) {
  const auth = await authenticate(request);
  if (auth) return auth;

  if (process.env.NODE_ENV === "development") {
    return { userId: "dev-user", email: "dev@localhost" };
  }

  return null;
}

/**
 * POST /api/v1/documents/upload
 * Handles multipart form upload of files to S3 and records metadata in Postgres.
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

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const rawPrefix = (formData.get("prefix") as string) || "";
    const customMetadataStr = formData.get("metadata") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in request" }, { status: 400 });
    }

    const cleanPrefix = sanitizePath(rawPrefix);
    const formattedPrefix = cleanPrefix ? (cleanPrefix.endsWith("/") ? cleanPrefix : `${cleanPrefix}/`) : "";

    // Sanitize file name
    const rawFileName = file.name || "unnamed_document";
    const sanitizedFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const s3Key = `${formattedPrefix}${sanitizedFileName}`;

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse custom metadata if provided
    let parsedMetadata: any = { uploadedBy: user.email };
    if (customMetadataStr) {
      try {
        parsedMetadata = { ...parsedMetadata, ...JSON.parse(customMetadataStr) };
      } catch {
        parsedMetadata.rawMetadata = customMetadataStr;
      }
    }

    // 1. Upload file to S3
    const uploadResult = await uploadS3File(s3Key, buffer, file.type);

    // 2. Insert or update metadata in Postgres database for future RAG / search
    const docRecord = await upsertDocumentMetadata({
      name: sanitizedFileName,
      s3Key: uploadResult.key,
      folderPath: cleanPrefix,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      metadata: parsedMetadata,
      status: "uploaded",
    });

    return NextResponse.json(
      {
        success: true,
        document: {
          id: docRecord.id,
          name: docRecord.name,
          s3Key: docRecord.s3Key,
          folderPath: docRecord.folderPath,
          mimeType: docRecord.mimeType,
          size: docRecord.size,
          status: docRecord.status,
          metadata: docRecord.metadata,
          createdAt: docRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload document" },
      { status: 500 }
    );
  }
}
