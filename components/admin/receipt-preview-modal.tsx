"use client";

import { format } from "date-fns";
import { FileText, ImageIcon } from "lucide-react";

import { StatusBadge } from "@/components/admin/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatEtb, getPaymentMethodLabel } from "@/lib/branding";
import type { DonationWithReceipt } from "@/types/donation";

interface ReceiptPreviewModalProps {
  donation: DonationWithReceipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptPreviewModal({
  donation,
  open,
  onOpenChange,
}: ReceiptPreviewModalProps) {
  if (!donation) {
    return null;
  }

  const isPdf = donation.receipt_path?.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
          <DialogDescription>
            {donation.donor_name} · {format(new Date(donation.created_at), "PPP p")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-muted/40 flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl border">
            {donation.receipt_signed_url ? (
              isPdf ? (
                <div className="space-y-3 p-8 text-center">
                  <FileText className="text-primary mx-auto size-12" />
                  <p className="text-sm font-medium">PDF receipt attached</p>
                  <a
                    href={donation.receipt_signed_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-sm underline"
                  >
                    Open receipt in new tab
                  </a>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={donation.receipt_signed_url}
                  alt={`Receipt for ${donation.donor_name}`}
                  className="max-h-[480px] w-full object-contain"
                />
              )
            ) : (
              <div className="space-y-2 p-8 text-center">
                <ImageIcon className="text-muted-foreground mx-auto size-10" />
                <p className="text-muted-foreground text-sm">
                  Receipt preview unavailable.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Donor</p>
              <p className="font-medium">{donation.donor_name}</p>
              <p>{donation.phone}</p>
              {donation.email ? <p>{donation.email}</p> : null}
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Payment</p>
              <p className="font-medium">{formatEtb(donation.amount)}</p>
              <p>{getPaymentMethodLabel(donation.payment_method)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <StatusBadge status={donation.status} />
            </div>
            {donation.message ? (
              <div>
                <p className="text-muted-foreground mb-1">Notes</p>
                <p>{donation.message}</p>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
