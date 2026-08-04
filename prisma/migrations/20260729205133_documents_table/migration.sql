-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "folderPath" TEXT NOT NULL DEFAULT '',
    "mimeType" TEXT,
    "size" INTEGER NOT NULL,
    "metadata" JSONB,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_s3Key_key" ON "documents"("s3Key");

-- CreateIndex
CREATE INDEX "documents_folderPath_idx" ON "documents"("folderPath");

-- CreateIndex
CREATE INDEX "documents_status_idx" ON "documents"("status");
