"use client";

/**
 * PhoneFanSection
 * Fan of five app screens: center appears first, others fan out from behind,
 * then screens rotate in serial order 1 → 2 → 3 → 4 → 5 with swipe transitions.
 */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ROTATE_MS = 2800;
const FAN_HOLD_MS = 450;
const FAN_DURATION_MS = 1200;
const SWIPE_MS = 950;
const CENTER_SLOT = 2;

const screenContent = [
  {
    src: '/Hero-images/Mi-Mob.png',
    alt: "Home feed screen",
    number: "1.",
    title: "Home Feed",
    description:
      "Experience preparation like never before — peer discussions, live quizzes, and trusted resources in one distraction-free app.",
  },
  {
    src: "/mobile-screens/post.png",
    alt: "Post screen",
    number: "2.",
    title: "Post",
    description:
      "Don't just study—contribute. Start a thread, spark a debate, or share a shortcut that could help thousands.",
  },
  {
    src: "/mobile-screens/quiz.png",
    alt: "Quiz screen",
    number: "3.",
    title: "Quiz",
    description:
      "Test your knowledge, get instant feedback, and level up your preparation with every quiz.",
  },
  {
    src: "/mobile-screens/message.png",
    alt: "Messages screen",
    number: "4.",
    title: "Messages",
    description:
      "No noise, just answers. Reach out to top-performers and peers instantly to keep your momentum going.",
  },
  {
    src: "/mobile-screens/courses.png",
    alt: "Courses screen",
    number: "5.",
    title: "Courses",
    description:
      "Stop searching and start studying. Get instant access to the best-vetted resources the community has to offer.",
  },
] as const;

const fanPositions = [
  { rotate: -22, x: "-128%", y: "10%", z: 1, scale: 0.86 },
  { rotate: -11, x: "-62%", y: "4%", z: 2, scale: 0.93 },
  { rotate: 0, x: "0%", y: "0%", z: 5, scale: 1.02 },
  { rotate: 11, x: "62%", y: "4%", z: 2, scale: 0.93 },
  { rotate: 22, x: "128%", y: "10%", z: 1, scale: 0.86 },
] as const;

const mobilePositions = [
  { rotate: -14, x: "-70%", z: 1, scale: 0.88 },
  { rotate: 0, x: "0%", z: 3, scale: 1 },
  { rotate: 14, x: "70%", z: 1, scale: 0.88 },
] as const;

type Phase = "idle" | "center" | "fanning" | "rotating";

function PhoneFrame({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-[#0a0a0a] p-[6px] shadow-[0_24px_60px_rgba(17,17,24,0.22)] sm:rounded-[1.75rem] sm:p-[7px]">
      <div className="pointer-events-none absolute -left-[2px] top-[18%] h-[28px] w-[2px] rounded-l-sm bg-[#2a2a2a]" />
      <div className="pointer-events-none absolute -left-[2px] top-[28%] h-[48px] w-[2px] rounded-l-sm bg-[#2a2a2a]" />
      <div className="pointer-events-none absolute -right-[2px] top-[24%] h-[56px] w-[2px] rounded-r-sm bg-[#2a2a2a]" />
      <div className="pointer-events-none absolute left-1/2 top-[11px] z-20 h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[#1c1c1c] ring-1 ring-black/40 sm:top-[13px]" />

      <div className="relative h-full w-full overflow-hidden rounded-[1.05rem] bg-white sm:rounded-[1.35rem]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 160px, 220px"
          className="object-cover object-top"
          priority={priority}
        />
      </div>
    </div>
  );
}

/** Slot for screen i when `active` is in the center (serial 1→5). */
function slotForScreen(screenIndex: number, active: number, count: number) {
  return (screenIndex - active + CENTER_SLOT + count) % count;
}

interface PhoneFanSectionProps {
  className?: string;
}

export default function PhoneFanSection({ className = "" }: PhoneFanSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [swipeKey, setSwipeKey] = useState(0);
  const count = screenContent.length;
  const fanned = phase === "fanning" || phase === "rotating";
  const rotating = phase === "rotating";
  const motionMs = rotating ? SWIPE_MS : FAN_DURATION_MS;
  const ease = rotating
    ? "cubic-bezier(0.33, 1, 0.68, 1)"
    : "cubic-bezier(0.22, 1, 0.36, 1)";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let fanTimer: number | undefined;
    let rotateReadyTimer: number | undefined;
    let started = false;

    const startIntro = () => {
      if (started) return;
      started = true;
      el.classList.add("visible");

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        setPhase("rotating");
        return;
      }

      setPhase("center");

      fanTimer = window.setTimeout(() => {
        setPhase("fanning");

        rotateReadyTimer = window.setTimeout(() => {
          setPhase("rotating");
        }, FAN_DURATION_MS + 80);
      }, FAN_HOLD_MS);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) startIntro();
        });
      },
      { threshold: 0.18 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (fanTimer) window.clearTimeout(fanTimer);
      if (rotateReadyTimer) window.clearTimeout(rotateReadyTimer);
    };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % count);
      setSwipeKey((k) => k + 1);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [rotating, count]);

  const centerScreen = screenContent[active];

  return (
    <section
      ref={sectionRef}
      className={`phone-fan-section relative w-full overflow-hidden bg-white pb-14 pt-4 font-body section-reveal md:pb-16 md:pt-6 lg:pb-20 ${className}`}
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center px-4 text-center">
        <h2 className="font-display text-[clamp(1.85rem,4.5vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-ink">
          <span className="text-brand">Aspirant</span>{" "}
          <span className="text-ink">Adda</span>
        </h2>
        <p className="mt-2 max-w-xl font-display text-[clamp(1.15rem,2.6vw,1.75rem)] font-semibold tracking-tight md:mt-3">
          <span className="text-brand">Clarify.</span>{" "}
          <span className="text-ink">Connect.</span>{" "}
          <span className="text-brand">Succeed.</span>
        </p>

        <div className="phone-fan relative mt-8 w-full max-w-[1320px] md:mt-10">
          {/* Desktop / tablet fan */}
          <div className="relative mx-auto hidden h-[420px] w-full sm:block md:h-[520px] lg:h-[580px]">
            {screenContent.map((screen, i) => {
              const slot = slotForScreen(i, active, count);
              const target = fanPositions[slot];
              const isCenter = i === active;
              const pos = fanned
                ? target
                : {
                    rotate: 0,
                    x: "0%",
                    y: isCenter ? "0%" : "2%",
                    z: isCenter ? 5 : 1,
                    scale: isCenter ? 1.02 : 0.94,
                  };
              // Stagger only on initial fan-open; rotation uses a unified swipe
              const delayMs =
                phase === "fanning" ? Math.abs(slot - CENTER_SLOT) * 70 : 0;

              return (
                <div
                  key={screen.alt}
                  className={`phone-fan-item absolute left-1/2 top-0 origin-bottom ${
                    rotating ? "phone-swipe-move" : ""
                  }`}
                  style={{
                    width: "clamp(150px, 17vw, 220px)",
                    height: "clamp(310px, 36vw, 460px)",
                    zIndex: pos.z,
                    opacity: phase === "idle" ? 0 : isCenter || fanned ? 1 : 0.55,
                    transform: `translateX(-50%) translateX(${pos.x}) translateY(${pos.y}) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                    transition: `transform ${motionMs}ms ${ease} ${delayMs}ms, opacity 0.5s ${ease} ${delayMs}ms, z-index 0s linear ${motionMs * 0.35}ms`,
                    willChange: "transform",
                  }}
                >
                  <PhoneFrame
                    src={screen.src}
                    alt={screen.alt}
                    priority={isCenter}
                  />
                </div>
              );
            })}
          </div>

          {/* Mobile: 3 visible slots */}
          <div className="relative mx-auto h-[360px] w-full max-w-[400px] overflow-hidden sm:hidden">
            {screenContent.map((screen, i) => {
              const slot = slotForScreen(i, active, count);
              if (fanned && (slot < 1 || slot > 3)) return null;

              const mobileSlot = fanned ? slot - 1 : 1;
              const target = mobilePositions[Math.min(Math.max(mobileSlot, 0), 2)];
              const isCenter = i === active;
              const pos = fanned
                ? target
                : {
                    rotate: 0,
                    x: "0%",
                    z: isCenter ? 3 : 1,
                    scale: isCenter ? 1 : 0.92,
                  };
              const delayMs =
                phase === "fanning" ? Math.abs(slot - CENTER_SLOT) * 70 : 0;

              return (
                <div
                  key={screen.alt}
                  className={`phone-fan-item absolute left-1/2 top-0 origin-bottom ${
                    rotating ? "phone-swipe-move" : ""
                  }`}
                  style={{
                    width: "155px",
                    height: "320px",
                    zIndex: pos.z,
                    opacity: phase === "idle" ? 0 : isCenter || fanned ? 1 : 0.45,
                    transform: `translateX(-50%) translateX(${pos.x}) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                    transition: `transform ${motionMs}ms ${ease} ${delayMs}ms, opacity 0.5s ${ease} ${delayMs}ms, z-index 0s linear ${motionMs * 0.35}ms`,
                    willChange: "transform",
                  }}
                >
                  <PhoneFrame
                    src={screen.src}
                    alt={screen.alt}
                    priority={isCenter}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Swipe description */}
        <div className="relative mt-8 w-full max-w-2xl overflow-hidden px-2 sm:mt-10">
          <div
            key={`${active}-${swipeKey}`}
            className="phone-desc-swipe flex min-h-[7.5rem] flex-col items-center justify-start sm:min-h-[6.5rem]"
          >
            <p className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-tight text-ink">
              <span className="text-brand">{centerScreen.number}</span>{" "}
              {centerScreen.title}
            </p>
            <p className="mt-3 font-display text-[clamp(1.05rem,2.4vw,1.35rem)] font-medium leading-snug tracking-tight text-ink">
              {centerScreen.description}
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .phone-fan-item:hover {
          filter: brightness(1.02);
        }

        @keyframes phoneDescSwipeIn {
          from {
            opacity: 0;
            transform: translateX(48px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .phone-desc-swipe {
          animation: phoneDescSwipeIn ${SWIPE_MS}ms cubic-bezier(0.33, 1, 0.68, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .phone-fan-item {
            transition: none !important;
          }
          .phone-desc-swipe {
            animation: none !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
