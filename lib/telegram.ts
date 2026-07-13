import { formatEtb, PAYMENT_METHODS } from "@/lib/branding";
import { getReceiptSignedUrl } from "@/lib/receipts";
import type { Donation } from "@/types/donation";

type TelegramConfig = {
  botToken: string;
  chatId: string;
};

type TelegramApiResponse = {
  ok: boolean;
  description?: string;
};

function getTelegramConfig(): TelegramConfig | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return null;
  }

  return { botToken, chatId };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getPaymentMethodLabel(value: string | null): string {
  if (!value) {
    return "—";
  }

  return PAYMENT_METHODS.find((method) => method.value === value)?.label ?? value;
}

function buildDonationMessage(donation: Donation): string {
  const lines = [
    "🏗️ <b>New Builder Contribution</b>",
    "",
    `<b>Name:</b> ${escapeHtml(donation.donor_name)}`,
    `<b>Phone:</b> ${escapeHtml(donation.phone)}`,
  ];

  if (donation.email) {
    lines.push(`<b>Email:</b> ${escapeHtml(donation.email)}`);
  }

  lines.push(
    `<b>Amount:</b> ${escapeHtml(formatEtb(donation.amount))}`,
    `<b>Payment:</b> ${escapeHtml(getPaymentMethodLabel(donation.payment_method))}`,
    `<b>Purpose:</b> ${escapeHtml(donation.purpose ?? "Church Building Project")}`,
    `<b>Status:</b> ${escapeHtml(donation.status)}`,
  );

  if (donation.message) {
    lines.push("", `<b>Message:</b> ${escapeHtml(donation.message)}`);
  }

  return lines.join("\n");
}

async function callTelegramApi(
  botToken: string,
  method: string,
  body: Record<string, unknown>,
): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as TelegramApiResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.description ?? `Telegram ${method} failed`);
  }
}

async function sendReceiptAttachment(
  config: TelegramConfig,
  donation: Donation,
  receiptPath: string,
): Promise<void> {
  const signedUrl = await getReceiptSignedUrl(receiptPath, 300);

  if (!signedUrl) {
    return;
  }

  const isPdf = receiptPath.toLowerCase().endsWith(".pdf");
  const method = isPdf ? "sendDocument" : "sendPhoto";
  const mediaKey = isPdf ? "document" : "photo";

  await callTelegramApi(config.botToken, method, {
    chat_id: config.chatId,
    [mediaKey]: signedUrl,
    caption: `Receipt · ${donation.donor_name}`,
  });
}

export async function notifyDonationReceived(
  donation: Donation,
  receiptPath: string,
): Promise<void> {
  const config = getTelegramConfig();

  if (!config) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured.",
      );
    }

    return;
  }

  await callTelegramApi(config.botToken, "sendMessage", {
    chat_id: config.chatId,
    text: buildDonationMessage(donation),
    parse_mode: "HTML",
  });

  try {
    await sendReceiptAttachment(config, donation, receiptPath);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[telegram] Receipt attachment failed:", error);
    }
  }
}
