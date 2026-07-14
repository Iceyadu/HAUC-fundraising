import { Building2 } from "lucide-react";

import { CHURCH_BANK_ACCOUNTS } from "@/lib/payment-methods";

export function BankAccountInfo() {
  return (
    <div className="bg-primary/5 rounded-lg border border-primary/20 p-3 md:p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
          <Building2 className="size-3.5" />
        </div>
        <div className="min-w-0 text-left">
          <h3 className="text-sm font-semibold">Church Bank Accounts</h3>
          <p className="text-muted-foreground text-xs">
            የቤተክርስቲያኑ የባንክ ሂሳቦች · Pay in, then upload receipt
          </p>
        </div>
      </div>

      <ul className="grid gap-1.5 sm:grid-cols-2">
        {CHURCH_BANK_ACCOUNTS.map((account) => (
          <li
            key={account.value}
            className="bg-background rounded-md border px-2.5 py-2 text-left text-xs leading-snug"
          >
            <p className="font-medium">{account.bankName}</p>
            <p className="text-muted-foreground mt-0.5">
              {account.accountNumber}
              {account.reference ? ` · Ref ${account.reference}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
