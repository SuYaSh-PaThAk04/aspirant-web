/**
 * BentoCards
 * Reusable bento grid card variants: FeatureCard, BentoCardHorizontal,
 * BentoCardVertical, and CoursesBentoCard. Each provides a distinct
 * layout for the homepage feature showcase grid.
 */
import React from "react";
import { BentoAnimation } from "@/components/animations/BentoAnimation";
import { PipelineAnimation } from "@/components/animations/PipelineAnimation";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

interface BentoCardHorizontalProps {
  title: string;
  description: string;
}

interface BentoCardVerticalProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

interface CoursesBentoCardProps {
  title: string;
  subtitle: string;
  description: string;
}

export function FeatureCard({
  title,
  subtitle,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="relative flex w-full min-h-[400px] flex-col justify-between overflow-hidden rounded-[32px] border border-box-border bg-box-bg p-6 md:p-8 lg:h-[400px]">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-brand">
          {title}
        </h3>
        <h4 className="mt-1 text-sm font-normal uppercase tracking-wide text-brand">
          {subtitle}
        </h4>
        <p className="mt-4 max-w-[320px] text-base leading-relaxed text-grey-1">
          {description}
        </p>
      </div>

      <div className="z-10 mt-4 flex items-end justify-end self-end">
        {icon}
      </div>
    </div>
  );
}

export function BentoCardHorizontal({
  title,
  description,
}: BentoCardHorizontalProps) {
  return (
    <div className="flex w-full min-h-[720px] flex-col items-start justify-between overflow-hidden rounded-[32px] border border-box-border bg-box-bg p-6 md:h-[824px] md:min-h-[824px] md:max-h-[824px] md:p-8 lg:row-span-2 lg:h-[824px] lg:max-h-[824px]">
      <div className="w-full">
        <h3 className="text-2xl font-bold tracking-tight text-brand">
          {title}
        </h3>
      </div>

      <div className="relative flex h-[550px] w-full flex-1 items-center justify-center md:h-[550px]">
        <PipelineAnimation />
      </div>

      <div className="mt-auto w-full">
        <p className="text-left text-base leading-relaxed text-grey-1">
          {description}
        </p>
      </div>
    </div>
  );
}

export function BentoCardVertical({
  title,
  subtitle,
  description,
  icon,
}: BentoCardVerticalProps) {
  return (
    <div className="relative flex w-full min-h-[400px] flex-col justify-between overflow-hidden rounded-[32px] border border-box-border bg-box-bg p-6 md:p-8 lg:h-[400px]">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-brand">
          {title}
        </h3>
        <h4 className="mt-1 text-sm font-normal uppercase tracking-wide text-brand">
          {subtitle}
        </h4>
        <p className="mt-4 max-w-[320px] text-base leading-relaxed text-grey-1">
          {description}
        </p>
      </div>

      <div className="z-10 mt-4 flex items-end justify-end self-end">
        <div className="relative flex h-[160px] w-[160px] items-center justify-center overflow-visible">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function CoursesBentoCard({
  title,
  subtitle,
  description,
}: CoursesBentoCardProps) {
  return (
    <div className="relative flex w-full min-h-[400px] flex-col justify-between overflow-hidden rounded-[32px] border border-box-border bg-box-bg p-6 md:p-8 lg:h-[400px]">
      <div>
        <h3 className="text-lg font-bold uppercase tracking-tight text-brand">
          {title}
        </h3>
        <h4 className="mt-1 text-sm font-normal uppercase tracking-wide text-brand">
          {subtitle}
        </h4>
        <p className="mt-4 max-w-[320px] text-base leading-relaxed text-grey-1">
          {description}
        </p>
      </div>

      <div className="z-10 mt-4 flex items-end justify-end self-end">
        <div className="relative flex h-[160px] w-[160px] origin-bottom scale-110 items-center justify-center overflow-visible">
          <BentoAnimation />
        </div>
      </div>
    </div>
  );
}
