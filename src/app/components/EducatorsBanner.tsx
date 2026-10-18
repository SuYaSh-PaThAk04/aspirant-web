"use client";
import { useEffect, useRef } from "react";

const educators = [
  { initials: "VK", name: "Vikas K.", subject: "History", color: "#7c3aed" },
  { initials: "RS", name: "Ravi S.", subject: "Polity", color: "#0891b2" },
  { initials: "AM", name: "Anjali M.", subject: "Geography", color: "#059669" },
  { initials: "PG", name: "Prashant G.", subject: "Economics", color: "#d97706" },
  { initials: "NB", name: "Neha B.", subject: "Science", color: "#db2777" },
];

export default function EducatorsBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 section-reveal">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="relative rounded-3xl overflow-hidden p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, #2d1b69 0%, #4c1d95 50%, #2d1b69 100%)',
            border: '1px solid rgba(165,180,252,0.25)',
            boxShadow: '0 0 60px rgba(79,70,229,0.3)',
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(165,180,252,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(79,70,229,0.4) 0%, transparent 50%)',
            }}
          />

          {/* Floating educator avatars */}
          <div className="flex justify-center gap-3 mb-6">
            {educators.map((edu, i) => (
              <div
                key={edu.initials}
                className="relative group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-2"
                  style={{
                    background: `linear-gradient(135deg, ${edu.color}, ${edu.color}88)`,
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: `0 0 16px ${edu.color}66`,
                  }}
                >
                  {edu.initials}
                </div>
                {/* Tooltip */}
                <div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-center whitespace-nowrap pointer-events-none px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(0,0,0,0.8)', color: 'white' }}
                >
                  {edu.name}
                  <br />
                  <span style={{ color: 'var(--purple-light)' }}>{edu.subject}</span>
                </div>
              </div>
            ))}
            {/* +more indicator */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.1)', border: '2px dashed rgba(165,180,252,0.4)', color: 'var(--purple-glow)' }}
            >
              +25
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
              ✨ Educators Community
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
              <span className="gradient-text-gold">30+</span> Educators Have Joined
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(165,180,252,0.8)' }}>
              Expert educators from top coaching institutes and IAS academies are already on the platform, sharing knowledge and guiding aspirants.
            </p>
            <button className="btn-primary px-8 py-3">
              Become an Educator →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}