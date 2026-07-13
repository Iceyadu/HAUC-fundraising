const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "pdf"]);

export function validateReceiptFile(file: File | null | undefined): string | null {
  if (!file || file.size === 0) {
    return "Payment receipt is required";
  }

  if (file.size > MAX_RECEIPT_SIZE_BYTES) {
    return "Receipt must be 5 MB or smaller";
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return "Receipt must be a JPG, PNG, or PDF file";
  }

  return null;
}
