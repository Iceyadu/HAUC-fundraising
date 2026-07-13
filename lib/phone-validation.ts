import { z } from "zod";

export const PHONE_VALIDATION_MESSAGE =
  "Enter a valid Ethiopian, US, or international phone number.";

export function normalizePhoneInput(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/[^\d]/g, "")}`;
  }

  return trimmed.replace(/[\s().-]/g, "");
}

export function isValidPhoneNumber(value: string): boolean {
  const normalized = normalizePhoneInput(value);

  if (!normalized) {
    return false;
  }

  if (/^\+[1-9]\d{6,14}$/.test(normalized)) {
    return true;
  }

  if (/^251[79]\d{8}$/.test(normalized) || /^2511\d{7,8}$/.test(normalized)) {
    return true;
  }

  if (/^0[79]\d{8}$/.test(normalized) || /^0[1-9]\d{7,9}$/.test(normalized)) {
    return true;
  }

  if (/^1[2-9]\d{9}$/.test(normalized) || /^[2-9]\d{9}$/.test(normalized)) {
    return true;
  }

  if (/^[1-9]\d{7,14}$/.test(normalized)) {
    return true;
  }

  return false;
}

export const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .max(25, PHONE_VALIDATION_MESSAGE)
  .refine(isValidPhoneNumber, PHONE_VALIDATION_MESSAGE);
