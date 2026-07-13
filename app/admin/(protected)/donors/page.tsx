import { format } from "date-fns";
import { Users } from "lucide-react";

import { EmptyState } from "@/components/admin/empty-state";
import { ExportPdfButton } from "@/components/admin/export-pdf-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEtb } from "@/lib/branding";
import { getDonorSummaries } from "@/lib/donations";

export default async function AdminDonorsPage() {
  let donors: Awaited<ReturnType<typeof getDonorSummaries>> = [];

  try {
    donors = await getDonorSummaries();
  } catch {
    donors = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Donors</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Supporter profiles aggregated from donation history.
          </p>
        </div>
        {donors.length > 0 ? (
          <ExportPdfButton
            href="/api/admin/export/donors"
            label="Export Donors PDF"
            filename="donor-directory.pdf"
          />
        ) : null}
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Donor Directory</CardTitle>
          <CardDescription>
            {donors.length} unique supporter{donors.length === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {donors.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No donors yet"
              description="Donor records will appear here after the first gift is received."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contributions</TableHead>
                    <TableHead>Total Contributed</TableHead>
                    <TableHead>Last Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donors.map((donor) => (
                    <TableRow key={donor.donor_key}>
                      <TableCell className="font-medium">
                        {donor.donor_name}
                      </TableCell>
                      <TableCell>{donor.phone}</TableCell>
                      <TableCell>{donor.email || "—"}</TableCell>
                      <TableCell>{donor.donation_count}</TableCell>
                      <TableCell>{formatEtb(donor.total_amount)}</TableCell>
                      <TableCell>
                        {format(new Date(donor.last_donation_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
