"use client";

import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/donations": "Donations",
  "/admin/donors": "Donors",
  "/admin/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/admin/donations/")) {
    return "Donation Details";
  }

  return pageTitles[pathname] ?? "Admin";
}

interface AdminTopbarProps {
  user: User;
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Unable to sign out. Please try again.");
      return;
    }

    window.location.href = "/admin/login";
  };

  return (
    <header className="bg-background flex h-16 items-center justify-between border-b px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin navigation</SheetTitle>
            </SheetHeader>
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-muted-foreground hidden text-sm sm:block">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-muted-foreground hidden max-w-[220px] truncate text-sm md:block">
          {user.email}
        </p>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
