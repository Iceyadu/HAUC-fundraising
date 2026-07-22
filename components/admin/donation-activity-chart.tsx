"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEtb } from "@/lib/branding";
import { cn } from "@/lib/utils";
import type { DonationActivitySummary } from "@/types/donation";

type ActivityView = "daily" | "weekly";

interface DonationActivityChartProps {
  activity: DonationActivitySummary;
}

function ActivityToggle({
  active,
  onChange,
}: {
  active: ActivityView;
  onChange: (view: ActivityView) => void;
}) {
  return (
    <div className="bg-muted inline-flex rounded-lg p-1">
      {(["daily", "weekly"] as const).map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => onChange(view)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === view
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {view === "daily" ? "By Day" : "By Week"}
        </button>
      ))}
    </div>
  );
}

export function DonationActivityChart({ activity }: DonationActivityChartProps) {
  const [view, setView] = useState<ActivityView>("weekly");
  const buckets = view === "daily" ? activity.daily : activity.weekly;
  const peak = view === "daily" ? activity.peakDay : activity.peakWeek;
  const maxAmount = useMemo(
    () => Math.max(...buckets.map((bucket) => bucket.amount), 1),
    [buckets],
  );
  const hasDonations = buckets.some((bucket) => bucket.amount > 0);

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Donation Activity
          </CardTitle>
          <CardDescription>
            See which days and weeks bring the most contributions during the
            52-day campaign.
          </CardDescription>
        </div>
        <ActivityToggle active={view} onChange={setView} />
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasDonations ? (
          <p className="text-muted-foreground text-sm">
            No donation activity recorded yet. Peaks will appear here as
            contributions come in.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto pb-2">
              <div
                className="flex min-w-full items-end gap-1.5"
                style={{ minHeight: "12rem" }}
              >
                {buckets.map((bucket) => {
                  const heightPercent = (bucket.amount / maxAmount) * 100;
                  const isPeak = peak?.key === bucket.key && bucket.amount > 0;

                  return (
                    <div
                      key={bucket.key}
                      className="group flex min-w-8 flex-1 flex-col items-center justify-end"
                    >
                      <div className="relative mb-2 flex h-40 w-full items-end justify-center">
                        <div
                          className={cn(
                            "w-full max-w-10 rounded-t-md transition-colors",
                            isPeak ? "bg-primary" : "bg-primary/70",
                            bucket.amount === 0 && "bg-muted",
                          )}
                          style={{
                            height: `${Math.max(heightPercent, bucket.amount > 0 ? 6 : 2)}%`,
                          }}
                          title={`${bucket.label}: ${formatEtb(bucket.amount)} (${bucket.count} donation${bucket.count === 1 ? "" : "s"})`}
                        />
                        <div className="pointer-events-none absolute -top-14 left-1/2 z-10 hidden -translate-x-1/2 rounded-md border bg-background px-2 py-1 text-center text-xs shadow-sm group-hover:block">
                          <p className="font-medium whitespace-nowrap">
                            {formatEtb(bucket.amount)}
                          </p>
                          <p className="text-muted-foreground whitespace-nowrap">
                            {bucket.count} donation{bucket.count === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-muted-foreground w-full truncate text-center text-[10px]",
                          isPeak && "text-primary font-medium",
                        )}
                      >
                        {bucket.shortLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {peak ? (
              <div className="bg-muted/50 rounded-lg border px-4 py-3 text-sm">
                <span className="font-medium">
                  Peak {view === "daily" ? "day" : "week"}:{" "}
                </span>
                <span>{peak.label}</span>
                <span className="text-muted-foreground">
                  {" "}
                  — {formatEtb(peak.amount)} from {peak.count} donation
                  {peak.count === 1 ? "" : "s"}
                </span>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
