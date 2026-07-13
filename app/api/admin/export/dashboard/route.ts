import { format } from "date-fns";
import { NextResponse } from "next/server";

import { buildDashboardReportPdf } from "@/lib/pdf/dashboard-report";
import { requireExportAuth } from "@/lib/pdf/auth";
import { getAdminDashboardStats, getRecentDonations } from "@/lib/donations";

export async function GET() {
  const auth = await requireExportAuth();

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const [stats, recentDonations] = await Promise.all([
      getAdminDashboardStats(),
      getRecentDonations(10),
    ]);

    const pdf = buildDashboardReportPdf({
      stats,
      recentDonations,
    });

    const filename = `campaign-progress-${format(new Date(), "yyyy-MM-dd")}.pdf`;

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to generate dashboard report." },
      { status: 500 },
    );
  }
}
