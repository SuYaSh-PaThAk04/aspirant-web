"use client";
import { useEffect, useRef } from "react";
import FeatureCard from "./FeatureCard"; // adjust path as needed

const features = [
  {
    title: "Learning",
    description:
      "Delivering secure, compliant, and scalable fintech platforms.",
    image: "/Feat-images/Learning.jpg",
  },
  {
    title: "Livelihood",
    description:
      "Delivering secure, compliant, and scalable fintech platforms.",
    image: "/Feat-images/Livelihood.jpg",
  },
  {
    title: "Loneliness",
    description:
      "Delivering secure, compliant, and scalable fintech platforms.",
    image: "/Feat-images/Loneliness.jpg",
  },
];

export default function FeaturesSection() {
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
    <section ref={sectionRef} className="relative py-24 bg-white section-reveal">
      <div className="max-w-5xl mx-auto px-6"
        style={{
    fontWeight: 500,
    fontFamily: "var(--font-poppins)",
    letterSpacing: "0%",
    fontSize:"48px"
  }}>

        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl leading-snug text-gray-900">
            Where aspirants talk,{" "}
            <span className="text-violet-400">connect, debate</span>
            {" "}—
            <br />
            and find{" "}
            <span className="text-violet-400">trusted guides.</span>
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"
          style={{
            fontWeight: 400,
            fontFamily: "var(--font-poppins)",
          }}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              image={feature.image}
            />
          ))}
        </div>

      </div>
    </section>
  );
}