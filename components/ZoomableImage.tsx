"use client";

import Image, { type StaticImageData } from "next/image";
import { useLightbox } from "@/components/Lightbox";

type ZoomableImageProps = {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  decorative?: boolean;
};

export function ZoomableImage({
  src,
  alt,
  className = "",
  sizes,
  decorative = false,
}: ZoomableImageProps) {
  const { open } = useLightbox();

  return (
    <button
      type="button"
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : 0}
      onClick={(event) => open(src, alt, event.currentTarget)}
      className={`block cursor-zoom-in overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        draggable={false}
        className="h-full w-full select-none object-cover"
      />
    </button>
  );
}
