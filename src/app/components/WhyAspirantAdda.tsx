"use client";
import { useEffect, useRef } from "react";

const reasons = [
  {
    icon: "🌐",
    title: "Community-Driven Learning",
    description: "Learn from peers who are on the same journey. Share notes, strategies, and insights.",
  },
  {
    icon: "📚",
    title: "Full-Stack Exam Coverage",
    description: "UPSC, SSC, Railways, Banking and more — all in one unified platform.",
  },
  {
    icon: "🎯",
    title: "Respected Mentors",
    description: "Get guidance from verified officers, toppers, and subject-matter experts.",
  },
];

// Decorative image grid placeholders
function ImageGrid() {
  const colors = [
    'linear-gradient(135deg, #7c3aed, #4c1d95)',
    'linear-gradient(135deg, #db2777, #7c3aed)',
    'linear-gradient(135deg, #0891b2, #7c3aed)',
    'linear-gradient(135deg, #059669, #0891b2)',
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {colors.map((bg, i) => (
        <div
          key={i}
          className="rounded-2xl relative overflow-hidden"
          style={{ height: i === 0 || i === 3 ? 160 : 120, background: bg }}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)' }}
          />
          <div className="absolute bottom-3 left-3">
            <div className="w-8 h-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)' }} />
          </div>
          {/* Floating 3d-ish element */}
          <div className="absolute top-3 right-3 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
            <div className="w-6 h-6 rounded-full" style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WhyAspirantAdda() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 section-reveal">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left - Image grid */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)', filter: 'blur(30px)' }} />
            <div className="relative z-10">
              <ImageGrid />
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(79,70,229,0.2)', color: 'var(--purple-glow)', border: '1px solid rgba(165,180,252,0.2)' }}>
              Why us?
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
              Why{" "}
              <span className="gradient-text">Aspirant Adda?</span>
            </h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              We built this platform because we know the exam journey can be lonely and overwhelming. Aspirant Adda brings together everything you need.
            </p>

            {/* Reasons list */}
            <div className="space-y-5">
              {reasons.map((reason, i) => (
                <div
                  key={reason.title}
                  className="flex items-start gap-4 p-4 rounded-xl group cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(79,70,229,0.12)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(165,180,252,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ background: 'rgba(79,70,229,0.2)' }}
                  >
                    {reason.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">{reason.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{reason.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}