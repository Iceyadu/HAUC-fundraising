import {
  endOfDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { CAMPAIGN_GOAL_ETB } from "@/lib/branding";
import { getContributionUnitsFromAmount } from "@/lib/contribution";
import { normalizePaymentMethodForStorage } from "@/lib/payment-methods";
import { getReceiptSignedUrl } from "@/lib/receipts";
import { createServiceClient } from "@/lib/supabase/admin";
import { throwSupabaseError } from "@/lib/supabase/errors";
import type {
  AdminDashboardStats,
  Campaign,
  DashboardStats,
  Donation,
  DonationQueryParams,
  DonationStatus,
  DonationWithReceipt,
  DonorSummary,
  PaginatedDonations,
} from "@/types/donation";

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : Number(value);
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("title");

  if (error) {
    return [];
  }

  return (data ?? []).map((campaign) => ({
    ...campaign,
    goal_amount:
      campaign.goal_amount === null ? null : toNumber(campaign.goal_amount),
  }));
}

export async function getRecentDonations(limit = 10): Promise<Donation[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throwSupabaseError("Donation query", error, "DATABASE_QUERY_FAILED");
  }

  return (data ?? []).map((donation) => ({
    ...donation,
    amount: toNumber(donation.amount),
  }));
}

export async function getAllDonations(): Promise<Donation[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throwSupabaseError("Donation query", error, "DATABASE_QUERY_FAILED");
  }

  return (data ?? []).map((donation) => ({
    ...donation,
    amount: toNumber(donation.amount),
  }));
}

export async function getDonorSummaries(): Promise<DonorSummary[]> {
  const donations = await getAllDonations();
  const donors = new Map<string, DonorSummary>();

  for (const donation of donations) {
    const donorKey = donation.phone || donation.email || donation.donor_name;
    const existing = donors.get(donorKey);

    if (existing) {
      existing.total_amount += donation.amount;
      existing.donation_count += 1;

      if (donation.created_at > existing.last_donation_at) {
        existing.last_donation_at = donation.created_at;
        existing.donor_name = donation.donor_name;
        existing.email = donation.email;
        existing.phone = donation.phone;
      }

      continue;
    }

    donors.set(donorKey, {
      donor_key: donorKey,
      donor_name: donation.donor_name,
      email: donation.email,
      phone: donation.phone,
      total_amount: donation.amount,
      donation_count: 1,
      last_donation_at: donation.created_at,
    });
  }

  return Array.from(donors.values()).sort(
    (a, b) => b.total_amount - a.total_amount,
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServiceClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const { data: donations, error: donationsError } = await supabase
    .from("donations")
    .select("amount, email, phone, created_at");

  if (donationsError) {
    throwSupabaseError("Dashboard stats query", donationsError, "DATABASE_QUERY_FAILED");
  }

  const allDonations = donations ?? [];
  const totalRaised = allDonations.reduce(
    (sum, donation) => sum + toNumber(donation.amount),
    0,
  );

  const thisMonthDonations = allDonations.filter(
    (donation) => new Date(donation.created_at) >= startOfMonth,
  );
  const lastMonthDonations = allDonations.filter((donation) => {
    const createdAt = new Date(donation.created_at);
    return createdAt >= startOfLastMonth && createdAt < startOfMonth;
  });

  const thisMonthTotal = thisMonthDonations.reduce(
    (sum, donation) => sum + toNumber(donation.amount),
    0,
  );
  const lastMonthTotal = lastMonthDonations.reduce(
    (sum, donation) => sum + toNumber(donation.amount),
    0,
  );

  const activeDonors = new Set(
    thisMonthDonations.map((donation) => donation.phone || donation.email),
  ).size;

  const monthlyGrowth =
    lastMonthTotal === 0
      ? thisMonthTotal > 0
        ? 100
        : null
      : ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

  return {
    totalRaised,
    activeDonors,
    monthlyGrowth,
    activeCampaigns: 1,
  };
}

export async function createDonation(input: {
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  amount: number;
  paymentMethod: string;
  purpose: string;
  receiptPath: string;
  message: string | null;
  status?: Donation["status"];
}): Promise<Donation> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_name: input.donorName,
      phone: input.donorPhone,
      email: input.donorEmail,
      amount: input.amount,
      payment_method: normalizePaymentMethodForStorage(input.paymentMethod),
      purpose: input.purpose,
      receipt_path: input.receiptPath,
      message: input.message,
      status: input.status ?? "pending",
    })
    .select("*")
    .single();

  if (error) {
    throwSupabaseError("Donation insert", error, "DATABASE_INSERT_FAILED");
  }

  return {
    ...data,
    amount: toNumber(data.amount),
  };
}

async function attachReceiptSignedUrl(
  donation: Donation,
): Promise<DonationWithReceipt> {
  const receipt_signed_url = donation.receipt_path
    ? await getReceiptSignedUrl(donation.receipt_path, 3600)
    : null;

  return {
    ...donation,
    receipt_signed_url,
  };
}

function mapDonationRow(row: Donation): Donation {
  return {
    ...row,
    amount: toNumber(row.amount),
  };
}

function getDateRangeStart(dateRange: DonationQueryParams["dateRange"]): string | null {
  const now = new Date();

  switch (dateRange) {
    case "today":
      return startOfDay(now).toISOString();
    case "week":
      return startOfWeek(now, { weekStartsOn: 1 }).toISOString();
    case "month":
      return startOfMonth(now).toISOString();
    default:
      return null;
  }
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = createServiceClient();
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const monthStart = startOfMonth(now).toISOString();

  const { data, error } = await supabase
    .from("donations")
    .select("amount, status, phone, email, created_at");

  if (error) {
    throwSupabaseError("Admin dashboard stats query", error, "DATABASE_QUERY_FAILED");
  }

  const donations = data ?? [];
  const totalRaised = donations.reduce(
    (sum, donation) => sum + toNumber(donation.amount),
    0,
  );
  const verifiedDonations = donations.filter(
    (donation) => donation.status === "verified",
  );
  const pendingCount = donations.filter(
    (donation) => donation.status === "pending",
  ).length;
  const verifiedCount = verifiedDonations.length;
  const rejectedCount = donations.filter(
    (donation) => donation.status === "rejected",
  ).length;
  const monthlyTotal = donations
    .filter((donation) => donation.created_at >= monthStart)
    .reduce((sum, donation) => sum + toNumber(donation.amount), 0);
  const todayTotal = donations
    .filter((donation) => donation.created_at >= todayStart)
    .reduce((sum, donation) => sum + toNumber(donation.amount), 0);
  const verifiedRaised = verifiedDonations.reduce(
    (sum, donation) => sum + toNumber(donation.amount),
    0,
  );
  const participantUnits = verifiedDonations.reduce(
    (sum, donation) => sum + getContributionUnitsFromAmount(toNumber(donation.amount)),
    0,
  );

  const campaignGoal = CAMPAIGN_GOAL_ETB;
  const remainingAmount = Math.max(campaignGoal - verifiedRaised, 0);
  const progressPercent = Math.min((verifiedRaised / campaignGoal) * 100, 100);

  return {
    totalRaised,
    campaignGoal,
    remainingAmount,
    donationCount: donations.length,
    builderCount: participantUnits,
    pendingCount,
    verifiedCount,
    rejectedCount,
    monthlyTotal,
    todayTotal,
    averageContribution:
      donations.length > 0 ? totalRaised / donations.length : 0,
    progressPercent,
  };
}

export async function getDonationsPaginated(
  params: DonationQueryParams = {},
): Promise<PaginatedDonations> {
  const supabase = createServiceClient();
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = params.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const sortColumn =
    params.sortBy === "amount"
      ? "amount"
      : params.sortBy === "name"
        ? "donor_name"
        : "created_at";
  const ascending = params.sortDir === "asc";

  let query = supabase.from("donations").select("*", { count: "exact" });

  if (params.search?.trim()) {
    const term = params.search.trim().replace(/[%_]/g, "");
    query = query.or(
      `donor_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`,
    );
  }

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.paymentMethod && params.paymentMethod !== "all") {
    query = query.eq(
      "payment_method",
      normalizePaymentMethodForStorage(params.paymentMethod),
    );
  }

  const dateRangeStart = getDateRangeStart(params.dateRange);
  if (dateRangeStart) {
    query = query.gte("created_at", dateRangeStart);
    if (params.dateRange === "today") {
      query = query.lte("created_at", endOfDay(new Date()).toISOString());
    }
  }

  const { data, error, count } = await query
    .order(sortColumn, { ascending })
    .range(from, to);

  if (error) {
    throwSupabaseError("Donations query", error, "DATABASE_QUERY_FAILED");
  }

  const donations = await Promise.all(
    (data ?? []).map(async (row) =>
      attachReceiptSignedUrl(mapDonationRow(row as Donation)),
    ),
  );

  const total = count ?? 0;

  return {
    donations,
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}

export async function getDonationById(id: string): Promise<DonationWithReceipt | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throwSupabaseError("Donation lookup", error, "DATABASE_QUERY_FAILED");
  }

  if (!data) {
    return null;
  }

  return attachReceiptSignedUrl(mapDonationRow(data as Donation));
}

export async function updateDonationStatus(
  id: string,
  status: DonationStatus,
): Promise<Donation> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("donations")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throwSupabaseError("Donation status update", error, "DATABASE_UPDATE_FAILED");
  }

  return mapDonationRow(data as Donation);
}

export async function getPublicCampaignProgress(): Promise<{
  progress: number;
}> {
  try {
    const stats = await getAdminDashboardStats();
    return { progress: stats.progressPercent };
  } catch {
    return { progress: 0 };
  }
}
