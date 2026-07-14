export interface PaymentAccount {
  value: string;
  bankName: string;
  accountNumber: string;
  reference?: string;
  label: string;
}

export const CHURCH_BANK_ACCOUNTS: PaymentAccount[] = [
  {
    value: "Bank of Abyssinia: 1315 (Ref: 132532397)",
    bankName: "Bank of Abyssinia",
    accountNumber: "1315",
    reference: "132532397",
    label: "Bank of Abyssinia: 1315 (Ref: 132532397)",
  },
  {
    value: "Awash Bank: 01352574197600",
    bankName: "Awash Bank",
    accountNumber: "01352574197600",
    label: "Awash Bank: 01352574197600",
  },
  {
    value: "Commercial Bank of Ethiopia (CBE): 1000336186211",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000336186211",
    label: "Commercial Bank of Ethiopia (CBE): 1000336186211",
  },
  {
    value: "Commercial Bank of Ethiopia (CBE): 1315",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1315",
    label: "Commercial Bank of Ethiopia (CBE): 1315",
  },
  {
    value: "Berhan Bank: 2600260017823 (Ref: 5212)",
    bankName: "Berhan Bank",
    accountNumber: "2600260017823",
    reference: "5212",
    label: "Berhan Bank: 2600260017823 (Ref: 5212)",
  },
  {
    value: "Cooperative Bank of Oromia: 1059900033212",
    bankName: "Cooperative Bank of Oromia",
    accountNumber: "1059900033212",
    label: "Cooperative Bank of Oromia: 1059900033212",
  },
  {
    value: "Cooperative Bank of Oromia: 7776",
    bankName: "Cooperative Bank of Oromia",
    accountNumber: "7776",
    label: "Cooperative Bank of Oromia: 7776",
  },
];

export const PAYMENT_METHODS = CHURCH_BANK_ACCOUNTS.map((account) => ({
  value: account.value,
  label: account.label,
}));

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"];

const LEGACY_PAYMENT_LABELS: Record<string, string> = {
  telebirr: "Telebirr",
  cbe: "Commercial Bank of Ethiopia (CBE)",
  dashen: "Dashen Bank",
  awash: "Awash Bank",
  cash: "Cash",
  "Commercial Bank of Ethiopia": "Commercial Bank of Ethiopia (CBE)",
  "Bank of Abyssinia": "Bank of Abyssinia",
  "Berhan Bank": "Berhan Bank",
  "Cooperative Bank of Oromia": "Cooperative Bank of Oromia",
};

export function normalizePaymentMethodForStorage(value: string): string {
  const method = PAYMENT_METHODS.find((item) => item.value === value);
  if (method) {
    return method.value;
  }

  return LEGACY_PAYMENT_LABELS[value] ?? value;
}

export function getPaymentMethodLabel(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const method = PAYMENT_METHODS.find((item) => item.value === value);
  if (method) {
    return method.label;
  }

  return LEGACY_PAYMENT_LABELS[value] ?? value;
}

export function isAllowedPaymentMethod(value: string): boolean {
  return PAYMENT_METHODS.some((method) => method.value === value);
}
