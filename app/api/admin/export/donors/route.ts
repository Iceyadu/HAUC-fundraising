import { format } from "date-fns";
import { NextResponse } from "next/server";

import { buildDonorsReportPdf } from "@/lib/pdf/donors-report";
import { requireExportAuth } from "@/lib/pdf/auth";
import { getDonorSummaries } from "@/lib/donations";

export async function GET() {
  const auth = await requireExportAuth();

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const donors = await getDonorSummaries();
    const pdf = buildDonorsReportPdf({ donors });
    const filename = `donor-directory-${format(new Date(), "yyyy-MM-dd")}.pdf`;

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to generate donor report." },
      { status: 500 },
    );
  }
}
