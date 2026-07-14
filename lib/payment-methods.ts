export interface PaymentAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  reference?: string;
}

/** Bank names allowed in the donation form dropdown (matches Supabase constraint). */
export const PAYMENT_METHOD_NAMES = [
  "Telebirr",
  "Bank of Abyssinia",
  "Awash Bank",
  "Commercial Bank of Ethiopia (CBE)",
  "Berhan Bank",
  "Cooperative Bank of Oromia",
] as const;

const PAYMENT_METHOD_STORAGE_VALUES: Record<
  (typeof PAYMENT_METHOD_NAMES)[number],
  string
> = {
  "Telebirr": "Telebirr",
  "Bank of Abyssinia": "Bank of Abyssinia",
  "Awash Bank": "Awash Bank",
  "Commercial Bank of Ethiopia (CBE)": "Commercial Bank of Ethiopia",
  "Berhan Bank": "Berhan Bank",
  "Cooperative Bank of Oromia": "Cooperative Bank of Oromia",
};

export const PAYMENT_METHODS = PAYMENT_METHOD_NAMES.map((name) => ({
  value: PAYMENT_METHOD_STORAGE_VALUES[name],
  label: name,
}));

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"];

export const CHURCH_BANK_ACCOUNTS: PaymentAccount[] = [
  {
    id: "boa-1315",
    bankName: "Bank of Abyssinia",
    accountNumber: "1315",
    reference: "132532397",
  },
  {
    id: "awash-01352574197600",
    bankName: "Awash Bank",
    accountNumber: "01352574197600",
  },
  {
    id: "cbe-1000336186211",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000336186211",
  },
  {
    id: "cbe-1315",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1315",
  },
  {
    id: "berhan-2600260017823",
    bankName: "Berhan Bank",
    accountNumber: "2600260017823",
    reference: "5212",
  },
  {
    id: "cbo-1059900033212",
    bankName: "Cooperative Bank of Oromia",
    accountNumber: "1059900033212",
  },
  {
    id: "cbo-7776",
    bankName: "Cooperative Bank of Oromia",
    accountNumber: "7776",
  },
];

const STORAGE_TO_LABEL: Record<string, string> = Object.fromEntries(
  PAYMENT_METHODS.map((method) => [method.value, method.label]),
);

const LEGACY_PAYMENT_LABELS: Record<string, string> = {
  telebirr: "Telebirr",
  cbe: "Commercial Bank of Ethiopia (CBE)",
  dashen: "Dashen Bank",
  awash: "Awash Bank",
  cash: "Cash",
  "Bank of Abyssinia: 1315 (Ref: 132532397)": "Bank of Abyssinia",
  "Awash Bank: 01352574197600": "Awash Bank",
  "Commercial Bank of Ethiopia (CBE): 1000336186211":
    "Commercial Bank of Ethiopia (CBE)",
  "Commercial Bank of Ethiopia (CBE): 1315": "Commercial Bank of Ethiopia (CBE)",
  "Berhan Bank: 2600260017823 (Ref: 5212)": "Berhan Bank",
  "Cooperative Bank of Oromia: 1059900033212": "Cooperative Bank of Oromia",
  "Cooperative Bank of Oromia: 7776": "Cooperative Bank of Oromia",
};

export function normalizePaymentMethodForStorage(value: string): string {
  const method = PAYMENT_METHODS.find(
    (item) => item.value === value || item.label === value,
  );

  if (method) {
    return method.value;
  }

  if (value in PAYMENT_METHOD_STORAGE_VALUES) {
    return PAYMENT_METHOD_STORAGE_VALUES[
      value as (typeof PAYMENT_METHOD_NAMES)[number]
    ];
  }

  return LEGACY_PAYMENT_LABELS[value] ?? value;
}

export function getPaymentMethodLabel(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const normalized = normalizePaymentMethodForStorage(value);
  return STORAGE_TO_LABEL[normalized] ?? LEGACY_PAYMENT_LABELS[value] ?? value;
}

export function isAllowedPaymentMethod(value: string): boolean {
  const normalized = normalizePaymentMethodForStorage(value);
  return PAYMENT_METHODS.some((method) => method.value === normalized);
}
