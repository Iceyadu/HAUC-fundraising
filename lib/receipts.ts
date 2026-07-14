import { randomUUID } from "crypto";

import { validateReceiptFile } from "@/lib/receipt-validation";
import { createServiceClient } from "@/lib/supabase/admin";
import { throwSupabaseError } from "@/lib/supabase/errors";

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

export { validateReceiptFile } from "@/lib/receipt-validation";

function getStorageObjectPath(receiptPath: string): string {
  return receiptPath.replace(/^receipts\//, "");
}

export function buildReceiptPath(extension: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const timestamp = now.getTime();
  const uuid = randomUUID();

  return `receipts/${year}/${month}/${day}/${uuid}_${timestamp}.${extension}`;
}

export async function uploadReceipt(file: File): Promise<string> {
  const validationError = validateReceiptFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";

  if (!MIME_BY_EXTENSION[extension]) {
    throw new Error("Receipt must be a JPG or PNG image");
  }

  const receiptPath = buildReceiptPath(extension);
  const objectPath = getStorageObjectPath(receiptPath);
  const contentType = MIME_BY_EXTENSION[extension] ?? "application/octet-stream";
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createServiceClient();

  const { error } = await supabase.storage.from("receipts").upload(objectPath, buffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    if (error.message.toLowerCase().includes("bucket not found")) {
      throw new Error("STORAGE_BUCKET_MISSING");
    }

    throwSupabaseError("Receipt upload", error, "STORAGE_UPLOAD_FAILED");
  }

  return receiptPath;
}

export async function getReceiptSignedUrl(
  receiptPath: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const supabase = createServiceClient();
  const objectPath = getStorageObjectPath(receiptPath);
  const { data, error } = await supabase.storage
    .from("receipts")
    .createSignedUrl(objectPath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
