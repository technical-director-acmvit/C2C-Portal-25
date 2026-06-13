"use client";

import Landing from "./components/landing/landing";
import About from "./components/landing/about-c2c";
import Sponsors from "./components/landing/sponsors";
import FAQs from "./components/landing/faqs";
import Timeline from "./components/landing/timeline";
import AboutACM from "./components/landing/about-acm";
import Statistics from "./components/landing/statistics";
import Footer from "./components/landing/footer";
import Speaker from "./components/landing/speaker";
import TopBar from "./components/landing/top-bar";
import ViewportPortal from "@/components/viewport-portal";
import { useLayoutEffect, useEffect, useState, useCallback } from "react";
import { StickyScroll } from "./components/landing/ui/sticky-scroll-reveal";
import Image from "next/image";
import GradientBG from "./components/landing/gradient-bg";
import DotGrid from "./components/landing/dot-grid";
import HeadingText from "./components/landing/HeadingText";
import Tracks, { LANDING_TRACKS } from "./components/landing/tracks";
import ReturnAnnouncement from "./components/landing/return-announcement";
import PreRegistration from "./components/landing/pre-registration";
import PreRegSuccess from "./components/landing/pre-reg-success";

const PREREG_CACHE_KEY = "c2c-prereg-status";

const TRACKS_CONTENT = LANDING_TRACKS.map((track) => ({
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
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [preRegisterOpen, setPreRegisterOpen] = useState(false);
  const [preRegistered, setPreRegistered] = useState(false);
  const [successPlaying, setSuccessPlaying] = useState(false);

  // Restore the cached pre-registration status so the CTA stays "Pre-registered"
  // across reloads.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(PREREG_CACHE_KEY) === "done") {
        setPreRegistered(true);
      }
    } catch {
      // localStorage can throw in private mode — treat as not registered.
    }
  }, []);

  useLayoutEffect(() => {
    // ScrollSmoother.create({
    //   wrapper: '#smooth-wrapper',
    //   content: '#smooth-content',
    //   smooth: 1,
    // });
  }, []);

  const toggleUpcoming = useCallback(() => {
    setUpcomingOpen((current) => !current);
  }, []);

  const openPreRegister = useCallback(() => {
    setPreRegisterOpen(true);
  }, []);

  const closePreRegister = useCallback(() => setPreRegisterOpen(false), []);

  // Registration confirmed: cache the status, mark the CTA and hand off to the
  // success animation. The form stays mounted while the success scrim slowly
  // darkens over it (the ~2.4s crossfade in globals.css) and is only swapped
  // out once fully covered, so the page-to-page transition reads as one smooth
  // fade — by the time the scrim lifts, the CTA already says "Pre-registered".
  // The swap waits for the quiet hold after the facet docks (~4s) so its
  // re-render/scroll-lock churn can't jank the fly-in, but still lands before
  // the scrim starts lifting at ~5.5s.
  const handlePreRegSuccess = useCallback(() => {
    try {
      window.localStorage.setItem(PREREG_CACHE_KEY, "done");
    } catch {
      // Persisting is best-effort; the in-memory flag still drives this session.
    }
    setPreRegistered(true);
    setSuccessPlaying(true);
    window.setTimeout(() => setPreRegisterOpen(false), 4600);
  }, []);

  const handleSuccessDone = useCallback(() => setSuccessPlaying(false), []);

  // Lock body scroll while the pre-register flow or success animation is active
  useEffect(() => {
    if (typeof document === "undefined") return;
    const shouldLockScroll = preRegisterOpen || successPlaying;
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = shouldLockScroll ? "hidden" : previousBody || "";
    document.documentElement.style.overflow = shouldLockScroll ? "hidden" : previousHtml || "";
    return () => {
      document.body.style.overflow = previousBody || "";
      document.documentElement.style.overflow = previousHtml || "";
    };
  }, [preRegisterOpen, successPlaying]);

  // Surface the upcoming toggle to the (portal-rendered) TopBar nav item
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => toggleUpcoming();
    window.addEventListener("c2c:open-upcoming", handler);
    return () => window.removeEventListener("c2c:open-upcoming", handler);
  }, [toggleUpcoming]);

  const shellClass = [
    "relative w-full c2c-page-shell",
    upcomingOpen ? "is-upcoming-open" : "",
    preRegisterOpen ? "is-prereg-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClass}>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0a0a0a] via-[#161616] to-[#0a0a0a]" />

      <ViewportPortal
        className={`c2c-upcoming-header ${upcomingOpen ? "is-upcoming-open" : ""} ${
          preRegisterOpen ? "is-prereg-open" : ""
        }`}
      >
        <TopBar onUpcomingEdition={toggleUpcoming} />
      </ViewportPortal>
      <ViewportPortal
        id="c2c-upcoming-portal"
        className={`c2c-upcoming-host ${preRegisterOpen ? "is-prereg-open" : ""}`}
      >
        <ReturnAnnouncement active={upcomingOpen} onToggle={toggleUpcoming} />
      </ViewportPortal>
      <ViewportPortal id="c2c-prereg-portal">
        <PreRegistration
          active={preRegisterOpen}
          onClose={closePreRegister}
          onSuccess={handlePreRegSuccess}
        />
      </ViewportPortal>
      <ViewportPortal id="c2c-prereg-success-portal">
        <PreRegSuccess active={successPlaying} onDone={handleSuccessDone} />
      </ViewportPortal>

      <div id="smooth-wrapper" className="relative z-0">
        <div id="smooth-content">
          <div className="relative">
            <Landing onPreRegister={openPreRegister} preRegistered={preRegistered} />
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
          <div id="tracks" className="relative w-full">
            {/* Mobile: use the original Tracks component */}
            <div className="lg:hidden">
              <Tracks />
            </div>

            {/* Desktop: GSAP sticky scroll version */}
            <div className="hidden lg:block">
              <div className="min-h-[300vh]">
                <GradientBG>
                  <div className="relative z-10">
                    <HeadingText text="Tracks" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 -z-10">
                    <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" className="h-full w-full" />
                  </div>

                  <div className="w-full max-w-[1080px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
                    <StickyScroll content={TRACKS_CONTENT} />
                  </div>
                </GradientBG>
              </div>
            </div>
          </div>

          <div id="speakers" className="min-h-screen flex items-center justify-between flex-col">
            <Speaker />
          </div>
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
