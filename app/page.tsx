"use client";

import Landing from "./components/landing/landing";
import About from "./components/landing/about-c2c";
import Sponsors from "./components/landing/sponsors";
import FAQs from "./components/landing/faqs";
import Timeline from "./components/landing/timeline";
import AboutACM from "./components/landing/about-acm";
import Statistics from "./components/landing/statistics";
import Footer from "./components/landing/footer";
import TopBar from "./components/landing/top-bar";
import ViewportPortal from "@/components/viewport-portal";
import { useLayoutEffect } from "react";
import { InteractiveHoverButton } from "./components/landing/ui/cta-button";
import { useRouter } from "next/navigation";
import { StickyScroll } from "./components/landing/ui/sticky-scroll-reveal";
import Image from "next/image";
import GradientBG from "./components/landing/gradient-bg";
import DotGrid from "./components/landing/dot-grid";
import HeadingText from "./components/landing/HeadingText";
import Tracks from "./components/landing/tracks";
import { REGISTRATIONS_OPEN } from "@/lib/env";
import { RegisterModal, useModal } from "@/components/RegisterModal";


const TRACKS = [
  {
    number: 1,
    title: "I Can Do It Better",
    description:
      "Reimagine and improve widely used software by enhancing usability, adding desired features, or optimizing performance.",
    svgPath: "/tracks/CanDoBetter.svg",
  },
  {
    number: 2,
    title: "I Can Do It Better",
    description:
      "Reimagine and improve widely used software by enhancing usability, adding desired features, or optimizing performance.",
    svgPath: "/tracks/CanDoBetter.svg",
  },
  {
    number: 3,
    title: "Art Attack",
    description:
      "Build tools that reimagine creative expression through technologies that help create music, art, or media in new and exciting ways.",
    svgPath: "/tracks/Art_Attack.svg",
  },
  {
    number: 4,
    title: "Game Over",
    description:
      "Create experiences that redefine gaming through original games and technologies that improve gameplay, performance, or game development.",
    svgPath: "/tracks/Game_Over.svg",
  },
  {
    number: 5,
    title: "Digital Dawn",
    description:
      "Create solutions that uniquely solve Indian challenges at scale, focusing on affordable and inclusive technology for the next billion users.",
    svgPath: "/tracks/Digital_Dawn.svg",
  },
  {
    number: 6,
    title: "AI Solutions",
    description:
      "Build intelligent systems using RunPod's compute services to create practical and scalable AI solutions for real-world problems.",
    svgPath: "/tracks/ai_solutions.svg",
  },
];

const TRACKS_CONTENT = TRACKS.map((track) => ({
  title: track.title,
  description: track.description,
  content: (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      <Image
        src={track.svgPath}
        alt={`${track.title} illustration`}
        fill
        className="object-contain"
        priority={track.number === 1}
        loading={track.number === 1 ? "eager" : "lazy"}
      />
    </div>
  ),
}));

export default function Page() {
  // const router = useRouter();
  useLayoutEffect(() => {
    // ScrollSmoother.create({
    //   wrapper: '#smooth-wrapper',
    //   content: '#smooth-content',
    //   smooth: 1,
    // });
  }, []);
  const {openModal, isOpen, closeModal} = useModal();
  return (
    <div className="relative w-full">
      {/* Page-wide gradient background to unify section transitions */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0a0a0a] via-[#161616] to-[#0a0a0a]" />

      {/* Top Bar via React Portal to body to avoid GSAP transforms */}
      <ViewportPortal>
        <TopBar />
      </ViewportPortal>

      {/* Desktop Register CTA fixed to viewport via portal (mobile CTA stays in Landing) */}
      <ViewportPortal>
        <div className="hidden md:flex fixed left-1/2 -translate-x-1/2 bottom-[8%] z-[9999]">
          {REGISTRATIONS_OPEN ? (
            <InteractiveHoverButton
              onClick={openModal}
              className="w-[280px] text-lg px-5 py-2 min-h-[48px] rounded-full font-bold flex items-center justify-center bg-[#48BA86] hover:bg-[#3aa874] text-black border border-[#48BA86] transition-colors"
            >
              Register Now
            </InteractiveHoverButton>
          ) : (
            <span
              className="inline-block w-[280px] text-lg px-5 py-2 min-h-[48px] rounded-full font-bold text-white border border-white/30 bg-black/30 backdrop-blur-sm text-center"
              aria-live="polite"
            >
              Registrations opening soon
            </span>
          )}
        </div>
      </ViewportPortal>

      <RegisterModal
        isOpen={isOpen}
        onClose={closeModal}
        url="gravitas.vit.ac.in"
      />

      {/* Smooth scrolling content wrapper (GSAP ScrollSmoother) */}
      <div id="smooth-wrapper" className="relative z-0">
        <div id="smooth-content">
          {/* Landing - wrapped to overlay CTA on desktop */}
          <div className="relative">
            <Landing />
          </div>

          <div className="min-h-screen flex flex-col">
            <div id="about" className="flex-1 w-full">
              <About />
            </div>
          </div>

          <div className=" flex items-center justify-between flex-col">
            <AboutACM />
          </div>
          <div className=" flex items-center justify-between flex-col">
            <Statistics />
          </div>
          {/* <div className="h-screen flex items-center justify-between flex-col"> */}
          {/* <Bento /> */}
          {/* </div> */}
          <div id="tracks" className="relative w-full">
            {/* Mobile: use the original Tracks component */}
            <div className="lg:hidden">
              <Tracks />
            </div>

            {/* Desktop: GSAP sticky scroll version */}
            <div className="hidden lg:block">
              {/* Tall section to provide scroll height */}
              <div className="min-h-[300vh]">
                <GradientBG>
                  <div className="relative z-10">
                    <HeadingText text="Tracks" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 -z-10">
                    <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" className="h-full w-full" />
                  </div>

                  {/* Sticky scroll content */}
                  <div className="w-full max-w-[1080px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
                    <StickyScroll content={TRACKS_CONTENT} />
                  </div>
                </GradientBG>
              </div>
            </div>
          </div>
          {/* <div className="min-h-screen flex items-center justify-between flex-col">
            <Speaker />
          </div> */}
          <div id="timeline" className="h-screen flex items-center justify-between flex-col">
            <Timeline />
          </div>
          <div id="sponsors" className="min-h-screen flex items-center justify-between flex-col">
            <Sponsors />
          </div>
          <div id="faqs" className="flex items-center justify-between flex-col">
            <FAQs />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
