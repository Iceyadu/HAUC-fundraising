type SupabaseLikeError = {
  code?: string;
  message: string;
  details?: string | null;
  hint?: string | null;
};

export function formatSupabaseError(
  operation: string,
  error: SupabaseLikeError,
): string {
  return [
    `${operation} failed`,
    "",
    `Code: ${error.code ?? "N/A"}`,
    `Message: ${error.message}`,
    `Details: ${error.details ?? "None"}`,
    `Hint: ${error.hint ?? "None"}`,
  ].join("\n");
}

export function throwSupabaseError(
  operation: string,
  error: SupabaseLikeError,
  productionCode: string,
): never {
  if (process.env.NODE_ENV === "development") {
    throw new Error(formatSupabaseError(operation, error));
  }

  throw new Error(productionCode);
}
