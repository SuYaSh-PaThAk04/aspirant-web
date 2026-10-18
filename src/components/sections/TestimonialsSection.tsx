"use client";

/**
 * TestimonialsSection
 * Social proof section with review carousel, star ratings, app store badges,
 * and CTA download buttons. Auto-advances with pause-on-hover.
 */
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

// Inline SVG component for the exact purple star color matching your design
const PurpleStar = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="var(--brand)"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const AppleIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 16 20"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.0567 10.2004C13.0837 13.106 15.6056 14.0729 15.6336 14.0852C15.6122 14.1533 15.2306 15.4631 14.3049 16.8159C13.5046 17.9856 12.6741 19.1509 11.3657 19.175C10.0801 19.1987 9.66673 18.4127 8.19692 18.4127C6.72756 18.4127 6.26826 19.1509 5.0513 19.1987C3.7884 19.2466 2.82667 17.934 2.01981 16.7686C0.37101 14.3849 -0.889014 10.0327 0.80288 7.09499C1.64338 5.63608 3.14541 4.71224 4.77573 4.68855C6.01587 4.6649 7.18638 5.52288 7.94452 5.52288C8.70219 5.52288 10.1246 4.49108 11.62 4.64261C12.246 4.66867 14.0033 4.89549 15.1316 6.54713C15.0407 6.6035 13.0349 7.77119 13.0567 10.2004ZM10.6405 3.06557C11.311 2.25397 11.7623 1.12416 11.6392 0C10.6727 0.0388433 9.50408 0.644017 8.81087 1.45517C8.18962 2.17348 7.64554 3.32317 7.79234 4.42508C8.86956 4.50843 9.97003 3.87768 10.6405 3.06557Z" />
  </svg>
);

const PlaystoreIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 17 18"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.954 8.60203L11.911 5.64503L2.36 0.277035C1.727 -0.0649652 1.134 -0.112965 0.614 0.261035L8.954 8.60203ZM12.415 12.064L15.489 10.335C16.089 9.99903 16.418 9.52304 16.418 8.99504C16.418 8.46803 16.089 7.99103 15.49 7.65503L12.707 6.09203L9.574 9.22404L12.415 12.064ZM0.0999999 0.988035C0.0359999 1.18503 0 1.40503 0 1.64603V16.351C0 16.732 0.0840001 17.06 0.236 17.321L8.333 9.22303L0.0999999 0.988035ZM8.954 9.84303L0.902 17.896C1.056 17.955 1.222 17.986 1.397 17.986C1.709 17.986 2.034 17.894 2.365 17.71L11.62 12.513L8.954 9.84303Z" />
  </svg>
);

interface TestimonialsSectionProps {
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  className = "",
}) => {
  const [count, setCount] = useState(0);
  const [pinCodeCount, setPinCodeCount] = useState(0);
  const [showExecutionPhone, setShowExecutionPhone] = useState(false);
  const proofSectionRef = useRef<HTMLDivElement | null>(null);

  const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=in.aspirantadda.app";
  const APP_STORE_URL =
    "https://apps.apple.com/in/app/aspirant-adda-upsc-community/id6747092407";

  const testimonials = [
    {
      name: "Rohan Sharma",
      exam: "UPSC Aspirant",
      city: "Delhi",
      image: "/indian images person/pexels-mouli-ghosh-615183603-17394327 1.png",
      text: "Mentors on Aspirant Adda actually reply. My GS doubts get cleared the same day, and the feed stays focused on prep — no distractions.",
      rating: 5,
    },
    {
      name: "Rahul Mehta",
      exam: "SSC CGL",
      city: "Ahmedabad",
      image: "/indian images person/atul-kumar-8OikdXQa1vE-unsplash 1.png",
      text: "Course reviews helped me avoid wasting money. I compared options, asked seniors, and enrolled with confidence.",
      rating: 5,
    },
    {
      name: "Gurpreet Singh",
      exam: "State PCS",
      city: "Chandigarh",
      image: "/indian images person/pexels-ketut-subiyanto-4307869 1.png",
      text: "1v1 quizzes keep me consistent. Competing with peers daily has improved my speed and accuracy more than solo mock tests.",
      rating: 5,
    },
    {
      name: "Aman Verma",
      exam: "Banking",
      city: "Jaipur",
      image: "/indian images person/usman-yousaf-yIOViGQmjJ4-unsplash 1.png",
      text: "Great community quality. No spam — just preparation-focused conversations, peer accountability, and practical study planning.",
      rating: 5,
    },
    {
      name: "Arjun Nair",
      exam: "UPSC",
      city: "Kochi",
      image: "/indian images person/pexels-wanderinglenses-19958868 1.png",
      text: "Curated resources inside the app saved me weeks of searching. Everything feels built for serious exam prep.",
      rating: 4,
    },
    {
      name: "Vikram Patel",
      exam: "Railway Exams",
      city: "Surat",
      image: "/indian images person/pexels-d67-hunter-2154822929-36535613 1.png",
      text: "From doubt solving to mentor sessions, this is the most structured aspirant community I have used.",
      rating: 5,
    },
  ];

  // Duplicate testimonials array 6 times to create a seamless infinite scroll loop
  const extendedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  // Statistics Counters
  useEffect(() => {
    if (!showExecutionPhone) return;

    const target = 50000;
    const durationMs = 2200;
    const intervalMs = 16;
    const steps = Math.ceil(durationMs / intervalMs);
    const increment = target / steps;
    let current = 0;

    const timer = window.setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        window.clearInterval(timer);
        return;
      }
      setCount(Math.floor(current));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [showExecutionPhone]);

  useEffect(() => {
    if (!showExecutionPhone) return;

    const target = 3000;
    const durationMs = 2200;
    const intervalMs = 16;
    const steps = Math.ceil(durationMs / intervalMs);
    const increment = target / steps;
    let current = 0;

    const timer = window.setInterval(() => {
      current += increment;
      if (current >= target) {
        setPinCodeCount(target);
        window.clearInterval(timer);
        return;
      }
      setPinCodeCount(Math.floor(current));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [showExecutionPhone]);

  // Phone Image Intersection Observer
  useEffect(() => {
    const node = proofSectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowExecutionPhone(true);
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <section
      className={`relative w-full overflow-hidden bg-white px-4 pb-10 pt-12 sm:px-6 md:pb-12 md:pt-20 lg:px-8 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 0%, rgba(79,70,229,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1240px]">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12 sm:items-start sm:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft/80 px-3.5 py-1.5">
            <div className="flex items-center gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <PurpleStar key={i} />
              ))}
            </div>
            <span className="font-body text-xs font-semibold text-brand sm:text-sm">
              4.8/5 from 50k+ aspirants
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
            Community Validated Success
          </h2>
          <p className="mt-3 max-w-[680px] font-body text-base font-normal leading-relaxed text-ink-muted md:mt-4 md:text-lg">
            Real reviews from serious aspirants across India who moved from
            scattered study groups to focused, high-intent preparation.
          </p>
        </div>

        <div className="relative w-full overflow-hidden pb-2 pt-2">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16"
            style={{
              background: "linear-gradient(90deg, #fff 0%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16"
            style={{
              background: "linear-gradient(270deg, #fff 0%, transparent 100%)",
            }}
          />

          <div className="flex w-max gap-5 animate-marquee-testimonials sm:gap-6">
            {extendedTestimonials.map((item, index) => (
              <article
                key={`testimonial-${index}`}
                className="group flex h-auto w-[300px] shrink-0 flex-col rounded-[1.5rem] border border-box-border bg-white p-5 shadow-[0_10px_30px_rgba(79,70,229,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_18px_40px_rgba(79,70,229,0.12)] sm:w-[340px] sm:p-6 md:w-[360px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-brand/20 ring-offset-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="truncate font-display text-base font-bold tracking-tight text-ink">
                        {item.name}
                      </p>
                      <p className="mt-0.5 truncate font-body text-xs font-medium text-ink-muted">
                        {item.exam} · {item.city}
                      </p>
                    </div>
                  </div>
                  <span
                    className="font-display text-3xl leading-none text-brand/25"
                    aria-hidden
                  >
                    ”
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <PurpleStar key={i} />
                  ))}
                </div>

                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-ink/80 line-clamp-5 md:text-[0.95rem]">
                  {item.text}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-box-border/80 pt-4">
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 font-body text-[11px] font-semibold uppercase tracking-wide text-brand">
                    Verified review
                  </span>
                  <span className="font-body text-xs font-medium text-ink-muted">
                    {item.rating}.0 / 5
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
        {/* =========================================
            BOTTOM STATS & DOWNLOAD SECTION 
        ========================================= */}
        <div
          ref={proofSectionRef}
          className="relative mx-auto mt-10 w-full max-w-[1040px] overflow-hidden rounded-[2rem] px-4 py-8 sm:mt-12 sm:px-8 sm:py-12"
        >
          {/* Soft brand wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem]"
            style={{
              background:
                "radial-gradient(ellipse 85% 70% at 50% 0%, rgba(79,70,229,0.16) 0%, rgba(238,242,255,0.7) 45%, transparent 78%)",
            }}
          />
          <div
            aria-hidden
            className={`love-float-orb pointer-events-none absolute left-[12%] top-16 -z-10 h-40 w-40 rounded-full blur-3xl ${
              showExecutionPhone ? "is-on" : ""
            }`}
            style={{ background: "rgba(79,70,229,0.18)" }}
          />
          <div
            aria-hidden
            className={`love-float-orb love-float-orb-b pointer-events-none absolute right-[10%] top-28 -z-10 h-48 w-48 rounded-full blur-3xl ${
              showExecutionPhone ? "is-on" : ""
            }`}
            style={{ background: "rgba(129,140,248,0.22)" }}
          />

          <div className="flex flex-col items-center text-center">
            <p
              className={`font-display text-[clamp(1.85rem,4.2vw,2.75rem)] font-bold leading-none tracking-tight ${
                showExecutionPhone ? "love-reveal love-reveal-1" : "love-hidden"
              }`}
            >
              <span style={{ color: "#4f46e5" }}>Aspirant</span>{" "}
              <span className="text-ink">Love</span>
            </p>
            <p
              className={`mt-3 max-w-xl font-body text-sm leading-relaxed text-ink-muted sm:text-base ${
                showExecutionPhone ? "love-reveal love-reveal-2" : "love-hidden"
              }`}
            >
              A growing community of serious aspirants preparing together —
              across cities, towns, and pin codes.
            </p>

            {/* Dual metric panels */}
            <div
              className={`mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-5 ${
                showExecutionPhone ? "" : "love-hidden"
              }`}
            >
              <div
                className={`love-metric-card relative overflow-hidden rounded-3xl border border-brand/20 bg-white/90 px-6 py-8 shadow-[0_18px_50px_rgba(79,70,229,0.1)] backdrop-blur-sm ${
                  showExecutionPhone ? "love-slide-left" : ""
                }`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/10"
                />
                <div
                  aria-hidden
                  className="love-shimmer pointer-events-none absolute inset-0"
                />
                <p
                  className={`font-display text-[clamp(2.75rem,8vw,4.25rem)] font-bold leading-none tracking-[-0.03em] text-[#4f46e5] ${
                    showExecutionPhone ? "love-counter-pop" : ""
                  }`}
                >
                  {count.toLocaleString("en-IN")}+
                </p>
                <p className="mt-3 font-display text-lg font-semibold text-ink">
                  Active Aspirants
                </p>
                <p className="mt-1 font-body text-sm text-ink-muted">
                  Learning, discussing &amp; progressing daily
                </p>
              </div>

              <div
                className={`love-metric-card relative overflow-hidden rounded-3xl border border-brand/20 bg-white/90 px-6 py-8 shadow-[0_18px_50px_rgba(79,70,229,0.1)] backdrop-blur-sm ${
                  showExecutionPhone ? "love-slide-right" : ""
                }`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-brand/10"
                />
                <div
                  aria-hidden
                  className="love-shimmer pointer-events-none absolute inset-0"
                />
                <p
                  className={`font-display text-[clamp(2.75rem,8vw,4.25rem)] font-bold leading-none tracking-[-0.03em] text-[#4f46e5] ${
                    showExecutionPhone ? "love-counter-pop" : ""
                  }`}
                  style={{ animationDelay: "140ms" }}
                >
                  {pinCodeCount.toLocaleString("en-IN")}+
                </p>
                <p className="mt-3 font-display text-lg font-semibold text-ink">
                  Pin Codes Covered
                </p>
                <p className="mt-1 font-body text-sm text-ink-muted">
                  Pan-India reach, one focused community
                </p>
              </div>
            </div>

            {/* Community avatars + rating */}
            <div
              className={`mt-7 flex w-full max-w-3xl flex-col items-center justify-between gap-5 rounded-3xl border border-brand/15 bg-white/80 px-5 py-5 shadow-[0_12px_36px_rgba(79,70,229,0.06)] backdrop-blur-sm sm:mt-8 sm:flex-row sm:px-7 ${
                showExecutionPhone ? "love-reveal love-reveal-4" : "love-hidden"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    "/indian images person/pexels-ketut-subiyanto-4307869 1.png",
                    "/indian images person/pexels-wanderinglenses-19958868 1.png",
                    "/indian images person/atul-kumar-8OikdXQa1vE-unsplash 1.png",
                    "/indian images person/usman-yousaf-yIOViGQmjJ4-unsplash 1.png",
                    "/indian images person/pexels-mouli-ghosh-615183603-17394327 1.png",
                  ].map((src, i) => (
                    <div
                      key={src}
                      className={`relative h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-brand-soft shadow-sm ring-1 ring-brand/10 ${
                        showExecutionPhone ? "love-avatar-pop" : "opacity-0"
                      }`}
                      style={{ animationDelay: `${480 + i * 90}ms`, zIndex: 5 - i }}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover object-top"
                      />
                    </div>
                  ))}
                  <div
                    className={`relative z-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#4f46e5] font-display text-xs font-bold text-white shadow-sm ${
                      showExecutionPhone ? "love-avatar-pop" : "opacity-0"
                    }`}
                    style={{ animationDelay: "930ms" }}
                  >
                    +50k
                  </div>
                </div>
                <p className="hidden text-left font-body text-sm font-medium text-ink-muted sm:block">
                  Joined by aspirants
                  <br />
                  across India
                </p>
              </div>

              <div className="flex flex-col items-center gap-1 sm:items-end">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5" aria-label="5 star rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={showExecutionPhone ? "love-star-pop" : "opacity-0"}
                        style={{ animationDelay: `${600 + i * 100}ms` }}
                      >
                        <PurpleStar />
                      </span>
                    ))}
                  </div>
                  <span className="font-display text-lg font-bold text-[#4f46e5]">
                    4.8/5
                  </span>
                </div>
                <p className="font-body text-sm font-medium text-ink-muted">
                  App Store &amp; Play Store
                </p>
              </div>
            </div>

            {/* Dense proof chips */}
            <div className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-3">
              {[
                "Free Mentorship",
                "Doubt Solving",
                "Trusted Resources",
                "Peer Discussions",
                "Live Quizzes",
                "Exam Focused",
              ].map((label, i) => (
                <span
                  key={label}
                  className={`love-chip inline-flex items-center justify-center rounded-2xl border border-brand/15 bg-white/90 px-3 py-3 text-center font-body text-xs font-semibold tracking-tight text-[#4f46e5] shadow-[0_8px_24px_rgba(79,70,229,0.05)] sm:px-4 sm:text-sm ${
                    showExecutionPhone ? "love-pill-in" : "love-hidden"
                  }`}
                  style={{ animationDelay: `${760 + i * 90}ms` }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee-testimonials {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.75rem)); }
        }

        .animate-marquee-testimonials {
          animation: marquee-testimonials 45s linear infinite;
        }

        .animate-marquee-testimonials:hover,
        .animate-marquee-testimonials:active,
        .animate-marquee-testimonials:focus {
          animation-play-state: paused;
        }

        .love-hidden {
          opacity: 0;
          transform: translateY(18px) scale(0.96);
        }

        @keyframes loveReveal {
          from { opacity: 0; transform: translateY(22px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .love-reveal {
          animation: loveReveal 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .love-reveal-1 { animation-delay: 40ms; }
        .love-reveal-2 { animation-delay: 120ms; }
        .love-reveal-4 { animation-delay: 280ms; }

        @keyframes loveSlideLeft {
          from { opacity: 0; transform: translateX(-36px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes loveSlideRight {
          from { opacity: 0; transform: translateX(36px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .love-slide-left {
          animation: loveSlideLeft 0.85s cubic-bezier(0.22, 1, 0.36, 1) 160ms both;
        }
        .love-slide-right {
          animation: loveSlideRight 0.85s cubic-bezier(0.22, 1, 0.36, 1) 240ms both;
        }

        .love-metric-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .love-metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 48px rgba(79, 70, 229, 0.16);
        }

        @keyframes loveShimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .love-shimmer {
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.45) 50%,
            transparent 60%
          );
          animation: loveShimmer 2.8s ease-in-out 1.2s infinite;
        }

        @keyframes loveCounterPop {
          0% { opacity: 0; transform: scale(0.7); filter: blur(6px); }
          55% { opacity: 1; transform: scale(1.08); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); }
        }
        .love-counter-pop {
          animation: loveCounterPop 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes loveStarPop {
          0% { opacity: 0; transform: scale(0.2) rotate(-28deg); }
          70% { opacity: 1; transform: scale(1.28) rotate(8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .love-star-pop {
          display: inline-flex;
          animation: loveStarPop 0.55s cubic-bezier(0.34, 1.45, 0.64, 1) both;
        }

        @keyframes loveAvatarPop {
          0% { opacity: 0; transform: scale(0.45) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .love-avatar-pop {
          animation: loveAvatarPop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes lovePillIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.88); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .love-pill-in {
          animation: lovePillIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .love-chip {
          transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
        }
        .love-chip:hover {
          transform: translateY(-2px);
          background-color: #eef2ff;
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.12);
        }

        .love-float-orb {
          opacity: 0;
        }
        .love-float-orb.is-on {
          opacity: 1;
          animation: loveOrbFloat 6s ease-in-out infinite;
        }
        .love-float-orb-b.is-on {
          animation-delay: 1.2s;
          animation-duration: 7.5s;
        }
        @keyframes loveOrbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          .love-reveal,
          .love-counter-pop,
          .love-star-pop,
          .love-avatar-pop,
          .love-pill-in,
          .love-slide-left,
          .love-slide-right,
          .love-shimmer,
          .love-float-orb.is-on {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `,
        }}
      />
    </section>

      {/* Transform Your Prep Journey — separate themed CTA */}
      <section
        className="relative w-full overflow-hidden pt-6 pb-0 md:pt-8 lg:pt-10"
        style={{
          background:
            "linear-gradient(135deg, #312e81 0%, #3730a3 35%, #4338ca 65%, #1e1b4b 100%)",
        }}
      >
        {/* Monument silhouette background — full image, no crop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] w-full"
        >
          <Image
            src="/transform-images/bg1.png"
            alt=""
            width={1919}
            height={478}
            sizes="100vw"
            className="h-auto w-full object-contain object-bottom"
          />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-end gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          {/* Left — product visual (flush to section bottom) */}
          <div className="relative mx-auto flex w-full max-w-[400px] items-end justify-center lg:mx-0 lg:max-w-[460px]">
            <Image
              src="/transform-images/transform-cta.png"
              alt="Aspirant Adda app on phone"
              width={920}
              height={1150}
              sizes="(max-width: 1024px) 400px, 460px"
              className="h-auto w-full object-contain object-bottom"
            />
          </div>

          {/* Right — copy + store buttons */}
          <div className="flex flex-col items-center pb-6 text-center sm:pb-8 lg:items-start lg:pb-10 lg:pl-4 lg:text-left">
            <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
              Start today
            </p>
            <h2
              className="font-display text-2xl font-bold leading-tight tracking-tight !text-white sm:text-3xl lg:text-4xl"
              style={{ color: "#ffffff" }}
            >
              Transform Your Prep Journey
            </h2>
            <p className="mt-3 max-w-[520px] font-body text-sm font-normal leading-relaxed text-white/85 sm:mt-4 sm:text-base lg:text-lg">
              Join thousands of serious aspirants who use Aspirant Adda to solve
              doubts, track progress, and move closer to selection every single
              day.
            </p>

            <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                variant="primary"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="!min-w-[180px] !bg-white !px-7 !py-3.5 !text-[#4f46e5] text-base font-bold shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform hover:!bg-white/95 hover:scale-105"
              >
                <PlaystoreIcon className="h-5 w-5" />
                Play Store
              </Button>
              <Button
                variant="outline"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="!min-w-[180px] !border-white !bg-transparent !px-7 !py-3.5 !text-white text-base font-bold transition-transform hover:!border-white hover:!bg-white/10 hover:!text-white hover:scale-105"
              >
                <AppleIcon className="h-5 w-5" />
                App Store
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
