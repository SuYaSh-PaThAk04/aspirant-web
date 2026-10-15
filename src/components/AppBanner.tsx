"use client";

import { openInApp } from "@/components/OpenInApp";
import { ThemeImage } from "@/components/ThemeImage";

export function AppBanner({ tall = false }: { tall?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => openInApp()}
      className={`border-line relative aspect-[9/16] w-full overflow-hidden rounded-2xl border bg-sunken text-center shadow-sm lg:aspect-auto lg:w-full ${
        tall ? "lg:h-full" : "lg:h-[calc(50vh-3.125rem)]"
      }`}
    >
      <ThemeImage
        alt="Connecting Aspirants"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </button>
  );
}
