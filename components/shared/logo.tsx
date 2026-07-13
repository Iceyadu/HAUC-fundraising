import Image from "next/image";
import Link from "next/link";

import { CHURCH_LOGO, CHURCH_LOGO_ALT, CHURCH_NAME, CHURCH_SHORT_NAME } from "@/lib/branding";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 44,
  md: 56,
  lg: 80,
};

export function Logo({
  className,
  showText = true,
  size = "md",
}: LogoProps) {
  const dimension = sizeMap[size];

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <Image
        src={CHURCH_LOGO}
        alt={CHURCH_LOGO_ALT}
        width={dimension}
        height={dimension}
        className="size-auto shrink-0 rounded-full object-contain"
        style={{ width: dimension, height: dimension }}
        priority
      />
      {showText ? (
        <span className="max-w-[12rem] text-left text-sm leading-tight sm:max-w-none sm:text-base">
          {size === "sm" ? CHURCH_SHORT_NAME : CHURCH_NAME}
        </span>
      ) : null}
    </Link>
  );
}
