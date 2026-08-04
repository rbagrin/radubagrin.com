import crypto from "crypto";
import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const S3_BUCKET_NAME = (process.env.S3_BUCKET_NAME || "").trim();

export function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET_NAME
  );
}

/**
 * Strict path sanitization to prevent directory traversal attacks (e.g. "../", leading slashes).
 */
export function sanitizePath(inputPath: string): string {
  if (!inputPath) return "";

  let clean = inputPath.replace(/\\/g, "/");
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // keep string as is if decode fails
  }

  clean = clean.replace(/\.\./g, "").replace(/\/+/g, "/");

  while (clean.startsWith("/")) {
    clean = clean.slice(1);
  }

  return clean;
}

export interface S3Item {
  key: string;
  name: string;
  isFolder: boolean;
  size: number;
  lastModified?: Date;
  etag?: string;
}

// AWS SDK aliases for compatibility with the rest of the file
const awsSdk = { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand };
const presignerSdk = { getSignedUrl };

function getS3AwsClient() {
  if (!isS3Configured()) return null;
  const endpoint = (process.env.S3_ENDPOINT || "").trim().replace(/\/+$/, "");
  let region = (process.env.S3_REGION || "auto").trim();

  const validR2Regions = ["auto", "wnam", "enam", "weur", "eeur", "apac", "oc"];
  if (endpoint.includes("r2.cloudflarestorage.com") && !validR2Regions.includes(region.toLowerCase())) {
    region = "auto";
  }

  const formattedEndpoint = endpoint.startsWith("http") ? endpoint : `https://${endpoint}`;

  return new awsSdk.S3Client({
    region,
    endpoint: formattedEndpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: (process.env.S3_ACCESS_KEY_ID || "").trim(),
      secretAccessKey: (process.env.S3_SECRET_ACCESS_KEY || "").trim(),
    },
  });
}

// --- AWS SigV4 Native Signer Helpers ----------------------------------------

function sha256(data: Buffer | Uint8Array | string): string {
  const buf = typeof data === "string" ? data : Buffer.from(data);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Buffer {
  const kDate = hmacSha256(`AWS4${key}`, dateStamp);
  const kRegion = hmacSha256(kDate, regionName);
  const kService = hmacSha256(kRegion, serviceName);
  return hmacSha256(kService, "aws4_request");
}

function getS3Config() {
  const endpoint = (process.env.S3_ENDPOINT || "").trim();
  const accessKeyId = (process.env.S3_ACCESS_KEY_ID || "").trim();
  const secretAccessKey = (process.env.S3_SECRET_ACCESS_KEY || "").trim();
  let region = (process.env.S3_REGION || "auto").trim();
  const bucket = (process.env.S3_BUCKET_NAME || "").trim();

  const validR2Regions = ["auto", "wnam", "enam", "weur", "eeur", "apac", "oc"];
  if (endpoint.includes("r2.cloudflarestorage.com") && !validR2Regions.includes(region.toLowerCase())) {
    region = "auto";
  }

  const parsedUrl = new URL(endpoint.startsWith("http") ? endpoint : `https://${endpoint}`);
  return {
    rawHost: parsedUrl.host,
    baseUrl: parsedUrl.origin,
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
  };
}

function makeSignedHeaders(
  method: string,
  path: string,
  queryParams: Record<string, string> = {},
  payload: Buffer | Uint8Array = Buffer.alloc(0),
  contentType?: string,
  customHost?: string,
  customBaseUrl?: string,
  customRegion?: string
): { url: string; headers: Record<string, string> } {
  const config = getS3Config();
  const hostToUse = customHost || config.rawHost;
  const baseUrlToUse = customBaseUrl || config.baseUrl;
  const regionToUse = customRegion || config.region;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]/g, "").replace(/\.\d{3}/, "");
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = sha256(payload);

  const sortedParams = Object.keys(queryParams)
    .sort()
    .map((k) => {
      const val = queryParams[k];
      const encodedVal = encodeURIComponent(val).replace(/%2F/g, "/");
      return `${encodeURIComponent(k)}=${encodedVal}`;
    })
    .join("&");

  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const requestUrl = `${baseUrlToUse}${fullPath}${sortedParams ? `?${sortedParams}` : ""}`;

  const headersToSign: Record<string, string> = {
    host: hostToUse,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  if (contentType) {
    headersToSign["content-type"] = contentType;
  }

  const signedHeaderKeys = Object.keys(headersToSign).sort();
  const canonicalHeaders = signedHeaderKeys.map((k) => `${k}:${headersToSign[k]}\n`).join("");
  const signedHeadersStr = signedHeaderKeys.join(";");

  const canonicalRequest = [
    method.toUpperCase(),
    fullPath,
    sortedParams,
    canonicalHeaders,
    signedHeadersStr,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${regionToUse}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(
    config.secretAccessKey,
    dateStamp,
    regionToUse,
    "s3"
  );
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersStr}, Signature=${signature}`;

  return {
    url: requestUrl,
    headers: {
      ...headersToSign,
      Authorization: authorizationHeader,
    },
  };
}

// --- Public S3 API Operations ------------------------------------------------

/**
 * List files and sub-folders under a given prefix using S3 ListObjectsV2 API.
 */
export async function listS3Objects(prefix: string): Promise<{
  folders: string[];
  files: S3Item[];
}> {
  if (!isS3Configured()) {
    return { folders: [], files: [] };
  }

  const client = getS3AwsClient();
  if (client) {
    const cleanPrefix = sanitizePath(prefix);
    const formattedPrefix = cleanPrefix && !cleanPrefix.endsWith("/") ? `${cleanPrefix}/` : cleanPrefix;

    const command = new awsSdk.ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME,
      Prefix: formattedPrefix,
      Delimiter: "/",
    });

    const response = await client.send(command);
    const folders: string[] = (response.CommonPrefixes || [])
      .map((cp: any) => cp.Prefix || "")
      .filter((p: string) => p !== "" && p !== formattedPrefix);

    const files: S3Item[] = (response.Contents || [])
      .filter((item: any) => item.Key && item.Key !== formattedPrefix && !item.Key.endsWith("/"))
      .map((item: any) => {
        const key = item.Key as string;
        const parts = key.split("/");
        const name = parts[parts.length - 1] || key;
        return {
          key,
          name,
          isFolder: false,
          size: item.Size || 0,
          lastModified: item.LastModified,
          etag: item.ETag,
        };
      });

    return { folders, files };
  }

  // Fallback Native SigV4 fetch with region & style matrix retries
  const config = getS3Config();
  const cleanPrefix = sanitizePath(prefix);
  const formattedPrefix = cleanPrefix && !cleanPrefix.endsWith("/") ? `${cleanPrefix}/` : cleanPrefix;

  const queryParams: Record<string, string> = {
    "list-type": "2",
    delimiter: "/",
  };
  if (formattedPrefix) {
    queryParams.prefix = formattedPrefix;
  }

  const isCloudflare = config.rawHost.includes("r2.cloudflarestorage.com");
  const virtualHost = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `${config.bucket}.${config.rawHost}`
    : config.rawHost;
  const virtualBaseUrl = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `https://${virtualHost}`
    : config.baseUrl;

  const regionsToTry = [config.region, "auto", "us-east-1"].filter((v, i, a) => a.indexOf(v) === i);
  const styleAttempts = [
    { host: virtualHost, path: "/", baseUrl: virtualBaseUrl },
    { host: config.rawHost, path: `/${config.bucket}`, baseUrl: config.baseUrl },
    { host: config.rawHost, path: `/${config.bucket}/`, baseUrl: config.baseUrl },
  ];

  let xmlText = "";
  let lastErrText = "";

  for (const reg of regionsToTry) {
    for (const attempt of styleAttempts) {
      const { url, headers } = makeSignedHeaders(
        "GET",
        attempt.path,
        queryParams,
        Buffer.alloc(0),
        undefined,
        attempt.host,
        attempt.baseUrl,
        reg
      );

      try {
        const res = await fetch(url, { method: "GET", headers });
        if (res.ok) {
          xmlText = await res.text();
          break;
        } else {
          lastErrText = await res.text();
        }
      } catch (err: any) {
        lastErrText = err?.cause?.message || err?.message || String(err);
      }
    }
    if (xmlText) break;
  }

  if (!xmlText) {
    throw new Error(`S3 ListObjects error (403/AccessDenied): ${lastErrText || "Check R2 API token permissions & bucket name"}`);
  }

  const folders: string[] = [];
  const folderMatches = xmlText.matchAll(/<CommonPrefixes>\s*<Prefix>(.*?)<\/Prefix>\s*<\/CommonPrefixes>/g);
  for (const match of folderMatches) {
    if (match[1] && match[1] !== formattedPrefix) {
      folders.push(match[1]);
    }
  }

  const files: S3Item[] = [];
  const contentMatches = xmlText.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g);
  for (const match of contentMatches) {
    const block = match[1];
    const keyMatch = block.match(/<Key>(.*?)<\/Key>/);
    const sizeMatch = block.match(/<Size>(.*?)<\/Size>/);
    const dateMatch = block.match(/<LastModified>(.*?)<\/LastModified>/);
    const etagMatch = block.match(/<ETag>(.*?)<\/ETag>/);

    const key = keyMatch ? keyMatch[1] : "";
    if (key && key !== formattedPrefix && !key.endsWith("/")) {
      const parts = key.split("/");
      const name = parts[parts.length - 1] || key;
      files.push({
        key,
        name,
        isFolder: false,
        size: sizeMatch ? parseInt(sizeMatch[1], 10) : 0,
        lastModified: dateMatch ? new Date(dateMatch[1]) : undefined,
        etag: etagMatch ? etagMatch[1].replace(/"/g, "") : undefined,
      });
    }
  }

  return { folders, files };
}

/**
 * Create a folder marker in S3 (0-byte object ending in '/').
 */
export async function createS3Folder(folderPath: string): Promise<string> {
  if (!isS3Configured()) {
    throw new Error("S3 environment credentials are not configured.");
  }

  const cleanPath = sanitizePath(folderPath);
  const folderKey = cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;

  const client = getS3AwsClient();
  if (client) {
    const command = new awsSdk.PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: folderKey,
      Body: new Uint8Array(0),
    });
    await client.send(command);
    return folderKey;
  }

  const config = getS3Config();
  const emptyBody = Buffer.alloc(0);

  const isCloudflare = config.rawHost.includes("r2.cloudflarestorage.com");
  const virtualHost = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `${config.bucket}.${config.rawHost}`
    : config.rawHost;
  const virtualBaseUrl = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `https://${virtualHost}`
    : config.baseUrl;

  const { url, headers } = makeSignedHeaders(
    "PUT",
    `/${folderKey}`,
    {},
    emptyBody,
    undefined,
    virtualHost,
    virtualBaseUrl
  );

  const res = await fetch(url, { method: "PUT", headers, body: emptyBody });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`S3 CreateFolder error (${res.status}): ${errText}`);
  }

  return folderKey;
}

/**
 * Upload a file buffer/Uint8Array to S3.
 */
export async function uploadS3File(
  key: string,
  body: Buffer | Uint8Array,
  contentType?: string
): Promise<{ key: string; etag?: string }> {
  if (!isS3Configured()) {
    throw new Error("S3 environment credentials are not configured.");
  }

  const cleanKey = sanitizePath(key);
  const payloadBuffer = Buffer.from(body);

  const client = getS3AwsClient();
  if (client) {
    const command = new awsSdk.PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: cleanKey,
      Body: payloadBuffer,
      ContentType: contentType || "application/octet-stream",
    });
    const res = await client.send(command);
    return { key: cleanKey, etag: res.ETag?.replace(/"/g, "") };
  }

  const config = getS3Config();
  const isCloudflare = config.rawHost.includes("r2.cloudflarestorage.com");
  const virtualHost = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `${config.bucket}.${config.rawHost}`
    : config.rawHost;
  const virtualBaseUrl = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `https://${virtualHost}`
    : config.baseUrl;

  const { url, headers } = makeSignedHeaders(
    "PUT",
    `/${cleanKey}`,
    {},
    payloadBuffer,
    contentType,
    virtualHost,
    virtualBaseUrl
  );

  const res = await fetch(url, { method: "PUT", headers, body: payloadBuffer });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`S3 Upload error (${res.status}): ${errText}`);
  }

  const etag = res.headers.get("etag")?.replace(/"/g, "");
  return { key: cleanKey, etag };
}

/**
 * Generate a 15-minute presigned GET URL for downloading or previewing a file.
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresInSeconds = 900
): Promise<string> {
  if (!isS3Configured()) {
    throw new Error("S3 environment credentials are not configured.");
  }

  const cleanKey = sanitizePath(key);

  const client = getS3AwsClient();
  if (client && presignerSdk) {
    const command = new awsSdk.GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: cleanKey,
    });
    return presignerSdk.getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  }

  const config = getS3Config();
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]/g, "").replace(/\.\d{3}/, "");
  const dateStamp = amzDate.slice(0, 8);

  const isCloudflare = config.rawHost.includes("r2.cloudflarestorage.com");
  const virtualHost = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `${config.bucket}.${config.rawHost}`
    : config.rawHost;
  const virtualBaseUrl = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `https://${virtualHost}`
    : config.baseUrl;

  const credentialScope = `${dateStamp}/${config.region}/s3/aws4_request`;
  const credentialParam = `${config.accessKeyId}/${credentialScope}`;

  const queryParams: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": credentialParam,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expiresInSeconds.toString(),
    "X-Amz-SignedHeaders": "host",
  };

  const sortedParams = Object.keys(queryParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
    .join("&");

  const fullPath = `/${cleanKey}`;
  const canonicalHeaders = `host:${virtualHost}\n`;
  const signedHeadersStr = "host";

  const canonicalRequest = [
    "GET",
    fullPath,
    sortedParams,
    canonicalHeaders,
    signedHeadersStr,
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(
    config.secretAccessKey,
    dateStamp,
    config.region,
    "s3"
  );
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  return `${virtualBaseUrl}${fullPath}?${sortedParams}&X-Amz-Signature=${signature}`;
}

/**
 * Delete a single file or folder prefix from S3.
 */
export async function deleteS3ObjectOrPrefix(key: string): Promise<void> {
  if (!isS3Configured()) {
    throw new Error("S3 environment credentials are not configured.");
  }

  const cleanKey = sanitizePath(key);
  const client = getS3AwsClient();

  const config = getS3Config();
  const isCloudflare = config.rawHost.includes("r2.cloudflarestorage.com");
  const virtualHost = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `${config.bucket}.${config.rawHost}`
    : config.rawHost;
  const virtualBaseUrl = isCloudflare && !config.rawHost.startsWith(`${config.bucket}.`)
    ? `https://${virtualHost}`
    : config.baseUrl;

  if (cleanKey.endsWith("/")) {
    const { files } = await listS3Objects(cleanKey);
    for (const file of files) {
      if (client) {
        const command = new awsSdk.DeleteObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: file.key,
        });
        await client.send(command);
      } else {
        const s3Path = `/${file.key}`;
        const { url, headers } = makeSignedHeaders("DELETE", s3Path, {}, Buffer.alloc(0), undefined, virtualHost, virtualBaseUrl);
        await fetch(url, { method: "DELETE", headers });
      }
    }
    if (client) {
      const command = new awsSdk.DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: cleanKey,
      });
      await client.send(command);
    } else {
      const folderS3Path = `/${cleanKey}`;
      const { url, headers } = makeSignedHeaders("DELETE", folderS3Path, {}, Buffer.alloc(0), undefined, virtualHost, virtualBaseUrl);
      await fetch(url, { method: "DELETE", headers });
    }
  } else {
    if (client) {
      const command = new awsSdk.DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: cleanKey,
      });
      await client.send(command);
    } else {
      const s3Path = `/${cleanKey}`;
      const { url, headers } = makeSignedHeaders("DELETE", s3Path, {}, Buffer.alloc(0), undefined, virtualHost, virtualBaseUrl);
      const res = await fetch(url, { method: "DELETE", headers });
      if (!res.ok && res.status !== 404) {
        const errText = await res.text();
        throw new Error(`S3 Delete error (${res.status}): ${errText}`);
      }
    }
  }
}
