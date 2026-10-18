"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Side décor for hero — calm float, kept clear of headline + phones.
 * Objects with black baked backgrounds use mix-blend screen.
 * Mobile: small edge floaters only (no text overlap). Desktop sizes via md+.
 */
const floaters = [
  // LEFT cluster — tops via class so mobile can sit at edges, clear of copy
  {
    src: "/language/laptop.png",
    alt: "Laptop",
    className: "left-[3%] top-[12%] w-[56px] sm:w-[72px] md:left-[2%] md:top-[26%] md:w-[150px]",
    delay: "0s",
    duration: "6.8s",
    rotate: "-8deg",
    swing: "5deg",
    x: "8px",
    y: "-20px",
  },
  {
    src: "/language/hat.png",
    alt: "Graduation hat",
    className:
      "left-[4%] top-[22%] w-[36px] sm:w-[48px] md:left-[11%] md:top-[18%] md:w-[78px]",
    delay: "1.1s",
    duration: "7.4s",
    rotate: "12deg",
    swing: "-6deg",
    x: "-6px",
    y: "-14px",
  },
  {
    src: "/language/Hindi.png",
    alt: "Aspirant Adda in Hindi",
    className: "hidden left-[3%] top-[48%] w-[130px] xl:block",
    delay: "0.5s",
    duration: "8s",
    rotate: "-4deg",
    swing: "3deg",
    x: "10px",
    y: "-12px",
    blend: true,
  },
  {
    src: "/language/Tamil.png",
    alt: "Aspirant Adda in Tamil",
    className: "hidden left-[9%] top-[58%] w-[118px] xl:block",
    delay: "1.8s",
    duration: "7.6s",
    rotate: "3deg",
    swing: "-4deg",
    x: "-8px",
    y: "-16px",
    blend: true,
  },

  // RIGHT cluster
  {
    src: "/language/book.png",
    alt: "Book",
    className:
      "right-[3%] top-[14%] w-[52px] sm:w-[68px] md:right-[2%] md:top-[24%] md:w-[140px]",
    delay: "0.4s",
    duration: "7s",
    rotate: "6deg",
    swing: "-5deg",
    x: "-10px",
    y: "-22px",
    blend: true,
  },
  {
    src: "/language/Pen.png",
    alt: "Pen",
    className:
      "right-[4%] top-[24%] w-[30px] sm:w-[40px] md:right-[12%] md:top-[16%] md:w-[64px]",
    delay: "1.4s",
    duration: "6.5s",
    rotate: "-18deg",
    swing: "8deg",
    x: "6px",
    y: "-18px",
    blend: true,
  },
  {
    src: "/language/English.png",
    alt: "Aspirant Adda in English",
    className: "hidden right-[2%] top-[46%] w-[140px] xl:block",
    delay: "0.8s",
    duration: "7.8s",
    rotate: "4deg",
    swing: "-3deg",
    x: "-8px",
    y: "-14px",
    blend: true,
  },
  {
    src: "/language/Marathi.png",
    alt: "Aspirant Adda in Marathi",
    className: "hidden right-[8%] top-[56%] w-[120px] xl:block",
    delay: "1.6s",
    duration: "8.2s",
    rotate: "-3deg",
    swing: "4deg",
    x: "8px",
    y: "-12px",
    blend: true,
  },
] as const;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (el) {
      setTimeout(() => el.classList.add("visible"), 100);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center overflow-hidden section-reveal"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero-images/Hero-BG.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(40,30,130,0.35) 0%, rgba(30,20,110,0.25) 50%, rgba(20,10,80,0.6) 100%)",
          }}
        />
      </div>

      {floaters.map((item) => (
        <div
          key={item.src}
          className={`hero-floater pointer-events-none absolute z-[5] ${item.className}`}
          style={{
            ["--hero-rot" as string]: item.rotate,
            ["--hero-swing" as string]: item.swing,
            ["--hero-x" as string]: item.x,
            ["--hero-y" as string]: item.y,
            ["--hero-delay" as string]: item.delay,
            ["--hero-dur" as string]: item.duration,
          }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={300}
            height={300}
            className="h-auto w-full select-none object-contain"
            style={{
              filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.35))",
              ...("blend" in item && item.blend
                ? { mixBlendMode: "screen" as const }
                : {}),
            }}
          />
        </div>
      ))}

      <div className="relative z-20 mx-auto flex max-w-8xl flex-col items-center px-6 pb-12 pt-36 text-center">
        <h1
          className="mb-5 text-center leading-[120%] text-white"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 400,
            fontFamily: "var(--font-poppins)",
            letterSpacing: "0%",
            textShadow: "0 2px 24px rgba(0,0,0,0.25)",
          }}
        >
          <span style={{ color: "#ffffff" }}>India&apos;s First </span>
          <span style={{ fontWeight: 700, color: "#ffffff" }}>
            Social-Marketplace
          </span>
          <br />
          <span style={{ color: "#ffffff" }}>for </span>
          <span style={{ fontWeight: 700, color: "#ffffff" }}>Aspirants</span>
        </h1>

        <p
          className="mb-10 text-white/80"
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
          }}
        >
          Distraction-Free Platform for Learning &amp; Community
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://play.google.com/store/apps/details?id=in.aspirantadda.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{ background: "white" }}
          >
            <span>→</span> Join Now
          </a>
          <a
            href="/#become-mentor"
            className="flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
            style={{ background: "transparent", border: "none" }}
          >
            <span>→</span> Become a Mentor
          </a>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mb-[90px] mt-8 flex w-full max-w-5xl items-end justify-center gap-2 px-3 sm:mt-10 sm:gap-4 md:-mb-[210px] md:mt-auto md:gap-6 md:px-4">
        <div
          className="relative"
          style={{ width: "clamp(88px, 22vw, 260px)" }}
        >
          <div
            className="overflow-hidden rounded-[1.25rem] bg-black p-[3px] sm:rounded-[1.75rem] sm:p-[4px] md:rounded-[2.5rem] md:p-[6px]"
            style={{ transform: "translateY(10px)" }}
          >
            <Image
              src="/Hero-images/Left-Mob.jpg"
              alt="Webinars Screen"
              width={260}
              height={640}
              className="h-auto w-full rounded-[1rem] sm:rounded-[1.4rem] md:rounded-[2rem]"
            />
          </div>
        </div>

        <div
          className="relative z-10"
          style={{ width: "clamp(108px, 26vw, 320px)" }}
        >
          <div
            className="overflow-hidden rounded-[1.25rem] bg-black p-[3px] sm:rounded-[1.75rem] sm:p-[4px] md:rounded-[2.5rem] md:p-[6px]"
            style={{
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.6), 0 0 40px rgba(79,70,229,0.25)",
              transform: "translateY(0px)",
            }}
          >
            <Image
              src="/Hero-images/Mi-Mob.png"
              alt="Home Feed Screen"
              width={320}
              height={640}
              className="h-auto w-full rounded-[1rem] sm:rounded-[1.4rem] md:rounded-[2rem]"
            />
          </div>
        </div>

        <div
          className="relative"
          style={{ width: "clamp(88px, 22vw, 260px)" }}
        >
          <div
            className="overflow-hidden rounded-[1.25rem] bg-black p-[3px] sm:rounded-[1.75rem] sm:p-[4px] md:rounded-[2.5rem] md:p-[6px]"
            style={{ transform: "translateY(10px)" }}
          >
            <Image
              src="/Hero-images/Right-Mob.png"
              alt="Courses Screen"
              width={260}
              height={640}
              className="h-auto w-full rounded-[1rem] sm:rounded-[1.4rem] md:rounded-[2rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
