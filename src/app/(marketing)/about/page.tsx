import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { WhatsAppFloat } from "@/components/marketing/WhatsAppFloat";

export const metadata: Metadata = {
  title: { absolute: "About Us – Aspirant Adda" },
  description:
    "Learn more about Aspirant Adda's mission to connect aspirants across India through community-driven learning for UPSC and competitive exams.",
  alternates: {
    canonical: "/about",
  },
};

const threeLs = [
  {
    title: "Loneliness",
    dot: "#facc15",
    stat: "70%",
    statLabel: "people between 19-29 yrs of age report anxiety",
    description: (
      <>
        Many <strong>aspirants</strong> feel lonely during exam prep. This
        chronic loneliness increases risks of{" "}
        <strong>depression, anxiety,</strong> and{" "}
        <strong>unhealthy behaviors.</strong>
      </>
    ),
  },
  {
    title: "Learning Gap",
    dot: "#6366f1",
    stat: "90%",
    statLabel: "students do not receive mentorship",
    description: (
      <>
        Most aspirants <strong>struggle</strong> to find proper guidance due to
        a <strong>fragmented course-selling marketplace</strong> and{" "}
        <strong>trust issues</strong> stemming from manufactured influence.
      </>
    ),
  },
  {
    title: "Livelihood",
    dot: "#22c55e",
    stat: "51%",
    statLabel: "of Graduates not Employable",
    description: (
      <>
        Most of <strong>Plan B learners</strong> in India are not{" "}
        <strong>job ready</strong>, highlighting a major{" "}
        <strong>upskilling gap</strong>.
      </>
    ),
  },
] as const;

const standFor = [
  "We're building a digital operating system for India's Aspirant Economy—connecting aspirants with the community, guidance, and opportunities they need to succeed.",
  "From social learning and AI-powered preparation to study tools and career opportunities, Aspirant Adda exists to solve three challenges every aspirant faces: Loneliness, Learning Gap, and Livelihood.",
];

function WarningIcon() {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4f46e5] text-white"
      aria-hidden
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M8 1.5 1.5 13.5h13L8 1.5Zm0 3.2c.4 0 .7.35.66.75l-.3 3.4a.66.66 0 0 1-1.32 0l-.3-3.4A.67.67 0 0 1 8 4.7Zm0 7.05a.85.85 0 1 1 0-1.7.85.85 0 0 1 0 1.7Z" />
      </svg>
    </span>
  );
}

function ThreeLCard({
  title,
  dot,
  stat,
  statLabel,
  description,
}: {
  title: string;
  dot: string;
  stat: string;
  statLabel: string;
  description: ReactNode;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl bg-[#c7d2fe]"
      />
      <div className="relative rounded-xl border border-[#e0e7ff] bg-white p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <WarningIcon />
          <h3 className="font-display text-base font-bold text-ink sm:text-lg">
            {title}
          </h3>
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: dot }}
            aria-hidden
          />
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-3 sm:gap-4">
          <div className="min-w-[4.5rem] sm:min-w-[5.5rem]">
            <p className="font-display text-3xl font-bold leading-none text-ink sm:text-4xl">
              {stat}
            </p>
            <p className="mt-1.5 max-w-[7.5rem] font-body text-[0.65rem] leading-snug text-ink/60 sm:text-xs">
              {statLabel}
            </p>
          </div>
          <p className="font-body text-xs leading-relaxed text-ink/70 sm:text-[0.8125rem]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-body text-ink">
      <Navbar variant="page" />

      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
          style={{
            background:
              "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 45%, #c7d2fe 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full blur-3xl"
            style={{ background: "rgba(79,70,229,0.18)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-0 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "rgba(129,140,248,0.28)" }}
          />

          <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-8">
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-[#4f46e5] sm:text-sm">
              Our story
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              About{" "}
              <span className="text-[#4f46e5]">Us</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-ink/65 sm:text-lg lg:text-xl">
              Learn more about our mission to connect aspirants across India
              through community-driven learning.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Who we <span className="text-[#4f46e5]">are?</span>
                </h2>
                <p className="mt-5 font-body text-base leading-relaxed text-ink/70 sm:text-lg">
                  Founded by Himanshu Poswal and Tushar Singla, Aspirant Adda is
                  India&apos;s first social platform built exclusively for
                  aspirants. Our mission is simple — to ensure that no aspirant
                  prepares alone.
                </p>
              </div>

              <div>
                <div className="relative min-h-[240px] overflow-hidden rounded-[1.75rem] sm:min-h-[280px]">
                  <Image
                    src="/founder/founder.jpeg"
                    alt="Founders of Aspirant Adda — Himanshu Poswal and Tushar Singla"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 520px"
                    priority
                  />
                </div>
                <p className="mt-4 text-center font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
                  Meet the <span className="text-[#4f46e5]">Founders</span>
                </p>
              </div>
            </div>

            {/* 3Ls */}
            <div className="relative mt-16 overflow-hidden rounded-[1.75rem] bg-[#f4f5ff] px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#c7d2fe]/70"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-[#c7d2fe]/50"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute right-8 top-8 h-28 w-28 rounded-full border border-[#c7d2fe]/40"
              />

              <h2 className="relative text-center font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[2rem]">
                3Ls To Know Why Indian Aspirants are Struggling?
              </h2>

              <div className="relative mt-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_minmax(200px,260px)_1fr] lg:gap-5">
                <div className="flex flex-col gap-5">
                  <ThreeLCard {...threeLs[0]} />
                  <ThreeLCard {...threeLs[1]} />
                </div>

                <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-ink shadow-lg lg:max-w-none">
                  <Image
                    src="/founder/mission.png"
                    alt="Stressed exam aspirant studying late with a tall stack of books"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 260px, 260px"
                  />
                </div>

                <div className="lg:flex lg:items-center">
                  <ThreeLCard {...threeLs[2]} />
                </div>
              </div>
            </div>

            {/* What we stand for */}
            <div className="mt-16 rounded-[1.75rem] border border-[#4f46e5]/10 bg-[#f8f9ff] p-7 sm:p-10 lg:p-12">
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                What We Stand For
              </h3>
              <div className="mt-6 space-y-4">
                {standFor.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-body text-[0.95rem] leading-relaxed text-ink/70 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Ready to prepare with your community?
              </h2>
              <p className="mx-auto mt-3 max-w-xl font-body text-sm text-ink/60 sm:text-base">
                Join thousands of aspirants already solving doubts, sharing
                strategies, and moving closer to selection together.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-[#4f46e5] px-7 py-3 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-[#4338ca]"
                >
                  Back to Home
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-[#4f46e5]/35 bg-white px-7 py-3 font-body text-sm font-semibold text-[#4f46e5] transition-colors hover:border-[#4f46e5] hover:bg-[#eef2ff]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
