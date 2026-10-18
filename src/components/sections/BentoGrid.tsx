
import React from "react";
import {
  BentoCardHorizontal,
  FeatureCard,
  BentoCardVertical,
  CoursesBentoCard,
} from "@/components/sections/BentoCards";
import { AnimatedChatIcon } from "@/components/animations/AnimatedChatIcon";
import { AnimatedNetworkIcon } from "@/components/animations/AnimatedNetworkIcon";
import { QuizAnimation } from "@/components/animations/QuizAnimation";

export default function BentoGrid() {
  return (
    <div className="mx-auto w-full max-w-[1264px] px-4 pb-4 pt-16 md:pb-6">
      {/* Master Grid Container */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto">
        {/* Card 1: High Value Curated Feed */}
        <FeatureCard
          title="High Value Curated Feed"
          subtitle="10X FASTER CLARITY"
          description="Your Personalized Feed For Exam Updates, Peer Discussions, Mentor Guidance, And Daily Preparation Support."
          icon={<AnimatedChatIcon className="w-[150px] h-[150px] md:w-[120px] md:h-[120px]" />}
        />

        {/* Card 2: 1:1 Peer Support */}
        <FeatureCard
          title="1:1 Peer Support"
          subtitle="100% FOCUSED SUPPORT"
          description="Connect With Aspirants & Mentors For Faster Doubt Solving, Personal Guidance, And Peer Support."
          icon={<AnimatedNetworkIcon className="w-[280px] h-[180px] md:w-[200px] md:h-[120px]" />}
        />

        {/* Card 3: Pan India Network (Tall Column on Desktop) */}
        <BentoCardHorizontal
          title="Pan India Aspirant Network"
          description="From Fellow Aspirants To Seniors And Mentors; Find The Right People For Every Stage Of Your Preparation."
        />

        {/* Card 4: 1 vs 1 Live Quiz Battles (Wide row item on Desktop) */}
        <BentoCardVertical
          title="1 vs 1 Live Quiz Battles"
          subtitle="4X DAILY PRODUCTIVITY"
          description="Get Matched Instantly With Fellow Aspirants To Play Real-Time 1v1 Quiz Challenges."
          icon={<QuizAnimation className="w-[160px] h-[160px]" />}
        />

        <div id="courses">
          <CoursesBentoCard
            title="COURSES ADDA"
            subtitle="SMARTER COURSE DECISIONS"
            description="Compare Courses, Read Trusted Reviews, And Ask Questions Before Investing Your Time And Money."
          />
        </div>
      </div>
    </div>
  );
}

