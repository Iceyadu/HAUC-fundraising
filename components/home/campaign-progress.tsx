import { getPublicCampaignProgress } from "@/lib/donations";
import { PROGRESS } from "@/lib/campaign-content";

export async function CampaignProgress() {
  const { progress } = await getPublicCampaignProgress();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">{PROGRESS.titleEn}</h2>
        <p className="text-primary mt-1 text-lg font-medium">{PROGRESS.titleAm}</p>
        <p className="text-muted-foreground mt-2 text-sm">
          {PROGRESS.publicSubtitleEn}
        </p>
        <p className="text-muted-foreground text-sm">{PROGRESS.publicSubtitleAm}</p>
      </div>

      <div className="bg-muted h-4 overflow-hidden rounded-full shadow-inner">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Campaign progress"
        />
      </div>
    </div>
  );
}
