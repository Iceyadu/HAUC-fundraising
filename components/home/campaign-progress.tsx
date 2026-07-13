import { Users } from "lucide-react";

import {
  BilingualHeading,
} from "@/components/shared/bilingual-text";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { formatEtb, getCampaignProgress } from "@/lib/branding";
import { PROGRESS } from "@/lib/campaign-content";

export function CampaignProgress() {
  const { goal, raised, remaining, progress, contributors } =
    getCampaignProgress();

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <BilingualHeading
          english={PROGRESS.titleEn}
          amharic={PROGRESS.titleAm}
          as="h2"
        />
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatBlock labelEn={PROGRESS.goalEn} labelAm={PROGRESS.goalAm} value={formatEtb(goal)} />
          <StatBlock
            labelEn={PROGRESS.raisedEn}
            labelAm={PROGRESS.raisedAm}
            value={formatEtb(raised)}
            highlight
          />
          <StatBlock
            labelEn={PROGRESS.remainingEn}
            labelAm={PROGRESS.remainingAm}
            value={formatEtb(remaining)}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="bg-muted h-3 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <Users className="text-primary size-4" />
          <span>
            <span className="font-semibold">{contributors}</span> {PROGRESS.buildersEn}
          </span>
          <span className="text-muted-foreground hidden sm:inline">·</span>
          <span className="text-primary hidden font-medium sm:inline">
            {PROGRESS.buildersAm}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function StatBlock({
  labelEn,
  labelAm,
  value,
  highlight = false,
}: {
  labelEn: string;
  labelAm: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 text-center ${
        highlight ? "bg-primary/5" : "bg-muted/40"
      }`}
    >
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {labelEn}
      </p>
      <p className="text-primary mt-1 text-xs font-medium">{labelAm}</p>
      <p
        className={`mt-3 text-2xl font-semibold ${
          highlight ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
