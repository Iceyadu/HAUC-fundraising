import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
  CAMPAIGN_TITLE,
  formatEtb,
} from "@/lib/branding";
import {
  addReportFooter,
  addReportHeader,
  drawProgressBar,
} from "@/lib/pdf/shared";
import { PDF_COLORS, PDF_MARGINS } from "@/lib/pdf/theme";
import type { AdminDashboardStats, Donation } from "@/types/donation";

interface DashboardReportInput {
  stats: AdminDashboardStats;
  recentDonations: Donation[];
  generatedAt?: Date;
}

export function buildDashboardReportPdf({
  stats,
  recentDonations,
  generatedAt = new Date(),
}: DashboardReportInput): Uint8Array {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PDF_MARGINS.left - PDF_MARGINS.right;
  const generatedLabel = format(generatedAt, "MMMM d, yyyy 'at' h:mm a");

  let y = addReportHeader(
    doc,
    "Campaign Progress Report",
    `Snapshot as of ${format(generatedAt, "MMMM d, yyyy")}`,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.text);
  doc.text("Campaign Progress", PDF_MARGINS.left, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.muted);
  doc.text(
    `${stats.progressPercent.toFixed(1)}% of ${formatEtb(stats.campaignGoal)} raised`,
    PDF_MARGINS.left,
    y,
  );
  y += 6;

  drawProgressBar(doc, PDF_MARGINS.left, y, contentWidth, 6, stats.progressPercent);
  y += 14;

  doc.setTextColor(...PDF_COLORS.text);
  doc.text(`Raised: ${formatEtb(stats.totalRaised)}`, PDF_MARGINS.left, y);
  doc.text(`Remaining: ${formatEtb(stats.remainingAmount)}`, PDF_MARGINS.left + contentWidth / 2, y);
  y += 12;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Campaign", CAMPAIGN_TITLE],
      ["Total Raised", formatEtb(stats.totalRaised)],
      ["Campaign Goal", formatEtb(stats.campaignGoal)],
      ["Remaining Amount", formatEtb(stats.remainingAmount)],
      ["Progress", `${stats.progressPercent.toFixed(1)}%`],
      ["Number of Donations", String(stats.donationCount)],
      ["Number of Builders", String(stats.builderCount)],
      ["Pending Verification", String(stats.pendingCount)],
      ["Verified Donations", String(stats.verifiedCount)],
      ["Rejected Donations", String(stats.rejectedCount)],
      ["Monthly Total", formatEtb(stats.monthlyTotal)],
      ["Today's Total", formatEtb(stats.todayTotal)],
      ["Average Contribution", formatEtb(stats.averageContribution)],
    ],
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 4,
      textColor: PDF_COLORS.text,
    },
    headStyles: {
      fillColor: PDF_COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: PDF_MARGINS.left, right: PDF_MARGINS.right },
  });

  const tableEnd = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ?.finalY ?? y + 40;

  if (recentDonations.length > 0) {
    const recentStartY = tableEnd + 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...PDF_COLORS.text);
    doc.text("Recent Donations", PDF_MARGINS.left, recentStartY);

    autoTable(doc, {
      startY: recentStartY + 4,
      head: [["Donor", "Amount", "Status", "Date"]],
      body: recentDonations.map((donation) => [
        donation.donor_name,
        formatEtb(donation.amount),
        donation.status,
        format(new Date(donation.created_at), "MMM d, yyyy"),
      ]),
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        textColor: PDF_COLORS.text,
      },
      headStyles: {
        fillColor: PDF_COLORS.primary,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: PDF_MARGINS.left, right: PDF_MARGINS.right },
    });
  }

  addReportFooter(doc, generatedLabel);

  return new Uint8Array(doc.output("arraybuffer"));
}
