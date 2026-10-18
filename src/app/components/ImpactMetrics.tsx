"use client";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration: number = 2000, started: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);

  return count;
}

function MetricCard({ value, suffix, label, description, started }: {
  value: number; suffix: string; label: string; description: string; started: boolean;
}) {
  const count = useCountUp(value, 2000, started);

  return (
    <div className="p-8 text-center flex flex-col items-center" style={{ background: "transparent" }}>
      <div
        style={{
             fontSize: "clamp(2.4rem, 6vw, 4rem)",  
    fontWeight: 400,
    fontFamily: "var(--font-poppins)",
    letterSpacing: "0%",
          color: "#7063FF",
          marginBottom: "8px",
        }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div
        style={{
          fontFamily: "var(--font-poppins)",
          fontWeight: 600,
          fontSize: "1.5rem",
          color: "#111",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "0.95rem",
          color: "#6b7280",
          lineHeight: 1.6,
        }}
      >
        {description}
      </div>
    </div>
  );
}

export default function ImpactMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            setStarted(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 section-reveal"
      style={{ background: "#eef0f8",
          fontFamily: "var(--font-poppins)",
           fontWeight: 800,
           fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
       }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            style={{
              color: "#111",
            }}
          >
            Impact Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            value={50000}
            suffix="+"
            label="Aspirants"
            description="A thriving learner community preparing together."
            started={started}
          />
          <MetricCard
            value={1000}
            suffix="+"
            label="Daily Discussions"
            description="Active doubt solving, debates, and peer learning every day."
            started={started}
          />
        </div>
      </div>
    </section>
  );
}