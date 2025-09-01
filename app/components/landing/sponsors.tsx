"use client";

import Image from "next/image";
import React from "react";
import DotGrid from "./dot-grid";
import GradientBG from "./gradient-bg";
import HeadingText from "./HeadingText";

const SponsorCard: React.FC<{
  title?: string;
  role?: string;
  description?: string;
  logoSrc?: string;
}> = ({
  title = "Sponsor Name",
  role = "Title Sponsor",
  description,
  logoSrc,
}) => {
  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
      <div
        className="bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-5 lg:p-7 transition-all duration-300 hover:bg-black/40 hover:border-white/20"
        style={{ backdropFilter: "blur(8px)" }}
      >
        {/* Logo */}
        <div className="h-12 sm:h-16 lg:h-20 xl:h-24 rounded-lg mb-3 sm:mb-4 lg:mb-5 flex items-center justify-center bg-white/50 p-2 sm:p-3">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={`${title} logo`}
              width={200}
              height={100}
              className="max-w-full max-h-full object-contain filter brightness-100 contrast-100"
              style={{ maxWidth: "90%", maxHeight: "90%" }}
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full rounded-lg bg-[#4ade80]" />
          )}
        </div>
        <h3
          className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-1 sm:mb-2"
          style={{ fontFamily: '"Pilat Extended", Arial, sans-serif' }}
        >
          {title}
        </h3>
        <p
          className="text-gray-300 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 lg:mb-4"
          style={{ fontFamily: '"DM Sans", Arial, sans-serif' }}
        >
          {role}
        </p>
        <p
          className="text-gray-400 text-xs sm:text-sm lg:text-base leading-relaxed"
          style={{ fontFamily: '"DM Sans", Arial, sans-serif' }}
        >
          {description ??
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"}
        </p>
      </div>
    </div>
  );
};

const Sponsors = () => (
  <GradientBG>
    <div className="w-full min-h-screen relative overflow-hidden">
      <HeadingText text="Sponsors" />
      
      {/* DotGrid positioned behind the cards */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" />
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-3 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Content wrapper with minimal spacing */}
          <div className="pt-2 sm:pt-8 md:pt-12 lg:pt-16 pb-2 sm:pb-6 md:pb-8 lg:pb-12">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 justify-center items-center lg:items-stretch">
              <SponsorCard
                title="Runpod"
                role="GPU Cloud Platform Sponsor"
                description="Runpod is a GPU cloud platform that makes high-performance computing simple, affordable, and scalable. Built by developers, for developers, it enables users to launch on-demand GPU instances in just a few clicks and create autoscaling serverless endpoints to run AI models in production. Trusted by over 300,000 developers worldwide, Runpod powers the training, deployment, and scaling of AI/ML workloads, seamlessly bridging experimentation and real-world applications."
                logoSrc="/landing/runpod.svg"
              />
              {/* Uncomment when adding more sponsors */}
              {/* <SponsorCard
                title="ElevenLabs"
                role="AI Audio Technology Sponsor"
                description="ElevenLabs is an AI Audio research and deployment company creating models that generate realistic, versatile, and context-aware speech and sound. Their technology powers audiobooks, news articles, video games, film pre-production, social media, and advertising. It also restores voices for those who've lost them and supports accessibility needs - reshaping how people create, experience, and interact with sound."
                logoSrc="/landing/elevenlabs-logo-black.svg"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </GradientBG>
);

export default Sponsors;
