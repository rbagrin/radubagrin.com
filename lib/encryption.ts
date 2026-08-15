import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard recommended IV length for AES-GCM

function getEncryptionKey(): Buffer {
  const secret =
    process.env.SKILL_ENCRYPTION_KEY ||
    process.env.AUTH_SECRET ||
    "personal-app-default-secure-dev-key";

  // Derive a reliable 32-byte (256-bit) key using SHA-256
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts sensitive secret (e.g. API keys, bearer tokens) using AES-256-GCM.
 * Output format: iv:authTag:encryptedData (hex encoded)
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return "";

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");
  const ivHex = iv.toString("hex");

  return `${ivHex}:${authTag}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM encrypted ciphertext.
 */
export function decryptSecret(cipherText: string): string {
  if (!cipherText) return "";

  const parts = cipherText.split(":");
  if (parts.length !== 3) {
    // If not in encrypted format (e.g. legacy or empty), return empty
    return "";
  }

  const [ivHex, authTagHex, encryptedDataHex] = parts;

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedDataHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Failed to decrypt secret:", err);
    return "";
  }
}

/**
 * Generates a masked string representation for safe display in UI.
 */
export function maskSecret(secret?: string | null): string {
  if (!secret) return "None";
  return "••••••••••••";
}
