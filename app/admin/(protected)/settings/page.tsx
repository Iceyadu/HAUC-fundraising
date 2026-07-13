import { Bell, Church, Settings, Target } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CAMPAIGN_GOAL_ETB,
  CAMPAIGN_TITLE,
  CHURCH_NAME,
  CONTACT,
  formatEtb,
} from "@/lib/branding";

function maskSecret(value: string | undefined): string {
  if (!value) {
    return "Not configured";
  }

  if (value.length <= 8) {
    return "Configured";
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export default function AdminSettingsPage() {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Platform configuration and campaign details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Church className="size-5" />
              </div>
              <div>
                <CardTitle>Church Information</CardTitle>
                <CardDescription>Core organization details.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Church Name</p>
              <p className="text-muted-foreground">{CHURCH_NAME}</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium">Support Email</p>
              <p className="text-muted-foreground">{CONTACT.email}</p>
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-muted-foreground">{CONTACT.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Target className="size-5" />
              </div>
              <div>
                <CardTitle>Campaign Goal</CardTitle>
                <CardDescription>Current fundraising target.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Campaign</p>
              <p className="text-muted-foreground">{CAMPAIGN_TITLE}</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium">Goal Amount</p>
              <p className="text-muted-foreground">{formatEtb(CAMPAIGN_GOAL_ETB)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Bell className="size-5" />
              </div>
              <div>
                <CardTitle>Telegram Configuration</CardTitle>
                <CardDescription>
                  Server-side notification settings for new donations.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Bot Token</p>
              <p className="text-muted-foreground">{maskSecret(telegramBotToken)}</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium">Channel Chat ID</p>
              <p className="text-muted-foreground">{maskSecret(telegramChatId)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Settings className="size-5" />
              </div>
              <div>
                <CardTitle>Future Settings</CardTitle>
                <CardDescription>Reserved for upcoming admin controls.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Additional campaign controls, notification preferences, and export
              tools will be added here in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
