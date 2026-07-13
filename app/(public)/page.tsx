import { ArrowRight, Calendar, Hammer, Users2 } from "lucide-react";

import { CampaignProgress } from "@/components/home/campaign-progress";
import { BuildingProjectImage } from "@/components/shared/building-project-image";
import {
  BilingualHeading,
  BilingualQuote,
  BilingualText,
  SectionShell,
} from "@/components/shared/bilingual-text";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  CAMPAIGN_DURATION_DAYS,
  CAMPAIGN_END,
  CAMPAIGN_START,
  CAMPAIGN_TAGLINE_AM,
  CAMPAIGN_TAGLINE_EN,
  DONATION_CTA,
  HERO,
  PARTICIPATE,
  POWER_IN_NUMBERS,
  THE_MATH,
  TIMELINE,
  VISION_GOAL,
} from "@/lib/campaign-content";

export default function HomePage() {
  return (
    <>
      <SectionShell className="pt-20 md:pt-28">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <Logo size="lg" showText={false} className="mb-8" />

            <p className="text-primary mb-4 text-sm font-medium tracking-wide uppercase">
              {CAMPAIGN_TAGLINE_EN}
            </p>
            <p className="text-primary mb-8 text-base font-medium">
              {CAMPAIGN_TAGLINE_AM}
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              🏗️ {HERO.titleEn}
            </h1>
            <p className="text-primary mt-3 text-2xl font-semibold md:text-3xl">
              {HERO.titleAm}
            </p>

            <div className="mt-6 space-y-1">
              <p className="text-muted-foreground text-lg md:text-xl">
                {HERO.subtitleEn}
              </p>
              <p className="text-primary text-lg font-medium md:text-xl">
                {HERO.subtitleAm}
              </p>
            </div>

            <Card className="mt-10 w-full max-w-3xl border-0 shadow-md">
              <CardContent className="p-8 md:p-10">
                <BilingualQuote
                  english={HERO.verseEn}
                  referenceEn={HERO.verseRefEn}
                  amharic={HERO.verseAm}
                  referenceAm={HERO.verseRefAm}
                />
              </CardContent>
            </Card>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <ButtonLink href="/donate" size="lg" className="h-11 px-6 text-base">
                Donate Now
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="/about"
                variant="outline"
                size="lg"
                className="h-11 px-6 text-base"
              >
                Learn More
              </ButtonLink>
            </div>
          </div>
        </Container>
      </SectionShell>

      <SectionShell className="bg-muted/20">
        <Container>
          <Card className="mx-auto max-w-5xl border-0 shadow-md">
            <CardContent className="space-y-8 p-8 md:p-12">
              <BilingualHeading
                english={VISION_GOAL.titleEn}
                amharic={VISION_GOAL.titleAm}
              />
              <BilingualText
                english={VISION_GOAL.bodyEn}
                amharic={VISION_GOAL.bodyAm}
              />
              <BuildingProjectImage showCaption={false} className="pt-4" />
            </CardContent>
          </Card>
        </Container>
      </SectionShell>

      <SectionShell>
        <Container>
          <Card className="mx-auto max-w-4xl border-0 shadow-md">
            <CardContent className="space-y-8 p-8 md:p-12">
              <BilingualHeading
                english={TIMELINE.titleEn}
                amharic={TIMELINE.titleAm}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <TimelineItem
                  icon={Calendar}
                  labelEn={TIMELINE.startEn}
                  labelAm={TIMELINE.startAm}
                  valueEn={CAMPAIGN_START.en}
                  valueAm={CAMPAIGN_START.am}
                />
                <TimelineItem
                  icon={Calendar}
                  labelEn={TIMELINE.endEn}
                  labelAm={TIMELINE.endAm}
                  valueEn={CAMPAIGN_END.en}
                  valueAm={CAMPAIGN_END.am}
                />
                <TimelineItem
                  icon={Hammer}
                  labelEn={TIMELINE.durationEn}
                  labelAm={TIMELINE.durationAm}
                  valueEn={`${CAMPAIGN_DURATION_DAYS} Days`}
                  valueAm={`${CAMPAIGN_DURATION_DAYS} ቀናት`}
                  highlight
                />
              </div>
            </CardContent>
          </Card>
        </Container>
      </SectionShell>

      <SectionShell className="bg-muted/20">
        <Container>
          <div className="mx-auto max-w-5xl space-y-8">
            <BilingualHeading
              english={POWER_IN_NUMBERS.titleEn}
              amharic={POWER_IN_NUMBERS.titleAm}
            />
            <div className="text-center">
              <p className="text-xl font-medium">{POWER_IN_NUMBERS.subtitleEn}</p>
              <p className="text-primary mt-2 text-lg font-medium">
                {POWER_IN_NUMBERS.subtitleAm}
              </p>
            </div>
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 md:p-12">
                <BilingualText
                  english={POWER_IN_NUMBERS.bodyEn}
                  amharic={POWER_IN_NUMBERS.bodyAm}
                />
              </CardContent>
            </Card>
          </div>
        </Container>
      </SectionShell>

      <SectionShell>
        <Container>
          <Card className="mx-auto max-w-4xl border-0 bg-primary/5 shadow-md">
            <CardContent className="space-y-6 p-8 text-center md:p-12">
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <MathBlock value={THE_MATH.total} />
                <span className="text-muted-foreground text-3xl font-light">÷</span>
                <MathBlock value={THE_MATH.people} />
                <span className="text-muted-foreground text-3xl font-light">=</span>
                <MathBlock value={THE_MATH.each} highlight />
              </div>
              <div className="space-y-2 pt-4">
                <p className="text-lg font-medium">{THE_MATH.taglineEn}</p>
                <p className="text-primary text-base font-medium">
                  {THE_MATH.taglineAm}
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </SectionShell>

      <SectionShell className="bg-muted/20">
        <Container>
          <div className="mx-auto max-w-5xl space-y-8">
            <BilingualHeading
              english={PARTICIPATE.titleEn}
              amharic={PARTICIPATE.titleAm}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <ParticipateCard
                icon={Hammer}
                titleEn={PARTICIPATE.optionOneTitleEn}
                titleAm={PARTICIPATE.optionOneTitleAm}
                bodyEn={PARTICIPATE.optionOneBodyEn}
                bodyAm={PARTICIPATE.optionOneBodyAm}
              />
              <ParticipateCard
                icon={Users2}
                titleEn={PARTICIPATE.optionTwoTitleEn}
                titleAm={PARTICIPATE.optionTwoTitleAm}
                bodyEn={PARTICIPATE.optionTwoBodyEn}
                bodyAm={PARTICIPATE.optionTwoBodyAm}
              />
            </div>
          </div>
        </Container>
      </SectionShell>

      <SectionShell>
        <Container>
          <div className="mx-auto max-w-3xl">
            <CampaignProgress />
          </div>
        </Container>
      </SectionShell>

      <SectionShell className="pb-24 md:pb-32">
        <Container>
          <Card className="mx-auto max-w-3xl border-0 shadow-md">
            <CardContent className="space-y-8 p-8 text-center md:p-12">
              <BilingualHeading
                english={DONATION_CTA.titleEn}
                amharic={DONATION_CTA.titleAm}
              />
              <ButtonLink href="/donate" size="lg" className="h-12 px-8 text-base">
                {DONATION_CTA.buttonEn}
              </ButtonLink>
              <p className="text-primary text-sm font-medium">
                {DONATION_CTA.buttonAm}
              </p>
            </CardContent>
          </Card>
        </Container>
      </SectionShell>
    </>
  );
}

function TimelineItem({
  icon: Icon,
  labelEn,
  labelAm,
  valueEn,
  valueAm,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  labelEn: string;
  labelAm: string;
  valueEn: string;
  valueAm: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 text-center ${
        highlight ? "border-primary/30 bg-primary/5" : "bg-card"
      }`}
    >
      <Icon className={`mx-auto mb-4 size-6 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {labelEn}
      </p>
      <p className="text-primary mt-1 text-xs font-medium">{labelAm}</p>
      <p
        className={`mt-4 text-xl font-semibold ${
          highlight ? "text-primary text-3xl" : ""
        }`}
      >
        {valueEn}
      </p>
      <p className="text-muted-foreground mt-1 text-sm">{valueAm}</p>
    </div>
  );
}

function MathBlock({
  value,
  highlight = false,
}: {
  value: string;
  highlight?: boolean;
}) {
  return (
    <p
      className={`text-2xl font-bold md:text-3xl ${
        highlight ? "text-primary md:text-4xl" : ""
      }`}
    >
      {value}
    </p>
  );
}

function ParticipateCard({
  icon: Icon,
  titleEn,
  titleAm,
  bodyEn,
  bodyAm,
}: {
  icon: React.ComponentType<{ className?: string }>;
  titleEn: string;
  titleAm: string;
  bodyEn: string;
  bodyAm: string;
}) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="space-y-4 p-8">
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
          <Icon className="size-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{titleEn}</h3>
          <p className="text-primary mt-1 font-medium">{titleAm}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <p className="text-muted-foreground leading-relaxed">{bodyEn}</p>
          <p className="text-muted-foreground leading-relaxed md:border-l md:border-border md:pl-6">
            {bodyAm}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
