const BANK_NAMES = [
  "Telebirr",
  "Commercial Bank of Ethiopia",
  "Development Bank of Ethiopia",
  "Awash Bank",
  "Bank of Abyssinia",
  "Dashen Bank",
  "Wegagen Bank",
  "Hibret Bank",
  "Nib International Bank",
  "Cooperative Bank of Oromia",
  "Oromia Bank",
  "Lion International Bank",
  "Zemen Bank",
  "Enat Bank",
  "Berhan Bank",
  "Bunna Bank",
  "Abay Bank",
  "Addis International Bank",
  "Global Bank Ethiopia",
  "Tsehay Bank",
  "Hijra Bank",
  "ZamZam Bank",
  "Ahadu Bank",
  "Siinqee Bank",
  "Gadaa Bank",
  "Amhara Bank",
  "Omo Bank",
  "Sidama Bank",
  "Rammis Bank",
  "Siket Bank",
  "Shabelle Bank",
  "Tsedey Bank",
  "Goh Betoch Bank",
] as const;

function toPaymentSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const LEGACY_SLUG_TO_LABEL: Record<string, string> = {
  telebirr: "Telebirr",
  cbe: "Commercial Bank of Ethiopia",
  dashen: "Dashen Bank",
  awash: "Awash Bank",
  cash: "Cash",
};

for (const label of BANK_NAMES) {
  LEGACY_SLUG_TO_LABEL[toPaymentSlug(label)] = label;
}

export const PAYMENT_METHODS = BANK_NAMES.map((label) => ({
  value: label,
  label,
}));

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"];

export function normalizePaymentMethodForStorage(value: string): string {
  const method = PAYMENT_METHODS.find((item) => item.value === value);
  if (method) {
    return method.value;
  }

  return LEGACY_SLUG_TO_LABEL[value] ?? value;
}

export function getPaymentMethodLabel(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  return normalizePaymentMethodForStorage(value);
}

export function isAllowedPaymentMethod(value: string): boolean {
  return PAYMENT_METHODS.some((method) => method.value === value);
}
