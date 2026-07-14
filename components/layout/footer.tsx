import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { CHURCH_NAME, CONTACT } from "@/lib/branding";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Donate", href: "/donate" },
  { label: "About", href: "/about" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card">
      <Container className="py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Together we will build God&apos;s house — a 52-day Nehemiah
              campaign to raise 50,000,000 ETB for our new church building.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">Contact</p>
            <div className="text-muted-foreground space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                {CONTACT.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                {CONTACT.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                {CONTACT.address}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">Quick Links</p>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-muted-foreground text-center text-sm">
          © {new Date().getFullYear()} {CHURCH_NAME}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
