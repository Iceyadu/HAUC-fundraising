import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/providers/app-providers";
import { CHURCH_LOGO, CHURCH_NAME } from "@/lib/branding";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: `${CHURCH_NAME} | Church Building Campaign`,
    template: `%s | ${CHURCH_NAME}`,
  },
  description:
    "Join the 52-day Nehemiah building campaign — together we will build God's house.",
  icons: {
    icon: CHURCH_LOGO,
    apple: CHURCH_LOGO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full`}>
      <body className="bg-background text-foreground min-h-full antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
