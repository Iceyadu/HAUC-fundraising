import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, FileText } from "lucide-react";

import { DonationStatusActions } from "@/components/admin/donation-status-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEtb, PAYMENT_METHODS } from "@/lib/branding";
import { getDonationById } from "@/lib/donations";

interface DonationDetailPageProps {
  params: Promise<{ id: string }>;
}

function getPaymentMethodLabel(value: string | null): string {
  if (!value) {
    return "—";
  }

  return PAYMENT_METHODS.find((method) => method.value === value)?.label ?? value;
}

export default async function DonationDetailPage({
  params,
}: DonationDetailPageProps) {
  const { id } = await params;
  const donation = await getDonationById(id).catch(() => null);

  if (!donation) {
    notFound();
  }

  const isPdf = donation.receipt_path?.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-6">
      <ButtonLink href="/admin/donations" variant="outline" size="sm">
        <ArrowLeft className="size-4" />
        Back to donations
      </ButtonLink>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {donation.donor_name}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Submitted {format(new Date(donation.created_at), "PPP p")}
          </p>
        </div>
        <StatusBadge status={donation.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/40 flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl border">
              {donation.receipt_signed_url ? (
                isPdf ? (
                  <div className="space-y-3 p-8 text-center">
                    <FileText className="text-primary mx-auto size-12" />
                    <p className="text-sm font-medium">PDF receipt attached</p>
                    <Link
                      href={donation.receipt_signed_url}
                      target="_blank"
                      className="text-primary text-sm underline"
                    >
                      Open receipt in new tab
                    </Link>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={donation.receipt_signed_url}
                    alt={`Receipt for ${donation.donor_name}`}
                    className="max-h-[520px] w-full object-contain"
                  />
                )
              ) : (
                <p className="text-muted-foreground text-sm">
                  Receipt preview unavailable.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Donor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{donation.donor_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{donation.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{donation.email || "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Contribution Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="text-lg font-semibold">
                  {formatEtb(donation.amount)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium">
                  {getPaymentMethodLabel(donation.payment_method)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Purpose</p>
                <p className="font-medium">
                  {donation.purpose ?? "Church Building Project"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Notes</p>
                <p className="font-medium">{donation.message || "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <DonationStatusActions
                donationId={donation.id}
                donorName={donation.donor_name}
                currentStatus={donation.status}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
