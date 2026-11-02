"use client";

import Image, { type StaticImageData } from "next/image";
import { useLightbox } from "@/components/Lightbox";

type ZoomableImageProps = {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  /**
   * Looped clone: clickable, but hidden from assistive tech and skipped by the
   * keyboard. The original slide is the single announced control.
   */
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

  const image = (
    <Image
      src={src}
      alt={decorative ? "" : alt}
      sizes={sizes}
      draggable={false}
      className="h-full w-full select-none object-cover"
    />
  );

  if (decorative) {
    return (
      <div
        aria-hidden="true"
        onClick={(event) => open(src, alt, event.currentTarget)}
        className={`block cursor-zoom-in overflow-hidden ${className}`}
      >
        {image}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => open(src, alt, event.currentTarget)}
      className={`block cursor-zoom-in overflow-hidden ${className}`}
    >
      {image}
    </button>
  );
}
