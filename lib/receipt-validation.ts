export const MAX_RECEIPT_SIZE_BYTES = 2 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png"]);
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

function getExtension(fileName: string): string | undefined {
  return fileName.split(".").pop()?.toLowerCase();
}

export function validateReceiptFile(file: File | null | undefined): string | null {
  if (!file || file.size === 0) {
    return "Payment receipt is required";
  }

  if (file.size > MAX_RECEIPT_SIZE_BYTES) {
    return "Receipt must be 2 MB or smaller";
  }

  const extension = getExtension(file.name);

  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return "Receipt must be a JPG or PNG image";
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return "Receipt must be a JPG or PNG image file";
  }

  const expectedMime = EXTENSION_TO_MIME[extension];

  if (file.type && file.type !== expectedMime) {
    return "Receipt file type does not match the selected image format";
  }

  return null;
}
