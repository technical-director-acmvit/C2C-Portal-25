"use client";

import Landing from "./components/landing/landing";
import { signIn } from "next-auth/react";
import About from "./components/landing/about-c2c";
import QuotesBanner from "./components/landing/quotes-banner";
import Speaker from "./components/landing/speaker";
import Sponsors from "./components/landing/sponsors";
import FAQs from "./components/landing/faqs";
import Timeline from "./components/landing/timeline";
import AboutACM from "./components/landing/about-acm";
import Tracks from "./components/landing/tracks";
import Footer from "./components/landing/footer";
export default function Page() {
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
      <button
        onClick={() => signIn("google", { callbackUrl: "/portal" })}
        className="fixed bottom-6 right-3 px-4 py-2 rounded-md bg-[#48BA86] text-black font-semibold shadow-lg hover:opacity-90"
        style={{ zIndex: 50 }}
        aria-label="Apply Now"
      >
        Apply Now
      </button>
    </div>
  );
}
