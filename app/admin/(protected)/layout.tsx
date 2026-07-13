import { AdminLayout } from "@/components/admin/admin-layout";
import { requireAuth } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuth();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}

export async function generateMetadata() {
  return {
    title: "Admin",
  };
}
