"use client";

import Landing from "./components/landing/landing";
import { signIn } from "next-auth/react";
import About from "./components/landing/about";
import Topper from "./components/landing/topper";
import Tracks from "./components/landing/tracks";
import Speaker from "./components/landing/speaker";import Sponsors from "./components/landing/sponsors";
import FAQs from "./components/landing/faqs";
import Timeline from "./components/landing/timeline";

export default function Page() {
  return (
    <>
      <Landing />

      

      <Topper text="About C2C" />
      

      <About />
      <Topper text="sponsor" />
      <Sponsors />
      <Topper text="timeline" />
      <Timeline />
      <Topper text="FAQs" />
      <FAQs />
      <button
        onClick={() => signIn('google', { callbackUrl: '/portal' })}
        className="fixed bottom-6 right-3 px-4 py-2 rounded-md bg-[#48BA86] text-black font-semibold shadow-lg hover:opacity-90"
        style={{ zIndex: 50 }}
        aria-label="Apply Now"
      >
        Apply Now
      </button>

      <Speaker />
      <Tracks />
      <About />
    </>
  );
}
