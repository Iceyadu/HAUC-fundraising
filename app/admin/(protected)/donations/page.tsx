import { Suspense } from "react";

import { DonationsTable } from "@/components/admin/donations-table";
import { TableSkeleton } from "@/components/admin/loading-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDonationsPaginated } from "@/lib/donations";
import type {
  DonationDateRange,
  DonationSortDirection,
  DonationSortField,
  DonationStatus,
  PaginatedDonations,
} from "@/types/donation";

interface AdminDonationsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    paymentMethod?: string;
    dateRange?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}

function parseStatus(value?: string): DonationStatus | "all" {
  if (value === "pending" || value === "verified" || value === "rejected") {
    return value;
  }

  return "all";
}

function parseDateRange(value?: string): DonationDateRange {
  if (value === "today" || value === "week" || value === "month") {
    return value;
  }

  return "all";
}

function parseSortBy(value?: string): DonationSortField {
  if (value === "amount" || value === "name") {
    return value;
  }

  return "date";
}

function parseSortDir(value?: string): DonationSortDirection {
  return value === "asc" ? "asc" : "desc";
}

export default async function AdminDonationsPage({
  searchParams,
}: AdminDonationsPageProps) {
  const params = await searchParams;
  let data: PaginatedDonations = {
    donations: [],
    total: 0,
    page: 1,
    pageSize: 25,
    totalPages: 1,
  };

  try {
    data = await getDonationsPaginated({
      page: Number(params.page ?? "1"),
      pageSize: 25,
      search: params.search,
      status: parseStatus(params.status),
      paymentMethod: params.paymentMethod ?? "all",
      dateRange: parseDateRange(params.dateRange),
      sortBy: parseSortBy(params.sortBy),
      sortDir: parseSortDir(params.sortDir),
    });
  } catch {
    // Database may not be configured yet.
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Donations</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Review, search, and verify every contribution submitted through the platform.
        </p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
          <CardDescription>
            Server-side pagination with search, filters, and receipt previews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <DonationsTable data={data} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
