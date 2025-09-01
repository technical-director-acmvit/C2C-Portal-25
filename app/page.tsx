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
// import Bento from "./components/landing/bento";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useLayoutEffect } from "react";


gsap.registerPlugin(ScrollTrigger, ScrollSmoother);



export default function Page() {
    useLayoutEffect(() => {
    ScrollSmoother.create({
      smooth: 1 // how long (in seconds) it takes to "catch up" to the native scroll position
    });
  }, []);
  return (
    <div className="relative w-full">
      {/* Page-wide gradient background to unify section transitions */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0a0a0a] via-[#161616] to-[#0a0a0a]" />

      <Landing />
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
      <div className="h-screen flex items-center justify-between flex-col">
        <Sponsors />
      </div>
      <div className="h-screen flex items-center justify-between flex-col">
        <FAQs />
      </div>
      
      <Footer />
    </div>
  );
}
