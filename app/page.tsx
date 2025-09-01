"use client";

import Landing from "./components/landing/landing";
import About from "./components/landing/about-c2c";
// import QuotesBanner from "./components/landing/quotes-banner";
// import Speaker from "./components/landing/speaker";
import Sponsors from "./components/landing/sponsors";
import FAQs from "./components/landing/faqs";
import Timeline from "./components/landing/timeline";
import AboutACM from "./components/landing/about-acm";
import Tracks from "./components/landing/tracks";
import Footer from "./components/landing/footer";
import TopBar from "./components/landing/top-bar";
import ViewportPortal from "@/components/viewport-portal";
// import Bento from "./components/landing/bento";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useLayoutEffect } from "react";
import { InteractiveHoverButton } from "./components/landing/ui/cta-button";
import { signIn } from "next-auth/react";


gsap.registerPlugin(ScrollTrigger, ScrollSmoother);



export default function Page() {
    useLayoutEffect(() => {
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
    });
  }, []);
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
          <InteractiveHoverButton
            onClick={() => signIn("google", { callbackUrl: "/portal" })}
            className="w-[280px] text-lg px-5 py-2 min-h-[48px] rounded-full font-bold flex items-center justify-center bg-[#48BA86] hover:bg-[#3aa874] text-black border border-[#48BA86] transition-colors"
          >
            Register
          </InteractiveHoverButton>
        </div>
      </ViewportPortal>

      {/* Smooth scrolling content wrapper (GSAP ScrollSmoother) */}
      <div id="smooth-wrapper" className="relative z-0">
        <div id="smooth-content">
          {/* Landing - wrapped to overlay CTA on desktop */}
          <div className="relative">
            <Landing />
          </div>

          <div className="min-h-screen flex flex-col">
            <div className="flex-1 w-full">
              <About />
            </div>
          </div>

          <div className=" flex items-center justify-between flex-col">
            <AboutACM />
          </div>
          {/* <div className="h-screen flex items-center justify-between flex-col"> */}
            {/* <Bento /> */}
          {/* </div> */}
          <div className=" flex items-center justify-between flex-col">
            <Tracks />
          </div>
          {/* <div className="min-h-screen flex items-center justify-between flex-col">
            <Speaker />
          </div> */}
          <div className="h-screen flex items-center justify-between flex-col">
            <Timeline />
          </div>
          <div className="min-h-screen flex items-center justify-between flex-col">
            <Sponsors />
          </div>
          <div className="flex items-center justify-between flex-col">
            <FAQs />
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}
