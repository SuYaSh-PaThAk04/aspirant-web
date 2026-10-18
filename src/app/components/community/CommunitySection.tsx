"use client";
import { useEffect, useRef } from "react";
import SectionHeader from "./SectionHeader";
import MembersGrid from "./MembersGrid";
import EducatorsBanner from "./EducatorsBanner";

export default function CommunitySection() {
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
    <section
      ref={sectionRef}
      className="section-reveal"
      style={{
        background: "#fff",
        padding: "80px 0",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeader />
        <MembersGrid />
        <EducatorsBanner />
      </div>
    </section>
  );
}