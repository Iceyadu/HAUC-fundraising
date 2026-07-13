"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  CAMPAIGN_PURPOSE,
  FIXED_CONTRIBUTION_ETB,
  PAYMENT_METHODS,
} from "@/lib/branding";
import { createDonation } from "@/lib/donations";
import { phoneNumberSchema } from "@/lib/phone-validation";
import { uploadReceipt, validateReceiptFile } from "@/lib/receipts";
import { notifyDonationReceived } from "@/lib/telegram";

const paymentMethodValues = PAYMENT_METHODS.map((method) => method.value);

const donationSchema = z.object({
  donorName: z.string().min(1, "Name or group name is required").max(120),
  donorPhone: phoneNumberSchema,
  donorEmail: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  paymentMethod: z.enum(paymentMethodValues as [string, ...string[]]),
  purpose: z.literal(CAMPAIGN_PURPOSE),
  message: z.string().max(500).optional(),
  campaignId: z.string().optional(),
});

export type DonationActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

function getFriendlyErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unable to process your contribution. Please try again.";
  }

  if (process.env.NODE_ENV === "development") {
    return error.message;
  }

  switch (error.message) {
    case "SUPABASE_SERVICE_ROLE_KEY is missing":
      return "Donation processing is not configured. Please contact the church office.";
    case "STORAGE_BUCKET_MISSING":
      return "Receipt storage is not set up yet. Please contact the church office.";
    case "STORAGE_UPLOAD_FAILED":
      return "Unable to upload your receipt. Please try again.";
    case "DATABASE_INSERT_FAILED":
      return "Unable to save your contribution. Please try again.";
    default:
      if (
        error.message.includes("Payment receipt") ||
        error.message.includes("Receipt must")
      ) {
        return error.message;
      }

      return "Unable to process your contribution. Please try again.";
  }
}

export async function submitDonation(
  _prevState: DonationActionState,
  formData: FormData,
): Promise<DonationActionState> {
  const parsed = donationSchema.safeParse({
    donorName: formData.get("donorName"),
    donorPhone: formData.get("donorPhone"),
    donorEmail: formData.get("donorEmail") || "",
    paymentMethod: formData.get("paymentMethod"),
    purpose: formData.get("purpose") || CAMPAIGN_PURPOSE,
    message: formData.get("message") || undefined,
    campaignId: formData.get("campaignId") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const receiptFile = formData.get("receipt");

  const receiptValidationError = validateReceiptFile(
    receiptFile instanceof File ? receiptFile : null,
  );

  if (receiptValidationError) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        receipt: [receiptValidationError],
      },
    };
  }

  if (!(receiptFile instanceof File)) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        receipt: ["Payment receipt is required"],
      },
    };
  }

  try {
    const receiptPath = await uploadReceipt(receiptFile);

    const donation = await createDonation({
      donorName: parsed.data.donorName,
      donorPhone: parsed.data.donorPhone,
      donorEmail: parsed.data.donorEmail || "",
      amount: FIXED_CONTRIBUTION_ETB,
      paymentMethod: parsed.data.paymentMethod,
      purpose: CAMPAIGN_PURPOSE,
      receiptPath,
      message: parsed.data.message ?? null,
      status: "pending",
    });

    try {
      await notifyDonationReceived(donation, receiptPath);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[telegram] Notification failed:", error);
      }
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/donations");
    revalidatePath("/admin/donors");
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
      fieldErrors:
        error instanceof Error &&
        (error.message.includes("Payment receipt") ||
          error.message.includes("Receipt must"))
          ? { receipt: [error.message] }
          : undefined,
    };
  }

  redirect("/success");
}
