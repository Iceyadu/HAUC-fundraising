import { addDays, eachDayOfInterval, parseISO } from "date-fns";

import { CAMPAIGN_END_AT } from "@/lib/campaign-content";
import type { DonationActivityBucket, DonationActivitySummary } from "@/types/donation";

export const CAMPAIGN_START_AT = "2026-07-14T00:00:00+03:00";

const EAT_OFFSET_MS = 3 * 60 * 60 * 1000;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

interface DonationActivityInput {
  amount: number | string;
  status: string;
  created_at: string;
}

function toEatDateKey(iso: string): string {
  const eat = new Date(new Date(iso).getTime() + EAT_OFFSET_MS);
  const year = eat.getUTCFullYear();
  const month = String(eat.getUTCMonth() + 1).padStart(2, "0");
  const day = String(eat.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, month, day };
}

function formatDateKey(dateKey: string, style: "short" | "long"): string {
  const { year, month, day } = parseDateKey(dateKey);
  const monthLabel = MONTHS[month - 1];

  if (style === "short") {
    return `${monthLabel} ${day}`;
  }

  return `${monthLabel} ${day}, ${year}`;
}

function toWeekStartKey(dateKey: string): string {
  const { year, month, day } = parseDateKey(dateKey);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  date.setUTCDate(date.getUTCDate() + diff);

  const weekYear = date.getUTCFullYear();
  const weekMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const weekDay = String(date.getUTCDate()).padStart(2, "0");
  return `${weekYear}-${weekMonth}-${weekDay}`;
}

function dateKeyToUtcDate(dateKey: string): Date {
  const { year, month, day } = parseDateKey(dateKey);
  return new Date(Date.UTC(year, month - 1, day));
}

function findPeak(buckets: DonationActivityBucket[]): DonationActivityBucket | null {
  const activeBuckets = buckets.filter((bucket) => bucket.amount > 0);
  if (activeBuckets.length === 0) {
    return null;
  }

  return activeBuckets.reduce((peak, bucket) =>
    bucket.amount > peak.amount ? bucket : peak,
  );
}

export function buildDonationActivitySummary(
  donations: DonationActivityInput[],
): DonationActivitySummary {
  const campaignStart = parseISO(CAMPAIGN_START_AT);
  const campaignEnd = parseISO(CAMPAIGN_END_AT);
  const activeDonations = donations.filter(
    (donation) => donation.status !== "rejected",
  );

  const dailyTotals = new Map<string, { amount: number; count: number }>();
  const weeklyTotals = new Map<string, { amount: number; count: number }>();

  for (const donation of activeDonations) {
    const amount =
      typeof donation.amount === "number"
        ? donation.amount
        : Number(donation.amount);
    const dayKey = toEatDateKey(donation.created_at);
    const weekKey = toWeekStartKey(dayKey);

    const dayEntry = dailyTotals.get(dayKey) ?? { amount: 0, count: 0 };
    dayEntry.amount += amount;
    dayEntry.count += 1;
    dailyTotals.set(dayKey, dayEntry);

    const weekEntry = weeklyTotals.get(weekKey) ?? { amount: 0, count: 0 };
    weekEntry.amount += amount;
    weekEntry.count += 1;
    weeklyTotals.set(weekKey, weekEntry);
  }

  const daily: DonationActivityBucket[] = eachDayOfInterval({
    start: campaignStart,
    end: campaignEnd,
  }).map((date) => {
    const key = toEatDateKey(date.toISOString());
    const totals = dailyTotals.get(key) ?? { amount: 0, count: 0 };

    return {
      key,
      label: formatDateKey(key, "long"),
      shortLabel: formatDateKey(key, "short"),
      amount: totals.amount,
      count: totals.count,
    };
  });

  const weekStartKeys = new Set<string>();
  for (const day of daily) {
    weekStartKeys.add(toWeekStartKey(day.key));
  }

  const weekly: DonationActivityBucket[] = [...weekStartKeys]
    .sort()
    .map((key) => {
      const totals = weeklyTotals.get(key) ?? { amount: 0, count: 0 };
      const weekEndKey = toEatDateKey(
        addDays(dateKeyToUtcDate(key), 6).toISOString(),
      );

      return {
        key,
        label: `${formatDateKey(key, "short")} – ${formatDateKey(weekEndKey, "long")}`,
        shortLabel: formatDateKey(key, "short"),
        amount: totals.amount,
        count: totals.count,
      };
    });

  return {
    daily,
    weekly,
    peakDay: findPeak(daily),
    peakWeek: findPeak(weekly),
  };
}
