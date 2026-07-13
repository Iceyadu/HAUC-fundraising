import type { jsPDF } from "jspdf";

import { CAMPAIGN_TITLE, CHURCH_NAME } from "@/lib/branding";
import { PDF_COLORS, PDF_MARGINS } from "@/lib/pdf/theme";

export function addReportHeader(
  doc: jsPDF,
  title: string,
  subtitle?: string,
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = PDF_MARGINS.top;

  doc.setFillColor(...PDF_COLORS.primary);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(CHURCH_NAME, PDF_MARGINS.left, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(CAMPAIGN_TITLE, PDF_MARGINS.left, 20);

  y = 38;
  doc.setTextColor(...PDF_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, PDF_MARGINS.left, y);

  if (subtitle) {
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.muted);
    doc.text(subtitle, PDF_MARGINS.left, y);
  }

  return y + 10;
}

export function addReportFooter(doc: jsPDF, generatedAt: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...PDF_COLORS.border);
    doc.line(PDF_MARGINS.left, pageHeight - 14, pageWidth - PDF_MARGINS.right, pageHeight - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.muted);
    doc.text(`Generated ${generatedAt}`, PDF_MARGINS.left, pageHeight - 8);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - PDF_MARGINS.right, pageHeight - 8, {
      align: "right",
    });
  }
}

export function drawProgressBar(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  percent: number,
): void {
  const clamped = Math.max(0, Math.min(percent, 100));
  const fillWidth = (width * clamped) / 100;

  doc.setFillColor(...PDF_COLORS.progressBg);
  doc.roundedRect(x, y, width, height, 2, 2, "F");

  if (fillWidth > 0) {
    doc.setFillColor(...PDF_COLORS.primary);
    doc.roundedRect(x, y, fillWidth, height, 2, 2, "F");
  }
}
