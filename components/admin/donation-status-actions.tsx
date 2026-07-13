"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateDonationStatusAction } from "@/app/actions/admin/donations";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Button } from "@/components/ui/button";
import type { DonationStatus } from "@/types/donation";

interface DonationStatusActionsProps {
  donationId: string;
  donorName: string;
  currentStatus: DonationStatus;
}

export function DonationStatusActions({
  donationId,
  donorName,
  currentStatus,
}: DonationStatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingStatus, setPendingStatus] = useState<DonationStatus | null>(null);

  const handleConfirm = () => {
    if (!pendingStatus) {
      return;
    }

    startTransition(async () => {
      const result = await updateDonationStatusAction(donationId, pendingStatus);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setPendingStatus(null);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setPendingStatus("verified")}
          disabled={currentStatus === "verified" || isPending}
        >
          Approve Donation
        </Button>
        <Button
          variant="outline"
          onClick={() => setPendingStatus("pending")}
          disabled={currentStatus === "pending" || isPending}
        >
          Mark as Pending
        </Button>
        <Button
          variant="destructive"
          onClick={() => setPendingStatus("rejected")}
          disabled={currentStatus === "rejected" || isPending}
        >
          Reject Donation
        </Button>
      </div>

      <ConfirmationDialog
        open={Boolean(pendingStatus)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingStatus(null);
          }
        }}
        title="Update donation status"
        description={
          pendingStatus
            ? `Mark ${donorName}'s contribution as ${pendingStatus}?`
            : ""
        }
        confirmLabel="Confirm"
        onConfirm={handleConfirm}
        isLoading={isPending}
        variant={pendingStatus === "rejected" ? "destructive" : "default"}
      />
    </>
  );
}
