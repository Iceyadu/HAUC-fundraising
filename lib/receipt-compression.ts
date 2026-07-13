const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png"]);
const MAX_DIMENSION = 1600;
const MAX_OUTPUT_BYTES = 5 * 1024 * 1024;
const COMPRESS_IF_LARGER_THAN_BYTES = 400 * 1024;
const INITIAL_QUALITY = 0.82;
const MIN_QUALITY = 0.5;

function getExtension(fileName: string): string | undefined {
  return fileName.split(".").pop()?.toLowerCase();
}

export function isCompressibleReceipt(file: File): boolean {
  const extension = getExtension(file.name);
  return Boolean(extension && IMAGE_EXTENSIONS.has(extension));
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read the selected image."));
    };

    image.src = objectUrl;
  });
}

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

export async function compressReceiptImage(file: File): Promise<File> {
  if (!isCompressibleReceipt(file)) {
    return file;
  }

  if (file.size <= COMPRESS_IF_LARGER_THAN_BYTES) {
    return file;
  }

  const image = await loadImage(file);
  const longestEdge = Math.max(image.width, image.height);
  const scale = Math.min(1, MAX_DIMENSION / longestEdge);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = INITIAL_QUALITY;
  let compressedBlob: Blob | null = null;

  while (quality >= MIN_QUALITY) {
    compressedBlob = await canvasToJpegBlob(canvas, quality);

    if (!compressedBlob) {
      break;
    }

    if (compressedBlob.size <= MAX_OUTPUT_BYTES) {
      break;
    }

    quality -= 0.08;
  }

  if (!compressedBlob) {
    return file;
  }

  if (compressedBlob.size > MAX_OUTPUT_BYTES) {
    throw new Error(
      "Receipt image is still too large after compression. Please choose a smaller photo.",
    );
  }

  if (compressedBlob.size >= file.size) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "receipt";

  return new File([compressedBlob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
