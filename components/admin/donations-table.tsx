"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Eye,
  FileText,
  ImageIcon,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateDonationStatusAction } from "@/app/actions/admin/donations";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { Pagination } from "@/components/admin/pagination";
import { ReceiptPreviewModal } from "@/components/admin/receipt-preview-modal";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEtb, getPaymentMethodLabel, PAYMENT_METHODS } from "@/lib/branding";
import type {
  DonationStatus,
  DonationWithReceipt,
  PaginatedDonations,
} from "@/types/donation";


interface DonationsTableProps {
  data: PaginatedDonations;
}

type PendingAction = {
  id: string;
  status: DonationStatus;
  donorName: string;
};

export function DonationsTable({ data }: DonationsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedDonation, setSelectedDonation] =
    useState<DonationWithReceipt | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<PendingAction | null>(null);

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentPayment = searchParams.get("paymentMethod") ?? "all";
  const currentDateRange = searchParams.get("dateRange") ?? "all";
  const currentSortBy = searchParams.get("sortBy") ?? "date";
  const currentSortDir = searchParams.get("sortDir") ?? "desc";

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusUpdate = () => {
    if (!confirmAction) {
      return;
    }

    startTransition(async () => {
      const result = await updateDonationStatusAction(
        confirmAction.id,
        confirmAction.status,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setConfirmAction(null);
      router.refresh();
    });
  };

  const sortLabel = useMemo(() => {
    if (currentSortBy === "amount") return "Amount";
    if (currentSortBy === "name") return "Name";
    return "Date";
  }, [currentSortBy]);

  if (data.total === 0 && !currentSearch && currentStatus === "all") {
    return (
      <EmptyState
        icon={Search}
        title="No donations yet"
        description="Contributions submitted through the public donation form will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            defaultValue={currentSearch}
            placeholder="Search name, phone, or email"
            className="pl-9"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateParams({
                  search: (event.target as HTMLInputElement).value,
                });
              }
            }}
          />
        </div>

        <Select
          value={currentStatus}
          onValueChange={(value) => updateParams({ status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentPayment}
          onValueChange={(value) => updateParams({ paymentMethod: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">All methods</SelectItem>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentDateRange}
          onValueChange={(value) => updateParams({ dateRange: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={`${currentSortBy}:${currentSortDir}`}
          onValueChange={(value) => {
            if (!value) {
              return;
            }

            const [sortBy, sortDir] = value.split(":");
            updateParams({ sortBy, sortDir });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date:desc">Newest first</SelectItem>
            <SelectItem value="date:asc">Oldest first</SelectItem>
            <SelectItem value="amount:desc">Amount high to low</SelectItem>
            <SelectItem value="amount:asc">Amount low to high</SelectItem>
            <SelectItem value="name:asc">Name A-Z</SelectItem>
            <SelectItem value="name:desc">Name Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <ArrowUpDown className="size-4" />
        Sorted by {sortLabel} · {data.total} result{data.total === 1 ? "" : "s"}
      </div>

      {data.donations.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching donations"
          description="Try adjusting your search or filters to find a contribution."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.donations.map((donation) => {
                const isPdf = donation.receipt_path?.toLowerCase().endsWith(".pdf");

                return (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <button
                        type="button"
                        className="bg-muted hover:ring-primary/30 flex size-12 items-center justify-center overflow-hidden rounded-lg border transition hover:ring-2"
                        onClick={() => {
                          setSelectedDonation(donation);
                          setPreviewOpen(true);
                        }}
                      >
                        {donation.receipt_signed_url && !isPdf ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={donation.receipt_signed_url}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : isPdf ? (
                          <FileText className="text-primary size-5" />
                        ) : (
                          <ImageIcon className="text-muted-foreground size-5" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">
                      {donation.donor_name}
                    </TableCell>
                    <TableCell>{donation.phone}</TableCell>
                    <TableCell>{donation.email || "—"}</TableCell>
                    <TableCell className="font-medium">
                      {formatEtb(donation.amount)}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodLabel(donation.payment_method)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={donation.status} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(donation.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            render={
                              <Link href={`/admin/donations/${donation.id}`} />
                            }
                          >
                            <Eye className="size-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setConfirmAction({
                                id: donation.id,
                                status: "verified",
                                donorName: donation.donor_name,
                              })
                            }
                          >
                            Approve donation
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setConfirmAction({
                                id: donation.id,
                                status: "rejected",
                                donorName: donation.donor_name,
                              })
                            }
                          >
                            Reject donation
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setConfirmAction({
                                id: donation.id,
                                status: "pending",
                                donorName: donation.donor_name,
                              })
                            }
                          >
                            Mark as pending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination page={data.page} totalPages={data.totalPages} />

      <ReceiptPreviewModal
        donation={selectedDonation}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      <ConfirmationDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
          }
        }}
        title="Update donation status"
        description={
          confirmAction
            ? `Mark ${confirmAction.donorName}'s contribution as ${confirmAction.status}?`
            : ""
        }
        confirmLabel="Confirm"
        onConfirm={handleStatusUpdate}
        isLoading={isPending}
        variant={confirmAction?.status === "rejected" ? "destructive" : "default"}
      />
    </div>
  );
}
