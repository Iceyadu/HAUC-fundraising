"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  type DonationActionState,
  submitDonation,
} from "@/app/actions/donations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CAMPAIGN_PURPOSE,
  FIXED_CONTRIBUTION_ETB,
  formatEtb,
  PAYMENT_METHODS,
} from "@/lib/branding";
import { DONATION_PAGE } from "@/lib/campaign-content";
import { compressReceiptImage } from "@/lib/receipt-compression";
import { validateReceiptFile } from "@/lib/receipt-validation";
import { cn } from "@/lib/utils";
import type { Campaign } from "@/types";

const donationFormSchema = z.object({
  donorName: z.string().min(1, "Name or group name is required").max(120),
  donorPhone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Enter a valid phone number"),
  donorEmail: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  paymentMethod: z.string().min(1, "Select a payment method"),
  purpose: z.string(),
  message: z.string().max(500).optional(),
});

type DonationFormSchema = z.infer<typeof donationFormSchema>;

interface DonationFormProps {
  campaigns: Campaign[];
}

export function DonationForm({ campaigns }: DonationFormProps) {
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const form = useForm<DonationFormSchema>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      donorName: "",
      donorPhone: "",
      donorEmail: "",
      paymentMethod: "",
      purpose: CAMPAIGN_PURPOSE,
      message: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const [isCompressing, setIsCompressing] = useState(false);

  const onSubmit = async (values: DonationFormSchema) => {
    const receiptFile = receiptInputRef.current?.files?.[0] ?? null;
    const receiptValidationError = validateReceiptFile(receiptFile);

    if (receiptValidationError) {
      setReceiptError(receiptValidationError);
      return;
    }

    setReceiptError(null);

    let fileToUpload = receiptFile;

    if (receiptFile) {
      try {
        setIsCompressing(true);
        fileToUpload = await compressReceiptImage(receiptFile);
      } catch (error) {
        setReceiptError(
          error instanceof Error
            ? error.message
            : "Unable to compress the selected image.",
        );
        return;
      } finally {
        setIsCompressing(false);
      }

      const compressedValidationError = validateReceiptFile(fileToUpload);
      if (compressedValidationError) {
        setReceiptError(compressedValidationError);
        return;
      }
    }

    const formData = new FormData();
    formData.set("donorName", values.donorName);
    formData.set("donorPhone", values.donorPhone);
    formData.set("donorEmail", values.donorEmail ?? "");
    formData.set("paymentMethod", values.paymentMethod);
    formData.set("purpose", CAMPAIGN_PURPOSE);

    if (campaigns[0]?.id) {
      formData.set("campaignId", campaigns[0].id);
    }

    if (values.message) {
      formData.set("message", values.message);
    }

    if (fileToUpload) {
      formData.set("receipt", fileToUpload);
    }

    try {
      const result: DonationActionState = await submitDonation(
        { success: false, message: "" },
        formData,
      );

      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (field === "receipt" && messages?.[0]) {
            setReceiptError(messages[0]);
            continue;
          }

          if (messages?.[0]) {
            form.setError(field as keyof DonationFormSchema, {
              message: messages[0],
            });
          }
        }
      }

      if (!result.success) {
        toast.error(result.message);
      }
    } catch {
      // redirect() throws; navigation to /success is handled by Next.js
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Campaign Contribution</FormLabel>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <p className="text-primary text-4xl font-bold md:text-5xl">
              {formatEtb(FIXED_CONTRIBUTION_ETB)}
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-lg font-semibold">{DONATION_PAGE.cardTitleEn}</p>
              <p className="text-primary font-medium">{DONATION_PAGE.cardTitleAm}</p>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-muted-foreground text-sm">
                {DONATION_PAGE.cardSubtitleEn}
              </p>
              <p className="text-muted-foreground text-sm">
                {DONATION_PAGE.cardSubtitleAm}
              </p>
            </div>
          </div>
          <FormDescription>Fixed contribution amount for every builder.</FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="donorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name / Group Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder="Your name or group name"
                  disabled={isSubmitting || isCompressing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="donorPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+251 9XX XXX XXX"
                  disabled={isSubmitting || isCompressing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="donorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={isSubmitting || isCompressing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Payment Method <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Input readOnly disabled {...field} />
              </FormControl>
              <FormDescription>
                All contributions support the new church building project.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>
            Receipt Upload <span className="text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                ref={receiptInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                disabled={isSubmitting}
                aria-invalid={Boolean(receiptError)}
                className={cn(
                  "cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground",
                  receiptError && "border-destructive",
                )}
                onChange={() => setReceiptError(null)}
              />
            </div>
          </FormControl>
          <FormDescription className="flex items-center gap-1.5">
            <Upload className="size-3.5" />
            JPG, PNG, or PDF up to 5 MB. Large photos are compressed automatically.
          </FormDescription>
          {receiptError ? (
            <p className="text-destructive text-sm">{receiptError}</p>
          ) : null}
        </FormItem>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share a note of encouragement or prayer"
                  className="min-h-24 resize-none"
                  disabled={isSubmitting || isCompressing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className={cn("h-11 w-full text-base")}
          disabled={isSubmitting || isCompressing}
        >
          {isCompressing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Compressing image...
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Contribution"
          )}
        </Button>
      </form>
    </Form>
  );
}
