import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { formatEtb } from "@/lib/branding";
import { addReportFooter, addReportHeader } from "@/lib/pdf/shared";
import { PDF_COLORS, PDF_MARGINS } from "@/lib/pdf/theme";
import type { DonorSummary } from "@/types/donation";

interface DonorsReportInput {
  donors: DonorSummary[];
  generatedAt?: Date;
}

export function buildDonorsReportPdf({
  donors,
  generatedAt = new Date(),
}: DonorsReportInput): Uint8Array {
  const doc = new jsPDF({ orientation: donors.length > 8 ? "landscape" : "portrait" });
  const generatedLabel = format(generatedAt, "MMMM d, yyyy 'at' h:mm a");
  const totalContributed = donors.reduce((sum, donor) => sum + donor.total_amount, 0);
  const totalContributions = donors.reduce(
    (sum, donor) => sum + donor.donation_count,
    0,
  );

  const y = addReportHeader(
    doc,
    "Donor Directory Report",
    `${donors.length} unique supporter${donors.length === 1 ? "" : "s"}`,
  );

  autoTable(doc, {
    startY: y,
    head: [["Name", "Phone", "Email", "Contributions", "Total Contributed", "Last Contribution"]],
    body: donors.map((donor) => [
      donor.donor_name,
      donor.phone,
      donor.email || "—",
      String(donor.donation_count),
      formatEtb(donor.total_amount),
      format(new Date(donor.last_donation_at), "MMM d, yyyy"),
    ]),
    foot: [[
      "Totals",
      "",
      "",
      String(totalContributions),
      formatEtb(totalContributed),
      "",
    ]],
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
      textColor: PDF_COLORS.text,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: PDF_COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [255, 247, 237],
      textColor: PDF_COLORS.text,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: PDF_MARGINS.left, right: PDF_MARGINS.right },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 28 },
      2: { cellWidth: 42 },
      3: { halign: "center" },
      4: { halign: "right" },
      5: { halign: "right" },
    },
  });

  addReportFooter(doc, generatedLabel);

  return new Uint8Array(doc.output("arraybuffer"));
}
