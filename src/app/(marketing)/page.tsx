import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import BackedBy from "@/app/components/BackedBy";
import BentoGrid from "@/components/sections/BentoGrid";
import PhoneFanSection from "@/components/sections/PhoneFanSection";
import { ExpertMasterclassesSection } from "@/components/sections/ExpertMasterclassesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Footer } from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "Aspirant Adda – India's First Social-Marketplace for Aspirants",
  },
  description:
    "Connect, learn, and grow with 50,000+ aspirants preparing for UPSC, SSC, Railways and more.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--purple-deep)] font-body">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="glow-orb animate-glow-pulse" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)", top: "-10%", left: "-10%" }} />
        <div className="glow-orb animate-glow-pulse" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(67,56,202,0.2) 0%, transparent 70%)", bottom: "20%", right: "-5%", animationDelay: "1.5s" }} />
        <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(55,48,163,0.15) 0%, transparent 70%)", top: "50%", left: "40%" }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <BackedBy />
        <section className="relative z-10 bg-white">
          <BentoGrid />
          <PhoneFanSection />
        </section>
        <ExpertMasterclassesSection />
        <section className="relative z-10 bg-white">
          <TestimonialsSection />
        </section>
        <Footer />
      </div>
    </main>
  );
}
