"use client";

/**
 * WhyAspirantAdda
 * Three-column feature comparison panel explaining the platform's
 * core value propositions: peer-first, ad-free, and free at the core.
 */
import React from "react";

export default function WhyAspirantAdda() {
  const features = [
    {
      number: "01.",
      title: "Peer-first",
      description:
        "A network of verified high-achievers. Peer learning models demonstrate up to a 35% increase in academic retention compared to isolated study sessions.",
    },
    {
      number: "02.",
      title: "Ad-free forever",
      description:
        "Your focus is sacred. We enforce a strict 100% ad-free policy, removing coaching promotions and commercial feeds that break concentration.",
    },
    {
      number: "03.",
      title: "Free at the core",
      description:
        "Access to study logs, P2P groups, and chats is entirely free. Premium upgrades are strictly opt-in for deeper progress analytics.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1264px] px-4 py-12 md:py-16">
      {/* Header Context */}
      <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
        <h2 className="mb-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Why Aspirant Adda?
        </h2>
        <p className="px-2 font-body text-sm font-medium leading-relaxed text-ink-muted md:text-base">
          Learn The High-Intent Strategies Used By Top Educators To Decode
          Complex Subjects And Guarantee Selection.
        </p>
      </div>

      {/* Features Card Panel Container */}
      <div className="w-full bg-box-bg rounded-[32px] border border-box-border p-6 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-0">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col w-full lg:h-full justify-between"
            >
              <FeatureItem
                number={item.number}
                title={item.title}
                description={item.description}
                isLast={index === features.length - 1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureItemProps {
  number: string;
  title: string;
  description: string;
  isLast: boolean;
}

function FeatureItem({ number, title, description, isLast }: FeatureItemProps) {
  return (
    <div
      className={`relative flex flex-col justify-start h-full w-full 
      ${!isLast ? "pb-10 border-b border-box-border lg:border-b-0 lg:pb-0 lg:pr-12" : ""} 
      ${number === "02." ? "lg:px-12" : ""} 
      ${number === "03." ? "lg:pl-12" : ""}`}
    >
      {/* Numbers */}
      <span className="mb-3 block font-display text-xl font-bold tracking-tight text-brand md:mb-4 md:text-2xl">
        {number}
      </span>

      {/* Heading Title */}
      <h3 className="mb-4 font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
        {title}
      </h3>

      <p className="font-body text-base font-normal leading-relaxed text-ink-muted">
        {description}
      </p>

      {/* Vertical Borders Layout Context - Shows up exclusively on Desktop viewports between boxes */}
      {!isLast && (
        <div className="hidden lg:block absolute right-0 top-4 bottom-4 w-[1px] bg-box-border" />
      )}
    </div>
  );
}
