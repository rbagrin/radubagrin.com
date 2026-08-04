"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface S3FileItem {
  key: string;
  name: string;
  isFolder: boolean;
  size: number;
  lastModified?: string;
  status?: string;
  metadata?: any;
  dbId?: string;
}

export default function DocumentsModulePage() {
  const [currentPrefix, setCurrentPrefix] = useState<string>("");
  const [folders, setFolders] = useState<string[]>([]);
  const [files, setFiles] = useState<S3FileItem[]>([]);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [bucketName, setBucketName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Folder Creation State
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [folderSubmitting, setFolderSubmitting] = useState<boolean>(false);

  // RAG Metadata Inspector State
  const [selectedFileForMetadata, setSelectedFileForMetadata] = useState<S3FileItem | null>(null);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch document listing
  const fetchDocuments = async (prefix: string = currentPrefix) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/documents?prefix=${encodeURIComponent(prefix)}`);
      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to fetch documents:", res.status, errText);
        return;
      }
      const data = await res.json();
      setIsConfigured(data.isConfigured !== false);
      setBucketName(data.bucketName || "");
      setFolders(data.folders || []);
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(currentPrefix);
  }, [currentPrefix]);

  // Navigate into subfolder
  const handleNavigateToFolder = (folderKey: string) => {
    setCurrentPrefix(folderKey);
  };

  // Navigate via breadcrumbs
  const getBreadcrumbs = () => {
    if (!currentPrefix) return [{ label: "Root", prefix: "" }];

    const parts = currentPrefix.split("/").filter(Boolean);
    const crumbs = [{ label: "Root", prefix: "" }];

    let accum = "";
    for (const part of parts) {
      accum += `${part}/`;
      crumbs.push({ label: part, prefix: accum });
    }
    return crumbs;
  };

  // Upload handler
  const handleFileUpload = async (filesToUpload: FileList | File[]) => {
    if (!filesToUpload || filesToUpload.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("prefix", currentPrefix);
        
        // Include initial RAG metadata tags
        const metadata = {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          ragReady: true,
        };
        formData.append("metadata", JSON.stringify(metadata));

        const res = await fetch("/api/v1/documents/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          alert(`Upload failed for ${file.name}: ${err.error || "Unknown error"}`);
        }
      }
      await fetchDocuments(currentPrefix);
    } catch (err: any) {
      alert(`Upload error: ${err.message || "Failed to upload file"}`);
    } finally {
      setUploading(false);
    }
  };

  // Create folder handler
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setFolderSubmitting(true);
    const fullFolderPath = currentPrefix
      ? `${currentPrefix}${newFolderName.trim()}/`
      : `${newFolderName.trim()}/`;

    try {
      const res = await fetch("/api/v1/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_folder", folderPath: fullFolderPath }),
      });

      if (res.ok) {
        setNewFolderName("");
        setShowFolderModal(false);
        await fetchDocuments(currentPrefix);
      } else {
        const data = await res.json();
        alert(`Failed to create folder: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error creating folder: ${err.message}`);
    } finally {
      setFolderSubmitting(false);
    }
  };

  // Delete item handler
  const handleDeleteItem = async (key: string, name: string, isFolder: boolean) => {
    const itemType = isFolder ? "folder and all its contents" : "file";
    if (!confirm(`Are you sure you want to delete the ${itemType} "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/documents?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchDocuments(currentPrefix);
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // Download / Preview handler
  const handleDownload = async (key: string) => {
    try {
      const res = await fetch(`/api/v1/documents/download?key=${encodeURIComponent(key)}`);
      const data = await res.json();

      if (res.ok && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        alert(`Download failed: ${data.error || "Presigned URL generation failed"}`);
      }
    } catch (err: any) {
      alert(`Download error: ${err.message}`);
    }
  };

  // Format file sizes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file type icon
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext)) {
      return (
        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) {
      return (
        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (["json", "js", "ts", "tsx", "html", "css", "py"].includes(ext)) {
      return (
        <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    }
    if (["doc", "docx", "txt", "md"].includes(ext)) {
      return (
        <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5 text-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  // Filtered files & folders
  const filteredFolders = folders.filter((f) => {
    const parts = f.replace(/\/$/, "").split("/");
    const name = parts[parts.length - 1];
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main
      className="flex-1 min-h-screen pb-20"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileUpload(e.dataTransfer.files);
        }
      }}
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        {/* Module Header & Breadcrumb */}
        <Link href="/modules" className="font-mono text-sm text-accent hover:underline inline-flex items-center gap-1">
          &larr; modules
        </Link>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight">Documents</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-xs border ${
                  isConfigured
                    ? "border-status-active/40 bg-status-active/10 text-status-active"
                    : "border-status-dummy/40 bg-status-dummy/10 text-status-dummy"
                }`}
              >
                {isConfigured ? (bucketName ? `S3: ${bucketName}` : "Active S3") : "Preview Mode"}
              </span>
            </div>
            <p className="mt-1 text-sm text-fg-muted">
              S3 bucket document manager indexed in Postgres with metadata for future RAG extensions.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFolderModal(true)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-hover flex items-center gap-1.5"
            >
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h3.93a2 2 0 011.664.89l.812 1.22A2 2 0 0010.07 8H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              New Folder
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {uploading ? "Uploading..." : "Upload File"}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              multiple
            />
          </div>
        </div>

        {/* Configuration Notice if S3 is unconfigured */}
        {!isConfigured && (
          <div className="mt-6 rounded-lg border border-status-dummy/30 bg-status-dummy/5 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-status-dummy shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-sm text-status-dummy">S3 Credentials Required for Live Storage</h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed">
                  Add the following variables to your <code className="font-mono text-accent">.env</code> file to enable live Cloudflare R2 / S3 operations:
                </p>
                <div className="mt-2 rounded bg-surface p-2.5 font-mono text-xs text-fg-muted overflow-x-auto border border-border">
                  <div>S3_ENDPOINT=&quot;https://&lt;account_id&gt;.r2.cloudflarestorage.com&quot;</div>
                  <div>S3_ACCESS_KEY_ID=&quot;your_access_key&quot;</div>
                  <div>S3_SECRET_ACCESS_KEY=&quot;your_secret_key&quot;</div>
                  <div>S3_BUCKET_NAME=&quot;your_bucket_name&quot;</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb Navigation & Search Bar */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3">
          <nav className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto py-1">
            {getBreadcrumbs().map((crumb, idx, arr) => {
              const isLast = idx === arr.length - 1;
              return (
                <div key={crumb.prefix} className="flex items-center gap-1.5 shrink-0">
                  {idx > 0 && <span className="text-fg-muted">/</span>}
                  <button
                    onClick={() => handleNavigateToFolder(crumb.prefix)}
                    className={`hover:underline ${
                      isLast ? "font-semibold text-accent" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {crumb.label}
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 w-full sm:w-64">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-bg pl-9 pr-3 py-1.5 text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <button
              onClick={() => fetchDocuments(currentPrefix)}
              title="Refresh"
              className="rounded-md border border-border bg-bg p-1.5 text-fg-muted hover:text-fg hover:bg-surface-hover"
            >
              <svg className={`h-4 w-4 ${loading ? "animate-spin text-accent" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drag Overlay Banner */}
        {isDragging && (
          <div className="mt-4 rounded-lg border-2 border-dashed border-accent bg-accent/10 p-8 text-center animate-pulse">
            <p className="font-medium text-accent">Drop files here to upload directly to current folder</p>
          </div>
        )}

        {/* File and Folder Listing */}
        <div className="mt-4 rounded-lg border border-border bg-surface overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-fg-muted">Loading documents...</div>
          ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-10 w-10 text-fg-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-3 font-medium text-sm text-fg-muted">This folder is empty</p>
              <p className="mt-1 text-xs text-fg-muted">Drag and drop files here or click Upload File above.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Folders List */}
              {filteredFolders.map((folderKey) => {
                const cleanKey = folderKey.replace(/\/$/, "");
                const parts = cleanKey.split("/");
                const folderName = parts[parts.length - 1];

                return (
                  <div
                    key={folderKey}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover transition-colors group cursor-pointer"
                    onClick={() => handleNavigateToFolder(folderKey)}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="font-medium text-sm text-fg group-hover:text-accent transition-colors">
                        {folderName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-fg-muted">Folder</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(folderKey, folderName, true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-fg-muted hover:text-red-400 transition-opacity"
                        title="Delete Folder"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Files List */}
              {filteredFiles.map((file) => (
                <div
                  key={file.key}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="shrink-0">{getFileIcon(file.name)}</div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-fg truncate">{file.name}</p>
                      {file.lastModified && (
                        <p className="text-xs text-fg-muted">
                          Modified: {new Date(file.lastModified).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Status / RAG metadata badge */}
                    <button
                      onClick={() => setSelectedFileForMetadata(file)}
                      className="rounded bg-border/60 hover:bg-border px-2 py-1 font-mono text-[11px] text-fg-muted hover:text-fg transition-colors flex items-center gap-1"
                      title="Inspect Postgres RAG Metadata"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
                      {file.status || "uploaded"}
                    </button>

                    <span className="font-mono text-xs text-fg-muted w-20 text-right">
                      {formatBytes(file.size)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(file.key)}
                        className="p-1.5 rounded-md text-fg-muted hover:text-accent hover:bg-bg transition-colors"
                        title="Download / View Presigned URL"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteItem(file.key, file.name, false)}
                        className="p-1.5 rounded-md text-fg-muted hover:text-red-400 hover:bg-bg transition-colors"
                        title="Delete File"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl">
            <h3 className="font-display text-lg font-semibold">Create New Folder</h3>
            <p className="mt-1 text-xs text-fg-muted">
              Creates a directory folder marker in S3 under <code className="font-mono text-accent">{currentPrefix || "root"}</code>.
            </p>

            <form onSubmit={handleCreateFolder} className="mt-5">
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                required
                className="w-full rounded-md border border-border bg-bg px-3.5 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-medium text-fg-muted hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={folderSubmitting || !newFolderName.trim()}
                  className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  {folderSubmitting ? "Creating..." : "Create Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RAG Metadata Inspector Slide-Over / Modal */}
      {selectedFileForMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Postgres RAG Metadata</h3>
              <button
                onClick={() => setSelectedFileForMetadata(null)}
                className="text-fg-muted hover:text-fg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-fg-muted font-mono">File Name</label>
                <p className="text-sm font-medium text-fg">{selectedFileForMetadata.name}</p>
              </div>

              <div>
                <label className="text-xs text-fg-muted font-mono">S3 Key Path</label>
                <p className="text-xs font-mono text-accent break-all">{selectedFileForMetadata.key}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-fg-muted font-mono">Status</label>
                  <p className="text-sm text-status-active font-mono">{selectedFileForMetadata.status || "uploaded"}</p>
                </div>
                <div>
                  <label className="text-xs text-fg-muted font-mono">Size</label>
                  <p className="text-sm font-mono text-fg">{formatBytes(selectedFileForMetadata.size)}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-fg-muted font-mono">Custom JSON Metadata (RAG Embeddings Target)</label>
                <pre className="mt-1.5 max-h-48 overflow-y-auto rounded-lg border border-border bg-bg p-3 font-mono text-xs text-fg-muted">
                  {JSON.stringify(selectedFileForMetadata.metadata || { ragReady: true, notice: "Ready for pgvector embedding pipeline" }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedFileForMetadata(null)}
                className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-white hover:opacity-90"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
