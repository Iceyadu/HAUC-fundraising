export type DonationStatus = "pending" | "verified" | "rejected";

export interface Donation {
  id: string;
  donor_name: string;
  phone: string;
  email: string;
  amount: number;
  payment_method: string | null;
  purpose: string | null;
  receipt_path: string | null;
  receipt_url: string | null;
  message: string | null;
  status: DonationStatus;
  created_at: string;
}

export interface DonationFormValues {
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  paymentMethod: string;
  purpose: string;
  message: string;
}

export interface DashboardStats {
  totalRaised: number;
  activeDonors: number;
  monthlyGrowth: number | null;
  activeCampaigns: number;
}

export interface AdminDashboardStats {
  totalRaised: number;
  campaignGoal: number;
  remainingAmount: number;
  donationCount: number;
  builderCount: number;
  pendingCount: number;
  verifiedCount: number;
  rejectedCount: number;
  monthlyTotal: number;
  todayTotal: number;
  averageContribution: number;
  progressPercent: number;
}

export interface DonationActivityBucket {
  key: string;
  label: string;
  shortLabel: string;
  amount: number;
  count: number;
}

export interface DonationActivitySummary {
  daily: DonationActivityBucket[];
  weekly: DonationActivityBucket[];
  peakDay: DonationActivityBucket | null;
  peakWeek: DonationActivityBucket | null;
}

export interface DonationWithReceipt extends Donation {
  receipt_signed_url: string | null;
}

export type DonationSortField = "date" | "amount" | "name";
export type DonationSortDirection = "asc" | "desc";
export type DonationDateRange = "all" | "today" | "week" | "month";

export interface DonationQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: DonationStatus | "all";
  paymentMethod?: string | "all";
  dateRange?: DonationDateRange;
  sortBy?: DonationSortField;
  sortDir?: DonationSortDirection;
}

export interface PaginatedDonations {
  donations: DonationWithReceipt[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DonorSummary {
  donor_key: string;
  donor_name: string;
  email: string;
  phone: string;
  total_amount: number;
  donation_count: number;
  last_donation_at: string;
}

// Kept for donate page compatibility when campaigns table is unavailable.
export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number | null;
  status: "active" | "completed" | "draft";
  created_at: string;
  updated_at: string;
}
