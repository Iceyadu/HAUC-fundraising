import { Church, Heart, Users } from "lucide-react";

import { BuildingProjectImage } from "@/components/shared/building-project-image";
import {
  BilingualHeading,
  BilingualText,
  SectionShell,
} from "@/components/shared/bilingual-text";
import { Container } from "@/components/shared/container";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  CAMPAIGN_TAGLINE_AM,
  CAMPAIGN_TAGLINE_EN,
  VISION_GOAL,
} from "@/lib/campaign-content";

const values = [
  {
    titleEn: "Faith",
    titleAm: "እምነት",
    descriptionEn:
      "Like Nehemiah, we believe God calls us to rise up and build His house with courage and conviction.",
    descriptionAm:
      "ከነህምያ ተምሳሌ በመከተል እግዚአብሔር ቤቱን በእምነትና በጽናት እንሰራለን ብለን እናምናለን።",
    icon: Heart,
  },
  {
    titleEn: "Community",
    titleAm: "ህብረት",
    descriptionEn:
      "This 52-day campaign unites 1,000 participants in shared purpose, fellowship, and service.",
    descriptionAm:
      "ይህ 52 ቀናት ዘመቻ 1,000 ተሳታፊዎችን በጋራ ግብ፣ በመተዋወቅና በአገልግሎት አንድነት ያደርጋል።",
    icon: Users,
  },
  {
    titleEn: "Stewardship",
    titleAm: "አደራ",
    descriptionEn:
      "Every 52,000 ETB gift is managed with accountability, transparency, and care.",
    descriptionAm:
      "እያንዳንዱ 52,000 ብር መዋጮ በተጠያቂነት፣ በግልጽነትና በጥንቃቄ ይታደጋል።",
    icon: Church,
  },
];

export default function AboutPage() {
  return (
    <>
      <SectionShell className="pt-16 md:pt-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <BilingualHeading
              english="Together We Will Build God's House"
              amharic={CAMPAIGN_TAGLINE_AM}
              as="h1"
            />
            <p className="text-muted-foreground text-lg leading-relaxed">
              {CAMPAIGN_TAGLINE_EN} Halwot Emmanuel United Church is on a
              focused 52-day journey to raise 52,000,000 ETB for our new church
              building.
            </p>
          </div>
        </Container>
      </SectionShell>

      <SectionShell className="bg-muted/20 pt-0">
        <Container>
          <Card className="mx-auto max-w-4xl border-0 shadow-md">
            <CardContent className="space-y-8 p-8 md:p-12">
              <BilingualHeading
                english={VISION_GOAL.titleEn}
                amharic={VISION_GOAL.titleAm}
              />
              <BilingualText
                english={VISION_GOAL.bodyEn}
                amharic={VISION_GOAL.bodyAm}
              />
            </CardContent>
          </Card>
        </Container>
      </SectionShell>

      <SectionShell className="pt-0">
        <Container>
          <div className="mx-auto max-w-2xl">
            <BuildingProjectImage />
          </div>
        </Container>
      </SectionShell>

      <SectionShell className="bg-muted/20 pt-0">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <Card key={value.titleEn} className="border-0 shadow-md">
                  <CardContent className="space-y-4 p-6">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{value.titleEn}</h3>
                      <p className="text-primary text-sm font-medium">
                        {value.titleAm}
                      </p>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p className="text-muted-foreground">{value.descriptionEn}</p>
                      <p className="text-muted-foreground">{value.descriptionAm}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </SectionShell>
    </>
  );
}
