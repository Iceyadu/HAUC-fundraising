import { cn } from "@/lib/utils";

interface BilingualHeadingProps {
  english: string;
  amharic: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function BilingualHeading({
  english,
  amharic,
  className,
  as: Tag = "h2",
}: BilingualHeadingProps) {
  return (
    <div className={cn("space-y-2 text-center", className)}>
      <Tag className="text-3xl font-semibold tracking-tight md:text-4xl">
        {english}
      </Tag>
      <p className="text-primary text-lg font-medium md:text-xl">{amharic}</p>
    </div>
  );
}

interface BilingualTextProps {
  english: React.ReactNode;
  amharic: React.ReactNode;
  className?: string;
  align?: "start" | "center";
}

export function BilingualText({
  english,
  amharic,
  className,
  align = "start",
}: BilingualTextProps) {
  return (
    <div
      className={cn(
        "grid gap-6 md:grid-cols-2 md:gap-0",
        align === "center" && "text-center md:text-left",
        className,
      )}
    >
      <div
        className={cn(
          "space-y-3 leading-relaxed",
          align === "center" && "md:text-left",
        )}
      >
        <p className="text-primary text-xs font-semibold tracking-widest uppercase">
          English
        </p>
        <div className="text-muted-foreground text-base md:text-lg">{english}</div>
      </div>
      <div
        className={cn(
          "space-y-3 leading-relaxed md:border-l md:border-border md:pl-8",
          align === "center" && "md:text-left",
        )}
      >
        <p className="text-primary text-xs font-semibold tracking-widest uppercase">
          አማርኛ
        </p>
        <div className="text-muted-foreground text-base md:text-lg">{amharic}</div>
      </div>
    </div>
  );
}

interface BilingualQuoteProps {
  english: string;
  referenceEn: string;
  amharic: string;
  referenceAm: string;
  className?: string;
}

export function BilingualQuote({
  english,
  referenceEn,
  amharic,
  referenceAm,
  className,
}: BilingualQuoteProps) {
  return (
    <div
      className={cn(
        "grid gap-8 md:grid-cols-2 md:gap-0",
        className,
      )}
    >
      <blockquote className="space-y-3 md:pr-8">
        <p className="text-xl leading-relaxed font-medium md:text-2xl">
          &ldquo;{english}&rdquo;
        </p>
        <footer className="text-primary text-sm font-medium">
          — {referenceEn}
        </footer>
      </blockquote>
      <blockquote className="space-y-3 md:border-l md:border-border md:pl-8">
        <p className="text-xl leading-relaxed font-medium md:text-2xl">
          &ldquo;{amharic}&rdquo;
        </p>
        <footer className="text-primary text-sm font-medium">
          — {referenceAm}
        </footer>
      </blockquote>
    </div>
  );
}

interface SectionShellProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionShell({ children, className, id }: SectionShellProps) {
  return (
    <section id={id} className={cn("py-16 md:py-20", className)}>
      {children}
    </section>
  );
}
