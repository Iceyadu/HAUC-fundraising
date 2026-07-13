import { formatDistanceToNow } from "date-fns";
import {
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  HandCoins,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { StatCard } from "@/components/admin/stat-card";
import { ExportPdfButton } from "@/components/admin/export-pdf-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CAMPAIGN_TITLE, formatEtb } from "@/lib/branding";
import { getAdminDashboardStats, getRecentDonations } from "@/lib/donations";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminDashboardPage() {
  let stats = {
    totalRaised: 0,
    campaignGoal: 0,
    remainingAmount: 0,
    donationCount: 0,
    builderCount: 0,
    pendingCount: 0,
    verifiedCount: 0,
    rejectedCount: 0,
    monthlyTotal: 0,
    todayTotal: 0,
    averageContribution: 0,
    progressPercent: 0,
  };
  let recentDonations: Awaited<ReturnType<typeof getRecentDonations>> = [];

  try {
    [stats, recentDonations] = await Promise.all([
      getAdminDashboardStats(),
      getRecentDonations(6),
    ]);
  } catch {
    // Database may not be configured yet.
  }

  const statCards = [
    {
      title: "Total Raised",
      value: formatEtb(stats.totalRaised),
      description: "All verified and pending contributions",
      icon: Wallet,
    },
    {
      title: "Campaign Goal",
      value: formatEtb(stats.campaignGoal),
      description: CAMPAIGN_TITLE,
      icon: Target,
    },
    {
      title: "Remaining Amount",
      value: formatEtb(stats.remainingAmount),
      description: "Still needed to reach the goal",
      icon: CircleDollarSign,
    },
    {
      title: "Number of Donations",
      value: stats.donationCount.toString(),
      description: "Total submissions received",
      icon: HandCoins,
    },
    {
      title: "Number of Builders",
      value: stats.builderCount.toString(),
      description: "Verified unique contributors",
      icon: Users,
    },
    {
      title: "Pending Verification",
      value: stats.pendingCount.toString(),
      description: "Awaiting admin review",
      icon: Clock3,
    },
    {
      title: "Verified Donations",
      value: stats.verifiedCount.toString(),
      description: "Approved contributions",
      icon: ClipboardCheck,
    },
    {
      title: "Monthly Total",
      value: formatEtb(stats.monthlyTotal),
      description: "Raised this month",
      icon: TrendingUp,
    },
    {
      title: "Today's Total",
      value: formatEtb(stats.todayTotal),
      description: "Raised today",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Campaign overview for the church finance team.
          </p>
        </div>
        <ExportPdfButton
          href="/api/admin/export/dashboard"
          label="Export Progress PDF"
          filename="campaign-progress.pdf"
        />
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Campaign Progress</CardTitle>
          <CardDescription>
            {stats.progressPercent.toFixed(1)}% of {formatEtb(stats.campaignGoal)} raised
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted h-3 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <span>Average contribution: {formatEtb(stats.averageContribution)}</span>
            <span>Rejected: {stats.rejectedCount}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Latest submissions from builders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentDonations.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No donations recorded yet.
            </p>
          ) : (
            recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {donation.donor_name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {formatDistanceToNow(new Date(donation.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={donation.status} />
                  <p className="text-sm font-semibold">
                    {formatEtb(donation.amount)}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
