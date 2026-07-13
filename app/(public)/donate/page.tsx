import { DonationForm } from "@/components/donate/donation-form";
import { BilingualHeading } from "@/components/shared/bilingual-text";
import { Container } from "@/components/shared/container";
import {
  Card,
  CardContent,
  CardDescription,
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

      <Card className="mx-auto mt-12 max-w-xl border-0 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Builder Contribution Form</CardTitle>
          <CardDescription>
            Record your gift as one of the 1,000 builders in this 52-day campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonationForm campaigns={campaigns} />
        </CardContent>
      </Card>
    </Container>
  );
}
