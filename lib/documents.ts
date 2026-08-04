import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface UpsertDocumentInput {
  name: string;
  s3Key: string;
  folderPath?: string;
  mimeType?: string | null;
  size: number;
  metadata?: Prisma.InputJsonValue;
  status?: string;
}

/**
 * Creates or updates a document metadata record in Postgres.
 */
export async function upsertDocumentMetadata(input: UpsertDocumentInput) {
  const folderPath = input.folderPath || "";
  const status = input.status || "uploaded";

  return db.document.upsert({
    where: { s3Key: input.s3Key },
    create: {
      name: input.name,
      s3Key: input.s3Key,
      folderPath,
      mimeType: input.mimeType || null,
      size: input.size,
      metadata: input.metadata ?? Prisma.JsonNull,
      status,
    },
    update: {
      name: input.name,
      folderPath,
      mimeType: input.mimeType || null,
      size: input.size,
      ...(input.metadata !== undefined && { metadata: input.metadata ?? Prisma.JsonNull }),
      status,
    },
  });
}

/**
 * Fetch document record by its S3 key.
 */
export async function getDocumentByS3Key(s3Key: string) {
  return db.document.findUnique({
    where: { s3Key },
  });
}

/**
 * List all document metadata records under a specific folder path.
 */
export async function listDocumentsByFolder(folderPath: string) {
  const normalizedPath = folderPath || "";
  return db.document.findMany({
    where: { folderPath: normalizedPath },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Delete a document metadata record (or all records under a folder prefix).
 */
export async function deleteDocumentMetadata(s3Key: string) {
  if (s3Key.endsWith("/")) {
    // Delete all metadata records matching prefix
    return db.document.deleteMany({
      where: {
        s3Key: {
          startsWith: s3Key,
        },
      },
    });
  }

  return db.document.delete({
    where: { s3Key },
  }).catch(() => null); // ignore if not found in db
}

/**
 * Helper to update RAG metadata or status (e.g. for future embedding / chunking pipeline).
 */
export async function updateDocumentRAGStatus(
  s3Key: string,
  status: string,
  metadata?: Prisma.InputJsonValue
) {
  return db.document.update({
    where: { s3Key },
    data: {
      status,
      ...(metadata !== undefined && { metadata: metadata ?? Prisma.JsonNull }),
    },
  });
}
