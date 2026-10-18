"use client";
import { useEffect, useRef } from "react";

const points = [
  "Community-driven learning environment",
  "Trust-based mentor and peer connections",
  "Preparation support for multiple competitive exams",
];

function PointIcon() {
  return (
    <img
      src="/Footer/Pooint-img.png"
      alt="point"
      style={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0, marginTop: 2 }}
    />
  );
}

function WhySection() {
  return (
    <div className="flex flex-col justify-start pt-2">
      <h2
        style={{
          fontFamily: "var(--font-poppins)",
          fontWeight: 800,
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          color: "#111",
          marginBottom: "24px",
        }}
      >
        Why <span style={{ color: "#7063FF" }}>Aspirant Adda</span>?
      </h2>

      <div className="flex flex-col gap-4 mb-10">
        {points.map((point) => (
          <div key={point} className="flex items-start gap-3">
            <PointIcon />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.95rem",
                color: "#333",
                lineHeight: 1.6,
              }}
            >
              {point}
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex justify-center items-end"
        style={{ marginBottom: -200, position: "relative", zIndex: 0 }}
      >
        <img
          src="/Footer/Roll.png"
          alt="spiral"
          style={{
            width: "75%",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 32px rgba(112,99,255,0.18))",
          }}
        />
      </div>
    </div>
  );
}

function FourRectangles() {
  return (
    <div style={{ borderRadius: 20, overflow: "hidden" }}>
      <img
        src="/Footer/4-Rectangles.png"
        alt="4 rectangles"
        style={{ width: "80%", height: "80%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

function FootBanner() {
  return (
  <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 16,
        minHeight: 160,
        zIndex: 10,
        position: "relative",
        margin: "0 -24px", /* ← bleeds out of the 24px padding on both sides */
      }}
    >
      <img
        src="/Footer/Foot-Banner.png"
        alt="footer banner"
        style={{
          position: "absolute",
          inset: 0,
          width: "120%",
          height: "80%",
          objectFit: "cover",
        }}
      />
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ minHeight: 260, padding: "40px 16px" }}
      >
        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
            color: "#fff",
            marginBottom: 8,
          }}
        >
          UPSC, SSC, Railways &amp; More
        </h3>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.82)",
          }}
        >
          One platform supporting multiple government exam preparations.
        </p>
      </div>
    </div>
  );
}

export default function WhyAsprirantAdda() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

return (
  <section
    ref={sectionRef}
    className="section-reveal"
    style={{ background: "#fff", padding: "60px 0 0 0", overflow: "hidden", maxHeight: 800 }}
  >
    <div style={{ margin: "0 auto", padding: "0 24px" }}>
      <div
        className="grid grid-cols-1 md:grid-cols-2 mb-0"
        style={{ alignItems: "stretch" }}
      >
        <FourRectangles />
        <WhySection />
      </div>

      <FootBanner />
    </div>
  </section>
);
}