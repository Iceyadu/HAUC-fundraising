"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  CAMPAIGN_END,
  CAMPAIGN_END_AT,
  COUNTDOWN,
} from "@/lib/campaign-content";

interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeRemaining(endTimestamp: number): TimeRemaining {
  const total = Math.max(endTimestamp - Date.now(), 0);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { total, days, hours, minutes, seconds };
}

function CountdownUnit({
  value,
  labelEn,
  labelAm,
  large = false,
}: {
  value: number;
  labelEn: string;
  labelAm: string;
  large?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={
          large
            ? "text-primary text-7xl font-bold tabular-nums sm:text-8xl md:text-9xl"
            : "text-3xl font-bold tabular-nums sm:text-4xl"
        }
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className={
          large
            ? "text-muted-foreground mt-2 text-sm font-medium uppercase tracking-widest sm:text-base"
            : "text-muted-foreground mt-1 text-xs uppercase tracking-wide"
        }
      >
        {labelEn}
      </span>
      <span className="text-primary text-xs font-medium">{labelAm}</span>
    </div>
  );
}

export function CampaignCountdown() {
  const endTimestamp = new Date(CAMPAIGN_END_AT).getTime();
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeRemaining(endTimestamp));
    update();

    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [endTimestamp]);

  if (!timeLeft) {
    return (
      <Card className="mt-10 w-full max-w-4xl border-0 bg-primary/5 shadow-md">
        <CardContent className="p-8 md:p-12">
          <div className="bg-muted/60 mx-auto h-32 max-w-md animate-pulse rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  const hasEnded = timeLeft.total === 0;

  return (
    <Card className="mt-10 w-full max-w-4xl border-0 bg-primary/5 shadow-md">
      <CardContent className="space-y-8 p-8 text-center md:p-12">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {hasEnded ? COUNTDOWN.endedEn : COUNTDOWN.titleEn}
          </h2>
          <p className="text-primary text-lg font-medium md:text-xl">
            {hasEnded ? COUNTDOWN.endedAm : COUNTDOWN.titleAm}
          </p>
          {!hasEnded ? (
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {COUNTDOWN.untilEn} · {CAMPAIGN_END.en}
            </p>
          ) : null}
          {!hasEnded ? (
            <p className="text-muted-foreground text-sm">
              {COUNTDOWN.untilAm} · {CAMPAIGN_END.am}
            </p>
          ) : null}
        </div>

        {!hasEnded ? (
          <>
            <CountdownUnit
              value={timeLeft.days}
              labelEn={COUNTDOWN.daysEn}
              labelAm={COUNTDOWN.daysAm}
              large
            />

            <div className="mx-auto grid max-w-xl grid-cols-3 gap-4 md:gap-8">
              <CountdownUnit
                value={timeLeft.hours}
                labelEn={COUNTDOWN.hoursEn}
                labelAm={COUNTDOWN.hoursAm}
              />
              <CountdownUnit
                value={timeLeft.minutes}
                labelEn={COUNTDOWN.minutesEn}
                labelAm={COUNTDOWN.minutesAm}
              />
              <CountdownUnit
                value={timeLeft.seconds}
                labelEn={COUNTDOWN.secondsEn}
                labelAm={COUNTDOWN.secondsAm}
              />
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
