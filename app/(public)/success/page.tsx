import { ArrowLeft, CheckCircle2, Home } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function SuccessPage() {
  return (
    <Container className="py-16 md:py-24">
      <Card className="mx-auto max-w-2xl border-0 shadow-md">
        <CardContent className="space-y-8 p-8 text-center md:p-12">
          <div className="bg-primary/10 text-primary mx-auto flex size-20 items-center justify-center rounded-full">
            <CheckCircle2 className="size-10" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Thank You
            </h1>
            <p className="text-primary text-xl font-semibold md:text-2xl">
              እናመስግናለን
            </p>
          </div>

          <div className="text-muted-foreground mx-auto max-w-md space-y-3 text-lg leading-relaxed">
            <p>Your contribution has been received.</p>
            <p>May God bless you.</p>
            <p>We&apos;ll verify your payment shortly.</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg" className="h-11 px-6">
              <Home className="size-4" />
              Return Home
            </ButtonLink>
            <ButtonLink href="/donate" variant="outline" size="lg" className="h-11 px-6">
              <ArrowLeft className="size-4" />
              Back to Donation Page
            </ButtonLink>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
