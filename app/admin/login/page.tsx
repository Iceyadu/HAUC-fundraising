import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { CHURCH_NAME } from "@/lib/branding";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: `Sign in to the ${CHURCH_NAME} admin dashboard.`,
};

function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="mx-auto size-12 rounded-full" />
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default async function AdminLoginPage() {
  const user = await getUser();

  if (user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Container className="max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </Container>
    </div>
  );
}
