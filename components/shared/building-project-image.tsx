import Image from "next/image";

import {
  BUILDING_PROJECT_ALT,
  BUILDING_PROJECT_IMAGE,
} from "@/lib/branding";
import { cn } from "@/lib/utils";

interface BuildingProjectImageProps {
  className?: string;
  imageClassName?: string;
  showCaption?: boolean;
  priority?: boolean;
}

export function BuildingProjectImage({
  className,
  imageClassName,
  showCaption = true,
  priority = false,
}: BuildingProjectImageProps) {
  return (
    <figure className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-2xl bg-card shadow-md">
        <Image
          src={BUILDING_PROJECT_IMAGE}
          alt={BUILDING_PROJECT_ALT}
          width={640}
          height={640}
          priority={priority}
          className={cn("h-auto w-full object-cover", imageClassName)}
        />
      </div>
      {showCaption ? (
        <figcaption className="text-muted-foreground mt-3 text-center text-sm">
          New church building project plan
        </figcaption>
      ) : null}
    </figure>
  );
}
