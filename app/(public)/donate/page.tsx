import { BankAccountInfo } from "@/components/donate/bank-account-info";
import { DonationForm } from "@/components/donate/donation-form";
import { BilingualHeading } from "@/components/shared/bilingual-text";
import { Container } from "@/components/shared/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DONATION_PAGE } from "@/lib/campaign-content";
import { getActiveCampaigns } from "@/lib/donations";
import type { Campaign } from "@/types";

export default async function DonatePage() {
  let campaigns: Campaign[] = [];

  try {
    campaigns = await getActiveCampaigns();
  } catch {
    campaigns = [];
  }

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <BilingualHeading
          english={DONATION_PAGE.headingEn}
          amharic={DONATION_PAGE.headingAm}
          as="h1"
        />
        <p className="text-muted-foreground text-lg leading-relaxed">
          {DONATION_PAGE.subtitleEn}
        </p>
        <p className="text-primary text-lg font-medium leading-relaxed">
          {DONATION_PAGE.subtitleAm}
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-xl space-y-4">
        <BankAccountInfo />

        <Card className="border-0 shadow-md">
          <CardHeader className="space-y-1 px-5 pt-5 pb-0 text-center">
            <CardTitle className="text-xl">{DONATION_PAGE.formTitleEn}</CardTitle>
            <p className="text-primary text-sm font-medium">{DONATION_PAGE.formTitleAm}</p>
          </CardHeader>
          <CardContent className="px-5 pt-4 pb-5">
            <DonationForm campaigns={campaigns} />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
