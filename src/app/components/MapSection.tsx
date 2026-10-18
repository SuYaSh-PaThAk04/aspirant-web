"use client";
import { useEffect, useRef } from "react";

const categories = [
  {
    label: "Freshers",
    description: "Start your preparation journey with the right guidance and peer support.",
    icon: "/Map-images/Head-img.png",
  },
  {
    label: "Seniors",
    description: "Share experiences, strategies, and help juniors navigate their exam path.",
    icon: "/Map-images/Head-img.png",
  },
  {
    label: "Mentors",
    description: "Guide aspirants with expert insights, structured plans, and real exam wisdom.",
    icon: "/Map-images/Head-img.png",
  },
  {
    label: "Officers",
    description: "Inspire the community by sharing real success stories and practical advice.",
    icon: "/Map-images/Head-img.png",
  },
];

export default function MapSection() {
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
    <section ref={sectionRef} className="relative py-0 section-reveal overflow-visible">
      <div className="w-full">
        <div className="flex flex-col md:flex-row" style={{ minHeight: 500 }}>

          {/* LEFT — light background */}
          <div
            className="relative flex-1 overflow-visible"
            style={{
              background: "linear-gradient(135deg, #f0eeff 0%, #e8e0ff 40%, #ddd6fe 100%)",
              minHeight: 600,
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 55%, rgba(79,70,229,0.1) 0%, transparent 65%)",
              }}
            />

            {/* Map — positioned so it bleeds over the right panel */}
            <div
              className="absolute animate-float"
              style={{
                zIndex: 30,
                /* shift it right so ~30% hangs over the purple side */
                left: "10%",
                top: "40%",
                transform: "translateY(-50%)",
                width: "110%",          /* wider than the column */
                filter: "drop-shadow(0 24px 60px rgba(55,48,163,0.45))",
              }}
            >
              <img
                src="/Map-images/Map.png"
                alt="India Map"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* RIGHT — purple panel */}
          <div
            className="relative flex flex-col justify-start flex-1 py-16 px-10 md:px-14"
            style={{
              background: "#7063FF",
              zIndex: 20,           /* sits above left bg, but map z-index:30 floats on top */
              overflow: "visible",
              
            }}
          >
            <div
              className="absolute top-0 right-0 pointer-events-none"
              style={{
                width: 300,
                height: 300,
                background:
                  "radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)",
    fontWeight: 400,
    fontFamily: "var(--font-poppins)",
    letterSpacing: "0%",
    textShadow: "0 2px 24px rgba(0,0,0,0.25)",
              }}
            />

            {/* Heading — pushed right so it doesn't clash with map overlap */}
            <h2
              className=" text-white leading-tight mb-5"
          style={{
              fontSize: "clamp(2.4rem, 6vw, 4rem)", 
               letterSpacing: "0%",
  }}          
            >
              Connecting Aspirants
              <br />
              Across India
            </h2>

            {/* Subtext */}
            <p
              className="mb-10 leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "0.95rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                paddingLeft: "clamp(80px, 12vw, 140px)",
              }}
            >
              A growing network of learners, mentors, and achievers from every
              corner of the country.
            </p>

            {/* 2×2 grid */}
            <div
              className="grid grid-cols-2 gap-x-8 gap-y-8"
              style={{ paddingLeft: "clamp(80px, 12vw, 140px)" }}
            >
              {categories.map((cat) => (
                <div key={cat.label} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={cat.icon}
                      alt={cat.label}
                     style={{ width: 36, height: 36, objectFit: "contain", transform: "rotate(270deg)" }}
                    />
                    <span
                      className=" text-white"
                      style={{
                        fontSize: "1.1rem",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.72)",
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}