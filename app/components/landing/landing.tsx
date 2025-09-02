"use client";

import React from "react";
import Image from "next/image";
import { InteractiveHoverButton } from "@/app/components/landing/ui/cta-button";
import { useRouter } from "next/navigation";

const Landing = () => {
  const router = useRouter();
  return (
    <div
      className="min-h-[640px] w-full relative overflow-hidden bg-transparent md:h-screen"
      style={{
        height: "100svh",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Gradient Background */}
      <Image
        src="/landing/gradient.svg"
        alt="Gradient Background"
        fill
        priority
        style={{
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
      {/* Gradient Background
      <Image
        src="/landing/gradient.svg"
        alt="Gradient Background"
        fill
        priority
        style={{
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none"
        }}
      /> */}
      {/* Main Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center z-10">
        {/* Main Heading with stroke - positioned above logo */}
        <div
          className="absolute md:top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 w-full max-w-screen-xl"
          style={{ zIndex: 10, top: "calc(28% + env(safe-area-inset-top, 0px))" }}
        >
          <h1 className="text-center text-hollow text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto mb-1 xs:mb-2 sm:mb-4">
            Turning what if
          </h1>
          <h1 className="text-center break-words hyphens-auto text-hollow text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
            into what&apos;s next
          </h1>
        </div>

        {/* Main logo positioned like rising sun from mountains - behind mountains */}
        <div
          className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-[8%]"
          style={{ zIndex: 1 }}
        >
          <div className="animate-floating" style={{ willChange: "transform" }}>
            <Image
              src="/landing/C2C Logo.svg"
              alt="Code2Create Main Logo"
              width={180}
              height={180}
              className="opacity-200 w-[40vw] h-[40vw] lg:w-[10vw] lg:h-[10vw] md:w-[20vw] md:h-[20vw] sm:w-[28vw] sm:h-[28vw] xs:w-[20vw] xs:h-[20vw]"
              priority
            />
          </div>
        </div>
        <style jsx global>{`
          @keyframes floating {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-18px);
            }
            100% {
              transform: translateY(0);
            }
          }
          .animate-floating {
            animation: floating 3s ease-in-out infinite;
          }
        `}</style>

        {/* Mountains background - moved up; darken with filter so colors read darker */}
        <div className="absolute bottom-0 left-0 w-full" style={{ zIndex: 5 }}>
          <Image
            src="/landing/footer-hills 1.png"
            alt="Mountain Background"
            width={1920}
            height={100}
            className="w-full h-auto object-cover"
            style={{
              maxHeight: "70vh",
              filter: "brightness(0.72) contrast(0.95)",
              minHeight: "180px",
            }}
            priority
          />
        </div>

        {/* Main tagline */}
        <div
          className="absolute left-1/2 -translate-x-1/2 px-4 w-full max-w-screen-xl flex flex-col items-center text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl bottom-[2%] md:bottom-[15%] lg:bottom-[15%] xl:bottom-[15%]"
          style={{ zIndex: 10 }}
        >
          {/* Top line */}
          <p className="tagline">Don&apos;t just code for the vibes, Code2Create.</p>

          {/* Reflected line (invisible on mobile to preserve layout height) */}
          <p className="tagline reflected-text mt-2 invisible sm:visible" aria-hidden="true">
            Don&apos;t just code for the vibes, Code2Create.
          </p>

          {/* Mobile CTA at bottom */}
          <div className="md:hidden mb-10">
            <InteractiveHoverButton
              variant="simple"
              onClick={() => router.push("/portal")}
              className="w-auto text-[12px] px-3 py-1.5 min-h-[32px] rounded-full font-semibold bg-black/50 hover:bg-black/60 text-white border border-white/30 backdrop-blur-sm transition-colors mb-2 mt-[-10%]"
            >
              Form your team
            </InteractiveHoverButton>
          </div>

          {/* CTA moved to app/page.tsx for better control on responsiveness and scroll behavior */}
        </div>

        {/* Footer text - left */}
        {/* <div className="absolute bottom-4 left-3 sm:bottom-6 sm:left-6 z-20">
          <p
            className="font-bold text-[10px] xs:text-[11px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-white leading-tight m-0"
            style={{
              fontFamily: "Trap-Bold, Arial, sans-serif",
            }}
          >
            We are not just another{" "}
            <span className="text-[#48BA86] font-bold">hackathon</span>
          </p>
          <p
            className="font-normal text-[10px] xs:text-[11px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-white leading-tight m-0"
            style={{
              fontFamily: "Trap-Bold, Arial, sans-serif",
            }}
          >
            We are the conspiracy that actually works
          </p>
        </div> */}

        {/* Footer text - right */}
        <div className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 text-right z-20">
          <p
            className="font-bold text-[10px] xs:text-[11px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-white leading-tight m-0"
            style={{
              fontFamily: "Trap-Bold, Arial, sans-serif",
            }}
          >
            Established in 2016
          </p>
          <p
            className="font-bold text-[10px] xs:text-[11px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-[#48BA86] leading-tight m-0"
            style={{
              fontFamily: "Trap-Bold, Arial, sans-serif",
            }}
          >
            Code2Create 6.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
