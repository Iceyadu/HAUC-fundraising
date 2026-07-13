import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import type { User } from "@/types";

interface AdminLayoutProps {
  user: User;
  children: React.ReactNode;
}

export function AdminLayout({ user, children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar className="hidden lg:flex" />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar user={user} />
        <main className="bg-muted/20 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
