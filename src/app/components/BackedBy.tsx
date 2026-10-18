/**
 * BackedBy
 * Partner/backer logos beneath the hero section.
 */
import Image from "next/image";

export default function BackedBy() {
  return (
    <div className="relative z-20 flex w-full flex-col items-center justify-center bg-white px-3 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-20 md:pb-16 md:pt-24">
      <span className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-brand sm:mb-8 sm:text-lg md:text-xl">
        Backed By
      </span>
      <div className="flex w-full max-w-4xl flex-nowrap items-center justify-center gap-3 sm:gap-10 md:gap-16 lg:gap-20">
        <div className="flex min-w-0 flex-1 justify-center sm:flex-none">
          <Image
            src="/backed-by/image 54.png"
            alt="DPIIT Logo"
            width={280}
            height={72}
            className="h-7 w-auto max-w-full object-contain sm:h-12 md:h-16 lg:h-[4.5rem]"
          />
        </div>
        <div className="flex min-w-0 flex-1 justify-center sm:flex-none">
          <Image
            src="/backed-by/image 55.png"
            alt="Tides Logo"
            width={260}
            height={72}
            className="h-7 w-auto max-w-full object-contain sm:h-12 md:h-16 lg:h-[4.5rem]"
          />
        </div>
        <div className="flex min-w-0 flex-1 justify-center sm:flex-none">
          <Image
            src="/backed-by/image 56.png"
            alt="Startup Haryana Logo"
            width={250}
            height={72}
            className="h-7 w-auto max-w-full object-contain sm:h-12 md:h-16 lg:h-[4.5rem]"
          />
        </div>
      </div>
    </div>
  );
}
