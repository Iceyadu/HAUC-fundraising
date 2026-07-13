"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth";
import { updateDonationStatus } from "@/lib/donations";
import type { DonationStatus } from "@/types/donation";

export type UpdateDonationStatusResult = {
  success: boolean;
  message: string;
};

export async function updateDonationStatusAction(
  id: string,
  status: DonationStatus,
): Promise<UpdateDonationStatusResult> {
  try {
    await requireAuth();
    await updateDonationStatus(id, status);

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/donations");
    revalidatePath("/admin/donors");
    revalidatePath(`/admin/donations/${id}`);

    return {
      success: true,
      message: `Donation marked as ${status}.`,
    };
  } catch {
    return {
      success: false,
      message: "Unable to update donation status. Please try again.",
    };
  }
}
